'use client';

import Link from 'next/link';

interface Props {
  currentStep: number;
  total?: number;
  hrefFor?: (step: number) => string;
}

/**
 * 7 clickable segments showing progress through the setup. Filled segments
 * indicate completed steps.
 */
export function ProgressBar({
  currentStep,
  total = 7,
  hrefFor = (s) => `/setup/${s}`,
}: Props) {
  return (
    <div className="flex gap-1.5 items-center h-1.5">
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const done = step < currentStep;
        const active = step === currentStep;
        return (
          <Link
            key={step}
            href={hrefFor(step)}
            role="button"
            aria-label={`Go to step ${step}`}
            className={[
              'flex-1 h-1.5 rounded-full transition-colors',
              done
                ? 'bg-brand-rose-500'
                : active
                  ? 'bg-brand-rose-500/50'
                  : 'bg-brand-rose-500/15',
            ].join(' ')}
          />
        );
      })}
    </div>
  );
}
