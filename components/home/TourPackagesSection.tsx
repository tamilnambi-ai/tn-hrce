'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCity } from '@/contexts/CityContext';
import { t } from '@/lib/i18n';
import { packagesByCity } from '@/data/tourPackages';
import TourPackageCard from '@/components/cards/TourPackageCard';

export default function TourPackagesSection() {
  const { lang } = useLanguage();
  const { city } = useCity();
  const packages = packagesByCity(city.id, 3);
  const cityName = lang === 'ta' ? city.nameTa : city.name;
  const taClass = lang === 'ta' ? 'ta-text' : '';

  return (
    <section className="bg-[#FAF6EE]">
      <div className="container-page py-12 md:py-16">
        <div className="flex items-end justify-between mb-6 md:mb-8">
          <div>
            <h2 className={`section-title ${taClass}`}>{t(lang, 'tourPackages.sectionTitle')}</h2>
            <p className={`text-[13px] text-[--color-text-secondary] mt-1 font-medium ${taClass}`}>
              {t(lang, 'tourPackages.cityLabel', { city: cityName })}
            </p>
          </div>
          <Link
            href="/placeholder?page=tour-packages"
            className={`flex items-center gap-1 text-[13px] font-semibold text-[--color-section-link] hover:opacity-70 transition-opacity flex-shrink-0 ml-6 pb-0.5 ${taClass}`}
          >
            {t(lang, 'tourPackages.showAll')}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {packages.length > 0 ? (
          <div key={city.id} className="city-fade grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {packages.map((pkg) => (
              <TourPackageCard
                key={pkg.id}
                pkg={pkg}
                durationLabel={t(lang, 'tourPackages.duration')}
                templesLabel={t(lang, 'tourPackages.temples')}
              />
            ))}
          </div>
        ) : (
          <div className={`text-center py-16 text-[--color-text-secondary] ${taClass}`}>
            <p className="text-[16px] font-semibold">{t(lang, 'tourPackages.empty', { city: cityName })}</p>
            <p className="text-[13px] mt-1">{t(lang, 'tourPackages.emptyHint')}</p>
          </div>
        )}
      </div>
    </section>
  );
}
