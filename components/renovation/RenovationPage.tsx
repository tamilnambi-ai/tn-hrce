'use client';

/**
 * RenovationPage — /temples/renovation
 *
 * Chip-row filter across cities that have active renovations + a grid of
 * RenovationCards. Only cities with renovations appear in the chip row (per
 * user request); "All Tamil Nadu" chip is always the first option.
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, HandCoins } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CITIES } from '@/contexts/CityContext';
import { t } from '@/lib/i18n';
import {
  citiesWithRenovations,
  renovationsByCity,
  type Renovation,
} from '@/data/renovations';
import RenovationCard from './RenovationCard';
import RenovationDonationModal from './RenovationDonationModal';
import { cn } from '@/lib/utils';

type FilterId = Renovation['city'] | 'all';

export default function RenovationPage() {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const taClass = ta ? 'ta-text' : '';

  const [filter, setFilter] = useState<FilterId>('all');
  const cityChips = useMemo(citiesWithRenovations, []);
  const list = useMemo(() => renovationsByCity(filter), [filter]);

  const [active, setActive] = useState<Renovation | null>(null);
  const handleDonate = (r: Renovation) => setActive(r);

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* ── Breadcrumb ── */}
      <nav className="container-page pt-5 pb-3 flex items-center gap-1.5 text-[12px] text-neutral-500" aria-label="Breadcrumb">
        <Link href="/" className={cn('hover:text-[--color-site-name]', taClass)}>{t(lang, 'nav.home')}</Link>
        <ChevronRight className="w-3 h-3 text-neutral-300" />
        <Link href="/temples" className={cn('hover:text-[--color-site-name]', taClass)}>{t(lang, 'nav.temples')}</Link>
        <ChevronRight className="w-3 h-3 text-neutral-300" />
        <span className={cn('text-neutral-800 font-semibold', taClass)}>{t(lang, 'renovation.pageTitle')}</span>
      </nav>

      {/* ── Header ── */}
      <header className="container-page pt-2 pb-5">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-xl bg-[--color-site-name]/10 text-[--color-site-name]">
            <HandCoins className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h1 className={cn('text-[22px] md:text-[26px] font-bold text-neutral-900', taClass)}>
              {t(lang, 'renovation.pageTitle')}
            </h1>
            <p className={cn('text-[13px] md:text-[14px] text-neutral-600 mt-1 max-w-[720px]', taClass)}>
              {t(lang, 'renovation.pageSubtitle')}
            </p>
          </div>
        </div>
      </header>

      {/* ── City filter chips ── */}
      <div className="border-y border-neutral-200 bg-white sticky top-0 z-10">
        <div className="container-page py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Chip
            active={filter === 'all'}
            onClick={() => setFilter('all')}
            label={t(lang, 'renovation.allTamilNadu')}
            count={cityChips.reduce((s, c) => s + c.count, 0)}
            taClass={taClass}
          />
          {cityChips.map(({ id, count }) => {
            const meta = CITIES.find((c) => c.id === id);
            const name = meta ? (ta ? meta.nameTa : meta.name) : id;
            return (
              <Chip
                key={id}
                active={filter === id}
                onClick={() => setFilter(id)}
                label={name}
                count={count}
                taClass={taClass}
              />
            );
          })}
        </div>
      </div>

      {/* ── Grid ── */}
      <main className="container-page py-6 md:py-8">
        {list.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {list.map((r) => (
              <RenovationCard key={r.id} renovation={r} onDonate={handleDonate} />
            ))}
          </div>
        ) : (
          <div className={cn('text-center py-24 text-neutral-500', taClass)}>
            <p className="text-[14px]">{t(lang, 'renovation.emptyFilter')}</p>
            <button
              onClick={() => setFilter('all')}
              className={cn('mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-[--color-site-name] hover:underline', taClass)}
            >
              {t(lang, 'renovation.showAll')}
            </button>
          </div>
        )}
      </main>

      <RenovationDonationModal
        open={!!active}
        renovation={active}
        onClose={() => setActive(null)}
      />
    </div>
  );
}

// ── Chip ─────────────────────────────────────────────────────────────────────
function Chip({
  active, onClick, label, count, taClass,
}: { active: boolean; onClick: () => void; label: string; count: number; taClass: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 flex-shrink-0 rounded-full px-4 py-1.5 text-[13px] font-semibold border transition-all',
        active
          ? 'bg-[--color-site-name] text-white border-[--color-site-name]'
          : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300',
      )}
    >
      <span className={taClass}>{label}</span>
      <span className={cn(
        'inline-flex items-center justify-center min-w-[20px] h-[18px] rounded-full text-[10px] font-bold px-1',
        active ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-600'
      )}>{count}</span>
    </button>
  );
}
