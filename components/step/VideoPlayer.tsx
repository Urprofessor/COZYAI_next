'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  src: string | null;
  labelTitle: string;
  duration?: string; // display-only, e.g. "15s"
  autoPlay?: boolean;
  /** Fired when the top-right expand icon is tapped. Parent should open the
   *  fullscreen player and pass the current playback time. */
  onExpand?: (currentTime: number) => void;
}

export interface VideoPlayerHandle {
  seek(seconds: number): void;
  play(): void;
  pause(): void;
  getCurrentTime(): number;
}

/**
 * Inline video player: tap-to-toggle + optional expand button.
 * Exposes an imperative handle so the parent can resume playback at a specific
 * time after the fullscreen player closes.
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
    <div className="relative w-full aspect-video bg-black/5 rounded-2xl overflow-hidden">
      {src ? (
        <video
          ref={videoRef}
          src={src}
          playsInline
          muted
          loop
          preload="auto"
          autoPlay={autoPlay}
          onClick={toggle}
          className="w-full h-full object-cover cursor-pointer bg-black"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-text-muted text-sm">
          Video unavailable
        </div>
      )}

      {/* Expand button (top-right) */}
      {onExpand && src && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onExpand(videoRef.current?.currentTime ?? 0);
          }}
          aria-label="Fullscreen"
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6" />
          </svg>
        </button>
      )}

      {/* Play button overlay when paused */}
      {!playing && src && (
        <button
          type="button"
          onClick={toggle}
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          aria-label="Play"
        >
          <span className="w-14 h-14 rounded-full bg-black/40 flex items-center justify-center backdrop-blur-md">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}

      {/* Label + duration */}
      <div className="absolute left-3 bottom-3 flex items-center gap-2 text-white text-xs bg-black/40 backdrop-blur-md px-2 py-1 rounded-full">
        <span>{labelTitle}</span>
        <span aria-hidden>·</span>
        <span>{duration}</span>
      </div>

      {/* Progress bar (visible while playing) */}
      <div
        className={cn(
          'absolute left-0 right-0 bottom-0 h-1 bg-white/20 transition-opacity',
          playing ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div
          className="h-full bg-white transition-[width] duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
});
