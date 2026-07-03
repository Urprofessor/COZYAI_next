import Link from 'next/link';

// Landing/home. Kept intentionally simple — the vanilla project's welcome page
// with its "Welcome to Air One" hero is a candidate for a future migration.
export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-full px-6 gap-6">
      <h1 className="font-denton text-4xl text-brand-rose-500 text-center">
        Momcozy Air One
      </h1>
      <p className="text-center text-text-muted max-w-xs">
        Migration in progress — the CozyAI experience is ready to use. Setup and
        Tips pages will follow.
      </p>
      <nav className="flex flex-col gap-3 w-full max-w-xs mt-4">
        <Link
          href="/cozy/welcome"
          className="bg-brand-rose-500 text-white rounded-full py-4 text-center font-semibold"
        >
          Open CozyAI
        </Link>
        <Link
          href="/setup/1"
          className="bg-white/70 text-brand-rose-500 rounded-full py-4 text-center font-semibold border border-brand-rose-500/10"
        >
          Setup guide (todo)
        </Link>
        <Link
          href="/tips"
          className="bg-white/70 text-brand-rose-500 rounded-full py-4 text-center font-semibold border border-brand-rose-500/10"
        >
          Tips (todo)
        </Link>
      </nav>
    </main>
  );
}
