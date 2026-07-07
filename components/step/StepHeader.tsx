'use client';

import Link from 'next/link';
import { CozyEntryPill } from './CozyEntryPill';

interface Props {
  title: string;
  backHref: string;
  onBackClick?: () => void;
  cozyFrom?: string;
  /** Setup uses an X close, Tips uses a back chevron. */
  variant?: 'close' | 'back';
}

/**
 * Shared header for Step and TipsStep pages. Matches vanilla `.step-header`:
 * padding 14/16, min-height 68, absolute-positioned close/back button at
 * left:16, centered title, CozyAI pill absolute at right:16.
 */
export function StepHeader({
  title,
  backHref,
  onBackClick,
  cozyFrom,
  variant = 'close',
}: Props) {
  const Icon = variant === 'close' ? CloseIcon : BackIcon;

  return (
    <div
      className="relative flex items-center flex-shrink-0"
      style={{ padding: '14px 16px', minHeight: 68 }}
    >
      {onBackClick ? (
        <button
          type="button"
          onClick={onBackClick}
          aria-label="Back"
          className="absolute w-9 h-9 rounded-full border-0 bg-white/70 flex items-center justify-center cursor-pointer z-[1]"
          style={{ left: 16, top: '50%', transform: 'translateY(-50%)' }}
        >
          <Icon />
        </button>
      ) : (
        <Link
          href={backHref}
          aria-label="Back"
          className="absolute w-9 h-9 rounded-full border-0 bg-white/70 flex items-center justify-center cursor-pointer z-[1]"
          style={{ left: 16, top: '50%', transform: 'translateY(-50%)' }}
        >
          <Icon />
        </Link>
      )}
      <span
        className="flex-1 text-center font-semibold"
        style={{ fontSize: 17, color: '#4A0612' }}
      >
        {title}
      </span>
      <div
        className="absolute z-[1]"
        style={{ right: 16, top: '50%', transform: 'translateY(-50%)' }}
      >
        <CozyEntryPill from={cozyFrom} />
      </div>
    </div>
  );
}

function CloseIcon() {
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

function BackIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
