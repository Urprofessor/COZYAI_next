'use client';

import { useEffect, useRef, useState } from 'react';
import { Lightbox } from '@/components/cozy/Lightbox';
import type { TipCarousel as TipCarouselType } from '@/lib/steps/types';

/**
 * Horizontal swipeable carousel. Matches vanilla `.carousel`:
 *   • Optional shared intro paragraph above
 *   • Frame — either aspect-ratio 16/9 (default) or `frameHeight`-driven
 *   • Dots overlaid at bottom of frame (not below)
 *   • Caption sits below frame, updates with active slide
 *
 * Uses native scroll-snap for swipe; sets `active` from scrollLeft.
 */
export function TipCarousel({ tip }: { tip: TipCarouselType }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const heightDriven = !!tip.frameHeight;
  const slideImages = tip.slides.map((s) => s.image);

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

  function goTo(idx: number) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: idx * el.clientWidth, behavior: 'smooth' });
  }

  return (
    <>
      {tip.sharedIntro && (
        <p className="text-[14px] leading-[1.55] text-[#555] m-0 mb-2.5">
          {tip.sharedIntro}
        </p>
      )}

      <div
        className="relative w-full overflow-hidden"
        style={{
          background: heightDriven ? 'transparent' : '#EAEAEA',
          borderRadius: heightDriven ? 0 : 8,
          aspectRatio: heightDriven ? undefined : '16 / 9',
          height: heightDriven ? tip.frameHeight : undefined,
        }}
      >
        <div
          ref={trackRef}
          className="flex h-full overflow-x-auto snap-x snap-mandatory scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {tip.slides.map((slide, i) => (
            <div
              key={i}
              className="min-w-full h-full snap-center flex items-center justify-center"
            >
              <img
                src={slide.image}
                alt=""
                draggable={false}
                onClick={() => setLightboxIdx(i)}
                className="block cursor-zoom-in select-none"
                style={
                  heightDriven
                    ? { width: 'auto', maxWidth: '100%', height: '100%', objectFit: 'contain' }
                    : { width: '100%', height: '100%', objectFit: 'cover' }
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dots sit BELOW the frame (not overlaid on the image) */}
      <div className="flex justify-center items-center gap-2 mt-2.5 h-[18px]">
        {tip.slides.map((_, i) => (
          <span
            key={i}
            onClick={() => goTo(i)}
            className="w-2 h-2 rounded-full transition-colors cursor-pointer"
            style={{ background: i === active ? '#4A0612' : '#E0D5D7' }}
          />
        ))}
      </div>

      {/* Caption of active slide */}
      <p
        className="text-[14px] leading-[1.5] text-[#555] m-0 mt-2 mb-2.5 whitespace-pre-line"
        style={{ minHeight: '1.5em' }}
      >
        {tip.slides[active]?.caption ?? ''}
      </p>

      {lightboxIdx !== null && (
        <Lightbox
          images={slideImages}
          initialIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </>
  );
}
