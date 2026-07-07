'use client';

import Link from 'next/link';

/**
 * The top-right "CozyAI" glass-pill entry, reused on Step and TipsStep headers.
 * Matches the design token: 96×44, border-radius 296px, frosted glass.
 */
export function CozyEntryPill({ from }: { from?: string }) {
  const href = `/cozy/welcome${from ? `?from=${encodeURIComponent(from)}` : ''}`;
  return (
    <Link
      href={href}
      aria-label="Ask CozyAI"
      className="flex items-center justify-center gap-1 w-[96px] h-[44px] rounded-pill px-2 py-0
                 bg-white/55 backdrop-blur-[20px] backdrop-saturate-[140%]
                 shadow-[0_2px_10px_rgba(74,6,18,0.05)] active:opacity-70 transition-opacity"
    >
      <img
        src="/images/IP_%E9%AB%98%E5%85%B4.png"
        alt=""
        draggable={false}
        className="w-[34px] h-[34px] object-contain flex-shrink-0"
      />
      <span className="text-[15px] font-bold text-brand-rose-500 tracking-tight whitespace-nowrap">
        CozyAI
      </span>
    </Link>
  );
}
