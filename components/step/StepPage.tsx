'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { STEPS } from '@/lib/steps/data';
import { MOMS_AGREE_PCT, getStepVideoSrc } from '@/lib/steps/video';
import { StepHeader } from './StepHeader';
import { ProgressBar } from './ProgressBar';
import { VideoPlayer, type VideoPlayerHandle } from './VideoPlayer';
import { FullscreenVideoPlayer } from './FullscreenVideoPlayer';
import { TipAccordion } from './TipAccordion';

interface Props {
  stepNumber: number;
}

/**
 * One step of the 7-step Setup flow. Header → progress → title → video →
 * moms-agree badge → tip accordion → Back/Next footer. Tapping the video's
 * expand icon opens the FullscreenVideoPlayer overlay with prev/next step
 * navigation.
 */
export function StepPage({ stepNumber }: Props) {
  const router = useRouter();
  const idx = Math.max(1, Math.min(7, stepNumber)) - 1;
  const step = STEPS[idx];
  const isFirst = step.num === 1;
  const isLast = step.num === 7;

  const videoRef = useRef<VideoPlayerHandle>(null);
  const [fsOpen, setFsOpen] = useState(false);
  const [fsInitialTime, setFsInitialTime] = useState(0);

  function next() {
    if (isLast) router.push('/');
    else router.push(`/setup/${step.num + 1}`);
  }
  function back() {
    if (isFirst) router.push('/');
    else router.push(`/setup/${step.num - 1}`);
  }

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
        title="Air One Setup"
        backHref="/"
        cozyFrom={`step-${step.num}`}
      />

      <div className="px-6 pb-4 pt-2 flex-shrink-0">
        <ProgressBar currentStep={step.num} />
        <div className="mt-4">
          <div className="text-[13px] font-semibold text-brand-rose-500 mb-1">
            Step {step.num}
          </div>
          <h2 className="text-2xl font-semibold text-text-1">{step.title}</h2>
          <p className="text-[14px] text-text-muted mt-1">{step.subtitle}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-32">
        <VideoPlayer
          ref={videoRef}
          src={getStepVideoSrc(step.num)}
          labelTitle={step.videoTitle}
          onExpand={openFullscreen}
        />

        {/* Moms agree badge */}
        <div className="flex items-center gap-2 mt-4 mb-3">
          <svg viewBox="0 0 24 24" fill="#4A0612" className="w-4 h-4">
            <path d="M12 2 C12.6 7.4 16.6 11.4 22 12 C16.6 12.6 12.6 16.6 12 22 C11.4 16.6 7.4 12.6 2 12 C7.4 11.4 11.4 7.4 12 2 Z" />
          </svg>
          <span className="text-[13px] font-semibold text-brand-rose-500">
            {MOMS_AGREE_PCT[idx] ?? 65}% of Moms Asked About This
          </span>
        </div>

        <TipAccordion tips={step.tips} />
      </div>

      <StepFooter
        backLabel={isFirst ? 'Home' : 'Back'}
        nextLabel={isLast ? 'Finish' : 'Next'}
        onBack={back}
        onNext={next}
      />

      {fsOpen && (
        <FullscreenVideoPlayer
          src={getStepVideoSrc(step.num)}
          stepNum={step.num}
          stepLabel={`Step ${step.num}`}
          initialTime={fsInitialTime}
          hasPrev={!isFirst}
          hasNext={true}
          nextLabel={isLast ? 'Finish' : 'Next Step'}
          onClose={closeFullscreen}
          onPrev={() => {
            setFsOpen(false);
            back();
          }}
          onNext={() => {
            setFsOpen(false);
            next();
          }}
        />
      )}
    </div>
  );
}

function StepFooter({
  backLabel,
  nextLabel,
  onBack,
  onNext,
}: {
  backLabel: string;
  nextLabel: string;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div
      className="fixed left-0 right-0 bottom-0 z-[5] flex gap-3 px-6 pt-3 bg-brand-rose-50"
      style={{ paddingBottom: `calc(env(safe-area-inset-bottom) + 12px)` }}
    >
      <button
        type="button"
        onClick={onBack}
        className="flex-1 py-4 rounded-full border-[1.5px] border-brand-rose-500 text-brand-rose-500 font-semibold bg-brand-rose-50"
      >
        {backLabel}
      </button>
      <button
        type="button"
        onClick={onNext}
        className="flex-[2] py-4 rounded-full bg-brand-rose-500 text-white font-semibold"
      >
        {nextLabel}
      </button>
    </div>
  );
}
