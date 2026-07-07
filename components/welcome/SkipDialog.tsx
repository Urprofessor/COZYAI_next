'use client';

import { useEffect } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * Center-modal "Skip tutorial?" confirmation, matches the vanilla project's
 * skip-dialog. Backdrop click / Esc closes; Skip button confirms.
 */
export function SkipDialog({ open, onClose, onConfirm }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-label="Skip tutorial"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-8 animate-lightbox-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[320px] bg-white rounded-2xl px-6 pt-6 pb-4 text-center"
      >
        <h2 className="font-denton text-[22px] leading-[1.2] text-text-1 m-0 mb-2">
          Skip tutorial?
        </h2>
        <p className="text-[14px] leading-[1.5] text-text-muted mt-0 mb-5">
          You can always find it in Help Center &gt; Tutorials &amp; Guides
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3 rounded-full border-[1.5px] border-brand-rose-500 text-brand-rose-500 font-semibold bg-transparent"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-[1.4] py-3 rounded-full bg-brand-rose-500 text-white font-semibold border-0"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
