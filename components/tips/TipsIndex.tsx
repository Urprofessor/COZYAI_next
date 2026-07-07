'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TIP_INDEX } from '@/lib/steps/data';
import { FloatingCozyBtn } from '@/components/step/FloatingCozyBtn';

/**
 * Tips index — 7 topic cards on top of a hero, plus the floating "Ask CozyAI"
 * button anchored to the bottom edge.
 */
export function TipsIndex() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full">
      {/* Top-left back arrow */}
      <div className="flex items-center px-4 pt-3">
        <button
          type="button"
          onClick={() => router.push('/')}
          aria-label="Back"
          className="w-9 h-9 flex items-center justify-center"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2.2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      {/* Content (scrollable, padded so floating button doesn't overlap) */}
      <div className="flex-1 overflow-y-auto px-6" style={{ paddingBottom: 'calc(140px + env(safe-area-inset-bottom))' }}>
        <div className="flex flex-col items-center mb-4">
          <img
            src="/images/welcome-hero.png"
            alt="Air One tips"
            draggable={false}
            className="w-40 h-auto mt-2"
            onError={(e) => ((e.currentTarget.style.display = 'none'))}
          />
          <h1 className="font-denton text-[28px] leading-[140%] text-text-1 text-center mt-2">
            Get the most from Air One
          </h1>
        </div>

        <div className="flex flex-col gap-2.5">
          {TIP_INDEX.map((tip, i) => (
            <Link
              key={i}
              href={`/tips/${i + 1}`}
              className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-[0_2px_10px_rgba(74,6,18,0.04)] active:opacity-70 transition-opacity"
            >
              <img
                src={tip.icon}
                alt=""
                draggable={false}
                className="w-9 h-9 flex-shrink-0 object-contain"
              />
              <div className="flex-1">
                <h4 className="text-[15px] font-semibold text-text-1">{tip.title}</h4>
                <p className="text-[12.5px] text-text-muted">{tip.blurb}</p>
              </div>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#BBB"
                strokeWidth="2.2"
                className="w-5 h-5 flex-shrink-0"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      <FloatingCozyBtn />
    </div>
  );
}
