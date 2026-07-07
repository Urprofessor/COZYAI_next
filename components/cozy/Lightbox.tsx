'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  /** Single-image mode (existing API). */
  src?: string;
  /** Gallery mode — multi-image with left/right swipe + dots + counter. */
  images?: string[];
  /** Which image to open on. Only used in gallery mode. */
  initialIndex?: number;
  onClose: () => void;
}

/**
 * Fullscreen image viewer.
 *   • `src` — single image, backdrop click closes
 *   • `images` + `initialIndex` — swipeable gallery with dots and 1/N counter
 *
 * In both modes: click backdrop / press Esc to close. Tap on the image itself
 * does nothing (so pinch-zoom on mobile isn't lost).
 */
export function Lightbox({ src, images, initialIndex = 0, onClose }: Props) {
  const list = images ?? (src ? [src] : []);
  const [idx, setIdx] = useState(initialIndex);
  const trackRef = useRef<HTMLDivElement>(null);

  // Seek to initialIndex once the track is mounted (scroll-snap swipe works
  // on all subsequent horizontal scroll).
  useEffect(() => {
    const el = trackRef.current;
    if (!el || list.length <= 1) return;
    // requestAnimationFrame so the browser has finished laying out the frame.
    requestAnimationFrame(() => {
      el.scrollTo({ left: initialIndex * el.clientWidth, behavior: 'instant' as ScrollBehavior });
      setIdx(initialIndex);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update the active index from scrollLeft as the user swipes.
  useEffect(() => {
    const el = trackRef.current;
    if (!el || list.length <= 1) return;
    const onScroll = () => {
      const next = Math.round(el.scrollLeft / el.clientWidth);
      if (next !== idx) setIdx(next);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [idx, list.length]);

  // Esc closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!list.length) return null;

  return (
    <div
      role="dialog"
      aria-label="Image viewer"
      onClick={onClose}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 animate-lightbox-in cursor-zoom-out"
      style={{ padding: 'env(safe-area-inset-top) 0 env(safe-area-inset-bottom)' }}
    >
      {/* Counter (only in gallery mode) */}
      {list.length > 1 && (
        <div
          className="absolute left-1/2 -translate-x-1/2 z-[2] pointer-events-none text-white/85 text-[13px] font-medium tabular-nums"
          style={{ top: 'calc(env(safe-area-inset-top) + 16px)' }}
        >
          {idx + 1} / {list.length}
        </div>
      )}

      {/* Swipe track — track itself does NOT stopPropagation, so taps in the
          black margins around the image fall through to the backdrop and close.
          Only the <img> element blocks propagation, letting pinch-zoom happen
          without dismissing the viewer. */}
      <div
        ref={trackRef}
        className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {list.map((url, i) => (
          <div
            key={i}
            className="min-w-full h-full snap-center flex items-center justify-center"
          >
            <img
              src={url}
              alt=""
              draggable={false}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-full object-contain select-none cursor-default"
            />
          </div>
        ))}
      </div>

      {/* Bottom dots */}
      {list.length > 1 && (
        <div
          className="absolute left-0 right-0 flex justify-center gap-2 z-[2]"
          style={{ bottom: 'calc(env(safe-area-inset-bottom) + 20px)' }}
        >
          {list.map((_, i) => (
            <span
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                const el = trackRef.current;
                if (!el) return;
                el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
              }}
              className="w-2 h-2 rounded-full transition-colors cursor-pointer pointer-events-auto"
              style={{ background: i === idx ? '#fff' : 'rgba(255,255,255,0.35)' }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
