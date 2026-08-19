'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import type { Temple } from '@/data/temples';
import SectionShell from './SectionShell';
import { cn } from '@/lib/utils';

export default function HistorySection({ temple }: { temple: Temple }) {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const taClass = ta ? 'ta-text' : '';

  return (
    <SectionShell id="history" title={t(lang, 'templeDetail.section.history')} taTitle={ta}>
      <div className="bg-white rounded-2xl border border-[--color-border] p-5 md:p-6 space-y-4">
        {temple.historyEn && temple.historyEn.length > 0 ? (
          temple.historyEn.map((p, i) => (
            <p key={i} className="text-[14px] text-[--color-text-primary] leading-relaxed">
              {p}
            </p>
          ))
        ) : (
          <p className={cn('text-[13px] text-[--color-text-secondary]', taClass)}>
            {t(lang, 'templeDetail.contentComing')}
          </p>
        )}
      </div>
    </SectionShell>
  );
}
