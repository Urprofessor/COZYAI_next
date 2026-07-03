'use client';

import { useEffect, useRef, useState } from 'react';
import { cn, randInt } from '@/lib/utils';
import {
  COZY_LOADING_ICON,
  HANDOFF_ASSIGNING_FADEOUT_MS,
  HANDOFF_ASSIGNING_MS,
  HANDOFF_CONNECTING_MS,
  HANDOFF_QUEUE_MAX_MS,
  HANDOFF_QUEUE_MIN_MS,
  SARAH_INTRO,
  SARAH_INTRO_TYPING_MS,
} from '@/lib/cozy/constants';
import type { HandoffState } from '@/lib/cozy/types';

interface Props {
  state: HandoffState;
  supportAvatar: string | null;
  onConfirm: () => void;
  onCancel: () => void;
  onAdvance: (next: HandoffState) => void;
  onJoined: () => void;
  onSarahIntro: () => void;
}

export function HandoffCard({
  state,
  supportAvatar,
  onConfirm,
  onCancel,
  onAdvance,
  onJoined,
  onSarahIntro,
}: Props) {
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [queueNum, setQueueNum] = useState(3);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const clearAll = () => {
      timers.current.forEach((t) => clearTimeout(t));
      timers.current = [];
    };

    if (state === 'connecting') {
      const t = setTimeout(() => onAdvance('queuing'), HANDOFF_CONNECTING_MS);
      timers.current.push(t);
    } else if (state === 'queuing') {
      const total = randInt(HANDOFF_QUEUE_MIN_MS, HANDOFF_QUEUE_MAX_MS);
      const start = randInt(2, 5);
      setQueueNum(start);
      const perStep = Math.floor(total / start);
      for (let i = 1; i < start; i++) {
        const idx = i;
        timers.current.push(
          setTimeout(() => setQueueNum(start - idx), perStep * i)
        );
      }
      timers.current.push(setTimeout(() => onAdvance('assigning'), total));
    } else if (state === 'assigning') {
      timers.current.push(
        setTimeout(() => {
          setFadingOut(true);
          timers.current.push(
            setTimeout(() => {
              onJoined();
              // After the join system message posts, run the ~2s "typing"
              // simulation before Sarah's intro text lands.
              timers.current.push(setTimeout(onSarahIntro, SARAH_INTRO_TYPING_MS));
            }, HANDOFF_ASSIGNING_FADEOUT_MS)
          );
        }, HANDOFF_ASSIGNING_MS)
      );
    }

    return clearAll;
  }, [state, onAdvance, onJoined, onSarahIntro]);

  // "joined" state hides the card entirely — the parent has moved on.
  if (state === 'joined') return null;

  return (
    <div className="self-center w-[92%] max-w-[92%]">
      <div
        className={cn(
          'bg-white rounded-[18px] p-[18px_18px_16px] shadow-[0_4px_18px_rgba(74,6,18,0.08)]',
          'min-h-[200px] flex flex-col items-center justify-center text-center',
          'transition-opacity duration-300',
          fadingOut && 'opacity-0'
        )}
      >
        {state === 'idle' && (
          <IdleContent avatar={supportAvatar} onConfirm={onConfirm} />
        )}
        {state === 'connecting' && (
          <>
            <img
              src={COZY_LOADING_ICON}
              alt=""
              className="w-8 h-8 mx-auto mb-2.5 animate-cozy-spin"
            />
            <p className="text-[14.5px] text-text-1 font-semibold mb-1 leading-[1.4]">
              Connecting you with customer service...
            </p>
            <CancelBtn onCancel={onCancel} />
          </>
        )}
        {state === 'queuing' && (
          <>
            <img src="/icon/queue.png" alt="" className="w-8 h-8 mx-auto mb-2.5" />
            <p className="text-[14.5px] text-text-1 font-semibold mb-1 leading-[1.4]">
              You're in the queue
            </p>
            <p className="text-[12.5px] text-text-muted mb-3.5 leading-[1.4]">
              Estimated time: 1-3 min, Queue number:{' '}
              <strong className="text-brand-rose-500 font-semibold">{queueNum}</strong>
            </p>
            <CancelBtn onCancel={onCancel} />
          </>
        )}
        {state === 'assigning' && (
          <>
            <img
              src={supportAvatar ?? '/images/%E4%BA%BA%E5%B7%A5%E5%AE%A2%E6%9C%8D%E6%A0%B7%E5%BC%8F.png'}
              alt=""
              className="w-11 h-11 rounded-full object-cover mx-auto mb-2.5 bg-brand-rose-300 block"
            />
            <p className="text-[14.5px] text-text-1 font-semibold mb-1 leading-[1.4]">
              Sarah has been assigned
            </p>
            <p className="text-[12.5px] text-text-muted mb-3.5">
              She is joining the conversation...
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function IdleContent({ avatar, onConfirm }: { avatar: string | null; onConfirm: () => void }) {
  return (
    <>
      <img
        src={avatar ?? '/images/%E4%BA%BA%E5%B7%A5%E5%AE%A2%E6%9C%8D%E6%A0%B7%E5%BC%8F.png'}
        alt=""
        className="w-11 h-11 rounded-full object-cover mx-auto mb-2.5 bg-brand-rose-300 block"
      />
      <p className="text-[14.5px] text-text-1 font-semibold mb-1 leading-[1.4]">
        Connect you with a human customer service agent?
      </p>
      <p className="text-[12.5px] text-text-muted mb-3.5">Service hours: 9:00 AM–6:00 PM</p>
      <button
        type="button"
        onClick={onConfirm}
        className="w-full bg-brand-rose-500 text-white border-0 rounded-full py-3 text-[14.5px] font-semibold cursor-pointer"
      >
        Contact an agent
      </button>
    </>
  );
}

function CancelBtn({ onCancel }: { onCancel: () => void }) {
  return (
    <button
      type="button"
      onClick={onCancel}
      className="w-full bg-neutral-100 text-brand-rose-500 border-0 rounded-full py-3 text-[14.5px] font-semibold cursor-pointer mt-2"
    >
      Cancel request
    </button>
  );
}

export { SARAH_INTRO };
