import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import TempleDetailPage from '@/components/temples/detail/TempleDetailPage';
import { templeById } from '@/data/temples';

interface Params { id: string }

/**
 * /temples/[id] — detail page for a single temple.
 * All content lives on this single scroll page — no sub-pages.
 */
export default async function Page({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const temple = templeById(id);
  if (!temple) notFound();
  return (
    <div className="min-h-screen flex flex-col bg-[--color-surface-muted]">
      <Header />
      <main className="flex-1">
        <TempleDetailPage temple={temple} />
      </main>
    </div>
  );
}
