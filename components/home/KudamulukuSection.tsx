'use client';

/**
 * KudamulukuSection — placeholder rail
 *
 * A-track scope: same shape as EventsSection but with inline demo entries.
 * Real data + a dedicated KudamulukuCard can come later (B-track).
 */

import Link from 'next/link';
import { ArrowRight, Calendar, MapPin, Droplets } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCity } from '@/contexts/CityContext';
import { t } from '@/lib/i18n';

type Kudamuluku = {
  id: string;
  temple: string;
  templeTa?: string;
  area: string;
  areaTa?: string;
  daysAway: number;
  dateLabel: string;
  dateLabelTa?: string;
  imageUrl: string;
};

// ── Demo entries (city-agnostic prototype content) ─────────────────────────────
const DEMO: Kudamuluku[] = [
  {
    id: 'kmk-1',
    temple: 'Arulmigu Kapaleeswarar Temple',
    templeTa: 'அருள்மிகு கபாலீஸ்வரர் திருக்கோயில்',
    area: 'Mylapore',
    areaTa: 'மயிலாப்பூர்',
    daysAway: 42,
    dateLabel: 'Aug 12 — Aug 18',
    dateLabelTa: 'ஆக 12 — ஆக 18',
    imageUrl: 'https://images.unsplash.com/photo-1768406091087-7fb0d03f6064?w=800&h=500&fit=crop&q=80&auto=format',
  },
  {
    id: 'kmk-2',
    temple: 'Sri Parthasarathy Temple',
    templeTa: 'ஸ்ரீ பார்த்தசாரதி திருக்கோயில்',
    area: 'Triplicane',
    areaTa: 'திருவல்லிக்கேணி',
    daysAway: 96,
    dateLabel: 'Nov 04 — Nov 10',
    dateLabelTa: 'நவ 04 — நவ 10',
    imageUrl: 'https://images.unsplash.com/photo-1705723116788-d11fa6e3f415?w=800&h=500&fit=crop&q=80&auto=format',
  },
  {
    id: 'kmk-3',
    temple: 'Sri Vadapalani Andavar Temple',
    templeTa: 'ஸ்ரீ வடபழனி ஆண்டவர் திருக்கோயில்',
    area: 'Vadapalani',
    areaTa: 'வடபழனி',
    daysAway: 154,
    dateLabel: 'Jan 15 — Jan 21',
    dateLabelTa: 'ஜன 15 — ஜன 21',
    imageUrl: 'https://images.unsplash.com/photo-1778385924133-4f9987da2aa7?w=800&h=500&fit=crop&q=80&auto=format',
  },
];

function CountdownBadge({ days, ta }: { days: number; ta: boolean }) {
  const label = ta ? `${days} நாட்களில்` : `In ${days} days`;
  return (
    <span className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-[--color-btn-primary-bg] text-white text-[11px] font-bold rounded-full tracking-wide">
      <Droplets className="w-3 h-3" />
      {label}
    </span>
  );
}

function KudamulukuCard({ item }: { item: Kudamuluku }) {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const temple = ta ? (item.templeTa ?? item.temple) : item.temple;
  const area   = ta ? (item.areaTa   ?? item.area)   : item.area;
  const date   = ta ? (item.dateLabelTa ?? item.dateLabel) : item.dateLabel;
  const taClass = ta ? 'ta-text' : '';

  return (
    <Link href={`/placeholder?page=kudamuluku&id=${item.id}`} className="card-root group block">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
        <img src={item.imageUrl} alt={temple} className="card-img" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <CountdownBadge days={item.daysAway} ta={ta} />
      </div>
      <div className="mt-3 px-0.5">
        <h3 className={`text-[15px] font-semibold text-neutral-900 leading-snug group-hover:text-[--color-site-name] transition-colors ${taClass}`}>
          {temple}
        </h3>
        <div className="flex items-center gap-1 mt-1.5">
          <MapPin className="w-3 h-3 text-neutral-400 flex-shrink-0" />
          <span className={`text-[13px] text-neutral-500 truncate ${taClass}`}>{area}</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Calendar className="w-3 h-3 text-neutral-400" />
          <span className={`text-[12px] text-neutral-500 ${taClass}`}>{date}</span>
        </div>
      </div>
    </Link>
  );
}

export default function KudamulukuSection() {
  const { lang } = useLanguage();
  const { city } = useCity();
  const cityName = lang === 'ta' ? city.nameTa : city.name;

  return (
    <section className="bg-[#ffefe0]">
      <div className="container-page py-12 md:py-16">
        <div className="flex items-end justify-between mb-6 md:mb-8">
          <div>
            <h2 className={`section-title ${lang === 'ta' ? 'ta-text' : ''}`}>
              {t(lang, 'kudamuluku.sectionTitle', { city: cityName })}
            </h2>
            <p className={`text-[12px] text-neutral-400 mt-1 font-medium ${lang === 'ta' ? 'ta-text' : ''}`}>
              {t(lang, 'kudamuluku.demoNote')}
            </p>
          </div>
          <Link
            href="/placeholder?page=kudamuluku"
            className={`flex items-center gap-1 text-[13px] font-semibold text-[--color-section-link] hover:opacity-70 transition-opacity flex-shrink-0 ml-6 pb-0.5 ${lang === 'ta' ? 'ta-text' : ''}`}
          >
            {t(lang, 'kudamuluku.showAll')}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div key={city.id} className="city-fade grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {DEMO.map((item) => (
            <KudamulukuCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
