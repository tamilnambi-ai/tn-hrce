import Header from '@/components/layout/Header';
import FestivalsPage from '@/components/festivals/FestivalsPage';

export const metadata = {
  title: 'Festivals — Tamil Nadu HR&CE',
  description: 'Explore temple festivals and celebrations across Tamil Nadu. Follow the lunar calendar.',
};

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <FestivalsPage />
      </main>
    </div>
  );
}
