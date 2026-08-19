'use client';

import { useRef, useState } from 'react';
import { ArrowRight, Check, Calendar, Minus, Plus, User, Baby } from 'lucide-react';
import { cn } from '@/lib/utils';

// ── PrimaryCtaButton ──────────────────────────────────────────────────────────
// A single, high-visibility button for entering a flow (e.g. "Get Started").
// Sits inline like any other control but reads as the primary CTA of the turn.
export function PrimaryCtaButton({
  label,
  onClick,
  bilingualClass,
}: {
  label: string;
  onClick: () => void;
  bilingualClass?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[--color-site-name] hover:bg-[--color-btn-primary-hover] text-white text-[14px] font-bold shadow-md hover:shadow-lg transition-all',
        bilingualClass
      )}
    >
      {label}
      <ArrowRight className="w-4 h-4" />
    </button>
  );
}

// ── DateChips ─────────────────────────────────────────────────────────────────
// Shows the first 6 dates as chips. 7th slot is a "Pick a date" chip that
// opens a native date input constrained to the full date range.
export function DateChips({
  dates,
  labels,
  onPick,
  pickerLabel = 'Pick a date',
}: {
  dates: string[];
  labels?: (iso: string) => string;
  onPick: (iso: string, echo: string) => void;
  pickerLabel?: string;
}) {
  const fmt = labels ?? ((iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  });
  const visible = dates.slice(0, 6);
  const min = dates[0];
  const max = dates[dates.length - 1];
  const inputRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    // showPicker() is supported in modern browsers; fall back to click().
    const el = inputRef.current;
    if (!el) return;
    const anyEl = el as HTMLInputElement & { showPicker?: () => void };
    if (typeof anyEl.showPicker === 'function') anyEl.showPicker();
    else el.click();
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((iso) => {
        const label = fmt(iso);
        return (
          <button
            key={iso}
            onClick={() => onPick(iso, label)}
            className="flex-shrink-0 px-3 py-2 rounded-lg bg-white border border-[--color-border] text-[12.5px] font-semibold text-[--color-text-primary] hover:border-[--color-site-name] hover:bg-red-50/50 transition-colors"
          >
            {label}
          </button>
        );
      })}

      {/* 7th slot — native picker (only visible if there are more than 6 dates) */}
      {dates.length > 6 && (
        <div className="relative flex-shrink-0">
          <button
            onClick={openPicker}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white border border-dashed border-[--color-border] text-[12.5px] font-semibold text-[--color-text-secondary] hover:border-[--color-site-name] hover:text-[--color-site-name] hover:bg-red-50/50 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
            {pickerLabel}
          </button>
          {/* Native input sits invisible under the button (or opened programmatically) */}
          <input
            ref={inputRef}
            type="date"
            min={min}
            max={max}
            onChange={(e) => {
              const iso = e.target.value;
              if (!iso) return;
              onPick(iso, fmt(iso));
            }}
            className="absolute inset-0 opacity-0 pointer-events-none"
            tabIndex={-1}
          />
        </div>
      )}
    </div>
  );
}

// ── TimeSlotPicker ────────────────────────────────────────────────────────────
export interface TimeSlotOption {
  id:        string;
  timeLabel: string;
  capacity:  number;
  filled:    number;
}

