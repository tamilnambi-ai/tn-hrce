'use client';

import { Sparkles, Ticket, Bell, Share2, Copy, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Success screen for a completed draw entry.
 * Looks like a physical raffle stub — perforated left edge, big centred entry
 * code, temple watermark, event badge. Distinct from the darshan BookingTicket.
 */
export default function RaffleTicket({
  ta,
  templeName,
  eventName,
  entryCode,
  entrantName,
  drawDate,
  submittedAt,
  stats,
  labels,
  onClose,
}: {
  ta: boolean;
  templeName:  string;
  eventName:   string;
  entryCode:   string;   // e.g. "R47-9B2"
  entrantName: string;
  drawDate:    string;
  submittedAt: string;
  stats:       { entriesSoFar: number; oddsLabel: string };
  labels: {
    congrats:      string;
    subline:       string;
    entryNoLabel:  string;
    eventLabel:    string;
    forLabel:      string;
    submittedLabel:string;
    yourPosition:  string; // "You are #4,721"
    yourOdds:      string; // "Your odds"
    notifyHint:    string;
    copy:          string;
    share:         string;
    copied:        string;
    close:         string;
  };
  onClose: () => void;
}) {
  const taClass = ta ? 'ta-text' : '';
  const [toast, setToast] = useState<string | null>(null);

  function flashToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }

  async function copyCode() {
    try { await navigator.clipboard.writeText(entryCode); } catch { /* ignore */ }
    flashToast(labels.copied);
  }

  async function share() {
    const text = `${eventName} · ${labels.entryNoLabel}: ${entryCode}`;
    if (typeof navigator !== 'undefined' && (navigator as Navigator & { share?: (d: ShareData) => Promise<void> }).share) {
      try { await (navigator as Navigator & { share: (d: ShareData) => Promise<void> }).share({ text, title: eventName }); return; } catch { /* fall through */ }
    }
    flashToast(labels.share + ' ✓');
  }

  return (
    <div className="w-full max-w-[460px] mx-auto">
      {/* Congratulatory eyebrow */}
      <div className={cn('flex items-center justify-center gap-1.5 mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-700', taClass)}>
        <Sparkles className="w-3.5 h-3.5" />
        {labels.congrats}
      </div>

      {/* Raffle stub */}
      <div className="relative">
        {/* Perforated separator (decorative) */}
        <div
          aria-hidden
          className="absolute left-[104px] top-0 bottom-0 w-px"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, rgba(0,0,0,0.35) 0 4px, transparent 4px 9px)',
          }}
        />
        {/* Ticket body — dark maroon with subtle gold sheen */}
        <div
          className="relative overflow-hidden rounded-2xl text-white shadow-[0_18px_50px_rgba(139,26,26,0.35)] flex"
          style={{
            background:
              'linear-gradient(135deg, #6b0f0f 0%, #8B1A1A 40%, #a02020 100%)',
          }}
        >
          {/* Watermark diya */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-end opacity-[0.06] text-[220px] leading-none pr-4 select-none"
          >
            🪔
          </div>

          {/* LEFT STUB — big entry code column */}
          <div className="w-[104px] flex-shrink-0 flex flex-col items-center justify-center py-5 border-r border-white/10 relative">
            <div
              className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white"
              aria-hidden
            />
            <div
              className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white"
              aria-hidden
            />
            <span className={cn('text-[8.5px] font-bold uppercase tracking-[0.22em] text-amber-200/80 mb-2', taClass)}>
              {labels.entryNoLabel}
            </span>
            <div className="text-[24px] font-black tabular-nums leading-none tracking-tight">
              {entryCode.split('-')[0]}
            </div>
            <div className="text-[12px] font-bold tabular-nums leading-none opacity-80 mt-0.5">
              {entryCode.split('-')[1]}
            </div>
            <Ticket className="w-5 h-5 text-amber-200/60 mt-3" />
          </div>

          {/* RIGHT MAIN — event + entrant */}
          <div className="flex-1 min-w-0 relative p-4">
            <div className={cn('flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-amber-200', taClass)}>
              <span>{labels.eventLabel}</span>
            </div>
            <p className={cn('text-[15px] font-bold leading-tight mt-0.5 truncate', taClass)}>
              {eventName}
            </p>
            <p className={cn('text-[11px] text-white/70 mt-0.5 truncate', taClass)}>
              {templeName}
            </p>

            <div className="mt-3 pt-3 border-t border-white/15 grid grid-cols-2 gap-y-1.5 gap-x-3">
              <MetaRow label={labels.forLabel}       value={entrantName} taClass={taClass} />
              <MetaRow label={labels.eventLabel}     value={drawDate}    taClass={taClass} />
              <MetaRow label={labels.submittedLabel} value={submittedAt} taClass={taClass} spanFull />
            </div>

            <div className={cn('mt-3 flex items-center gap-2 text-[10px] font-semibold text-amber-100/90', taClass)}>
              <Bell className="w-3 h-3" />
              <span className="truncate">{labels.notifyHint}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Position + odds pill row */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-[--color-border] bg-white p-2.5">
          <p className={cn('text-[9.5px] font-bold uppercase tracking-wider text-[--color-text-secondary]', taClass)}>
            {labels.yourPosition}
          </p>
          <p className="text-[15px] font-bold text-[--color-text-primary] tabular-nums mt-0.5">
            #{stats.entriesSoFar.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="rounded-xl border border-[--color-border] bg-white p-2.5">
          <p className={cn('text-[9.5px] font-bold uppercase tracking-wider text-[--color-text-secondary]', taClass)}>
            {labels.yourOdds}
          </p>
          <p className="text-[15px] font-bold text-[--color-text-primary] tabular-nums mt-0.5">
            {stats.oddsLabel}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={copyCode}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[--color-border] bg-white hover:bg-neutral-50 text-[13px] font-bold text-[--color-text-primary] transition-colors',
            taClass,
          )}
        >
          <Copy className="w-3.5 h-3.5" />
          {labels.copy}
        </button>
        <button
          onClick={share}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[--color-border] bg-white hover:bg-neutral-50 text-[13px] font-bold text-[--color-text-primary] transition-colors',
            taClass,
          )}
        >
          <Share2 className="w-3.5 h-3.5" />
          {labels.share}
        </button>
        <button
          onClick={onClose}
          className={cn(
            'flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[--color-site-name] hover:bg-[--color-btn-primary-hover] text-white text-[13px] font-bold transition-colors',
            taClass,
          )}
          aria-label={labels.close}
        >
          <X className="w-3.5 h-3.5" />
          {labels.close}
        </button>
      </div>

      {/* Subline reassurance */}
      <p className={cn('text-[11.5px] text-[--color-text-secondary] mt-3 text-center leading-relaxed', taClass)}>
        {labels.subline}
      </p>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[12px] font-semibold px-4 py-2 rounded-full shadow-lg z-[110]">
          {toast}
        </div>
      )}
    </div>
  );
}

function MetaRow({ label, value, taClass, spanFull }: { label: string; value: string; taClass: string; spanFull?: boolean }) {
  return (
    <div className={spanFull ? 'col-span-2' : ''}>
      <p className={cn('text-[9px] font-bold uppercase tracking-wider text-amber-200/70', taClass)}>{label}</p>
      <p className={cn('text-[12px] font-semibold text-white/95 truncate', taClass)}>{value}</p>
    </div>
  );
}
