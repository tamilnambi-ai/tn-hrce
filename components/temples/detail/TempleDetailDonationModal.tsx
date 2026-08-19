'use client';

/**
 * TempleDetailDonationModal — opened from the Donation section CTA on temple detail page.
 * Wraps DonationCard and passes the temple name so emails have proper context.
 */

import { useEffect } from 'react';
import { X, HandHeart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import type { Temple } from '@/data/temples';
import DonationCard from './DonationCard';
import { cn } from '@/lib/utils';

export default function TempleDetailDonationModal({
  open,
  temple,
  onClose,
}: {
  open: boolean;
  temple: Temple;
  onClose: () => void;
}) {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const taClass = ta ? 'ta-text' : '';
  const templeName = ta ? (temple.nameTa ?? temple.name) : temple.name;

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

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[95] flex items-center justify-center p-3 md:p-6"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.35)] w-full max-w-[520px] max-h-[94vh] flex flex-col overflow-hidden">
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
              {t(lang, 'templeDetail.section.donation')}
            </p>
          </div>
          <h2 className={cn('text-[16px] md:text-[17px] font-bold text-neutral-900 pr-8 leading-snug', taClass)}>
            {templeName}
          </h2>
        </div>

        {/* Body — just the donation card */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-4 pb-4">
          <DonationCard compact templeName={templeName} />
        </div>
      </div>
    </div>
  );
}
