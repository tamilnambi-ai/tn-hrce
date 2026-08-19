'use client';

import { FileText, Instagram, BookOpen, ScrollText, Music, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import type { Temple } from '@/data/temples';
import SectionShell from './SectionShell';
import { cn } from '@/lib/utils';

// Combined section covering: Resources, Social Media, Magazines, Aaram Thirumurai, Songs
export default function ResourcesSection({ temple: _temple }: { temple: Temple }) {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const taClass = ta ? 'ta-text' : '';

  const cards = [
    { key: 'social',     icon: Instagram,  color: 'text-pink-600',    bg: 'bg-pink-50'    },
    { key: 'magazines',  icon: BookOpen,   color: 'text-amber-600',   bg: 'bg-amber-50'   },
    { key: 'thirumurai', icon: ScrollText, color: 'text-purple-600',  bg: 'bg-purple-50'  },
    { key: 'songs',      icon: Music,      color: 'text-teal-600',    bg: 'bg-teal-50'    },
  ];

  return (
    <SectionShell id="resources" title={t(lang, 'templeDetail.section.resources')} taTitle={ta}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map(({ key, icon: Icon, color, bg }) => (
          <button
            key={key}
            className="group text-left bg-white rounded-2xl border border-[--color-border] p-4 hover:border-[--color-site-name] hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', bg)}>
                <Icon className={cn('w-5 h-5', color)} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-neutral-300 group-hover:text-[--color-site-name] transition-colors" />
            </div>
            <p className={cn('text-[13px] font-bold text-[--color-text-primary] leading-snug', taClass)}>
              {t(lang, `templeDetail.section.${key}`)}
            </p>
            <p className={cn('text-[11px] text-[--color-text-secondary] mt-0.5', taClass)}>
              {t(lang, 'templeDetail.launchingSoon')}
            </p>
          </button>
        ))}
      </div>

      {/* Full docs card */}
      <div className="mt-3 flex items-center gap-3 bg-white rounded-2xl border border-[--color-border] p-4">
        <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-neutral-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn('text-[13px] font-bold text-[--color-text-primary]', taClass)}>
            {ta ? 'கோயில் அறிக்கைகள் & ஆவணங்கள்' : 'Temple reports & documents'}
          </p>
          <p className={cn('text-[11px] text-[--color-text-secondary]', taClass)}>
            {t(lang, 'templeDetail.launchingSoon')}
          </p>
        </div>
      </div>
    </SectionShell>
  );
}
