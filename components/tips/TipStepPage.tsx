'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { STEPS } from '@/lib/steps/data';
import { getStepVideoSrc } from '@/lib/steps/video';
import { StepHeader } from '@/components/step/StepHeader';
import { VideoPlayer, type VideoPlayerHandle } from '@/components/step/VideoPlayer';
import { FullscreenVideoPlayer } from '@/components/step/FullscreenVideoPlayer';
import { TipAccordion } from '@/components/step/TipAccordion';
import { ProgressBar } from '@/components/step/ProgressBar';

interface Props {
  tipNumber: number;
}

/**
 * Single tip detail. Same layout as Setup step (video + tip accordion) but
 * back goes to /tips instead of the previous step, and fullscreen navigation
 * jumps between /tips/N instead of /setup/N.
 */
export function TipStepPage({ tipNumber }: Props) {
  const router = useRouter();
  const idx = Math.max(1, Math.min(7, tipNumber)) - 1;
  const step = STEPS[idx];
  const isFirst = step.num === 1;
  const isLast = step.num === 7;

  const videoRef = useRef<VideoPlayerHandle>(null);
  const [fsOpen, setFsOpen] = useState(false);
  const [fsInitialTime, setFsInitialTime] = useState(0);

  function openFullscreen(t: number) {
    setFsInitialTime(t);
    setFsOpen(true);
    videoRef.current?.pause();
  }
  function closeFullscreen(endedAt: number) {
    setFsOpen(false);
    videoRef.current?.seek(endedAt);
    videoRef.current?.play();
  }

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
          ref={videoRef}
          src={getStepVideoSrc(step.num)}
          labelTitle={step.videoTitle}
          onExpand={openFullscreen}
        />
        <div className="mt-4">
          <TipAccordion tips={step.tips} />
        </div>
      </div>

      {fsOpen && (
        <FullscreenVideoPlayer
          src={getStepVideoSrc(step.num)}
          stepNum={step.num}
          stepLabel={`Tip ${step.num}`}
          initialTime={fsInitialTime}
          hasPrev={!isFirst}
          hasNext={!isLast}
          nextLabel="Next Tip"
          onClose={closeFullscreen}
          onPrev={() => {
            setFsOpen(false);
            router.push(`/tips/${step.num - 1}`);
          }}
          onNext={() => {
            setFsOpen(false);
            router.push(`/tips/${step.num + 1}`);
          }}
        />
      )}
    </div>
  );
}
