'use client';

type Tab = 'home' | 'device' | 'community' | 'me';

interface Props {
  active?: Tab;
}

// PNG icons from the Figma export. Only "device" has an explicit `on` variant;
// the other tabs stay at their neutral (base) icon whether or not they're the
// current tab, so we don't need active state art for them yet.
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
 * Bottom tab bar — iOS 26+ liquid-glass style. Full viewport width, floating
 * above content with a heavy backdrop-blur so what's behind still bleeds
 * through subtly. Tokens from the Figma inspect:
 *   • 94.5px hug height
 *   • padding 16/25/25/25
 *   • background lgrad #F9F7F5 @ ~72% alpha
 *
 * Home / Community / Me are stubs — clicking them does nothing yet.
 */
export function BottomNav({ active = 'device' }: Props) {
  return (
    <div
      className="fixed left-0 right-0 bottom-0 z-[20] flex items-start justify-around"
      style={{
        // Figma hug height is 94.5; use min-height so devices with a safe-area
        // inset (iPhone home indicator) can grow the bar instead of squeezing content.
        minHeight: 94.5,
        paddingTop: 16,
        paddingLeft: 25,
        paddingRight: 25,
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)',
        background:
          'linear-gradient(180deg, rgba(249, 247, 245, 0.72) 0%, rgba(249, 247, 245, 0.90) 100%)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        borderTop: '0.5px solid rgba(255, 255, 255, 0.55)',
        boxShadow: '0 -1px 0 rgba(0, 0, 0, 0.04)',
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
      className="flex flex-col items-center gap-1 border-0 bg-transparent cursor-pointer px-3 active:opacity-70 transition-opacity"
    >
      <img
        src={ICON[tab]}
        alt=""
        draggable={false}
        className="select-none"
        style={{ width: 26, height: 26, objectFit: 'contain' }}
      />
      <span
        className="font-medium"
        style={{
          fontSize: 11,
          color: isActive ? '#4A0612' : '#8A8A8A',
          letterSpacing: 0,
        }}
      >
        {label}
      </span>
    </button>
  );
}
