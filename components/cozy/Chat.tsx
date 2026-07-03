'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useCozyChat } from '@/hooks/useCozyChat';
import { SARAH_INTRO } from '@/lib/cozy/constants';
import { Bubble } from './Bubble';
import { HandoffCard } from './HandoffCard';
import { InputBar } from './InputBar';
import { Lightbox } from './Lightbox';
import { LoadingIndicator } from './LoadingIndicator';

interface Props {
  /** If provided, seed the first message so Welcome → Chat can hand a query over. */
  initialQuestion?: string;
}

export function CozyChat({ initialQuestion }: Props) {
  const chat = useCozyChat();
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const seededRef = useRef(false);

  // Seed initial question from Welcome page's pill/textarea handoff.
  useEffect(() => {
    if (seededRef.current) return;
    if (initialQuestion?.trim()) {
      seededRef.current = true;
      chat.send(initialQuestion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuestion]);

  // Auto-scroll to bottom as messages grow.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chat.messages.length, chat.streaming]);

  // When Sarah first "joins", drop the intro text after the typing simulation.
  const introQueuedRef = useRef(false);
  function handleSarahIntro() {
    if (introQueuedRef.current) return;
    introQueuedRef.current = true;
    chat.appendAssistant(SARAH_INTRO, 'support');
  }

  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <div className="relative z-[1] flex items-center justify-center h-14 px-2 flex-shrink-0">
        <Link
          href="/cozy/welcome"
          aria-label="Back"
          className="absolute left-3 w-9 h-9 rounded-full border-0 bg-white/70 flex items-center justify-center cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A0612" strokeWidth="2.2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <span className="text-[15px] font-semibold text-brand-rose-500 opacity-80">CozyAI</span>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="relative z-[1] flex-1 overflow-y-auto flex flex-col gap-[18px] px-4 pt-2 pb-3"
      >
        {chat.messages.map((m) =>
          m.content === '__HANDOFF_CARD__' ? (
            <HandoffCard
              key={m.id}
              state={chat.handoffState}
              supportAvatar={chat.supportAvatar}
              onConfirm={chat.confirmHandoff}
              onCancel={chat.cancelHandoff}
              onAdvance={chat.advanceHandoff}
              onJoined={() => {
                chat.finishHandoff();
                chat.appendSystem('Sarah joined the conversation.');
              }}
              onSarahIntro={handleSarahIntro}
            />
          ) : (
            <Bubble key={m.id} msg={m} onOpenImage={setLightboxSrc} />
          )
        )}
        {chat.streaming && (
          <LoadingIndicator persona={chat.persona} supportAvatar={chat.supportAvatar} />
        )}
      </div>

      {/* Bottom fade mask */}
      <div
        className="fixed left-0 right-0 bottom-0 h-[125px] pointer-events-none z-[4]"
        aria-hidden
        style={{
          background:
            'linear-gradient(180deg, rgba(255, 247, 248, 0.00) -5.91%, #FFF7F8 20%)',
        }}
      />

      <InputBar
        streaming={chat.streaming}
        pendingImages={chat.pendingImages}
        onAddImages={chat.addImages}
        onRemoveImage={chat.removeImage}
        onSend={chat.send}
        onStop={chat.stop}
      />

      <p
        className="text-center text-[11px] text-brand-rose-500/40 pt-2 relative z-[6] flex-shrink-0"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        AI-generated, not professional advice.
      </p>

      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
    </div>
  );
}
