'use client';

import { Ticket, Calendar, Clock, ArrowRight, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import type { Temple } from '@/data/temples';
import SectionShell from './SectionShell';
import { cn } from '@/lib/utils';

export default function EventsSection({ temple }: { temple: Temple }) {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const taClass = ta ? 'ta-text' : '';
  const items = temple.announcements ?? [];

  if (items.length === 0) return null;   // hide entirely when there's nothing

  return (
    <SectionShell id="events" title={t(lang, 'templeDetail.section.events')} taTitle={ta}>
      {/* Preview note */}
      <p className={cn(
        'inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 text-[11px] font-semibold',
        taClass
      )}>
        <Info className="w-3 h-3" />
        {t(lang, 'templeDetail.previewNote')}
      </p>

      <div className="space-y-4">
        {items.map((a) => {
          const title       = ta ? (a.titleTa       ?? a.title)       : a.title;
          const subtitle    = ta ? (a.subtitleTa    ?? a.subtitle)    : a.subtitle;
          const date        = ta ? (a.dateTa        ?? a.date)        : a.date;
          const deadline    = ta ? (a.deadlineTa    ?? a.deadline)    : a.deadline;
          const cta         = ta ? (a.ctaLabelTa    ?? a.ctaLabel)    : a.ctaLabel;
          const description = ta ? (a.descriptionTa ?? a.description) : a.description;

          const accent = a.urgent
            ? { border: 'border-red-200',     ribbon: 'bg-[--color-site-name]', btn: 'bg-[--color-site-name] hover:bg-[--color-btn-primary-hover]' }
            : { border: 'border-blue-200',    ribbon: 'bg-blue-600',            btn: 'bg-blue-600 hover:bg-blue-700' };

          return (
            <div
              key={a.id}
              className={cn(
                'relative overflow-hidden bg-white rounded-2xl border p-5',
                accent.border
              )}
            >
              {/* left ribbon */}
              <div className={cn('absolute left-0 top-0 bottom-0 w-1', accent.ribbon)} />

              <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                <div className="flex-1 min-w-0">
                  {/* Type + pass badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                    <span className={cn(
                      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest',
                      a.urgent ? 'bg-red-100 text-[--color-site-name]' : 'bg-blue-100 text-blue-700'
                    )}>
                      <Ticket className="w-2.5 h-2.5" />
                      {a.type === 'pass_draw'
                        ? (ta ? 'அனுமதி குலுக்கல்' : 'Pass Draw')
                        : (ta ? 'அறிவிப்பு' : 'Announcement')}
                    </span>
                    {a.passType && (
                      <span className={cn(
                        'text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full',
                        a.passType === 'free' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200',
                        taClass
                      )}>
                        {t(lang, a.passType === 'free' ? 'templeDetail.passFree' : 'templeDetail.passPaid')}
                      </span>
                    )}
                    {a.priceLabel && (
                      <span className="text-[11px] font-bold text-[--color-text-primary]">
                        {a.priceLabel}
                      </span>
                    )}
                  </div>

                  {/* Title + subtitle */}
                  <h3 className={cn('text-[16px] md:text-[18px] font-bold text-[--color-text-primary] leading-tight', taClass)}>
                    {a.emoji && <span className="mr-1.5">{a.emoji}</span>}
                    {title}
                  </h3>
                  {subtitle && (
                    <p className={cn('text-[13px] text-[--color-text-secondary] mt-0.5', taClass)}>
                      {subtitle}
                    </p>
                  )}

                  {/* Meta */}
                  <div className={cn('flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5 text-[12px] text-[--color-text-secondary]', taClass)}>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="font-semibold text-[--color-text-primary]">{date}</span>
                    </span>
                    {deadline && (
                      <span className="flex items-center gap-1 text-[--color-site-name]">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="font-semibold">{deadline}</span>
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {description && (
                    <p className={cn('text-[13px] text-[--color-text-primary] leading-relaxed mt-3', taClass)}>
                      {description}
                    </p>
                  )}
                </div>

                {/* CTA */}
                <div className="flex-shrink-0 md:pl-2">
                  <button
                    className={cn(
                      'w-full md:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-[13px] font-bold transition-colors',
                      accent.btn,
                      taClass
                    )}
                  >
                    {cta}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
