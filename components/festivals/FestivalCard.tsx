'use client';

import Link from 'next/link';
import { MapPin, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import type { Festival } from '@/data/festivals';
import { getTithiEmoji } from '@/data/festivals';
import { cn } from '@/lib/utils';

export default function FestivalCard({ festival }: { festival: Festival }) {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const taClass = ta ? 'ta-text' : '';

  const templeName = ta ? festival.templeNameTa : festival.templeName;
  const tithiName = ta ? festival.tithiNameTa : festival.tithiName;
  const description = ta ? festival.descriptionTa : festival.description;

  // Format date range
  const dateFrom = new Date(festival.dateFrom);
  const dateTo = new Date(festival.dateTo);
  const dateStr =
    dateFrom.getMonth() === dateTo.getMonth()
      ? `${dateFrom.toLocaleDateString('en-IN', { day: 'numeric' })}–${dateTo.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
      : `${dateFrom.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – ${dateTo.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`;

  const emoji = getTithiEmoji(festival.tithi);

  return (
    <Link href={`/temples/${festival.templeId}`}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 hover:shadow-lg hover:border-neutral-300 transition-all cursor-pointer h-full flex flex-col">
        {/* Top row: Deity + City chip */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <p className={cn('text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1', taClass)}>
              {ta ? festival.deityTa : festival.deity}
            </p>
            <h3 className={cn('text-[15px] font-bold text-neutral-900 leading-snug', taClass)}>
              {templeName}
            </h3>
          </div>
          <div className="flex-shrink-0 px-2.5 py-1 bg-neutral-100 rounded-full text-[11px] font-semibold text-neutral-600 whitespace-nowrap">
            {festival.city.charAt(0).toUpperCase() + festival.city.slice(1)}
          </div>
        </div>

        {/* Lunar info */}
        <div className="flex items-center gap-1.5 mb-3 pb-3 border-b border-neutral-100">
          <span className="text-[18px]">{emoji}</span>
          <p className={cn('text-[13px] font-semibold text-neutral-900', taClass)}>
            {tithiName}
          </p>
        </div>

        {/* Gregorian dates */}
        <div className="flex items-center gap-2 mb-3 text-[12px] text-neutral-600">
          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{dateStr}</span>
        </div>

        {/* Description */}
        <p className={cn('text-[13px] text-neutral-700 line-clamp-3 flex-1 mb-3 leading-relaxed', taClass)}>
          {description}
        </p>

        {/* CTA button */}
        <button className={cn(
          'inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[12px] font-semibold transition-colors text-center',
          taClass
        )}>
          {t(lang, 'festivals.card.viewTemple')}
          <span>→</span>
        </button>
      </div>
    </Link>
  );
}
