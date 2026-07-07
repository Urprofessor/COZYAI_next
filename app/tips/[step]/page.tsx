import { notFound } from 'next/navigation';
import { TipStepPage } from '@/components/tips/TipStepPage';

interface PageProps {
  params: Promise<{ step: string }>;
}

export function generateStaticParams() {
  return Array.from({ length: 7 }, (_, i) => ({ step: String(i + 1) }));
}

export default async function Page({ params }: PageProps) {
  const { step } = await params;
  const n = Number(step);
  if (!Number.isInteger(n) || n < 1 || n > 7) notFound();
  return <TipStepPage tipNumber={n} />;
}
