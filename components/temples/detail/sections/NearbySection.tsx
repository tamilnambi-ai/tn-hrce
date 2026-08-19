'use client';

import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { templesByIds, type Temple } from '@/data/temples';
import SectionShell from './SectionShell';
import { cn } from '@/lib/utils';

export default function NearbySection({ temple }: { temple: Temple }) {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const taClass = ta ? 'ta-text' : '';
  const nearby = templesByIds(temple.nearbyIds ?? []);

  return (
    <SectionShell id="nearby" title={t(lang, 'templeDetail.section.nearby')} taTitle={ta}>
      {nearby.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
          {nearby.map((tp) => {
            const name = ta ? (tp.nameTa ?? tp.name) : tp.name;
            const area = ta ? (tp.areaTa ?? tp.area) : tp.area;
            return (
              <Link
                key={tp.id}
                href={`/temples/${tp.id}`}
                className="group flex-shrink-0 w-[220px] bg-white rounded-2xl border border-[--color-border] overflow-hidden hover:shadow-md hover:border-[--color-site-name] transition-all"
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img src={tp.imageUrl} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-3">
                  <p className={cn('text-[13px] font-semibold text-[--color-text-primary] leading-snug line-clamp-2 group-hover:text-[--color-site-name] transition-colors', ta && 'ta-text')}>
                    {name}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-neutral-400 flex-shrink-0" />
                    <span className={cn('text-[11px] text-neutral-500', ta && 'ta-text')}>{area}</span>
                  </div>
                </div>
              </Link>
            );
          })}
          {/* View all card */}
          <Link
            href="/temples"
            className="flex-shrink-0 w-[160px] rounded-2xl border-2 border-dashed border-[--color-border] flex flex-col items-center justify-center text-center px-4 hover:border-[--color-site-name] hover:bg-red-50/40 transition-colors group"
          >
            <ArrowRight className="w-5 h-5 text-[--color-text-secondary] group-hover:text-[--color-site-name] transition-colors" />
            <span className={cn('mt-2 text-[12px] font-semibold text-[--color-text-secondary] group-hover:text-[--color-site-name] transition-colors', taClass)}>
              {t(lang, 'templeDetail.viewAllNearby')}
            </span>
          </Link>
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
