'use client';

/**
 * RenovationCard — progress-first, photo-less.
 *
 * Chips (city + type) top → temple name → area → short description →
 * BOLD progress bar → BIG money block (raised / still-needed) → Donate CTA.
 */

import { MapPin, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CITIES } from '@/contexts/CityContext';
import { t } from '@/lib/i18n';
import { formatInrShort, type Renovation } from '@/data/renovations';
import { cn } from '@/lib/utils';

export default function RenovationCard({
  renovation, onDonate,
}: {
  renovation: Renovation;
  onDonate: (r: Renovation) => void;
}) {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const taClass = ta ? 'ta-text' : '';

  const templeName  = ta ? (renovation.templeNameTa ?? renovation.templeName) : renovation.templeName;
  const area        = ta ? (renovation.areaTa ?? renovation.area) : renovation.area;
  const description = ta ? (renovation.descriptionTa ?? renovation.description) : renovation.description;

  const cityMeta = CITIES.find((c) => c.id === renovation.city);
  const cityName = cityMeta ? (ta ? cityMeta.nameTa : cityMeta.name) : renovation.city;
  const typeLabel = t(lang, `renovation.type.${renovation.type}`);

  const pct       = Math.min(100, Math.round((renovation.raised / renovation.goal) * 100));
  const remaining = Math.max(0, renovation.goal - renovation.raised);

  return (
    <article className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 hover:shadow-lg hover:border-neutral-300 transition-all">
      {/* Chips */}
      <div className="flex items-center gap-2 mb-3">
        <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-neutral-100 text-neutral-700', taClass)}>
          {cityName}
        </span>
        <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-[--color-site-name]/10 text-[--color-site-name]', taClass)}>
          {typeLabel}
        </span>
      </div>

      {/* Name + area */}
      <h3 className={cn('text-[16px] md:text-[17px] font-bold text-neutral-900 leading-snug', taClass)}>
        {templeName}
      </h3>
      <div className="flex items-center gap-1 text-neutral-500 mt-1">
        <MapPin className="w-3 h-3 flex-shrink-0" />
        <span className={cn('text-[12px] truncate', taClass)}>{area}</span>
      </div>

      {/* Description */}
      <p className={cn('text-[13px] text-neutral-600 leading-snug line-clamp-3 mt-3', taClass)}>
        {description}
      </p>

      {/* ── Progress-first money block ── */}
      <div className="mt-5 rounded-xl bg-neutral-50 border border-neutral-200/80 p-4">
        {/* Big raised amount */}
        <div className="flex items-baseline gap-2">
          <span className="text-[28px] md:text-[30px] font-black text-neutral-900 leading-none tracking-tight">
            {formatInrShort(renovation.raised)}
          </span>
          <span className={cn('text-[12px] text-neutral-500 font-medium', taClass)}>
            {t(lang, 'renovation.raisedOf')} <span className="font-extrabold text-neutral-900">{formatInrShort(renovation.goal)}</span>
          </span>
        </div>

        {/* Thick progress bar */}
        <div className="h-2.5 rounded-full bg-white border border-neutral-200 overflow-hidden mt-3">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Percentage + still needed */}
        <div className="flex items-baseline justify-between mt-2">
          <span className="text-[13px] font-bold text-emerald-700">
            {pct}% <span className={cn('text-neutral-500 font-medium', taClass)}>{t(lang, 'renovation.funded')}</span>
          </span>
          <span className={cn('text-[14px]', taClass)}>
            <span className="font-black text-neutral-900 tracking-tight">{formatInrShort(remaining)}</span>{' '}
            <span className="text-[12px] text-neutral-500 font-medium">{t(lang, 'renovation.stillNeeded')}</span>
          </span>
        </div>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={() => onDonate(renovation)}
        className={cn(
          'mt-4 w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[--color-btn-primary-bg] text-white text-[13px] font-bold hover:opacity-90 transition-opacity',
          taClass
        )}
      >
        {t(lang, 'renovation.donateCta')}
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </article>
  );
}
