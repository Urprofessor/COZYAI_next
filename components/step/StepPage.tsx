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
 * One step of the 7-step Setup flow. Structure mirrors vanilla `#step`:
 *   • Header (X close + "Air One Setup" + CozyAI pill)
 *   • .step-progress (padding 8/24/16): "Step N" label + Denton 28px title +
 *     thin progress bar
 *   • .step-video (full-bleed, no rounding, 393/267 aspect)
 *   • .step-card-wrap: pink ribbon "moms-agree-badge" on top + white .step-card
 *     containing the accordion
 *   • .step-footer: Back (white outline) + Next (dark red filled) with safe-area
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
    // Finish → back to the My Device hub.
    if (isLast) router.push('/');
    else router.push(`/setup/${step.num + 1}`);
  }
  function back() {
    // From step 1, back goes to the Welcome intro (not the device hub) so users
    // can revisit the phase overview.
    if (isFirst) router.push('/welcome');
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
    <div className="flex flex-col h-full" style={{ background: '#FEF5F5' }}>
      <StepHeader
        title="Air One Setup"
        backHref="/"
        cozyFrom={`step-${step.num}`}
        variant="close"
      />

      <div
        className="flex-shrink-0"
        style={{ padding: '8px 24px 16px' }}
      >
        <div
          className="font-semibold"
          style={{ fontSize: 13, color: '#4A0612', marginBottom: 4 }}
        >
          Step {step.num}
        </div>
        <h2
          className="font-denton m-0"
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: '#1A1A1A',
            marginBottom: 10,
            lineHeight: 1.2,
          }}
        >
          {step.title}
        </h2>
        <ProgressBar currentStep={step.num} />
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Full-bleed video */}
        <div style={{ margin: '0 0 16px' }}>
          <VideoPlayer
            ref={videoRef}
            src={getStepVideoSrc(step.num)}
            labelTitle="How-to video"
            onExpand={openFullscreen}
          />
        </div>

        {/* Floating card with pink ribbon badge */}
        <div className="relative" style={{ margin: '0 16px 16px' }}>
          {/* moms-agree-badge — the pink ribbon shape uses rectangleBg.png */}
          <div
            className="absolute inline-flex items-center justify-center gap-[5px] text-white whitespace-nowrap"
            style={{
              top: -8,
              right: -6,
              width: 290,
              height: 44,
              backgroundImage: "url('/images/rectangleBg.png')",
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              fontSize: 12.5,
              fontWeight: 700,
              letterSpacing: '0.01em',
              paddingLeft: 30,
              zIndex: 3,
              filter:
                'drop-shadow(0 4px 6px rgba(160, 30, 50, 0.25)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.08))',
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="#fff"
              aria-hidden
              style={{ width: 14, height: 14, flexShrink: 0 }}
            >
              <path d="M12 2 C12.6 7.4 16.6 11.4 22 12 C16.6 12.6 12.6 16.6 12 22 C11.4 16.6 7.4 12.6 2 12 C7.4 11.4 11.4 7.4 12 2 Z" />
            </svg>
            <span>{MOMS_AGREE_PCT[idx] ?? 65}% of Moms Asked About This</span>
          </div>

          {/* Step card wrapping the accordion */}
          <div
            className="bg-white"
            style={{
              borderRadius: 20,
              padding: '24px 22px',
              boxShadow: '0 1px 0 rgba(0,0,0,0.02)',
            }}
          >
            <TipAccordion tips={step.tips} />
          </div>
        </div>

        {/* Bottom breathing room so footer doesn't clip content */}
        <div style={{ height: 100 }} />
      </div>

      <StepFooter
        showBack={!isFirst}
        nextLabel={isLast ? 'Finish' : 'Next'}
        backLabel="Back"
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
  showBack,
  backLabel,
  nextLabel,
  onBack,
  onNext,
}: {
  showBack: boolean;
  backLabel: string;
  nextLabel: string;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div
      className="flex flex-shrink-0"
      style={{
        gap: 12,
        padding: '12px 20px calc(20px + env(safe-area-inset-bottom))',
        background: '#FEF5F5',
        marginTop: 'auto',
      }}
    >
      {showBack && (
        <button
          type="button"
          onClick={onBack}
          className="cursor-pointer active:opacity-80 transition-opacity"
          style={{
            background: '#fff',
            color: '#1A2746',
            border: '1px solid #E0D5D7',
            borderRadius: 100,
            padding: '16px 32px',
            fontSize: 16,
            fontWeight: 600,
            minWidth: 110,
          }}
        >
          {backLabel}
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        className="flex-1 cursor-pointer active:opacity-80 transition-opacity"
        style={{
          background: '#4A0612',
          color: '#fff',
          border: 'none',
          borderRadius: 100,
          padding: 16,
          fontSize: 16,
          fontWeight: 600,
        }}
      >
        {nextLabel}
      </button>
    </div>
  );
}
