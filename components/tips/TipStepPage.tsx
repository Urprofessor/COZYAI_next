'use client';

import { useRouter } from 'next/navigation';
import { STEPS } from '@/lib/steps/data';
import { getStepVideoSrc } from '@/lib/steps/video';
import { StepHeader } from '@/components/step/StepHeader';
import { VideoPlayer } from '@/components/step/VideoPlayer';
import { TipAccordion } from '@/components/step/TipAccordion';
import { ProgressBar } from '@/components/step/ProgressBar';

interface Props {
  tipNumber: number;
}

/**
 * Single tip detail. Same layout as Setup step (video + tip accordion) but
 * back goes to /tips instead of the previous step. No footer nav.
 */
export function TipStepPage({ tipNumber }: Props) {
  const router = useRouter();
  const idx = Math.max(1, Math.min(7, tipNumber)) - 1;
  const step = STEPS[idx];

  return (
    <div className="flex flex-col h-full">
      <StepHeader
        title="Air One Tips"
        backHref="/tips"
        cozyFrom={`tips-${step.num}`}
      />

      <div className="px-6 pb-4 pt-2 flex-shrink-0">
        <ProgressBar
          currentStep={step.num}
          hrefFor={(s) => `/tips/${s}`}
        />
        <div className="mt-4">
          <div className="text-[13px] font-semibold text-brand-rose-500 mb-1">
            Tip {step.num}
          </div>
          <h2 className="text-2xl font-semibold text-text-1">{step.title}</h2>
          <p className="text-[14px] text-text-muted mt-1">{step.subtitle}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-8">
        <VideoPlayer
          src={getStepVideoSrc(step.num)}
          labelTitle={step.videoTitle}
        />
        <div className="mt-4">
          <TipAccordion tips={step.tips} />
        </div>
      </div>
    </div>
  );
}
