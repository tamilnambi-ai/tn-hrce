'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Clock, Sparkles, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import type { TempleAnnouncement } from '@/data/temples';
import { cn } from '@/lib/utils';
import { useDrawEntry } from './DrawEntry/DrawEntryContext';

/**
 * Floating announcement card fixed to the bottom-centre of the viewport.
 * Sits above the mobile action bar on mobile. Dismissable per session.
 * Hidden entirely if `announcements` is empty.
 */
export default function AnnouncementStrip({
  announcements,
}: {
  announcements: TempleAnnouncement[];
}) {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const taClass = ta ? 'ta-text' : '';
  const [idx, setIdx] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const { openFor } = useDrawEntry();

  if (!announcements.length || dismissed) return null;

  const total = announcements.length;
  const a = announcements[idx];

  const title    = ta ? (a.titleTa    ?? a.title)    : a.title;
  const subtitle = ta ? (a.subtitleTa ?? a.subtitle) : a.subtitle;
  const date     = ta ? (a.dateTa     ?? a.date)     : a.date;
  const deadline = ta ? (a.deadlineTa ?? a.deadline) : a.deadline;
  const cta      = ta ? (a.ctaLabelTa ?? a.ctaLabel) : a.ctaLabel;

  // Colour theme depends on whether this is an urgent event
  const isUrgent = !!a.urgent;
  const bg = isUrgent
    ? 'bg-gradient-to-r from-[#8B1A1A] via-[#A0281A] to-[#C8500A]'
    : 'bg-gradient-to-r from-[#1A3E6B] via-[#245A85] to-[#2E7099]';

  function go(dir: -1 | 1) {
    setIdx((i) => (i + dir + total) % total);
  }

  // Only free draws are wired to the entry modal in this iteration; paid
  // passes stay non-interactive until their own flow is built.
  const canOpenDraw = a.type === 'pass_draw' && a.passType === 'free';
  const handleCta = () => { if (canOpenDraw) openFor(a); };

  return (
    <div
      className={cn(
        // Positioning: floating, centered, above mobile action bar on mobile
        'fixed z-40 left-1/2 -translate-x-1/2',
        'bottom-[80px] lg:bottom-6',
        // Sizing
        'w-[calc(100%-24px)] max-w-[720px]',
        // Skin
        'text-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.28)]',
        'overflow-hidden ring-1 ring-white/10',
        'animate-announcementIn',
        bg,
      )}
      role="region"
      aria-label="Temple announcement"
    >
      {/* Sheen */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 12% 40%, rgba(255,255,255,0.25) 0%, transparent 40%)',
        }}
      />

      {/* Dismiss */}
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors z-10"
      >
        <X className="w-3 h-3" />
      </button>

      <div className="relative px-4 py-3 md:px-5 md:py-3.5">
        <div className="flex items-center gap-3 md:gap-4 pr-6">
          {/* Emoji badge */}
          <div className="hidden sm:flex w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/15 backdrop-blur-sm items-center justify-center flex-shrink-0 text-[20px]">
            {a.emoji ?? '✨'}
          </div>

          {/* Main content — title + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
              <Sparkles className="w-3 h-3 text-amber-200 flex-shrink-0" />
              <span className={cn('text-[10px] font-bold uppercase tracking-[0.18em] text-amber-100', taClass)}>
                {a.type === 'pass_draw'
                  ? (ta ? 'அனுமதி குலுக்கல்' : 'Pass Draw')
                  : (ta ? 'அறிவிப்பு' : 'Announcement')}
              </span>
              {a.passType && (
                <span className={cn(
                  'text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full',
                  a.passType === 'free'
                    ? 'bg-emerald-400/20 text-emerald-100 border border-emerald-300/30'
                    : 'bg-amber-400/20 text-amber-100 border border-amber-300/30',
                  taClass
                )}>
                  {t(lang, a.passType === 'free' ? 'templeDetail.passFree' : 'templeDetail.passPaid')}
                </span>
              )}
            </div>
            <p className={cn('text-[14px] font-bold truncate', taClass)}>
              {title}
              {subtitle && (
                <span className="ml-2 text-white/80 font-medium hidden md:inline">
                  · {subtitle}
                </span>
              )}
            </p>
            <div className={cn('flex items-center gap-3 mt-0.5 text-[11px] md:text-[12px] text-white/85', taClass)}>
              <span className="font-semibold">{date}</span>
              {deadline && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {deadline}
                </span>
              )}
              {a.priceLabel && (
                <span className="hidden md:inline font-semibold">{a.priceLabel}</span>
              )}
            </div>
          </div>

          {/* CTA + carousel controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleCta}
              disabled={!canOpenDraw}
              className={cn(
                'hidden sm:flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-xl bg-white text-[--color-text-primary] text-[12px] md:text-[13px] font-bold hover:bg-white/95 transition-colors',
                !canOpenDraw && 'opacity-70 cursor-not-allowed hover:bg-white',
                taClass
              )}
            >
              {cta}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {total > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => go(-1)}
                  aria-label="Previous"
                  className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-bold tabular-nums px-1 min-w-[24px] text-center">
                  {idx + 1}/{total}
                </span>
                <button
                  onClick={() => go(1)}
                  aria-label="Next"
                  className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile CTA (full width, second row) */}
        <button
          onClick={handleCta}
          disabled={!canOpenDraw}
          className={cn(
            'sm:hidden mt-2 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white text-[--color-text-primary] text-[12px] font-bold',
            !canOpenDraw && 'opacity-70 cursor-not-allowed',
            taClass
          )}
        >
          {cta}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
