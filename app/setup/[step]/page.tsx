// TODO: migrate the 7-step setup flow from AI-Setup2.0_Deepseek/index.html
// (step video, tips accordion, progress bar). See README "Migration TODO".

interface PageProps {
  params: Promise<{ step: string }>;
}

export default async function Page({ params }: PageProps) {
  const { step } = await params;
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Step {step}</h1>
      <p className="text-text-muted mt-2">Not migrated yet.</p>
    </main>
  );
}
