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
 * Matches vanilla `.accordion` — flat list inside one white card, items
 * separated by hairline dividers, not individual pills. Multiple items may be
 * open at once. Chevron rotates on open.
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
    <div className="w-full">
      {tips.map((tip, i) => {
        const open = openSet.has(i);
        const isLast = i === tips.length - 1;
        return (
          <div
            key={i}
            className={cn(!isLast && 'border-b border-[#F0E5E7]')}
          >
            <button
              type="button"
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between gap-3 py-4 bg-transparent border-0 cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5 text-[15px] font-medium text-text-1">
                <img
                  src={ICON_SRC[tip.icon] ?? ICON_SRC.question}
                  alt=""
                  draggable={false}
                  className="w-[22px] h-[22px] flex-shrink-0 object-contain select-none"
                />
                <span>{tip.title}</span>
              </div>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={cn(
                  'text-neutral-500 transition-transform duration-300 flex-shrink-0',
                  open && 'rotate-180'
                )}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {/* Collapsible body — matches vanilla max-height transition */}
            <div
              className={cn(
                'overflow-hidden transition-[max-height,padding] duration-300 ease',
                open ? 'max-h-[600px] pb-4' : 'max-h-0'
              )}
            >
              <TipBody tip={tip} />
            </div>
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
