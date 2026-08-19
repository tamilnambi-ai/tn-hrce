import Header from '@/components/layout/Header';
import RenovationPage from '@/components/renovation/RenovationPage';

/**
 * /temples/renovation — public page listing every active temple renovation
 * across Tamil Nadu, filterable by city.
 */
export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <RenovationPage />
      </main>
    </div>
  );
}
