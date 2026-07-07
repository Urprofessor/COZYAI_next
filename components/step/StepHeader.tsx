'use client';

import Link from 'next/link';
import { CozyEntryPill } from './CozyEntryPill';

interface Props {
  title: string;
  backHref: string;
  onBackClick?: () => void;
  /** Used as ?from= on the CozyAI entry so downstream can track referrer. */
  cozyFrom?: string;
}

/**
 * Shared header for Step and TipsStep pages. Back button on the left,
 * centered title, CozyAI glass pill on the right.
 */
export function StepHeader({ title, backHref, onBackClick, cozyFrom }: Props) {
  return (
    <div className="relative flex items-center px-4 py-[14px] min-h-[68px] flex-shrink-0">
      {onBackClick ? (
        <button
          type="button"
          onClick={onBackClick}
          aria-label="Back"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border-0
                     bg-white/70 flex items-center justify-center cursor-pointer z-[1]"
        >
          <BackIcon />
        </button>
      ) : (
        <Link
          href={backHref}
          aria-label="Back"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border-0
                     bg-white/70 flex items-center justify-center cursor-pointer z-[1]"
        >
          <BackIcon />
        </Link>
      )}
      <span className="flex-1 text-center text-[17px] font-semibold text-brand-rose-500">
        {title}
      </span>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-[1]">
        <CozyEntryPill from={cozyFrom} />
      </div>
    </div>
  );
}

function BackIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
