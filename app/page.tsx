'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SkipDialog } from '@/components/welcome/SkipDialog';

const PHASES = [
  {
    icon: '/icon/Welcome-1.png',
    title: 'Unboxing',
    desc: 'Open the box and get to know your parts',
    time: '20s',
  },
  {
    icon: '/icon/Welcome-2.png',
    title: 'Clean & Assemble',
    desc: 'Wash, dry, and put your pump together',
    time: '1min20s',
  },
  {
    icon: '/icon/Welcome-3.png',
    title: 'First Use',
    desc: 'Wear it and start your first session',
    time: '2min10s',
  },
];

/**
 * Root / — mirrors the vanilla #welcome page.
 * Pink gradient bg, Skip pill top-right, hero + 3 phase list, Get started
 * jumps into /setup/1.
 */
export default function Home() {
  const router = useRouter();
  const [skipOpen, setSkipOpen] = useState(false);

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: 'linear-gradient(180deg, #F8C3CD 0%, #FEF5F5 48%)',
      }}
    >
      {/* Skip button */}
      <button
        type="button"
        onClick={() => setSkipOpen(true)}
        className="absolute right-5 z-[5] px-5 py-2 rounded-full bg-white/55 backdrop-blur-[20px] text-text-1 text-[15px] font-medium border-0"
        style={{ top: 'calc(env(safe-area-inset-top) + 12px)' }}
      >
        Skip
      </button>

      <div
        className="flex-1 flex flex-col px-6"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 20px)' }}
      >
        {/* Hero */}
        <div className="text-center flex-shrink-0" style={{ marginTop: 52 }}>
          <img
            src="/images/welcome-hero.png"
            alt="Welcome"
            draggable={false}
            className="block mx-auto mb-[18px] object-contain"
            style={{
              width: '72%',
              maxWidth: 280,
              aspectRatio: '393 / 267',
              height: 'auto',
            }}
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
          <h1 className="font-denton text-[32px] font-semibold leading-[1.12] tracking-[-0.3px] text-[#2B0007] m-0 mb-2.5">
            Welcome to Air One
          </h1>
          <p className="text-[15px] leading-[1.45] text-[#2B0007] mx-auto max-w-[300px] font-normal mt-0 mb-[26px]">
            Set up in 3 phases around 4min and pump right the first time.
          </p>
        </div>

        {/* 3 phase list */}
        <div className="flex-1 flex flex-col px-1">
          {PHASES.map((p, i) => (
            <div
              key={p.title}
              className={
                'flex gap-3 items-start ' + (i < PHASES.length - 1 ? 'pb-[22px]' : '')
              }
            >
              <div className="w-6 h-6 flex-shrink-0 mt-px flex items-center justify-center">
                <img
                  src={p.icon}
                  alt=""
                  draggable={false}
                  className="w-6 h-6 object-contain select-none"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[18px] font-semibold leading-[1.25] text-text-1 m-0 mb-0.5">
                  {p.title}
                </h3>
                <p className="text-[13px] leading-[1.35] text-text-1 m-0 mb-0.5">
                  {p.desc}
                </p>
                <p className="text-[12px] leading-[1.3] text-neutral-500 m-0">
                  {p.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-auto pt-7 flex-shrink-0">
          <button
            type="button"
            onClick={() => router.push('/setup/1')}
            className="w-full py-[18px] rounded-full bg-brand-rose-500 text-white font-semibold text-[17px] border-0"
          >
            Get started
          </button>
        </div>
      </div>

      <SkipDialog
        open={skipOpen}
        onClose={() => setSkipOpen(false)}
        onConfirm={() => {
          setSkipOpen(false);
          // Vanilla routed Skip → #control (device hub). That page isn't
          // migrated yet — /tips is the closest existing hub.
          router.push('/tips');
        }}
      />
    </div>
  );
}
