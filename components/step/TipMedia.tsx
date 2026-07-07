'use client';

import { useState } from 'react';
import { Lightbox } from '@/components/cozy/Lightbox';
import type { TipImage } from '@/lib/steps/types';

/**
 * Renders images + text for a `type: 'image'` tip. Matches vanilla
 * `.accordion-body-img` (grey background box, rounded 8px, image full width).
 * Multi-image renders each in its own box stacked, then the body text below.
 */
export function TipMedia({ tip }: { tip: TipImage }) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const images = tip.images ?? (tip.image ? [tip.image] : []);

  return (
    <>
      {images.map((src, i) => (
        <div
          key={i}
          className="w-full bg-[#EAEAEA] rounded-lg overflow-hidden mb-3"
        >
          <img
            src={src}
            alt=""
            draggable={false}
            onClick={() => setLightbox(src)}
            className="w-full h-auto block cursor-zoom-in select-none"
          />
        </div>
      ))}

      <div
        className="text-[14px] leading-[1.55] text-[#555] whitespace-pre-line"
      >
        {tip.body}
      </div>

      {tip.warning && <TipWarning text={tip.warning} />}

      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
    </>
  );
}

export function TipTextBody({ body, warning }: { body: string; warning?: string }) {
  return (
    <>
      <div className="text-[14px] leading-[1.55] text-[#555] whitespace-pre-line">
        {body}
      </div>
      {warning && <TipWarning text={warning} />}
    </>
  );
}

function TipWarning({ text }: { text: string }) {
  return (
    <div
      className="flex items-start gap-2 mt-3 px-3 py-2.5 rounded-lg"
      style={{ background: 'rgba(232, 121, 138, 0.10)' }}
    >
      <img
        src="/icon/%E6%84%9F%E5%8F%B9%E5%8F%B7icon.png"
        alt=""
        className="w-[18px] h-[18px] flex-shrink-0 mt-px object-contain select-none"
        draggable={false}
      />
      <div className="text-[13px] leading-[1.5] text-[#555] whitespace-pre-line flex-1">
        {text}
      </div>
    </div>
  );
}
