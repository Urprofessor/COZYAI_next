'use client';

import { useEffect } from 'react';

interface Props {
  src: string;
  onClose: () => void;
}

export function Lightbox({ src, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-label="Image viewer"
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 animate-lightbox-in cursor-zoom-out"
      style={{ padding: 'env(safe-area-inset-top) 0 env(safe-area-inset-bottom)' }}
    >
      <img
        src={src}
        alt=""
        onClick={(e) => e.stopPropagation()}
        className="max-w-full max-h-full object-contain cursor-default select-none"
        draggable={false}
      />
    </div>
  );
}
