'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const PILLS = [
  'How do I know the flange fits?',
  'What if the suction feels weak?',
  'Connection issues.',
];

export function CozyWelcome() {
  const [greeting, setGreeting] = useState('Good day');
  const [name, setName] = useState('Clara');
  const router = useRouter();

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening');
    setName(localStorage.getItem('cozyUserName') || 'Clara');
  }, []);

  function sendPill(text: string) {
    // Simplest handoff to the Chat page: seed via querystring.
    router.push(`/cozy/chat?q=${encodeURIComponent(text)}`);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Background image (bottom-anchored) */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 pointer-events-none bg-brand-rose-50"
        style={{
          backgroundImage: "url('/images/Background.png')",
          backgroundSize: '100% auto',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Topbar */}
      <div className="relative z-[1] flex items-center justify-center h-14 px-2 flex-shrink-0">
        <Link
          href="/"
          aria-label="Back"
          className="absolute left-3 w-9 h-9 rounded-full border-0 bg-white/70 flex items-center justify-center cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A0612" strokeWidth="2.2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <span className="text-[15px] font-semibold text-brand-rose-500 opacity-80">CozyAI</span>
      </div>

      {/* Body */}
      <div className="relative z-[1] flex-1 flex flex-col items-center px-6 pt-2 overflow-y-auto">
        <img
          src="/images/IP_%E9%AB%98%E5%85%B4.png"
          alt="CozyAI"
          draggable={false}
          className="block h-auto w-[66vw] mx-auto mt-1.5 mb-4"
        />
        <p className="w-full max-w-[361px] font-denton text-[28px] leading-[140%] text-text-1 text-center m-0">
          {greeting}, <span className="text-brand-rose-700">{name}</span>
        </p>
        <p className="w-full max-w-[361px] font-denton text-[28px] leading-[140%] text-text-1 text-center m-0">
          How can I help?
        </p>

        <div className="w-full flex flex-col items-start gap-2.5 mt-auto pb-4">
          {PILLS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => sendPill(p)}
              className="w-auto max-w-full text-left bg-white/70 border-0 rounded-[20px] px-[18px] py-3 text-[15px] leading-snug text-brand-rose-500 whitespace-nowrap cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Ask anything input just routes to chat */}
      <div className="relative z-[6] px-4 flex-shrink-0">
        <button
          type="button"
          onClick={() => router.push('/cozy/chat')}
          className="flex items-center gap-2.5 bg-white rounded-3xl px-[18px] py-3.5 shadow-[0_4px_18px_rgba(74,6,18,0.08)] w-full text-left"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" className="w-5 h-5 text-neutral-900">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span className="text-base text-neutral-400">Ask anything</span>
        </button>
      </div>

      <p
        className="text-center text-[11px] text-brand-rose-500/40 pt-2 relative z-[6] flex-shrink-0"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        AI-generated, not professional advice.
      </p>
    </div>
  );
}