export function TimeSlotPicker({
  slots,
  onPick,
  labels,
  bilingualClass,
}: {
  slots: TimeSlotOption[];
  onPick: (id: string, echo: string) => void;
  labels: {
    seatsLeft: (n: number) => string;
    filled:    (n: number) => string;
    full:      string;
    totalAvail:(left: number, total: number) => string;
    entryAt:   (time: string) => string;
  };
  bilingualClass?: string;
}) {
  const totalCap  = slots.reduce((s, x) => s + x.capacity, 0);
  const totalLeft = slots.reduce((s, x) => s + (x.capacity - x.filled), 0);

  return (
    <div className="space-y-2 max-w-[440px]">
      {/* Aggregate seats-left header */}
      <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-neutral-100">
        <span className={cn('text-[11px] font-bold uppercase tracking-wider text-[--color-text-secondary]', bilingualClass)}>
          {labels.totalAvail(totalLeft, totalCap)}
        </span>
        <span className="text-[11px] font-bold text-[--color-site-name] tabular-nums">
          {totalLeft} / {totalCap}
        </span>
      </div>

      {/* Slot grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {slots.map((s) => {
          const left = s.capacity - s.filled;
          const pct  = Math.round((s.filled / s.capacity) * 100);
          const isFull = left <= 0;
          const barColor =
            pct >= 100 ? 'bg-neutral-400' :
            pct >= 80  ? 'bg-amber-500'  :
            pct >= 50  ? 'bg-amber-400'  :
                         'bg-emerald-500';

          return (
            <button
              key={s.id}
              onClick={() => !isFull && onPick(s.id, s.timeLabel)}
              disabled={isFull}
              className={cn(
                'group text-left rounded-lg border transition-colors p-2.5',
                isFull
                  ? 'border-neutral-200 bg-neutral-100 cursor-not-allowed opacity-60'
                  : 'border-[--color-border] bg-white hover:border-[--color-site-name] hover:bg-red-50/40'
              )}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={cn('text-[12.5px] font-bold text-[--color-text-primary]', bilingualClass)}>
                  {s.timeLabel}
                </span>
                {isFull ? (
                  <span className={cn('text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-neutral-300 text-neutral-700', bilingualClass)}>
                    {labels.full}
                  </span>
                ) : (
                  <span className={cn('text-[10px] font-bold text-[--color-site-name] tabular-nums', bilingualClass)}>
                    {labels.seatsLeft(left)}
                  </span>
                )}
              </div>

              {/* Fill bar */}
              <div className="h-1 w-full rounded-full bg-neutral-200 overflow-hidden">
                <div className={cn('h-full rounded-full transition-all', barColor)} style={{ width: `${Math.min(100, pct)}%` }} />
              </div>

              <p className={cn('mt-1 text-[10.5px] text-[--color-text-secondary] tabular-nums', bilingualClass)}>
                {labels.filled(s.filled)} / {s.capacity}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── CountBreakdown (adults + kids steppers with live total) ───────────────────
export function CountBreakdown({
  pricePerAdult,
  maxTotal = 10,
  labels,
  onSubmit,
  bilingualClass,
}: {
  pricePerAdult: number;
  maxTotal?: number;
  labels: {
    adults: string;
    kids: string;
    kidsHint: string;
    maxHint: string;
    total: string;
    needsAdult: string;
    passesLabel: (n: number) => string;
    submit: string;
    formatCurrency: (n: number) => string;
  };
  onSubmit: (
    value: { adults: number; kids: number; amount: number },
    echo: string,
  ) => void;
  bilingualClass?: string;
}) {
  const [adults, setAdults] = useState(1);
  const [kids,   setKids]   = useState(0);
  const total = adults + kids;
  const amount = adults * pricePerAdult;
  const canSubmit = adults >= 1 && total <= maxTotal;

  function nudge(kind: 'adults' | 'kids', delta: 1 | -1) {
    if (kind === 'adults') {
      const next = Math.max(0, adults + delta);
      if (next + kids > maxTotal) return;
      setAdults(next);
    } else {
      const next = Math.max(0, kids + delta);
      if (adults + next > maxTotal) return;
      setKids(next);
    }
  }

  function commit() {
    if (!canSubmit) return;
    const echo = `${labels.passesLabel(total)} · ${labels.adults} ${adults} · ${labels.kids} ${kids} · ${labels.formatCurrency(amount)}`;
    onSubmit({ adults, kids, amount }, echo);
  }

  return (
    <div className="space-y-2 max-w-[420px]">
      <StepperRow
        icon={User}
        label={labels.adults}
        hint={labels.formatCurrency(pricePerAdult)}
        value={adults}
        onDec={() => nudge('adults', -1)}
        onInc={() => nudge('adults',  1)}
        minReached={adults === 0}
        maxReached={total >= maxTotal}
        bilingualClass={bilingualClass}
      />
      <StepperRow
        icon={Baby}
        label={labels.kids}
        hint={labels.kidsHint}
        value={kids}
        onDec={() => nudge('kids', -1)}
        onInc={() => nudge('kids',  1)}
        minReached={kids === 0}
        maxReached={total >= maxTotal}
        bilingualClass={bilingualClass}
      />

      {/* Live total + hint row */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-red-50 border border-red-100">
        <div className="min-w-0">
          <p className={cn('text-[11px] font-bold uppercase tracking-wider text-[--color-text-secondary]', bilingualClass)}>
            {labels.total}
          </p>
          <p className={cn('text-[11.5px] text-[--color-text-secondary]', bilingualClass)}>
            {labels.passesLabel(total)}
          </p>
        </div>
        <p className="text-[18px] font-bold text-[--color-site-name] tabular-nums">
          {labels.formatCurrency(amount)}
        </p>
      </div>

      {/* Max hint */}
      <p className={cn('text-[11px] text-[--color-text-secondary] text-center', bilingualClass)}>
        {labels.maxHint}
      </p>

      <button
        onClick={commit}
        disabled={!canSubmit}
        className={cn(
          'w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-bold transition-colors',
          canSubmit
            ? 'bg-[--color-site-name] hover:bg-[--color-btn-primary-hover] text-white'
            : 'bg-neutral-200 text-neutral-400 cursor-not-allowed',
          bilingualClass
        )}
      >
        {canSubmit ? labels.submit : labels.needsAdult}
        {canSubmit && <ArrowRight className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

function StepperRow({
  icon: Icon,
  label,
  hint,
  value,
  onDec,
  onInc,
  minReached,
  maxReached,
  bilingualClass,
}: {
  icon: React.ElementType;
  label: string;
  hint?: string;
  value: number;
  onDec: () => void;
  onInc: () => void;
  minReached: boolean;
  maxReached: boolean;
  bilingualClass?: string;
}) {
  return (
    <div className="flex items-center gap-3 bg-white border border-[--color-border] rounded-xl px-3 py-2">
      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-[--color-site-name]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('text-[13px] font-semibold text-[--color-text-primary] leading-tight', bilingualClass)}>
          {label}
        </p>
        {hint && (
          <p className={cn('text-[11px] text-[--color-text-secondary] leading-tight', bilingualClass)}>
            {hint}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={onDec}
          disabled={minReached}
          aria-label="Decrease"
          className={cn(
            'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
            minReached
              ? 'bg-neutral-100 text-neutral-300 cursor-not-allowed'
              : 'bg-neutral-100 hover:bg-neutral-200 text-[--color-text-primary]'
          )}
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="text-[14px] font-bold text-[--color-text-primary] w-6 text-center tabular-nums">
          {value}
        </span>
        <button
          onClick={onInc}
          disabled={maxReached}
          aria-label="Increase"
          className={cn(
            'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
            maxReached
              ? 'bg-neutral-100 text-neutral-300 cursor-not-allowed'
              : 'bg-[--color-site-name] hover:bg-[--color-btn-primary-hover] text-white'
          )}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ── ChipsPicker (single-select) ───────────────────────────────────────────────
export function ChipsPicker({
  options,
  onPick,
}: {
  options: { key: string; label: string; echo?: string }[];
  onPick: (key: string, echo: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o.key}
          onClick={() => onPick(o.key, o.echo ?? o.label)}
          className="px-3.5 py-2 rounded-lg bg-white border border-[--color-border] text-[12.5px] font-semibold text-[--color-text-primary] hover:border-[--color-site-name] hover:bg-red-50/50 transition-colors"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ── TextInputBubble ───────────────────────────────────────────────────────────
export function TextInputBubble({
  placeholder,
  type = 'text',
  maxLength,
  onSubmit,
  transform,
  submitLabel,
  bilingualClass,
}: {
  placeholder?: string;
  type?: 'text' | 'email' | 'tel';
  maxLength?: number;
  onSubmit: (value: string, echo: string) => void;
  transform?: (raw: string) => string;
  submitLabel?: string;
  bilingualClass?: string;
}) {
  const [v, setV] = useState('');
  const canSubmit = v.trim().length > 0;

  function commit() {
    if (!canSubmit) return;
    const clean = transform ? transform(v.trim()) : v.trim();
    onSubmit(clean, clean);
  }

  return (
    <div className="flex items-center gap-2 bg-white border border-[--color-border] rounded-xl focus-within:border-[--color-site-name] focus-within:ring-2 focus-within:ring-red-100 transition-all px-3 py-2 max-w-[420px]">
      <input
        autoFocus
        type={type}
        value={v}
        maxLength={maxLength}
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') commit(); }}
        placeholder={placeholder}
        className={cn('flex-1 min-w-0 bg-transparent text-[13px] text-[--color-text-primary] outline-none font-medium', bilingualClass)}
      />
      <button
        onClick={commit}
        disabled={!canSubmit}
        aria-label={submitLabel ?? 'Send'}
        className={cn(
          'w-8 h-8 flex items-center justify-center rounded-lg transition-colors flex-shrink-0',
          canSubmit
            ? 'bg-[--color-site-name] hover:bg-[--color-btn-primary-hover] text-white'
            : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
        )}
      >
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── MultiField (2 or 3 inputs on one turn) ────────────────────────────────────
export interface MultiFieldSpec {
  key: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel';
  required?: boolean;
  transform?: (raw: string) => string;
  mask?: (value: string) => string;   // display transform for echo
}

export function MultiFieldInput({
  fields,
  onSubmit,
  submitLabel = 'Send',
  bilingualClass,
}: {
  fields: MultiFieldSpec[];
  onSubmit: (value: Record<string, string>, echo: string) => void;
  submitLabel?: string;
  bilingualClass?: string;
}) {
  const [state, setState] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.key, '']))
  );
  const canSubmit = fields.every((f) => !f.required || state[f.key]?.trim().length);

  function commit() {
    if (!canSubmit) return;
    const clean: Record<string, string> = {};
    for (const f of fields) {
      const raw = state[f.key]?.trim() ?? '';
      clean[f.key] = f.transform ? f.transform(raw) : raw;
    }
    const echo = fields
      .map((f) => {
        const v = clean[f.key];
        if (!v) return null;
        return f.mask ? f.mask(v) : v;
      })
      .filter(Boolean)
      .join(' · ');
    onSubmit(clean, echo);
  }

  return (
    <div className="space-y-2 max-w-[420px]">
      {fields.map((f) => (
        <div
          key={f.key}
          className="flex items-center gap-2 bg-white border border-[--color-border] rounded-xl focus-within:border-[--color-site-name] focus-within:ring-2 focus-within:ring-red-100 transition-all px-3 py-2"
        >
          <label className={cn('text-[11px] font-bold uppercase tracking-wider text-[--color-text-secondary] w-[76px] flex-shrink-0', bilingualClass)}>
            {f.label}
          </label>
          <input
            type={f.type ?? 'text'}
            value={state[f.key]}
            onChange={(e) => setState((s) => ({ ...s, [f.key]: e.target.value }))}
            placeholder={f.placeholder}
            className={cn('flex-1 min-w-0 bg-transparent text-[13px] text-[--color-text-primary] outline-none font-medium', bilingualClass)}
          />
        </div>
      ))}
      <button
        onClick={commit}
        disabled={!canSubmit}
        className={cn(
          'w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[13px] font-bold transition-colors',
          canSubmit
            ? 'bg-[--color-site-name] hover:bg-[--color-btn-primary-hover] text-white'
            : 'bg-neutral-200 text-neutral-400 cursor-not-allowed',
          bilingualClass
        )}
      >
        {submitLabel}
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ── SummaryCard ───────────────────────────────────────────────────────────────
export function SummaryCard({
  title,
  rows,
  amountLabel,
  amountValue,
  acceptLabel,
  ctaLabel,
  onConfirm,
  bilingualClass,
  extras,
}: {
  title: string;
  rows: { key: string; label: string; value: string }[];
  amountLabel: string;
  amountValue: string;
  acceptLabel: string;
  ctaLabel: string;
  onConfirm: () => void;
  bilingualClass?: string;
  extras?: React.ReactNode;   // e.g. rules block, warnings, etc.
}) {
  const [accepted, setAccepted] = useState(false);
  return (
    <div className="bg-white border border-[--color-border] rounded-2xl overflow-hidden max-w-[460px]">
      <div className={cn('px-4 py-2.5 border-b border-[--color-border] bg-neutral-50', bilingualClass)}>
        <p className="text-[12px] font-bold uppercase tracking-wider text-[--color-text-secondary]">
          {title}
        </p>
      </div>
      <div className="px-4 py-3 space-y-2">
        {rows.map((r) => (
          <div key={r.key} className="flex items-start gap-3">
            <p className={cn('text-[11px] font-semibold uppercase tracking-wider text-[--color-text-secondary] w-[88px] flex-shrink-0', bilingualClass)}>
              {r.label}
            </p>
            <p className="text-[13px] font-semibold text-[--color-text-primary] flex-1 min-w-0 break-words">
              {r.value}
            </p>
          </div>
        ))}
        <div className="pt-2 mt-2 border-t border-[--color-border] flex items-center justify-between">
          <p className={cn('text-[12px] font-bold uppercase tracking-wider text-[--color-text-secondary]', bilingualClass)}>
            {amountLabel}
          </p>
          <p className="text-[16px] font-bold text-[--color-site-name]">{amountValue}</p>
        </div>
      </div>

      {/* Optional slot for rules / warnings — rendered above the accept row */}
      {extras && <div className="px-4">{extras}</div>}

      <div className="px-4 pb-4 pt-3 space-y-3">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[--color-site-name] flex-shrink-0"
          />
          <span className={cn('text-[12px] text-[--color-text-secondary] leading-snug', bilingualClass)}>
            {acceptLabel}
          </span>
        </label>
        <button
          onClick={onConfirm}
          disabled={!accepted}
          className={cn(
            'w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-bold transition-colors',
            accepted
              ? 'bg-[--color-site-name] hover:bg-[--color-btn-primary-hover] text-white'
              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed',
            bilingualClass
          )}
        >
          <Check className="w-4 h-4" />
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}

// ── SuccessCard ───────────────────────────────────────────────────────────────
export function SuccessCard({
  title,
  body,
  reference,
  onClose,
  closeLabel,
  bilingualClass,
}: {
  title: string;
  body: string;
  reference: string;
  onClose: () => void;
  closeLabel: string;
  bilingualClass?: string;
}) {
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 max-w-[440px]">
      <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center mb-3">
        <Check className="w-5 h-5 text-white" />
      </div>
      <p className={cn('text-[15px] font-bold text-[--color-text-primary]', bilingualClass)}>{title}</p>
      <p className={cn('text-[12px] text-[--color-text-secondary] mt-1 leading-relaxed', bilingualClass)}>{body}</p>
      <p className="text-[11px] font-mono text-neutral-500 mt-3">{reference}</p>
      <button
        onClick={onClose}
        className={cn(
          'mt-4 w-full py-2 rounded-xl bg-white border border-emerald-300 text-[13px] font-bold text-emerald-700 hover:bg-emerald-100 transition-colors',
          bilingualClass
        )}
      >
        {closeLabel}
      </button>
    </div>
  );
}
