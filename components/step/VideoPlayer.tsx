'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

interface Props {
  src: string | null;
  labelTitle: string;
  duration?: string; // display-only, e.g. "15s"
  autoPlay?: boolean;
  onExpand?: (currentTime: number) => void;
}

export interface VideoPlayerHandle {
  seek(seconds: number): void;
  play(): void;
  pause(): void;
  getCurrentTime(): number;
}

/**
 * Inline video — matches vanilla `.step-video`. Full-width, aspect-ratio
 * 393/267, NO rounded corners, dimming overlay when paused, corner expand
 * button, bottom-left "How-to video · 15s" pill, thin bottom progress line.
 */
export const VideoPlayer = forwardRef<VideoPlayerHandle, Props>(function VideoPlayer(
  { src, labelTitle, duration = '15s', autoPlay = true, onExpand },
  ref
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useImperativeHandle(
    ref,
    () => ({
      seek(seconds) {
        const v = videoRef.current;
        if (v) {
          try { v.currentTime = seconds; } catch { /* ignore */ }
        }
      },
      play() { videoRef.current?.play().catch(() => {}); },
      pause() { videoRef.current?.pause(); },
      getCurrentTime() { return videoRef.current?.currentTime ?? 0; },
    }),
    []
  );

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () =>
      setProgress(v.duration ? (v.currentTime / v.duration) * 100 : 0);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('timeupdate', onTime);
    return () => {
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('timeupdate', onTime);
    };
  }, [src]);

  function toggle() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }

  return (
    <div
      className="relative w-full overflow-hidden bg-black cursor-pointer"
      style={{ aspectRatio: '393 / 267' }}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) return;
        toggle();
      }}
    >
      {src ? (
        <video
          ref={videoRef}
          src={src}
          playsInline
          muted
          loop
          preload="auto"
          autoPlay={autoPlay}
          className="w-full h-full object-contain block"
          style={{
            background:
              'linear-gradient(135deg, #E8C5C9 0%, #D9A8AE 100%)',
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white/60 text-sm">
          Video unavailable
        </div>
      )}

      {/* 27% dark overlay when paused */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none transition-opacity duration-200"
        style={{ background: 'rgba(0,0,0,0.27)', opacity: playing ? 0 : 1 }}
      />

      {/* Big center play button when paused (uses pause hero.png like vanilla) */}
      {src && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); toggle(); }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[3] border-0 bg-transparent p-0 transition-all"
          style={{
            width: 102,
            height: 96,
            opacity: playing ? 0 : 1,
            pointerEvents: playing ? 'none' : 'auto',
          }}
          aria-label="Play"
        >
          <img
            src="/images/pause%20hero.png"
            alt=""
            className="w-full h-full object-contain pointer-events-none select-none"
            draggable={false}
          />
        </button>
      )}

      {/* Top-right expand button */}
      {onExpand && src && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onExpand(videoRef.current?.currentTime ?? 0);
          }}
          aria-label="Fullscreen"
          className="absolute top-2.5 right-2.5 z-[10] w-10 h-10 rounded-full bg-black/35 text-white border-0 flex items-center justify-center cursor-pointer active:bg-black/55"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" pointerEvents="none">
            <path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6" />
          </svg>
        </button>
      )}

      {/* Bottom-left label pill */}
      <div className="absolute bottom-3.5 left-3 z-[2] bg-black/55 text-white text-[11px] font-medium px-3 py-1 rounded-md">
        {labelTitle} · {duration}
      </div>

      {/* Bottom progress line */}
      <div
        className="absolute left-0 bottom-0 h-[3px] z-[2] transition-[width] duration-100"
        style={{ width: `${progress}%`, background: '#E8909C' }}
      />
    </div>
  );
});
