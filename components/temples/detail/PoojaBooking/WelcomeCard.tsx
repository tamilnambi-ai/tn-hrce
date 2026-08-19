'use client';

import { Sparkles, Flame, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Attractive welcome card shown as the FIRST turn of the pooja booking flow.
 * Replaces the plain bot bubble with a warm, celebratory hero design.
 */
export default function WelcomeCard({
  serviceName,
  priceLabel,
  dateRangeLabel,
  namasteLabel,
  headline,
  subline,
  ta,
}: {
  serviceName:    string;
  priceLabel:     string;
  dateRangeLabel: string;
  namasteLabel:   { primary: string; secondary: string };
  headline:       string;
  subline:        string;
  ta:             boolean;
}) {
  const taClass = ta ? 'ta-text' : '';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-200/60 shadow-sm">
      {/* Warm gradient background with a subtle radial highlight */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50" />
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 12% 20%, rgba(255,180,80,0.35) 0%, transparent 55%), radial-gradient(circle at 85% 90%, rgba(200,70,10,0.20) 0%, transparent 45%)',
        }}
      />

      <div className="relative p-5">
        {/* Eyebrow: Namaste greeting */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span className={cn('text-[10.5px] font-bold uppercase tracking-[0.22em] text-amber-800', taClass)}>
            <span className="ta-text">{namasteLabel.primary}</span>
            {namasteLabel.secondary && <span className="opacity-70"> · {namasteLabel.secondary}</span>}
          </span>
        </div>

        {/* Headline — service you're booking */}
        <h3 className={cn('text-[16px] md:text-[17px] font-bold text-[--color-text-primary] leading-snug', taClass)}>
          {headline}
        </h3>

        {/* Featured service card */}
        <div className="mt-3 flex items-start gap-3 rounded-xl bg-white/85 backdrop-blur-sm border border-white/60 shadow-[0_2px_10px_rgba(139,26,26,0.06)] p-3">
          <div className="w-10 h-10 rounded-xl bg-[--color-site-name] flex items-center justify-center flex-shrink-0 shadow-md">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn('text-[13.5px] font-bold text-[--color-text-primary] leading-snug', taClass)}>
              {serviceName}
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-[13px] font-bold text-[--color-site-name] tabular-nums">
                {priceLabel}
              </span>
              <span className="text-[10.5px] text-[--color-text-secondary]">·</span>
              <span className={cn('flex items-center gap-1 text-[11px] font-semibold text-[--color-text-secondary]', taClass)}>
                <Calendar className="w-3 h-3" />
                {dateRangeLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Subtle subline */}
        <p className={cn('text-[12px] text-[--color-text-secondary] mt-3 leading-relaxed', taClass)}>
          {subline}
        </p>
      </div>
    </div>
  );
}
