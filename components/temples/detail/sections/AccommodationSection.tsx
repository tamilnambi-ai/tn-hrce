'use client';

import { BedDouble, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import SectionShell from './SectionShell';

/**
 * Accommodation section — a full-width version of the CTA card that
 * previously lived in the right rail. Kept intentionally simple so real
 * lodging content can be filled in later without redesigning the shell.
 */
export default function AccommodationSection() {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const taClass = ta ? 'ta-text' : '';

  return (
    <SectionShell
      id="accommodation"
      title={t(lang, 'templeDetail.section.accommodation')}
      taTitle={ta}
    >
      <div className="rounded-2xl border border-[--color-border] bg-gradient-to-br from-amber-50 to-amber-100/80 p-5 md:p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
            <BedDouble className="w-6 h-6 md:w-7 md:h-7 text-amber-700" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={cn('text-[16px] md:text-[18px] font-bold text-[--color-text-primary]', taClass)}>
              {t(lang, 'templeDetail.accommodation')}
            </h3>
            <p className={cn('text-[13px] md:text-[14px] text-[--color-text-secondary] mt-1 leading-relaxed max-w-[560px]', taClass)}>
              {t(lang, 'templeDetail.accommodationHint')}
            </p>
          </div>
        </div>

        <button
          className={cn(
            'mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[14px] font-bold transition-colors',
            taClass,
          )}
        >
          {t(lang, 'templeDetail.accommodationCta')}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </SectionShell>
  );
}
