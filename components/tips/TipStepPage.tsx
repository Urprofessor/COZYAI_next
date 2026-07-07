'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { STEPS } from '@/lib/steps/data';
import { getStepVideoSrc } from '@/lib/steps/video';
import { StepHeader } from '@/components/step/StepHeader';
import { VideoPlayer, type VideoPlayerHandle } from '@/components/step/VideoPlayer';
import { FullscreenVideoPlayer } from '@/components/step/FullscreenVideoPlayer';
import { TipAccordion } from '@/components/step/TipAccordion';

interface Props {
  tipNumber: number;
}

/**
 * Single tip detail — same visual language as StepPage but without progress
 * bar/footer nav, and header shows a back chevron pointing to /tips.
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
    <div className="flex flex-col h-full" style={{ background: '#FEF5F5' }}>
      <StepHeader
        title="Air One Tips"
        backHref="/tips"
        cozyFrom={`tips-${step.num}`}
        variant="back"
      />

      <div
        className="flex-shrink-0"
        style={{ padding: '8px 24px 16px' }}
      >
        <div
          className="font-semibold"
          style={{ fontSize: 13, color: '#4A0612', marginBottom: 4 }}
        >
          Tip {step.num}
        </div>
        <h2
          className="font-denton m-0"
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: '#1A1A1A',
            marginBottom: 0,
            lineHeight: 1.2,
          }}
        >
          {step.title}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div style={{ margin: '0 0 16px' }}>
          <VideoPlayer
            ref={videoRef}
            src={getStepVideoSrc(step.num)}
            labelTitle="How-to video"
            onExpand={openFullscreen}
          />
        </div>

        <div style={{ margin: '0 16px 16px' }}>
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

        <div style={{ height: 40 }} />
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
