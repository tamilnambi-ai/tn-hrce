'use client';

import { Sparkles, Ticket, Users, Target, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DrawStats } from './drawStats';

/**
 * Welcome hero for the "Enter the Draw" flow — first turn.
 * Shows the event, a live-looking stat strip (entries so far / passes / odds),
 * and a subline explaining what the draw is.
 */
export default function DrawWelcomeCard({
  ta,
  eventName,
  eventEmoji,
  dateLabel,
  stats,
  namasteLabel,
  headline,
  subline,
  statLabels,
}: {
  ta: boolean;
  eventName:   string;
  eventEmoji?: string;
  dateLabel:   string;
  stats:       DrawStats;
  namasteLabel:{ primary: string; secondary: string };
  headline:    string;
  subline:     string;
  statLabels:  { entries: string; passes: string; odds: string };
}) {
  const taClass = ta ? 'ta-text' : '';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-200/60 shadow-sm">
      {/* Warm gradient — same family as the pooja welcome, tuned toward gold */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-100" />
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 10% 15%, rgba(255,200,90,0.45) 0%, transparent 55%), radial-gradient(circle at 88% 92%, rgba(220,110,10,0.22) 0%, transparent 45%)',
        }}
      />

      <div className="relative p-5">
        {/* Eyebrow */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span className={cn('text-[10.5px] font-bold uppercase tracking-[0.22em] text-amber-800', taClass)}>
            <span className="ta-text">{namasteLabel.primary}</span>
            {namasteLabel.secondary && <span className="opacity-70"> · {namasteLabel.secondary}</span>}
          </span>
        </div>

        {/* Headline */}
        <h3 className={cn('text-[16px] md:text-[17px] font-bold text-[--color-text-primary] leading-snug', taClass)}>
          {headline}
        </h3>

        {/* Event card */}
        <div className="mt-3 flex items-start gap-3 rounded-xl bg-white/85 backdrop-blur-sm border border-white/60 shadow-[0_2px_10px_rgba(139,26,26,0.06)] p-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-md text-[18px]">
            {eventEmoji ?? '🪔'}
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn('text-[13.5px] font-bold text-[--color-text-primary] leading-snug', taClass)}>
              {eventName}
            </p>
            <div className={cn('flex items-center gap-1 text-[11px] font-semibold text-[--color-text-secondary] mt-1', taClass)}>
              <Calendar className="w-3 h-3" />
              {dateLabel}
            </div>
          </div>
          <span className={cn(
            'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 self-start',
            taClass,
          )}>
            {ta ? 'இலவசம்' : 'Free'}
          </span>
        </div>

        {/* Live stat strip */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <StatCell
            icon={<Users className="w-3.5 h-3.5" />}
            label={statLabels.entries}
            value={stats.entriesSoFar.toLocaleString('en-IN')}
            live
            taClass={taClass}
          />
          <StatCell
            icon={<Ticket className="w-3.5 h-3.5" />}
            label={statLabels.passes}
            value={stats.passesAvailable.toString()}
            taClass={taClass}
          />
          <StatCell
            icon={<Target className="w-3.5 h-3.5" />}
            label={statLabels.odds}
            value={stats.oddsLabel}
            taClass={taClass}
          />
        </div>

        {/* Subline */}
        <p className={cn('text-[12px] text-[--color-text-secondary] mt-3 leading-relaxed', taClass)}>
          {subline}
        </p>
      </div>
    </div>
  );
}

function StatCell({
  icon, label, value, live, taClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  live?: boolean;
  taClass: string;
}) {
  return (
    <div className="rounded-xl bg-white/85 backdrop-blur-sm border border-white/60 px-2.5 py-2 shadow-[0_1px_4px_rgba(139,26,26,0.05)]">
      <div className={cn('flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wider text-[--color-text-secondary]', taClass)}>
        {icon}
        <span className="truncate">{label}</span>
        {live && (
          <span className="relative flex w-1.5 h-1.5 ml-auto flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
        )}
      </div>
      <p className="text-[15px] font-bold text-[--color-text-primary] tabular-nums mt-0.5">
        {value}
      </p>
    </div>
  );
}
