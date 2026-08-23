'use client';

/**
 * HomeDonationModal — opened from the "Temple Upkeep Donation" spotlight tile.
 *
 * Single-column layout: temple dropdown at top, then the same DonationCard used
 * on the temple detail right rail. Temple selector uses the same availability
 * rule as booking (temples without pooja data grey out with "Coming soon").
 */

import { useEffect, useMemo, useState } from 'react';
import { X, HandHeart, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCity } from '@/contexts/CityContext';
import { t } from '@/lib/i18n';
import { templesByCity, type Temple } from '@/data/temples';
import { poojaServicesForTemple } from '@/data/poojaServices';
import DonationCard from '@/components/temples/detail/DonationCard';
import { cn } from '@/lib/utils';

export default function HomeDonationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang } = useLanguage();
  const { city } = useCity();
  const ta = lang === 'ta';
  const taClass = ta ? 'ta-text' : '';
  const cityName = ta ? city.nameTa : city.name;

  const templeList = useMemo(() => templesByCity(city.id, 50), [city.id]);
  const [templeId, setTempleId] = useState<string | null>(null);
  const temple: Temple | null =
    templeId ? templeList.find((tp) => tp.id === templeId) ?? null : null;

  // Reset on close
  useEffect(() => {
    if (!open) setTempleId(null);
  }, [open]);

  // Body scroll lock + Esc
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const templeName = temple ? (ta ? (temple.nameTa ?? temple.name) : temple.name) : '';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[95] flex items-center justify-center p-3 md:p-6"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-[#ffefe0] rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.35)] w-full max-w-[520px] max-h-[94vh] flex flex-col overflow-hidden">
        <button
          onClick={onClose}
          aria-label={t(lang, 'bookPooja.closeModal')}
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-[--color-site-name] transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Compact header */}
        <div className="px-5 pt-4 pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2 mb-0.5">
            <HandHeart className="w-3.5 h-3.5 text-[--color-site-name]" />
            <p className={cn('text-[10px] font-bold text-[--color-site-name] uppercase tracking-wide', taClass)}>
              {t(lang, 'homeDonate.eyebrow')}
            </p>
          </div>
          <h2 className={cn('text-[16px] md:text-[17px] font-bold text-neutral-900 pr-8 leading-snug', taClass)}>
            {t(lang, 'homeDonate.title')}
            {temple && (
              <span className="text-neutral-500 font-medium"> · {templeName}</span>
            )}
          </h2>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-3 pb-4 space-y-3">
          {/* Temple dropdown */}
          <div className="relative">
            <select
              value={templeId ?? ''}
              onChange={(e) => setTempleId(e.target.value)}
              className={cn(
                'w-full appearance-none rounded-lg border border-neutral-300 bg-[#ffefe0]',
                'px-3 py-2 pr-9 text-[13px] font-semibold text-neutral-900',
                'focus:outline-none focus:ring-2 focus:ring-[--color-site-name]/30 focus:border-[--color-site-name]',
                taClass
              )}
            >
              <option value="" disabled>{t(lang, 'homeBook.templePlaceholder')} — {cityName}</option>
              {templeList.map((tp) => {
                const available = poojaServicesForTemple(tp.id).length > 0;
                const name = ta ? (tp.nameTa ?? tp.name) : tp.name;
                return (
                  <option key={tp.id} value={tp.id} disabled={!available}>
                    {name} {available ? '' : `— ${t(lang, 'homeBook.comingSoon')}`}
                  </option>
                );
              })}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          </div>

          {/* Donation card OR empty state */}
          {temple ? (
            <DonationCard compact templeName={templeName} />
          ) : (
            <div className={cn('rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-6 text-center', taClass)}>
              <p className="text-[12px] text-neutral-500">
                {t(lang, 'homeDonate.pickTempleFirst')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
