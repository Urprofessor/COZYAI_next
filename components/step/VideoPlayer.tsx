'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  src: string | null;
  labelTitle: string;
  duration?: string; // display-only, e.g. "15s"
  autoPlay?: boolean;
}

/**
 * Inline video player: tap to play/pause. Simpler than the vanilla version
 * (which had a full-screen mode with scrubber). Fullscreen can be re-added
 * later; for now a bordered rounded frame is enough.
 */
export function VideoPlayer({ src, labelTitle, duration = '15s', autoPlay = true }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const v = ref.current;
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
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }

  return (
    <div className="relative w-full aspect-video bg-black/5 rounded-2xl overflow-hidden">
      {src ? (
        <video
          ref={ref}
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
}
