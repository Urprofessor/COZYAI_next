'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { COZY_MAX_IMAGE_MB, COZY_MAX_IMAGES_PER_MSG } from '@/lib/cozy/constants';

interface Props {
  streaming: boolean;
  pendingImages: string[];
  onAddImages: (files: File[]) => void;
  onRemoveImage: (idx: number) => void;
  onSend: (text: string) => void;
  onStop: () => void;
}

export function InputBar({
  streaming,
  pendingImages,
  onAddImages,
  onRemoveImage,
  onSend,
  onStop,
}: Props) {
  const [text, setText] = useState('');
  const taRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const lineHeight = 22;
    const max = lineHeight * 5;
    const desired = el.scrollHeight;
    if (desired > max) {
      el.style.height = max + 'px';
      el.style.overflowY = 'auto';
    } else {
      el.style.height = desired + 'px';
      el.style.overflowY = 'hidden';
    }
  }, [text]);

  const hasContent = text.trim().length > 0 || pendingImages.length > 0;

  function submit() {
    if (streaming || !hasContent) return;
    onSend(text);
    setText('');
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const oversize = files.filter((f) => f.size > COZY_MAX_IMAGE_MB * 1024 * 1024);
    if (oversize.length) alert(`Files over ${COZY_MAX_IMAGE_MB}MB are skipped.`);
    const ok = files.filter((f) => f.size <= COZY_MAX_IMAGE_MB * 1024 * 1024);
    if (pendingImages.length + ok.length > COZY_MAX_IMAGES_PER_MSG) {
      alert(`Max ${COZY_MAX_IMAGES_PER_MSG} images per message.`);
    }
    onAddImages(ok);
    e.target.value = '';
  }

  return (
    <div className="relative z-[6] flex-shrink-0">
      {/* Attachment strip */}
      {pendingImages.length > 0 && (
        <div className="flex gap-2 px-5 pb-2 overflow-x-auto">
          {pendingImages.map((url, i) => (
            <div
              key={i}
              className="relative w-[60px] h-[60px] rounded-xl bg-neutral-100 flex-shrink-0 overflow-hidden"
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onRemoveImage(i)}
                className="absolute top-0.5 right-0.5 w-[18px] h-[18px] rounded-full bg-black/55 text-white text-xs leading-none flex items-center justify-center"
                aria-label="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={onFile}
      />

      {/* Input pill */}
      <div className="px-4">
        <div className="relative flex items-end gap-2.5 bg-white rounded-3xl px-[18px] py-3.5 shadow-[0_4px_18px_rgba(74,6,18,0.08)]">
          {/* + upload icon */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            onClick={() => fileRef.current?.click()}
            className="w-5 h-5 flex-shrink-0 text-neutral-900 cursor-pointer self-end mb-[1px]"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>

          {/* textarea */}
          <textarea
            ref={taRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKey}
            placeholder="Ask anything"
            className={cn(
              'flex-1 min-w-0 border-0 outline-none bg-transparent text-base leading-[22px] resize-none block',
              'min-h-[22px] max-h-[110px] pr-[38px] placeholder:text-neutral-400'
            )}
          />

          {/* Send / stop button */}
          <button
            type="button"
            onClick={streaming ? onStop : submit}
            aria-label={streaming ? 'Stop' : 'Send'}
            className={cn(
              'absolute right-[14px] bottom-[12px] w-[30px] h-[30px] border-0 bg-transparent p-0 cursor-pointer',
              'transition-all duration-150',
              streaming || hasContent
                ? 'opacity-100 scale-100 pointer-events-auto'
                : 'opacity-0 scale-75 pointer-events-none'
            )}
          >
            <img
              src={streaming ? '/icon/input%20stop.png' : '/icon/input%20upload.png'}
              alt={streaming ? 'Stop' : 'Send'}
              className="w-full h-full object-contain pointer-events-none"
              draggable={false}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
