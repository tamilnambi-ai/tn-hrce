'use client';

import { View } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import type { Temple } from '@/data/temples';
import SectionShell from './SectionShell';
import { cn } from '@/lib/utils';

export default function ThreeSixtySection({ temple: _temple }: { temple: Temple }) {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const taClass = ta ? 'ta-text' : '';

  return (
    <SectionShell id="threesixty" title={t(lang, 'templeDetail.section.threesixty')} taTitle={ta}>
      <div className="relative overflow-hidden rounded-2xl border border-[--color-border] bg-gradient-to-br from-slate-800 to-slate-900 aspect-[16/9] flex flex-col items-center justify-center text-center p-6">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_0%,transparent_50%)]" />
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-3">
            <View className="w-7 h-7 text-white" />
          </div>
          <p className="text-white text-[16px] font-bold">360° Virtual Tour</p>
          <span className={cn('inline-block mt-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white text-[11px] font-bold uppercase tracking-widest', taClass)}>
            {t(lang, 'templeDetail.launchingSoon')}
          </span>
        </div>
      </div>
    </SectionShell>
  );
}
