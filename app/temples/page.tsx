import Header from '@/components/layout/Header';
import TemplesListingPage from '@/components/temples/TemplesListingPage';

/**
 * /temples — full temples listing page.
 * Shows all temples for the currently selected city with search + filter sidebar.
 */
export default function TemplesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[--color-surface-muted]">
      <Header />
      <main className="flex-1">
        <TemplesListingPage />
      </main>
    </div>
  );
}
