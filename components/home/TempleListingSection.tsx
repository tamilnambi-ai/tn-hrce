'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCity } from '@/contexts/CityContext';
import { t } from '@/lib/i18n';
import { templesByCity } from '@/data/temples';
import TempleCard from '@/components/cards/TempleCard';

export default function TempleListingSection() {
  const { lang } = useLanguage();
  const { city } = useCity();
  const temples = templesByCity(city.id, 6);
  const cityName = lang === 'ta' ? city.nameTa : city.name;
  const taClass = lang === 'ta' ? 'ta-text' : '';

  return (
    <section className="bg-[--color-surface-muted]">
      <div className="container-page py-12 md:py-16">
        <div className="flex items-end justify-between mb-6 md:mb-8">
          <div>
            <h2 className={`section-title ${taClass}`}>
              {t(lang, 'temples.sectionTitle', { city: cityName })}
            </h2>
            <p className={`text-[13px] text-[--color-text-secondary] mt-1 font-medium ${taClass}`}>
              {t(lang, 'temples.cityLabel', { city: cityName })}
            </p>
          </div>
          <Link
            href="/temples"
            className={`flex items-center gap-1 text-[13px] font-semibold text-[--color-section-link] hover:opacity-70 transition-opacity flex-shrink-0 ml-6 pb-0.5 ${taClass}`}
          >
            {t(lang, 'temples.showAll')}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {temples.length > 0 ? (
          <div key={city.id} className="city-fade grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {temples.map((temple) => (
              <TempleCard key={temple.id} temple={temple} />
            ))}
          </div>
        ) : (
          <div className={`text-center py-16 text-[--color-text-secondary] ${taClass}`}>
            <p className="text-[16px] font-semibold">{t(lang, 'temples.empty', { city: cityName })}</p>
            <p className="text-[13px] mt-1">{t(lang, 'temples.emptyHint')}</p>
          </div>
        )}
      </div>
    </section>
  );
}
