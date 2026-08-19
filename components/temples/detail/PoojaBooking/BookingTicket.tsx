'use client';

import { useState } from 'react';
import { Printer, Download, Share2, Check, Landmark, QrCode, Info, X } from 'lucide-react';
import { BOOKING_RULES } from '@/data/poojaServices';
import { cn } from '@/lib/utils';

/**
 * Temple-receipt-style confirmation ticket. Purely static —
 * Print/Download/Share buttons all fire the same "coming soon" toast.
 */
export default function BookingTicket({
  ta,
  templeName,
  reference,
  poojaLabel, poojaName,
  dateLabel,  dateValue,
  timeLabel, timeValue,
  devoteeLabel, devoteeName,
  passesLabel, passesValue,
  amountLabel, amountValue,
  bookedLabel, bookedValue,
  qrHint,
  sealLabel,
  title,
  subtitle,
  actions,
  toastMessage,
  onClose,
  closeLabel,
}: {
  ta: boolean;
  templeName: string;
  reference:  string;
  poojaLabel: string; poojaName: string;
  dateLabel:  string; dateValue: string;
  timeLabel?: string; timeValue?: string;
  devoteeLabel: string; devoteeName: string;
  passesLabel?: string; passesValue?: string;
  amountLabel: string; amountValue: string;
  bookedLabel: string; bookedValue: string;
  qrHint:  string;
  sealLabel: string;
  title:    string;
  subtitle: string;
  actions: { print: string; download: string; share: string };
  toastMessage: string;
  onClose:    () => void;
  closeLabel: string;
}) {
  const [toast, setToast] = useState<string | null>(null);

  function handlePrint() {
    window.print();
  }

  function handleDownload() {
    // Use browser's built-in print-to-PDF. Show a brief hint toast first.
    setToast(toastMessage);
    setTimeout(() => { setToast(null); window.print(); }, 400);
  }

  function fireToast() {
    setToast(toastMessage);
    setTimeout(() => setToast(null), 3000);
  }
  const taClass = ta ? 'ta-text' : '';

  const rows: { label: string; value: string }[] = [
    { label: poojaLabel,   value: poojaName },
    { label: dateLabel,    value: dateValue },
    ...(timeValue ? [{ label: timeLabel ?? 'Time', value: timeValue }] : []),
    { label: devoteeLabel, value: devoteeName },
    ...(passesValue ? [{ label: passesLabel ?? 'Passes', value: passesValue }] : []),
  ];

  return (
    <div className="relative w-full max-w-[520px] mx-auto">
      {/* Ticket card */}
      <div className="relative bg-white border border-[--color-border] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(139,26,26,0.15)]">
        {/* Letterhead */}
        <div className="relative bg-gradient-to-r from-[#8B1A1A] via-[#A02818] to-[#C8500A] px-5 py-4 text-white overflow-hidden">
          <div
            className="absolute inset-0 opacity-25 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at 12% 40%, rgba(255,255,255,0.35) 0%, transparent 45%)' }}
          />
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Landmark className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className={cn('text-[10px] font-bold uppercase tracking-[0.22em] text-amber-100', taClass)}>
                Tamil Nadu HR&amp;CE
              </p>
              <p className={cn('text-[15px] font-bold text-white leading-tight truncate', taClass)}>
                {templeName}
              </p>
            </div>
          </div>
        </div>

        {/* Reference + title */}
        <div className="px-5 pt-4 pb-3 border-b border-dashed border-[--color-border]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className={cn('text-[11px] font-bold uppercase tracking-wider text-[--color-text-secondary]', taClass)}>
                {title}
              </p>
              <p className={cn('text-[12px] text-[--color-text-secondary]', taClass)}>
                {subtitle}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider flex-shrink-0">
              <Check className="w-3 h-3" /> Confirmed
            </span>
          </div>
          <p className="mt-2 font-mono text-[13px] font-bold tracking-wide text-[--color-text-primary]">
            {reference}
          </p>
        </div>

        {/* Body */}
        <div className="relative px-5 py-4 flex flex-col md:flex-row gap-4">
          {/* Left: field rows */}
          <div className="flex-1 min-w-0 space-y-2">
            {rows.map((r) => (
              <div key={r.label} className="flex items-start gap-3">
                <p className={cn('text-[10px] font-bold uppercase tracking-wider text-[--color-text-secondary] w-[70px] flex-shrink-0', taClass)}>
                  {r.label}
                </p>
                <p className={cn('text-[13px] font-semibold text-[--color-text-primary] flex-1 min-w-0 break-words', taClass)}>
                  {r.value}
                </p>
              </div>
            ))}
            <div className="pt-2 mt-2 border-t border-dashed border-[--color-border] flex items-center justify-between">
              <p className={cn('text-[11px] font-bold uppercase tracking-wider text-[--color-text-secondary]', taClass)}>
                {amountLabel}
              </p>
              <p className="text-[18px] font-bold text-[--color-site-name] tabular-nums">
                {amountValue}
              </p>
            </div>
            <p className={cn('text-[10px] text-[--color-text-secondary] pt-1', taClass)}>
              {bookedLabel} · <span className="font-semibold text-[--color-text-primary]">{bookedValue}</span>
            </p>
          </div>

          {/* Right: QR placeholder */}
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <div className="w-[96px] h-[96px] rounded-lg border border-neutral-300 bg-white flex items-center justify-center relative overflow-hidden">
              {/* Faux QR pattern via a repeating grid */}
              <div
                className="absolute inset-2"
                style={{
                  backgroundImage:
                    'linear-gradient(0deg, transparent 30%, #111 30%, #111 42%, transparent 42%, transparent 55%, #111 55%, #111 70%, transparent 70%), linear-gradient(90deg, transparent 25%, #111 25%, #111 40%, transparent 40%, transparent 60%, #111 60%, #111 78%, transparent 78%)',
                  backgroundSize: '12px 12px',
                }}
              />
              <QrCode className="relative w-8 h-8 text-[--color-site-name]" />
            </div>
            <p className={cn('text-[9.5px] text-[--color-text-secondary] text-center max-w-[110px] leading-tight', taClass)}>
              {qrHint}
            </p>
          </div>

          {/* Watermark seal */}
          <div className="pointer-events-none absolute right-6 bottom-6 opacity-[0.05] rotate-[-12deg] select-none">
            <div className="border-4 border-[--color-site-name] rounded-full w-[160px] h-[160px] flex items-center justify-center">
              <span className={cn('text-[14px] font-black uppercase tracking-widest text-[--color-site-name] text-center leading-tight', taClass)}>
                {sealLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Rules list — visible on the ticket for a print-friendly reference */}
        <div className="border-t border-[--color-border] px-5 py-3 bg-neutral-50">
          <p className={cn('text-[10px] font-bold uppercase tracking-wider text-[--color-text-secondary] mb-2 flex items-center gap-1.5', taClass)}>
            <Info className="w-3 h-3" />
            {ta ? 'விதிமுறைகள்' : 'Instructions'}
          </p>
          <ol className="list-decimal list-inside space-y-1">
            {BOOKING_RULES.map((r) => (
              <li key={r.key} className={cn('text-[10.5px] leading-relaxed text-[--color-text-secondary]', ta && 'ta-text')}>
                {ta ? r.ta : r.en}
              </li>
            ))}
          </ol>
        </div>

        {/* Perforated bottom edge (visual only) */}
        <div className="h-3 bg-white border-t border-dashed border-[--color-border]" />
      </div>

      {/* Actions — outside the ticket, hidden when printing */}
      <div className="mt-4 grid grid-cols-3 gap-2 print:hidden">
        <ActionButton icon={Printer}  label={actions.print}    onClick={handlePrint}    bilingualClass={taClass} />
        <ActionButton icon={Download} label={actions.download} onClick={handleDownload} bilingualClass={taClass} />
        <ActionButton icon={Share2}   label={actions.share}    onClick={fireToast}      bilingualClass={taClass} />
      </div>

      {/* Close */}
      <div className="mt-2 print:hidden">
        <button
          onClick={onClose}
          className={cn('w-full py-2 rounded-xl border border-[--color-border] text-[13px] font-semibold text-[--color-text-secondary] hover:bg-neutral-50 transition-colors', taClass)}
        >
          {closeLabel}
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className={cn(
          'fixed left-1/2 -translate-x-1/2 bottom-8 z-[110] flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-900 text-white text-[12.5px] font-semibold shadow-xl',
          'animate-welcomeIn',
          taClass
        )}>
          <Info className="w-3.5 h-3.5 text-amber-300" />
          {toast}
          <button onClick={() => setToast(null)} aria-label="Dismiss" className="ml-1 opacity-70 hover:opacity-100">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  bilingualClass,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  bilingualClass?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl border border-[--color-border] bg-white hover:bg-neutral-50 hover:border-[--color-site-name] hover:text-[--color-site-name] transition-colors"
    >
      <Icon className="w-4 h-4" />
      <span className={cn('text-[11px] font-bold text-[--color-text-primary]', bilingualClass)}>
        {label}
      </span>
    </button>
  );
}
