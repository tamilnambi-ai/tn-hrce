'use client';

import {
  Car, Droplets, Utensils, Footprints, Accessibility, Bath, Shield, Waves,
  type LucideIcon,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import type { Temple } from '@/data/temples';
import SectionShell from './SectionShell';
import { cn } from '@/lib/utils';

const ICONS: Record<string, LucideIcon> = {
  parking:    Car,
  water:      Waves,
  drinking:   Droplets,
  prasadam:   Utensils,
  footwear:   Footprints,
  wheelchair: Accessibility,
  restrooms:  Bath,
  cctv:       Shield,
};

export default function FacilitiesSection({ temple }: { temple: Temple }) {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const taClass = ta ? 'ta-text' : '';
  const facilities = temple.facilities ?? [];

  return (
    <SectionShell id="facilities" title={t(lang, 'templeDetail.section.facilities')} taTitle={ta}>
      {facilities.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {facilities.map((f) => {
            const Icon = ICONS[f] ?? Shield;
            return (
              <div
                key={f}
                className="flex flex-col items-center gap-2 bg-white rounded-2xl border border-[--color-border] p-4 text-center hover:border-[--color-site-name] transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[--color-site-name]" />
                </div>
                <span className={cn('text-[12px] font-semibold text-[--color-text-primary]', taClass)}>
                  {t(lang, `templeDetail.facilityLabels.${f}`)}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[--color-border] p-5">
          <p className={cn('text-[13px] text-[--color-text-secondary]', taClass)}>
            {t(lang, 'templeDetail.contentComing')}
          </p>
        </div>
      )}
    </SectionShell>
  );
}
