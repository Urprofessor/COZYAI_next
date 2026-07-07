'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Tip } from '@/lib/steps/types';
import { TipCarousel } from './TipCarousel';
import { TipMedia, TipTextBody } from './TipMedia';

interface Props {
  tips: Tip[];
}

const ICON_SRC: Record<string, string> = {
  question: '/icon/%E9%97%AE%E5%8F%B7icon.png',
  alert: '/icon/%E6%84%9F%E5%8F%B9%E5%8F%B7icon.png',
};

/**
 * Expandable list of tips. Multiple items may be open at once, matching the
 * vanilla project's behavior. Toggle a single item by clicking its head.
 */
export function TipAccordion({ tips }: Props) {
  const [openSet, setOpenSet] = useState<Set<number>>(() => new Set());

  function toggle(i: number) {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {tips.map((tip, i) => {
        const open = openSet.has(i);
        return (
          <div
            key={i}
            className="bg-white rounded-xl shadow-[0_2px_8px_rgba(74,6,18,0.04)] overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggle(i)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left bg-transparent border-0 cursor-pointer"
            >
              <img
                src={ICON_SRC[tip.icon] ?? ICON_SRC.question}
                alt=""
                draggable={false}
                className="w-6 h-6 flex-shrink-0"
              />
              <span className="flex-1 text-[15px] font-semibold text-text-1">
                {tip.title}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                className={cn(
                  'text-brand-rose-500/60 transition-transform flex-shrink-0',
                  open && 'rotate-180'
                )}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {open && (
              <div
                className="px-4 pb-4"
                onClick={(e) => {
                  // Image taps inside the body open the lightbox; don't collapse.
                  if ((e.target as HTMLElement).closest('img[data-lightbox]')) {
                    e.stopPropagation();
                  }
                }}
              >
                <TipBody tip={tip} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TipBody({ tip }: { tip: Tip }) {
  if (tip.type === 'image') return <TipMedia tip={tip} />;
  if (tip.type === 'text') return <TipTextBody body={tip.body} warning={tip.warning} />;
  if (tip.type === 'carousel') return <TipCarousel tip={tip} />;
  return null;
}
