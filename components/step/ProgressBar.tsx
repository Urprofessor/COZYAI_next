'use client';

import Link from 'next/link';

interface Props {
  currentStep: number;
  total?: number;
  hrefFor?: (step: number) => string;
}

/**
 * Thin horizontal 7-segment progress bar. Matches vanilla `.step-progress-bar`:
 *   • 3px height, 4px gap, 2px radius
 *   • Empty = #F5C8CE (pink)
 *   • Done or Current = #4A0612 (dark red)
 * Each segment has an invisible ±10px vertical tap target for touch.
 */
export function ProgressBar({
  currentStep,
  total = 7,
  hrefFor = (s) => `/setup/${s}`,
}: Props) {
  return (
    <div className="flex" style={{ gap: 4 }}>
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const filled = step <= currentStep;
        return (
          <Link
            key={step}
            href={hrefFor(step)}
            role="button"
            aria-label={`Go to step ${step}`}
            className="flex-1 relative"
            style={{
              height: 3,
              borderRadius: 2,
              background: filled ? '#4A0612' : '#F5C8CE',
            }}
          >
            {/* Enlarged tap target for touch */}
            <span
              aria-hidden
              className="absolute left-0 right-0"
              style={{ top: -10, bottom: -10 }}
            />
          </Link>
        );
      })}
    </div>
  );
}
