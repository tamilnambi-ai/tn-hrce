import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import TempleDetailPage from '@/components/temples/detail/TempleDetailPage';
import { templeById } from '@/data/temples';
import { fetchTempleBySlug } from '@/lib/wordpress-api';

interface Params { id: string }

/**
 * /temples/[id] — detail page for a single temple.
 * All content lives on this single scroll page — no sub-pages.
 * Fetches from WordPress API, falls back to static data.
 */
export default async function Page({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  // Try WordPress first, then fall back to static data
  let temple = await fetchTempleBySlug(id);
  if (!temple) {
    temple = templeById(id);
  }

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
