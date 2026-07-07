'use client';

import Link from 'next/link';

/**
 * Bottom-anchored "Ask CozyAI" pill used on the Tips index. Sits above a
 * 125px fade-out mask so tip cards scroll behind it cleanly.
 */
export function FloatingCozyBtn() {
  return (
    <>
      {/* Fade mask behind the button */}
      <div
        aria-hidden
        className="fixed left-0 right-0 bottom-0 h-[125px] pointer-events-none z-[4]"
        style={{
          background:
            'linear-gradient(180deg, rgba(255, 247, 248, 0.00) -5.91%, #FFF7F8 20%)',
        }}
      />
      <Link
        href="/cozy/welcome?from=tips"
        aria-label="Ask CozyAI"
        className="fixed left-4 right-4 z-[5] block active:opacity-80 transition-opacity"
        style={{ bottom: 'env(safe-area-inset-bottom)' }}
      >
        <img
          src="/images/cozyAIbutton%20down.png"
          alt=""
          draggable={false}
          className="w-full h-auto block"
        />
      </Link>
    </>
  );
}
