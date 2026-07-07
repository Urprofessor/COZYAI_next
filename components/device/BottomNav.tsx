'use client';

import { cn } from '@/lib/utils';

type Tab = 'home' | 'device' | 'community' | 'me';

interface Props {
  active?: Tab;
}

/**
 * Bottom tab bar. Visual only — Home / Community / Me stubs don't navigate
 * because their pages don't exist yet.
 */
export function BottomNav({ active = 'device' }: Props) {
  const tabs: Array<{ tab: Tab; label: string }> = [
    { tab: 'home', label: 'Home' },
    { tab: 'device', label: 'Device' },
    { tab: 'community', label: 'Community' },
    { tab: 'me', label: 'Me' },
  ];
  return (
    <div
      className="fixed left-0 right-0 bottom-0 z-[20] bg-white flex items-center justify-around"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingTop: 6,
        borderTop: '0.5px solid #EEE',
      }}
    >
      {tabs.map(({ tab, label }) => (
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
      className="flex flex-col items-center border-0 bg-transparent cursor-pointer py-1 px-4"
    >
      <div
        className="flex items-center justify-center transition-colors"
        style={
          isActive
            ? {
                width: 50,
                height: 30,
                borderRadius: 999,
                background: '#F3E1E4',
              }
            : undefined
        }
      >
        <Icon tab={tab} active={isActive} />
      </div>
      <span
        className={cn('font-medium', isActive && 'font-semibold')}
        style={{
          fontSize: 11,
          color: isActive ? '#4A0612' : '#8A8A8A',
          marginTop: 3,
        }}
      >
        {label}
      </span>
    </button>
  );
}

function Icon({ tab, active }: { tab: Tab; active: boolean }) {
  const color = active ? '#4A0612' : '#8A8A8A';
  const size = 20;

  if (tab === 'home') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l9-8 9 8" />
        <path d="M5 10v10h4v-6h6v6h4V10" />
      </svg>
    );
  }
  if (tab === 'device') {
    // Filled hexagon with a stylized "Y" inside. Matches the highlighted Y-in-
    // hexagon tab motif from the design.
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2.4l8.3 4.8v9.6L12 21.6 3.7 16.8V7.2L12 2.4z"
          fill={color}
          stroke={color}
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 8.2l3.5 3.6 3.5-3.6M12 11.8v4"
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    );
  }
  if (tab === 'community') {
    // Planet with orbit ring
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
        <circle cx="12" cy="12" r="5" />
        <ellipse cx="12" cy="12" rx="10.5" ry="4" transform="rotate(-25 12 12)" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1-4.5 4.5-7 8-7s7 2.5 8 7" />
    </svg>
  );
}
