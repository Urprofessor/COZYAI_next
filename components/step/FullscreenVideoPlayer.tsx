'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { useDragSlider } from '@/hooks/useDragSlider';

interface Props {
  /** Video URL. `null` closes the player entirely. */
  src: string | null;
  /** 1-indexed step number, e.g. 3 of 7. */
  stepNum: number;
  totalSteps?: number;
  stepLabel?: string;
  /** Time to seek to on open — usually the inline player's currentTime. */
  initialTime?: number;
  /** "Last Step" / "Finish" button visibility. */
  hasPrev?: boolean;
  hasNext?: boolean;
  /** Label shown on the Next button. Defaults to "Next Step" / "Finish". */
  nextLabel?: string;
  onClose: (endedAt: number) => void;
  onPrev?: () => void;
  onNext?: () => void;
}

/**
 * Full-featured landscape-rotated video overlay matching the vanilla project's
 * `#video-fs` page. Portal-mounted at document.body so it escapes the layout.
 *
 * Controls:
 *  • Center play/pause overlay (tap video)
 *  • Prev/Next step navigation
 *  • Progress bar — click + drag to seek
 *  • Bottom row: play/pause, +10s, mute, volume slider, current/total time
 *  • Top-left step pill, top-right collapse
 */
export function FullscreenVideoPlayer({
  src,
  stepNum,
  totalSteps = 7,
  stepLabel = `Step ${stepNum}`,
  initialTime = 0,
  hasPrev = true,
  hasNext = true,
  nextLabel = 'Next Step',
  onClose,
  onPrev,
  onNext,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progressPct, setProgressPct] = useState(0);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [dragging, setDragging] = useState<'progress' | 'volume' | null>(null);
  const [isLandscape, setIsLandscape] = useState(false);

  // Portal target — need to wait for hydration.
  useEffect(() => setMounted(true), []);

  // Detect actual device orientation. Portrait phones get the rotation trick;
  // desktop / landscape phones render natively.
  useEffect(() => {
    const mq = window.matchMedia('(orientation: landscape)');
    const update = () => setIsLandscape(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Video event wiring
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => {
      setTime(v.currentTime);
      if (v.duration) {
        setProgressPct((v.currentTime / v.duration) * 100);
        setDuration(v.duration);
      }
    };
    const onLoaded = () => {
      setDuration(v.duration || 0);
      // Seek then attempt unmuted play. iOS may block it; fall back to muted.
      try {
        v.currentTime = initialTime;
      } catch { /* ignore */ }
      v.muted = false;
      v.volume = volume;
      v.play().catch(() => {
        v.muted = true;
        setMuted(true);
        v.play().catch(() => {});
      });
    };

    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('loadedmetadata', onLoaded);
    // If it's already ready when the effect runs, kick it manually.
    if (v.readyState >= 1) onLoaded();

    return () => {
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('loadedmetadata', onLoaded);
    };
    // initialTime only on mount; volume changes handled separately.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }

  function forward10() {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.min(v.duration || 0, v.currentTime + 10);
  }

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  function close() {
    const v = videoRef.current;
    onClose(v?.currentTime ?? 0);
  }

  // Progress bar
  const progressRef = useDragSlider<HTMLDivElement>({
    onChange: (pct) => {
      const v = videoRef.current;
      setProgressPct(pct * 100);
      if (v && v.duration) {
        v.currentTime = pct * v.duration;
        setTime(v.currentTime);
      }
    },
    onDragStart: () => setDragging('progress'),
    onDragEnd: () => setDragging(null),
  });

  // Volume slider
  const volumeRef = useDragSlider<HTMLDivElement>({
    onChange: (pct) => {
      const v = videoRef.current;
      if (!v) return;
      v.volume = pct;
      v.muted = pct === 0;
      setVolume(pct);
      setMuted(pct === 0);
    },
    onDragStart: () => setDragging('volume'),
    onDragEnd: () => setDragging(null),
  });

  if (!mounted || !src) return null;

  // Rotation trick — width/height swap when we're rotating the portrait phone
  // by 90deg to simulate landscape playback.
  const contentStyle: React.CSSProperties = isLandscape
    ? {
        width: '100dvw',
        height: '100dvh',
        transform: 'translate(-50%, -50%) rotate(0deg)',
      }
    : {
        width: '100dvh',
        height: '100dvw',
        transform: 'translate(-50%, -50%) rotate(90deg)',
      };

  return createPortal(
    <div className="fixed inset-0 z-[30] bg-black">
      <div
        className={cn(
          'absolute top-1/2 left-1/2 overflow-hidden bg-black',
          !playing &&
            "before:content-[''] before:absolute before:inset-0 before:bg-black/[0.27] before:z-[1] before:pointer-events-none"
        )}
        style={{ ...contentStyle, transformOrigin: 'center center' }}
      >
        <video
          ref={videoRef}
          src={src}
          playsInline
          loop
          autoPlay
          preload="auto"
          onClick={togglePlay}
          className="w-full h-full object-contain bg-black block"
        />

        {/* Overlay — pointer-events routed per-child */}
        <div className="absolute inset-0 z-[2] pointer-events-none">
          {/* Top-left step pill */}
          <div className="pointer-events-auto absolute top-6 left-6 flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white text-sm">
            <span>{stepNum}/{totalSteps}</span>
            <span className="opacity-50">|</span>
            <span>{stepLabel}</span>
          </div>

          {/* Top-right collapse */}
          <button
            type="button"
            onClick={close}
            aria-label="Exit fullscreen"
            className="pointer-events-auto absolute top-6 right-6 w-10 h-10 rounded-full border-0 bg-black/40 text-white flex items-center justify-center cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M9 3v6H3M15 3v6h6M9 21v-6H3M15 21v-6h6" />
            </svg>
          </button>

          {/* Center play/pause big button, visible when paused */}
          {!playing && (
            <button
              type="button"
              onClick={togglePlay}
              aria-label="Play"
              className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center"
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          )}

          {/* Prev / Next step nav (mid-right) */}
          <div className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3">
            {hasPrev && onPrev && (
              <button
                type="button"
                onClick={onPrev}
                className="pointer-events-auto flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md text-white text-sm cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                Last Step
              </button>
            )}
            {hasNext && onNext && (
              <button
                type="button"
                onClick={onNext}
                className="pointer-events-auto flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md text-white text-sm cursor-pointer"
              >
                <span>{nextLabel}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            )}
          </div>

          {/* Progress bar */}
          <div className="pointer-events-auto absolute left-6 right-6 bottom-16">
            <div
              ref={progressRef}
              className={cn(
                'relative w-full h-1.5 rounded-full bg-white/25 cursor-pointer transition-[height]',
                dragging === 'progress' && 'h-2'
              )}
            >
              <div
                className="absolute left-0 top-0 h-full bg-white rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Bottom controls */}
          <div className="pointer-events-auto absolute left-6 right-6 bottom-4 flex items-center gap-3 text-white">
            <button
              type="button"
              onClick={togglePlay}
              className="w-6 h-6 flex-shrink-0"
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={forward10}
              className="w-6 h-6 flex-shrink-0"
              aria-label="Forward 10 seconds"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>

            <div className="flex items-center gap-2 flex-1 max-w-[220px]">
              <button
                type="button"
                onClick={toggleMute}
                className="w-6 h-6 flex-shrink-0"
                aria-label={muted ? 'Unmute' : 'Mute'}
              >
                {muted ? (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.5 12L21 7.5V4.5l-6 6L9 4.5H4v15h5l6 5v-6l6 6L21 22z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3z" />
                  </svg>
                )}
              </button>
              <div
                ref={volumeRef}
                className={cn(
                  'relative flex-1 h-1 rounded-full bg-white/30 cursor-pointer transition-[height]',
                  dragging === 'volume' && 'h-1.5'
                )}
              >
                <div
                  className="absolute left-0 top-0 h-full bg-white rounded-full"
                  style={{ width: `${(muted ? 0 : volume) * 100}%` }}
                />
              </div>
            </div>

            <span className="text-xs ml-auto tabular-nums">
              {formatTime(time)} / {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function formatTime(s: number): string {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${ss}`;
}
