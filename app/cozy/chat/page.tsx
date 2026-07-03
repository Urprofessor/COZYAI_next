import { CozyChat } from '@/components/cozy/Chat';

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { q } = await searchParams;
  return <CozyChat initialQuestion={q} />;
}
