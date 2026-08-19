'use client';

import { MapPin, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Temple } from '@/data/temples';
import { CITIES } from '@/contexts/CityContext';
import { cn } from '@/lib/utils';

export default function TempleHero({ temple }: { temple: Temple }) {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const cityMeta = CITIES.find((c) => c.id === temple.city);
  const name  = ta ? (temple.nameTa ?? temple.name) : temple.name;
  const area  = ta ? (temple.areaTa ?? temple.area) : temple.area;
  const cityName = cityMeta ? (ta ? cityMeta.nameTa : cityMeta.name) : temple.city;
  const deity = ta ? (temple.deityTa ?? temple.deity) : temple.deity;
  const taClass = ta ? 'ta-text' : '';

  return (
    <section className="relative w-full h-[180px] md:h-[220px] overflow-hidden">
      <img
        src={temple.imageUrl.replace(/w=\d+/, 'w=1800').replace(/h=\d+/, 'h=700')}
        alt={name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

      {/* Breadcrumb */}
      <div className="absolute top-4 left-0 right-0 z-10 container-page">
        <div className="flex items-center gap-1.5 text-white/85 text-[12px] font-medium">
          <Link href="/" className="hover:text-white transition-colors">
            {ta ? 'முகப்பு' : 'Home'}
          </Link>
          <ChevronRight className="w-3 h-3 opacity-60" />
          <Link href="/temples" className="hover:text-white transition-colors">
            {ta ? `${cityName} கோயில்கள்` : `${cityName} Temples`}
          </Link>
          <ChevronRight className="w-3 h-3 opacity-60" />
          <span className={cn('text-white font-semibold truncate', taClass)}>{name}</span>
        </div>
      </div>

      {/* Bottom info block */}
      <div className="absolute inset-x-0 bottom-0 z-10 container-page pb-4 md:pb-5">
        <div className="max-w-[820px]">
          {deity && (
            <span className={cn('inline-block px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest mb-2', taClass)}>
              {deity}
            </span>
          )}
          <h1 className={cn('text-white text-[20px] md:text-[26px] font-bold leading-tight drop-shadow-md', taClass)}>
            {name}
          </h1>
          <div className={cn('flex items-center gap-1.5 mt-1.5 text-white/90 text-[12px] md:text-[13px] font-medium', taClass)}>
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{area} · {cityName} · {temple.pincode}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
