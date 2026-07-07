'use client';

import { useRouter } from 'next/navigation';
import { BottomNav } from './BottomNav';

/**
 * My Device hub — the first screen a user lands on. Contains a hero card
 * pushing them into the Breast Pump setup flow, plus stub cards for other
 * paired devices (BM04 camera, WN02 sensor) which are visual only.
 *
 * Tapping the pump card's "Get Start" navigates to /welcome.
 */
export function MyDevicePage() {
  const router = useRouter();

  return (
    <div
      className="relative flex flex-col h-full overflow-y-auto"
      style={{ background: '#FBECEE' }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-5 flex-shrink-0"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 12px)' }}
      >
        <h1
          className="m-0 font-bold"
          style={{ fontSize: 28, color: '#1A1A1A', letterSpacing: '-0.4px' }}
        >
          My Device
        </h1>
        <button
          type="button"
          aria-label="Add device"
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center border-0 cursor-pointer active:opacity-70"
          style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1A1A1A"
            strokeWidth="2.2"
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      {/* Content — pump hero + secondary device cards */}
      <div
        className="flex-1 flex flex-col gap-4 px-5 pt-5"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 90px)' }}
      >
        <PumpCard onGetStart={() => router.push('/welcome')} />
        <BM04Card />
        <WN02Card />
      </div>

      <BottomNav active="device" />
    </div>
  );
}

/**
 * The featured Breast Pump card — pink gradient, "Tap below for a quick setup
 * guide" prompt, bunny mascot peeking behind the Get Start button.
 */
function PumpCard({ onGetStart }: { onGetStart: () => void }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        borderRadius: 24,
        padding: '16px 18px 26px',
        background:
          'linear-gradient(155deg, #F8D3DA 0%, #F3B9C6 55%, #EFAEBC 100%)',
      }}
    >
      {/* Top row: pump icon + label + V3 pill + chevron */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.5)' }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4A0612"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M8 3h8v6a4 4 0 0 1-4 4 4 4 0 0 1-4-4V3z" />
            <path d="M12 13v8" />
          </svg>
        </div>
        <span
          className="font-semibold"
          style={{ fontSize: 16, color: '#4A0612', letterSpacing: '-0.1px' }}
        >
          Breast Pump
        </span>
        <span
          className="ml-1 rounded-full font-semibold"
          style={{
            background: '#FFF3B8',
            color: '#4A0612',
            fontSize: 11,
            padding: '3px 8px',
            letterSpacing: '0.02em',
          }}
        >
          V3 Added
        </span>
        <span className="ml-auto" style={{ color: '#4A0612' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </span>
      </div>

      {/* Central prompt */}
      <div className="text-center mt-6 mb-5 px-4">
        <p
          className="font-denton m-0"
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: '#4A0612',
            lineHeight: 1.25,
            letterSpacing: '-0.2px',
          }}
        >
          Tap below for a quick
          <br />
          setup guide
        </p>
      </div>

      {/* Get Start button with bunny mascot behind it */}
      <div className="relative flex justify-center items-center">
        <button
          type="button"
          onClick={onGetStart}
          className="relative z-[2] text-white font-semibold border-0 cursor-pointer active:opacity-85 transition-opacity"
          style={{
            background: '#4A0612',
            borderRadius: 100,
            padding: '14px 40px',
            fontSize: 16,
            letterSpacing: '0.02em',
            boxShadow: '0 6px 16px rgba(74, 6, 18, 0.25)',
          }}
        >
          Get Start
        </button>
        {/* Bunny mascot peeking from behind the right side of the button */}
        <img
          src="/images/IP_%E9%AB%98%E5%85%B4.png"
          alt=""
          draggable={false}
          className="absolute z-[1] pointer-events-none select-none"
          style={{
            right: 'calc(50% - 90px)',
            bottom: -6,
            width: 72,
            height: 72,
            objectFit: 'contain',
          }}
        />
      </div>
    </div>
  );
}

/** Stub — no real functionality yet. Visual only. */
function BM04Card() {
  return (
    <div className="rounded-3xl overflow-hidden bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-3 px-4 py-3" style={{ background: '#EFE9F6' }}>
        <div className="w-8 h-8 rounded-lg bg-white/70 flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B48A5" strokeWidth="1.8">
            <rect x="3" y="6" width="14" height="12" rx="2" />
            <path d="M17 10l4-2v8l-4-2z" fill="#6B48A5" />
          </svg>
        </div>
        <span className="font-semibold" style={{ fontSize: 16, color: '#6B48A5' }}>
          BM04
        </span>
        <svg
          className="ml-auto"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6B48A5"
          strokeWidth="2"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
      {/* Placeholder for camera feed — soft neutral gradient */}
      <div
        className="w-full relative"
        style={{
          aspectRatio: '16 / 10',
          background:
            'linear-gradient(135deg, #E9DFD3 0%, #D8C5B6 50%, #B7A18E 100%)',
        }}
      >
        <span
          className="absolute top-2 left-3 text-white text-[11px] font-medium tabular-nums"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
        >
          2025-01-08 11:50:55
        </span>
      </div>
    </div>
  );
}

/** Stub — no real functionality yet. Visual only. */
function WN02Card() {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 bg-white rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
      <div className="w-11 h-11 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.6">
          <path d="M4 15a4 4 0 0 1 3-7.9 6 6 0 0 1 11.8 1A3.5 3.5 0 0 1 20 15H4z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold" style={{ fontSize: 15, color: '#1A1A1A' }}>
          WN02
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: '#3E7CE8' }}
          />
          <span style={{ fontSize: 13, color: '#666' }}>Rain</span>
        </div>
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#BBB" strokeWidth="2">
        <path d="M9 18l6-6-6-6" />
      </svg>
    </div>
  );
}
