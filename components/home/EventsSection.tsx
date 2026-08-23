'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCity } from '@/contexts/CityContext';
import { t } from '@/lib/i18n';
import { eventsByCity } from '@/data/events';
import EventCard from '@/components/cards/EventCard';

export default function EventsSection() {
  const { lang } = useLanguage();
  const { city } = useCity();
  const events = eventsByCity(city.id, 3);
  const cityName = lang === 'ta' ? city.nameTa : city.name;

  return (
    <section className="bg-[#ffefe0]">
      <div className="container-page py-12 md:py-16">
        <div className="flex items-end justify-between mb-6 md:mb-8">
          <div>
            <h2 className={`section-title ${lang === 'ta' ? 'ta-text' : ''}`}>
              {t(lang, 'events.sectionTitle', { city: cityName })}
            </h2>
            <p className={`text-[12px] text-neutral-400 mt-1 font-medium ${lang === 'ta' ? 'ta-text' : ''}`}>
              {t(lang, 'events.demoNote')}
            </p>
          </div>
          <Link
            href="/placeholder?page=events"
            className={`flex items-center gap-1 text-[13px] font-semibold text-[--color-section-link] hover:opacity-70 transition-opacity flex-shrink-0 ml-6 pb-0.5 ${lang === 'ta' ? 'ta-text' : ''}`}
          >
            {t(lang, 'events.showAll')}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {events.length > 0 ? (
          <div key={city.id} className="city-fade grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className={`text-center py-16 text-[--color-text-secondary] ${lang === 'ta' ? 'ta-text' : ''}`}>
            <p className="text-[16px] font-semibold">{t(lang, 'events.empty', { city: cityName })}</p>
            <p className="text-[13px] mt-1">{t(lang, 'events.emptyHint')}</p>
          </div>
        )}
      </div>
    </section>
  );
}
