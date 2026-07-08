'use client';

import { useRouter } from 'next/navigation';
import { BottomNav } from './BottomNav';

/**
 * My Device hub. Two designed device cards stacked; tapping the first
 * (Breast Pump) navigates into the setup flow via /welcome. The BM04 card is
 * visual only. Bottom liquid-glass tab bar at the bottom.
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

      {/* Two designed device cards. Card 1 acts as the "Get Start" affordance
          → same target as the on-image Get Start button. */}
      <div
        className="flex-1 flex flex-col gap-3.5 px-5"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 120px)' }}
      >
        <button
          type="button"
          onClick={() => router.push('/welcome')}
          aria-label="Start setup guide"
          className="block w-full p-0 border-0 bg-transparent cursor-pointer active:opacity-90 transition-opacity"
        >
          <img
            src="/images/device/%E8%AE%BE%E5%A4%87%E5%8D%A1%E7%89%87%E9%A1%B5getstart.png"
            alt="Breast Pump — tap to start setup guide"
            draggable={false}
            className="block w-full h-auto select-none"
          />
        </button>

        <img
          src="/images/device/%E8%AE%BE%E5%A4%87%E5%8D%A1%E7%89%87%E9%A1%B5BM04.png"
          alt="BM04"
          draggable={false}
          className="block w-full h-auto select-none"
        />
      </div>

      <BottomNav active="device" />
    </div>
  );
}
