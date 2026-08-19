'use client';

import { Radio } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import type { Temple } from '@/data/temples';
import SectionShell from './SectionShell';
import { cn } from '@/lib/utils';

export default function LiveSection({ temple: _temple }: { temple: Temple }) {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const taClass = ta ? 'ta-text' : '';

  return (
    <SectionShell id="live" title={t(lang, 'templeDetail.section.live')} taTitle={ta}>
      <div className="relative overflow-hidden rounded-2xl border border-[--color-border] bg-gradient-to-br from-neutral-100 to-neutral-200 aspect-[16/9] flex flex-col items-center justify-center text-center p-6">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-3">
            <Radio className="w-7 h-7 text-[--color-site-name]" />
          </div>
          <p className="text-[--color-text-primary] text-[16px] font-bold">Live Darshan</p>
          <span className={cn('inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-neutral-200 text-neutral-600 text-[11px] font-bold uppercase tracking-widest', taClass)}>
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
            {t(lang, 'templeDetail.liveOffline')}
          </span>
        </div>
      </div>
    </SectionShell>
  );
}
