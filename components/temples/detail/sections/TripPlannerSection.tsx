'use client';

import { Route, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import type { Temple } from '@/data/temples';
import { cn } from '@/lib/utils';

export default function TripPlannerSection({ temple: _temple }: { temple: Temple }) {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const taClass = ta ? 'ta-text' : '';

  return (
    <section id="tripplanner" data-anchor className="scroll-mt-[140px]">
      <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-100 p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
          <Route className="w-5 h-5 text-indigo-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn('text-[14px] font-bold text-[--color-text-primary]', taClass)}>
            {t(lang, 'templeDetail.section.tripPlanner')}
          </p>
          <p className={cn('text-[12px] text-[--color-text-secondary] mt-0.5', taClass)}>
            {ta
              ? 'இந்த கோயிலை உங்கள் பயண திட்டத்தில் சேர்க்கவும்'
              : 'Add this temple to your custom pilgrimage itinerary'}
          </p>
        </div>
        <button className={cn(
          'flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-bold transition-colors flex-shrink-0',
          taClass
        )}>
          <Plus className="w-4 h-4" />
          {t(lang, 'templeDetail.addTripPlanner')}
        </button>
      </div>
    </section>
  );
}
