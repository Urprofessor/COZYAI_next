import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Momcozy Air One',
  description: 'Setup guide and CozyAI assistant for the Momcozy Air One wearable breast pump.',
  applicationName: 'Momcozy Air One',
  appleWebApp: {
    capable: true,
    title: 'Momcozy',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#FEF5F5',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Legacy iOS PWA tag — Next's appleWebApp emits `apple-mobile-web-app-capable`;
            we add `mobile-web-app-capable` for newer WebKit which no longer reads the apple-prefixed one. */}
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-sans antialiased text-text-1">
        <div id="app" className="relative w-screen h-[100dvh] overflow-hidden bg-brand-rose-50">
          {children}
        </div>
      </body>
    </html>
  );
}
