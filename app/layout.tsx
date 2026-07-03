import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Momcozy Air One',
  description: 'Setup guide and CozyAI assistant for the Momcozy Air One wearable breast pump.',
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
      <body className="font-sans antialiased text-text-1">
        <div id="app" className="relative w-screen h-[100dvh] overflow-hidden bg-brand-rose-50">
          {children}
        </div>
      </body>
    </html>
  );
}
