'use client';

import { useRouter } from 'next/navigation';
import { BottomNav } from './BottomNav';

/**
 * My Device hub. Layout:
 *   • Header — "My Device" title + subtle add pill
 *   • Breast Pump hero card — pink gradient, prompt copy, Get Start pill with
 *     bunny mascot peeking over the top of the button
 *   • Secondary device stubs (BM04 camera, WN02 sensor) — visual only
 *   • Bottom 4-tab nav (Device active)
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
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 14px)', paddingBottom: 10 }}
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
          className="w-11 h-11 rounded-full bg-white flex items-center justify-center border-0 cursor-pointer active:opacity-70"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
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

      {/* Content */}
      <div
        className="flex-1 flex flex-col gap-3.5 px-5"
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
 * Featured Breast Pump card. Height is generous so the bunny mascot has room
 * to peek from behind the Get Start button.
 */
function PumpCard({ onGetStart }: { onGetStart: () => void }) {
  return (
    <div
      className="relative"
      style={{
        borderRadius: 28,
        padding: '18px 20px 40px',
        // Softer pink washed gradient, lighter at top-left → warmer at bottom.
        background:
          'linear-gradient(150deg, #FBDCE1 0%, #F5C0CB 45%, #EFAEBC 100%)',
        boxShadow: '0 2px 12px rgba(240, 175, 190, 0.35)',
        overflow: 'hidden',
      }}
    >
      {/* Top row: pump icon + label + V3 pill + chevron */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.55)' }}
        >
          {/* Stylized breast pump silhouette */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M7.5 4.5c0-.9.7-1.5 1.5-1.5h6c.8 0 1.5.6 1.5 1.5v3.2c0 3-2 5.3-4.5 5.3s-4.5-2.3-4.5-5.3V4.5Z"
              fill="#EF9DB0"
              stroke="#B84361"
              strokeWidth="1.2"
            />
            <path d="M12 13v6" stroke="#B84361" strokeWidth="1.5" strokeLinecap="round" />
            <rect x="9" y="19" width="6" height="2.5" rx="1.2" fill="#B84361" />
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
            padding: '3px 9px',
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
      <div className="text-center px-3" style={{ marginTop: 40, marginBottom: 34 }}>
        <p
          className="font-denton m-0"
          style={{
            fontSize: 24,
            fontWeight: 500,
            color: '#4A0612',
            lineHeight: 1.28,
            letterSpacing: '-0.2px',
          }}
        >
          Tap below for a quick
          <br />
          setup guide
        </p>
      </div>

      {/* Get Start button with bunny mascot peeking over from behind */}
      <div className="relative flex justify-center" style={{ minHeight: 56 }}>
        <button
          type="button"
          onClick={onGetStart}
          className="relative z-[2] text-white font-semibold border-0 cursor-pointer active:opacity-85 transition-opacity"
          style={{
            background: '#4A0612',
            borderRadius: 100,
            padding: '15px 44px',
            fontSize: 16,
            letterSpacing: '0.02em',
            boxShadow: '0 8px 20px rgba(74, 6, 18, 0.30)',
          }}
        >
          Get Start
        </button>
        {/* Bunny — head peeks ABOVE the button, body/hands wrap around the
            right side. Higher z-index so ears/head are visible over the pill. */}
        <img
          src="/images/IP_%E9%AB%98%E5%85%B4.png"
          alt=""
          draggable={false}
          className="absolute select-none pointer-events-none"
          style={{
            left: 'calc(50% + 34px)',
            top: -34,
            width: 96,
            height: 96,
            objectFit: 'contain',
            zIndex: 1,
          }}
        />
      </div>
    </div>
  );
}

/**
 * Camera device stub. Live view is a warm neutral gradient with a subtle
 * baby-shape hint and a timestamp overlay.
 */
function BM04Card() {
  return (
    <div className="rounded-3xl overflow-hidden bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-3 px-4 py-3.5" style={{ background: '#EFE9F6' }}>
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
      <div
        className="w-full relative"
        style={{
          aspectRatio: '16 / 10',
          background:
            'radial-gradient(circle at 60% 55%, #F6E6D3 0%, #E7CFB9 40%, #C4A385 100%)',
        }}
      >
        {/* Soft baby-shape hint */}
        <div
          className="absolute"
          style={{
            left: '35%',
            top: '30%',
            width: 90,
            height: 90,
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 45% 40%, rgba(255, 235, 218, 0.9) 0%, rgba(230, 210, 195, 0.35) 60%, transparent 100%)',
            filter: 'blur(1px)',
          }}
        />
        <span
          className="absolute top-2.5 left-3 text-white text-[11px] font-medium tabular-nums"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        >
          2025-01-08 11:50:55
        </span>
      </div>
    </div>
  );
}

/** Small sensor device stub — one row: icon + name + status. */
function WN02Card() {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 bg-white rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
      <div className="w-11 h-11 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.6">
          {/* Square sensor with center dot — matches a smart device motif */}
          <rect x="4" y="4" width="16" height="16" rx="4" />
          <circle cx="12" cy="12" r="2" fill="#666" />
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
