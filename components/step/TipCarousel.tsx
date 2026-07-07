'use client';

import { useEffect, useRef, useState } from 'react';
import { Lightbox } from '@/components/cozy/Lightbox';
import type { TipCarousel as TipCarouselType } from '@/lib/steps/types';

/**
 * Horizontal swipe carousel used for multi-step sequences (Disassemble /
 * Assemble). Native touch-scroll snap; dots indicate the active slide.
 */
export function TipCarousel({ tip }: { tip: TipCarouselType }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const height = tip.frameHeight ?? 173;

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      setActive(idx);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {tip.sharedIntro && (
        <p className="text-[14px] leading-6 text-text-1 mb-3">{tip.sharedIntro}</p>
      )}

      <div
        ref={trackRef}
        className="w-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth rounded-xl bg-neutral-200"
        style={{ height }}
      >
        {tip.slides.map((slide, i) => (
          <div
            key={i}
            className="min-w-full h-full snap-center flex items-center justify-center overflow-hidden"
          >
            <img
              src={slide.image}
              alt=""
              onClick={() => setLightbox(slide.image)}
              className="w-full h-full object-contain cursor-zoom-in select-none"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-2">
        {tip.slides.map((_, i) => (
          <span
            key={i}
            className={
              'w-1.5 h-1.5 rounded-full transition-colors ' +
              (i === active ? 'bg-brand-rose-500' : 'bg-brand-rose-500/25')
            }
          />
        ))}
      </div>

      {/* Caption of active slide */}
      <p className="text-[13px] leading-5 text-text-muted text-center mt-2">
        {tip.slides[active]?.caption ?? ''}
      </p>

      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
    </>
  );
}
