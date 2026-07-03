'use client';

// Central chat controller. Wraps the raw fetch loop the vanilla project used
// with a React hook that exposes: messages, send, stop, streaming, handoff
// state, pending images, and history load/save.
//
// We intentionally do NOT use the AI SDK `useChat` here because we need:
//   • Persona-aware payload
//   • Client-side handoff routing (skip fetch when in queue)
//   • Image upload support (base64) merged into payload
//   • Reference-footer + [[HANDOFF]] / [[EXIT_HANDOFF]] tag stripping
// The bare fetch/stream code below is still ~1/3 the size of the vanilla version
// because state management moves to React.

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  COZY_MAX_IMAGES_PER_MSG,
  COZY_PAGE_SIZE,
} from '@/lib/cozy/constants';
import { HANDOFF_TAG, EXIT_TAG } from '@/lib/cozy/prompts';
import { detectHandoffTrigger } from '@/lib/cozy/keywords';
import { pickRandomSupportAvatar } from '@/lib/cozy/support-avatars';
import type { CozyMessage, HandoffState, Persona } from '@/lib/cozy/types';
import { useDeviceId } from './useDeviceId';

interface Options {
  initialPersona?: Persona;
}

export function useCozyChat(opts: Options = {}) {
  const deviceId = useDeviceId();
  const [messages, setMessages] = useState<CozyMessage[]>([]);
  const [persona, setPersona] = useState<Persona>(opts.initialPersona ?? 'qa');
  const [streaming, setStreaming] = useState(false);
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  const [handoffState, setHandoffState] = useState<HandoffState>('idle');
  const [supportAvatar, setSupportAvatar] = useState<string | null>(null);
  const [inQueue, setInQueue] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const historyLoadedRef = useRef(false);

  // ---------- history ----------

  useEffect(() => {
    if (!deviceId || historyLoadedRef.current) return;
    (async () => {
      try {
        const res = await fetch('/api/history?deviceId=' + encodeURIComponent(deviceId));
        if (!res.ok) return;
        const data = (await res.json()) as { messages?: CozyMessage[] };
        if (Array.isArray(data.messages) && data.messages.length) {
          setMessages(data.messages);
        }
        historyLoadedRef.current = true;
      } catch {
        /* offline / not configured — silent */
      }
    })();
  }, [deviceId]);

  const persistHistory = useCallback(
    (nextMessages: CozyMessage[]) => {
      if (!deviceId) return;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        // Strip base64 image data before persisting — session only.
        const sanitized = nextMessages.map((m) => {
          if (!m.images?.length) return m;
          const { images, ...rest } = m;
          return { ...rest, imageCount: images.length } as CozyMessage & {
            imageCount: number;
          };
        });
        try {
          await fetch('/api/history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deviceId, messages: sanitized.slice(-100) }),
          });
        } catch {
          /* best-effort */
        }
      }, 400);
    },
    [deviceId]
  );

  // Persist whenever messages change (debounced inside persistHistory).
  useEffect(() => {
    if (!historyLoadedRef.current) return;
    persistHistory(messages);
  }, [messages, persistHistory]);

  // ---------- image pool ----------

  const addImages = useCallback((files: File[]) => {
    const room = COZY_MAX_IMAGES_PER_MSG - pendingImages.length;
    if (room <= 0) return;
    const accepted = files.slice(0, room);
    Promise.all(
      accepted.map(
        (f) =>
          new Promise<string | null>((resolve) => {
            if (!f.type.startsWith('image/')) return resolve(null);
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(f);
          })
      )
    ).then((urls) => {
      setPendingImages((prev) => [...prev, ...urls.filter(Boolean) as string[]]);
    });
  }, [pendingImages.length]);

  const removeImage = useCallback((idx: number) => {
    setPendingImages((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  // ---------- sending ----------

  const send = useCallback(
    async (text: string) => {
      const cleaned = text.trim();
      const images = pendingImages.slice();
      if (!cleaned && !images.length) return;
      if (streaming) return;

      const userMsg: CozyMessage = {
        id: newId(),
        role: 'user',
        content: cleaned,
        persona,
        createdAt: Date.now(),
        ...(images.length ? { images } : {}),
      };
      setMessages((prev) => [...prev, userMsg]);
      setPendingImages([]);

      // If we're queued for handoff, mute AI. Message is preserved as context.
      if (inQueue) {
        return;
      }

      // QA fast-path: keyword hit → handoff card, no LLM call.
      if (persona === 'qa' && cleaned && detectHandoffTrigger(cleaned)) {
        beginHandoffCard();
        return;
      }

      await streamReply(persona, [...messages, userMsg]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pendingImages, streaming, persona, inQueue, messages]
  );

  const stop = useCallback(() => {
    if (abortRef.current) {
      try {
        abortRef.current.abort();
      } catch {
        /* ignore */
      }
    }
  }, []);

  // ---------- streaming to /api/chat ----------

  async function streamReply(personaAtStart: Persona, history: CozyMessage[]) {
    setStreaming(true);
    abortRef.current = new AbortController();
    let text = '';
    let assistantId = newId();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          persona: personaAtStart,
          messages: history
            .filter((m) => m.role === 'user' || m.role === 'assistant')
            .map((m) => {
              const base: { role: 'user' | 'assistant'; content: string; images?: string[] } = {
                role: m.role as 'user' | 'assistant',
                content: m.content || '',
              };
              if (m.images?.length) base.images = m.images;
              return base;
            }),
        }),
      });

      if (!res.ok || !res.body) throw new Error('AI request failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let bubbleAdded = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        // AI SDK data stream: each line is `<type_prefix>:<json>\n`.
        // For plain text deltas the prefix is `0:` and the value is a JSON string.
        for (const line of chunk.split('\n')) {
          if (!line) continue;
          const colon = line.indexOf(':');
          if (colon < 0) continue;
          const kind = line.slice(0, colon);
          const raw = line.slice(colon + 1);
          if (kind === '0') {
            try {
              const t = JSON.parse(raw) as string;
              text += t;
              const stripped = text.replaceAll(HANDOFF_TAG, '').replaceAll(EXIT_TAG, '');
              if (!bubbleAdded && stripped.trim()) {
                bubbleAdded = true;
                setMessages((prev) => [
                  ...prev,
                  { id: assistantId, role: 'assistant', content: stripped, persona: personaAtStart },
                ]);
              } else if (bubbleAdded) {
                setMessages((prev) =>
                  prev.map((m) => (m.id === assistantId ? { ...m, content: stripped } : m))
                );
              }
            } catch { /* skip malformed */ }
          }
        }
      }
    } catch (err: unknown) {
      const isAbort = err instanceof DOMException && err.name === 'AbortError';
      if (!isAbort) {
        setMessages((prev) => [
          ...prev,
          {
            id: assistantId,
            role: 'assistant',
            content: "Sorry, I couldn't reach the assistant right now. Please try again.",
            persona: personaAtStart,
          },
        ]);
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }

    // Post-stream: strip tags, decide handoff/exit.
    const hasHandoff = text.includes(HANDOFF_TAG);
    const hasExit = text.includes(EXIT_TAG);
    const clean = text.replaceAll(HANDOFF_TAG, '').replaceAll(EXIT_TAG, '').trim();

    if (personaAtStart === 'qa' && hasHandoff) {
      // Drop any leaked assistant bubble; show handoff card instead.
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      beginHandoffCard();
      return;
    }

    // Tag QA replies with reference footer.
    if (clean && personaAtStart === 'qa') {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: clean, reference: 'From Professional literature' }
            : m
        )
      );
    }

    if (personaAtStart === 'support' && hasExit) {
      setPersona('qa');
      setSupportAvatar(null);
      setMessages((prev) => [
        ...prev,
        { id: newId(), role: 'system', content: 'Conversation ended' },
      ]);
    }
  }

  // ---------- handoff flow ----------

  function beginHandoffCard() {
    setHandoffState('idle'); // card is rendered when idle → user clicks Contact
    setMessages((prev) => [
      ...prev,
      { id: newId(), role: 'system', content: '__HANDOFF_CARD__' }, // sentinel
    ]);
  }

  const confirmHandoff = useCallback(() => {
    const av = pickRandomSupportAvatar();
    setSupportAvatar(av);
    setInQueue(true);
    setHandoffState('connecting');
  }, []);

  const cancelHandoff = useCallback(() => {
    setInQueue(false);
    setHandoffState('idle');
    // Remove any handoff card sentinel from the stream.
    setMessages((prev) => prev.filter((m) => m.content !== '__HANDOFF_CARD__'));
  }, []);

  // The queuing/assigning/joined timers are driven by the HandoffCard component
  // via effects, so state updates flow from there back into the hook via these
  // setters:
  const advanceHandoff = useCallback((next: HandoffState) => {
    setHandoffState(next);
  }, []);

  const finishHandoff = useCallback(() => {
    setInQueue(false);
    setHandoffState('joined');
    setPersona('support');
    // The intro system message + Sarah's greeting are inserted by the caller
    // (HandoffCard) after the 2s typing simulation.
  }, []);

  const appendSystem = useCallback((content: string) => {
    setMessages((prev) => [...prev, { id: newId(), role: 'system', content }]);
  }, []);

  const appendAssistant = useCallback(
    (content: string, personaOverride?: Persona) => {
      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          role: 'assistant',
          content,
          persona: personaOverride ?? persona,
          ...(personaOverride === 'support' && supportAvatar ? { avatar: supportAvatar } : {}),
        },
      ]);
    },
    [persona, supportAvatar]
  );

  return {
    // state
    messages,
    persona,
    streaming,
    pendingImages,
    handoffState,
    supportAvatar,
    inQueue,
    // actions
    send,
    stop,
    addImages,
    removeImage,
    confirmHandoff,
    cancelHandoff,
    advanceHandoff,
    finishHandoff,
    appendSystem,
    appendAssistant,
    // pagination helper (used by chat page)
    pageSize: COZY_PAGE_SIZE,
  };
}

function newId() {
  return 'm_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}
