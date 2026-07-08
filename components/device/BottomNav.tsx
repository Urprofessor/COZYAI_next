'use client';

type Tab = 'home' | 'device' | 'community' | 'me';

interface Props {
  active?: Tab;
}

// PNG icons exported from Figma. Only "device" has an explicit `on` variant so
// far; the other tabs stay at their neutral (base) icon whether or not they're
// the current tab.
const ICON: Record<Tab, string> = {
  home: '/icon/icon_button_tab/Home01Icon.png',
  device: '/icon/icon_button_tab/deviceonIcon.png',
  community: '/icon/icon_button_tab/Community01Icon.png',
  me: '/icon/icon_button_tab/Me01Icon.png',
};

const TABS: Array<{ tab: Tab; label: string }> = [
  { tab: 'home', label: 'Home' },
  { tab: 'device', label: 'Device' },
  { tab: 'community', label: 'Community' },
  { tab: 'me', label: 'Me' },
];

/**
 * Floating rounded liquid-glass tab bar (iOS 26+ style). Sits above the page
 * background with margin on all sides so the page still shows around it — the
 * frosted glass reads properly against whatever is behind.
 *
 * Home / Community / Me are stubs — clicking them does nothing yet.
 */
export function BottomNav({ active = 'device' }: Props) {
  return (
    <div
      className="fixed z-[20] flex items-center justify-around"
      style={{
        left: 16,
        right: 16,
        bottom: 'calc(env(safe-area-inset-bottom) + 16px)',
        minHeight: 68,
        padding: '10px 6px',
        borderRadius: 34, // fully-rounded pill
        background:
          'linear-gradient(180deg, rgba(249, 247, 245, 0.68) 0%, rgba(249, 247, 245, 0.85) 100%)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        border: '0.5px solid rgba(255, 255, 255, 0.55)',
        boxShadow:
          '0 6px 24px rgba(74, 6, 18, 0.10), 0 1px 2px rgba(74, 6, 18, 0.06)',
      }}
    >
      {TABS.map(({ tab, label }) => (
        <NavItem key={tab} tab={tab} label={label} active={active} />
      ))}
    </div>
  );
}

function NavItem({ tab, label, active }: { tab: Tab; label: string; active: Tab }) {
  const isActive = tab === active;
  return (
    <button
      type="button"
      className="flex flex-col items-center gap-0.5 border-0 bg-transparent cursor-pointer px-2 active:opacity-70 transition-opacity"
    >
      <img
        src={ICON[tab]}
        alt=""
        draggable={false}
        className="select-none block"
        style={{ width: 32, height: 32, objectFit: 'contain' }}
      />
      <span
        className="font-medium"
        style={{
          fontSize: 11,
          color: isActive ? '#4A0612' : '#8A8A8A',
          letterSpacing: 0,
          lineHeight: 1,
        }}
      >
        {label}
      </span>
    </button>
  );
}
