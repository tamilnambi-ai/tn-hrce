'use client';

/**
 * FestivalCard — matches RenovationCard design patterns
 *
 * Chips (city + deity) top → festival name → temple name with location icon →
 * description → date info box → View Temple CTA
 */

import Link from 'next/link';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import type { Festival } from '@/data/festivals';
import { cn } from '@/lib/utils';

export default function FestivalCard({ festival }: { festival: Festival }) {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const taClass = ta ? 'ta-text' : '';

  const templeName = ta ? festival.templeNameTa : festival.templeName;
  const tithiName = ta ? festival.tithiNameTa : festival.tithiName;
  const description = ta ? festival.descriptionTa : festival.description;
  const deity = festival.deity;

  // Format date range
  const dateFrom = new Date(festival.dateFrom);
  const dateTo = new Date(festival.dateTo);
  const dateStr =
    dateFrom.getMonth() === dateTo.getMonth()
      ? `${dateFrom.toLocaleDateString('en-IN', { day: 'numeric' })}–${dateTo.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
      : `${dateFrom.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – ${dateTo.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`;

  return (
    <Link href={`/temples/${festival.templeId}`}>
      <article className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 hover:shadow-lg hover:border-neutral-300 transition-all cursor-pointer h-full">
        {/* Chips row — city + deity */}
        <div className="flex items-center gap-2 mb-3">
          <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-neutral-100 text-neutral-700', taClass)}>
            {festival.city.charAt(0).toUpperCase() + festival.city.slice(1)}
          </span>
          <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-[--color-site-name]/10 text-[--color-site-name]', taClass)}>
            {deity}
          </span>
        </div>

        {/* Festival name heading */}
        <h3 className={cn('text-[16px] md:text-[17px] font-bold text-neutral-900 leading-snug', taClass)}>
          {tithiName}
        </h3>

        {/* Temple name + location */}
        <div className="flex items-center gap-1 text-neutral-500 mt-1 mb-3">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className={cn('text-[12px] truncate', taClass)}>{templeName}</span>
        </div>

        {/* Description */}
        <p className={cn('text-[13px] text-neutral-600 leading-snug line-clamp-3 mb-4 flex-1', taClass)}>
          {description}
        </p>

        {/* Date info box — matches renovation progress box styling */}
        <div className="mt-4 rounded-xl bg-neutral-50 border border-neutral-200/80 p-4">
          <div className="flex items-center gap-2 text-[13px]">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-neutral-600" />
            <span className={cn('font-medium text-neutral-700', taClass)}>
              {dateStr}
            </span>
          </div>
        </div>

        {/* CTA — matches red renovation CTA */}
        <button
          type="button"
          className={cn(
            'mt-4 w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[--color-btn-primary-bg] text-white text-[13px] font-bold hover:opacity-90 transition-opacity',
            taClass
          )}
        >
          {t(lang, 'festivals.card.viewTemple')}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </article>
    </Link>
  );
}
