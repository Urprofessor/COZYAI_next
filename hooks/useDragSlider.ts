'use client';

import { useCallback, useEffect, useRef } from 'react';

interface Options {
  onChange: (pct: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

/**
 * Attach unified pointer/touch handlers to a slider/track element. Emits the
 * fraction (0..1) that maps to the horizontal position the user is holding.
 * Handles pointer events on modern browsers and falls back to touch events
 * on older iOS Safari.
 */
export function useDragSlider<T extends HTMLElement>(opts: Options) {
  const ref = useRef<T | null>(null);
  const draggingRef = useRef(false);
  const optsRef = useRef(opts);
  optsRef.current = opts;

  const pctFromClientX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const raw = (clientX - rect.left) / rect.width;
    return Math.max(0, Math.min(1, raw));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const start = (clientX: number, e: Event) => {
      e.preventDefault();
      draggingRef.current = true;
      optsRef.current.onDragStart?.();
      optsRef.current.onChange(pctFromClientX(clientX));
    };
    const move = (clientX: number, e: Event) => {
      if (!draggingRef.current) return;
      e.preventDefault();
      optsRef.current.onChange(pctFromClientX(clientX));
    };
    const end = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      optsRef.current.onDragEnd?.();
    };

    const onPtrDown = (e: PointerEvent) => start(e.clientX, e);
    const onPtrMove = (e: PointerEvent) => move(e.clientX, e);
    const onPtrUp = () => end();

    // Prefer pointer events (unifies mouse + touch on modern browsers).
    el.addEventListener('pointerdown', onPtrDown);
    window.addEventListener('pointermove', onPtrMove);
    window.addEventListener('pointerup', onPtrUp);
    window.addEventListener('pointercancel', onPtrUp);

    return () => {
      el.removeEventListener('pointerdown', onPtrDown);
      window.removeEventListener('pointermove', onPtrMove);
      window.removeEventListener('pointerup', onPtrUp);
      window.removeEventListener('pointercancel', onPtrUp);
    };
  }, [pctFromClientX]);

  return ref;
}
