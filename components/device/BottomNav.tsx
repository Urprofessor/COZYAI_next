'use client';

import { cn } from '@/lib/utils';

type Tab = 'home' | 'device' | 'community' | 'me';

interface Props {
  active?: Tab;
}

/**
 * Bottom tab bar shown on the My Device hub. Visual only — the other tabs
 * (Home / Community / Me) aren't built yet, so they don't navigate.
 */
export function BottomNav({ active = 'device' }: Props) {
  return (
    <div
      className="fixed left-0 right-0 bottom-0 z-[20] bg-white flex items-center justify-around"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingTop: 8,
        borderTop: '0.5px solid #EEE',
      }}
    >
      <NavItem label="Home" tab="home" active={active} />
      <NavItem label="Device" tab="device" active={active} highlighted />
      <NavItem label="Community" tab="community" active={active} />
      <NavItem label="Me" tab="me" active={active} />
    </div>
  );
}

function NavItem({
  label,
  tab,
  active,
  highlighted,
}: {
  label: string;
  tab: Tab;
  active: Tab;
  highlighted?: boolean;
}) {
  const isActive = tab === active;
  return (
    <button
      type="button"
      className={cn(
        'flex flex-col items-center justify-center gap-0.5 border-0 bg-transparent cursor-pointer',
        'py-1 px-3'
      )}
    >
      <div
        className="flex items-center justify-center"
        style={
          highlighted && isActive
            ? {
                width: 46,
                height: 30,
                borderRadius: 100,
                background: '#F5E9EB',
              }
            : undefined
        }
      >
        <Icon tab={tab} active={isActive} />
      </div>
      <span
        className="font-medium"
        style={{
          fontSize: 11,
          color: isActive ? '#4A0612' : '#8A8A8A',
          marginTop: 2,
        }}
      >
        {label}
      </span>
    </button>
  );
}

function Icon({ tab, active }: { tab: Tab; active: boolean }) {
  const stroke = active ? '#4A0612' : '#8A8A8A';
  const fill = active ? '#4A0612' : 'none';
  const size = 22;

  if (tab === 'home') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l9-8 9 8" />
        <path d="M5 10v10h4v-6h6v6h4V10" />
      </svg>
    );
  }
  if (tab === 'device') {
    // A hexagon with a Y inside — matches the "Y-shape" in the screenshot.
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="1.6" strokeLinejoin="round">
        <path d="M12 2l8.5 5v10L12 22 3.5 17V7z" />
        <path d="M8 8l4 4 4-4M12 12v5" stroke={active ? '#fff' : '#8A8A8A'} fill="none" />
      </svg>
    );
  }
  if (tab === 'community') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6">
        <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(-20 12 12)" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    );
  }
  // me
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1-4.5 4.5-7 8-7s7 2.5 8 7" />
    </svg>
  );
}
