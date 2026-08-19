'use client';

import { BedDouble, TicketCheck, HandCoins } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { useBookPooja } from './BookPoojaContext';

export default function MobileActionBar() {
  const { lang } = useLanguage();
  const { open: openBooking } = useBookPooja();
  const taClass = lang === 'ta' ? 'ta-text' : '';

  const items = [
    { icon: TicketCheck, key: 'booking',       tint: 'text-[--color-site-name]', onClick: openBooking },
    { icon: HandCoins,   key: 'donation',      tint: 'text-emerald-600',         onClick: () => {} },
    { icon: BedDouble,   key: 'accommodation', tint: 'text-amber-600',           onClick: () => {} },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[--color-border] shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-3">
        {items.map(({ icon: Icon, key, tint, onClick }) => (
          <button
            key={key}
            onClick={onClick}
            className="flex flex-col items-center justify-center gap-1 py-3 hover:bg-neutral-50 transition-colors"
          >
            <Icon className={cn('w-5 h-5', tint)} />
            <span className={cn('text-[11px] font-bold text-[--color-text-primary]', taClass)}>
              {t(lang, `templeDetail.${key}`)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
