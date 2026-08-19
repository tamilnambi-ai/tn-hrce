'use client';

import { useEffect, useState } from 'react';
import type { Temple } from '@/data/temples';
import TempleHero          from './TempleHero';
import AnnouncementStrip   from './AnnouncementStrip';
import StickyTabNav        from './StickyTabNav';
import KeyHighlightsRail   from './KeyHighlightsRail';
import MobileActionBar     from './MobileActionBar';
import BookPoojaModal      from './PoojaBooking/BookPoojaModal';
import { BookPoojaProvider, useBookPooja } from './BookPoojaContext';
import DrawEntryModal      from './DrawEntry/DrawEntryModal';
import { DrawEntryProvider, useDrawEntry } from './DrawEntry/DrawEntryContext';
import TempleDetailDonationModal from './TempleDetailDonationModal';
import OverviewSection     from './sections/OverviewSection';
import EventsSection       from './sections/EventsSection';
import HistorySection      from './sections/HistorySection';
import FestivalsSection    from './sections/FestivalsSection';
import AccommodationSection from './sections/AccommodationSection';
import DonationSection     from './sections/DonationSection';
import ThreeSixtySection   from './sections/ThreeSixtySection';
import LiveSection         from './sections/LiveSection';
import FacilitiesSection   from './sections/FacilitiesSection';
import NearbySection       from './sections/NearbySection';
import TripPlannerSection  from './sections/TripPlannerSection';
import ResourcesSection    from './sections/ResourcesSection';

// The anchors used by the sticky tab nav — order = display order in page.
// 'events' is included conditionally at render time based on whether the
// temple has any active announcements.
export const DETAIL_SECTIONS = [
  { id: 'overview',    labelKey: 'overview'    },
  { id: 'events',      labelKey: 'events'      },
  { id: 'festivals',   labelKey: 'festivals'   },
  { id: 'accommodation', labelKey: 'accommodation' },
  { id: 'donation',    labelKey: 'donation'    },
  { id: 'history',     labelKey: 'history'     },
  { id: 'threesixty',  labelKey: 'threesixty'  },
  { id: 'live',        labelKey: 'live'        },
  { id: 'facilities',  labelKey: 'facilities'  },
  { id: 'nearby',      labelKey: 'nearby'      },
  { id: 'resources',   labelKey: 'resources'   },
] as const;

export default function TempleDetailPage({ temple }: { temple: Temple }) {
  return (
    <BookPoojaProvider>
      <DrawEntryProvider>
        <TempleDetailInner temple={temple} />
      </DrawEntryProvider>
    </BookPoojaProvider>
  );
}

function TempleDetailInner({ temple }: { temple: Temple }) {
  const { isOpen, close } = useBookPooja();
  const draw = useDrawEntry();
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [donationOpen, setDonationOpen] = useState(false);

  // Track which section is in view (scrollspy)
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const seen = new Map<string, number>();
    const onIntersect = (entries: IntersectionObserverEntry[]) => {
      for (const e of entries) {
        seen.set(e.target.id, e.intersectionRatio);
      }
      let best: { id: string; ratio: number } | null = null;
      for (const [id, ratio] of seen) {
        if (ratio > 0 && (!best || ratio > best.ratio)) best = { id, ratio };
      }
      if (best) setActiveSection(best.id);
    };

    const io = new IntersectionObserver(onIntersect, {
      rootMargin: '-160px 0px -60% 0px',
      threshold: [0, 0.1, 0.5, 1],
    });
    for (const s of DETAIL_SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    }
    observers.push(io);
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const hasEvents = (temple.announcements ?? []).length > 0;

  return (
    <>
      {/* Full-width hero */}
      <TempleHero temple={temple} />

      {/* Announcement strip — shows only when there's a live event */}
      {hasEvents && <AnnouncementStrip announcements={temple.announcements!} />}

      {/* Sticky sub-nav — sits below the site header */}
      <StickyTabNav active={activeSection} hideEvents={!hasEvents} />

      {/* Two-column body */}
      <div className="container-page pt-8 pb-24 md:pb-16">
        <div className="flex gap-8">
          {/* Left: all content sections */}
          <div className="flex-1 min-w-0 space-y-14 md:space-y-16">
            <OverviewSection    temple={temple} />
            <EventsSection      temple={temple} />
            <FestivalsSection   temple={temple} />
            <AccommodationSection />
            <DonationSection    templeName={temple.name} onOpenDonation={() => setDonationOpen(true)} />
            <HistorySection     temple={temple} />
            <ThreeSixtySection  temple={temple} />
            <LiveSection        temple={temple} />
            <FacilitiesSection  temple={temple} />
            <NearbySection      temple={temple} />
            <TripPlannerSection temple={temple} />
            <ResourcesSection   temple={temple} />
          </div>

          {/* Right sticky rail — desktop only */}
          <aside className="hidden lg:block w-[320px] flex-shrink-0">
            <KeyHighlightsRail templeName={temple.name} />
          </aside>
        </div>
      </div>

      {/* Mobile floating bottom action bar */}
      <MobileActionBar />

      {/* Book Pooja / Darshan modal (opened from Overview button + mobile action bar) */}
      <BookPoojaModal open={isOpen} onClose={close} temple={temple} />

      {/* Donation modal (opened from the Donation section CTA) */}
      <TempleDetailDonationModal
        open={donationOpen}
        temple={temple}
        onClose={() => setDonationOpen(false)}
      />

      {/* Enter-the-Draw modal (opened from the announcement strip CTA) */}
      <DrawEntryModal
        open={draw.isOpen}
        onClose={draw.close}
        temple={temple}
        announcement={draw.announcement}
      />
    </>
  );
}
