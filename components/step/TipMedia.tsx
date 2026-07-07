'use client';

import { useState } from 'react';
import { Lightbox } from '@/components/cozy/Lightbox';
import type { TipImage } from '@/lib/steps/types';

/**
 * Renders the images for a type=image tip (single `image` or multi `images`)
 * plus body text and warning block. Clicking an image opens the shared lightbox.
 */
export function TipMedia({ tip }: { tip: TipImage }) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const images = tip.images ?? (tip.image ? [tip.image] : []);

  return (
    <>
      {images.length > 0 && (
        <div className={images.length > 1 ? 'grid grid-cols-2 gap-2 mb-3' : 'mb-3'}>
          {images.map((src, i) => (
            <div key={i} className="w-full bg-neutral-200 rounded-lg overflow-hidden">
              <img
                src={src}
                alt=""
                draggable={false}
                onClick={() => setLightbox(src)}
                className="w-full h-auto block cursor-zoom-in select-none"
              />
            </div>
          ))}
        </div>
      )}

      <div className="text-[14px] leading-6 text-text-1 whitespace-pre-wrap">
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
      <div className="text-[14px] leading-6 text-text-1 whitespace-pre-wrap">{body}</div>
      {warning && <TipWarning text={warning} />}
    </>
  );
}

function TipWarning({ text }: { text: string }) {
  return (
    <div className="flex gap-2 items-start mt-3 p-3 rounded-lg bg-brand-rose-100">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#E24B4A" className="flex-shrink-0 mt-0.5">
        <path d="M12 2 L1 21h22z" />
      </svg>
      <div className="text-[13px] leading-5 text-text-1 whitespace-pre-wrap">{text}</div>
    </div>
  );
}
