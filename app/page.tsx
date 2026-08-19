import Header from '@/components/layout/Header';
import HeroSection from '@/components/home/HeroSection';
import SpotlightActions from '@/components/home/SpotlightActions';
import QuickActions from '@/components/home/QuickActions';
import EventsSection from '@/components/home/EventsSection';
import KudamulukuSection from '@/components/home/KudamulukuSection';
import TempleListingSection from '@/components/home/TempleListingSection';

/**
 * Homepage — Phase 2
 * City-aware: all sections read the selected city from CityContext
 * and filter their own data. No server-side data props needed.
 */
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <SpotlightActions />
        {/* <QuickActions /> — hidden per design review 2026-08-18 */}
        <EventsSection />
        <KudamulukuSection />
        <TempleListingSection />
      </main>
    </div>
  );
}
