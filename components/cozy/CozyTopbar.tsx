'use client';

import Link from 'next/link';

interface Props {
  backHref?: string;
  onBackClick?: () => void;
}

/**
 * Shared CozyAI top bar. Centered "CozyAI Device" title with Beta pill icon
 * to the right. Used by both the Welcome and Chat pages so the label stays in
 * sync — change the title here and it changes everywhere.
 */
export function CozyTopbar({ backHref = '/', onBackClick }: Props) {
  return (
    <div className="relative z-[1] flex items-center justify-center h-14 px-2 flex-shrink-0">
      {onBackClick ? (
        <button
          type="button"
          onClick={onBackClick}
          aria-label="Back"
          className="absolute left-3 w-9 h-9 rounded-full border-0 bg-white/70 flex items-center justify-center cursor-pointer"
        >
          <BackIcon />
        </button>
      ) : (
        <Link
          href={backHref}
          aria-label="Back"
          className="absolute left-3 w-9 h-9 rounded-full border-0 bg-white/70 flex items-center justify-center cursor-pointer"
        >
          <BackIcon />
        </Link>
      )}

      {/* The wrapper only takes the width of the "CozyAI Device" span; the
          Beta pill is absolutely positioned off the right edge so it doesn't
          pull the title off-center. */}
      <div className="relative">
        <span className="text-[16px] font-bold text-brand-rose-500">
          CozyAI Device
        </span>
        <img
          src="/icon/Beta.png"
          alt="Beta"
          draggable={false}
          className="absolute left-full top-1/2 -translate-y-1/2 h-[20px] w-auto object-contain select-none ml-1.5 pointer-events-none"
        />
      </div>
    </div>
  );
}

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A0612" strokeWidth="2.2">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
