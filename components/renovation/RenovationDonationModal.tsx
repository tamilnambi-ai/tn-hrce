'use client';

/**
 * RenovationDonationModal — opens from a RenovationCard's "Donate" button.
 *
 * Single-column scroll (per user's B2 choice):
 *   1. Context strip — Renovating: <Temple> · <Project name>
 *   2. Overall project progress bar
 *   3. "Sponsor a Work Item" — WorkItemCards (mix of full + bulk)
 *      - Full: pick any amount up to the remaining
 *      - Bulk: choose units count → total updates live
 *   4. "Or Give Any Amount" — preset chips + custom, mirrors DonationCard style
 *   5. Rewards banner — inline tier explainer, always visible
 *   6. Sticky footer — "Donate ₹X" CTA
 *
 * Success → RenovationReceipt: shows the ticket + reward list actually unlocked
 * (D1 lock: single renovation, no dropdown).
 */

import { useEffect, useMemo, useState } from 'react';
import { X, HandCoins, Sparkles, IndianRupee, Check, Landmark, Award, Gift, Ticket, Loader2, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import {
  workItemsFor, rewardsFor, formatInrShort, type Renovation, type WorkItem, type RewardKey,
} from '@/data/renovations';
import { cn } from '@/lib/utils';
import { useRazorpay } from '@/hooks/useRazorpay';

// ── Selection state ──────────────────────────────────────────────────────────
type Selection =
  | { kind: 'idle' }
  | { kind: 'item-full';  itemId: string; amount: number }
  | { kind: 'item-bulk';  itemId: string; units: number }
  | { kind: 'preset';     amount: number }
  | { kind: 'other';      amount: number };

const PRESETS = [101, 501, 1001, 5001, 25001];

// ─────────────────────────────────────────────────────────────────────────────
export default function RenovationDonationModal({
  open, renovation, onClose,
}: {
  open: boolean;
  renovation: Renovation | null;
  onClose: () => void;
}) {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const taClass = ta ? 'ta-text' : '';

  const items = useMemo(() => (renovation ? workItemsFor(renovation.id) : []), [renovation]);
  const { openCheckout, paying } = useRazorpay();

  const [sel,  setSel]  = useState<Selection>({ kind: 'idle' });
  const [done, setDone] = useState<{ ref: string; amount: number } | null>(null);

  // Contact capture — shown before payment
  const [showContact,  setShowContact]  = useState(false);
  const [donorName,    setDonorName]    = useState('');
  const [donorEmail,   setDonorEmail]   = useState('');
  const [donorPhone,   setDonorPhone]   = useState('');
  const [contactError, setContactError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Reset when modal closes / renovation changes
  useEffect(() => {
    if (!open) {
      setSel({ kind: 'idle' }); setDone(null);
      setShowContact(false); setDonorName(''); setDonorEmail(''); setDonorPhone('');
      setContactError(null); setPaymentError(null);
    }
  }, [open]);
  useEffect(() => {
    setSel({ kind: 'idle' }); setDone(null);
    setShowContact(false); setPaymentError(null);
  }, [renovation?.id]);

  // Body-scroll lock + Esc
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey); };
  }, [open, onClose]);

  if (!open || !renovation) return null;

  const templeName = ta ? (renovation.templeNameTa ?? renovation.templeName) : renovation.templeName;
  const overallPct = Math.min(100, Math.round((renovation.raised / renovation.goal) * 100));

  const activeAmount = amountFromSelection(sel, items);
  const canDonate = activeAmount > 0;

  const activeItem: WorkItem | null =
    (sel.kind === 'item-full' || sel.kind === 'item-bulk')
      ? items.find((i) => i.id === sel.itemId) ?? null
      : null;

  // Step 1: CTA click → show contact form
  function handleDonate() {
    if (!canDonate) return;
    setShowContact(true);
    setContactError(null);
    setPaymentError(null);
  }

  // Step 2: Contact submitted → open Razorpay
  async function handleContactSubmit() {
    if (!donorName.trim()) {
      setContactError(ta ? 'பெயர் கட்டாயம்' : 'Name is required');
      return;
    }
    if (!donorEmail.includes('@')) {
      setContactError(ta ? 'சரியான மின்னஞ்சல் தேவை' : 'Valid email is required');
      return;
    }
    setContactError(null);
    setShowContact(false);
    if (!renovation) return;

    const activeItem: WorkItem | null =
      (sel.kind === 'item-full' || sel.kind === 'item-bulk')
        ? items.find((i) => i.id === sel.itemId) ?? null
        : null;

    const purposeLabel = activeItem
      ? `Renovation — Sponsoring: ${activeItem.name}`
      : `Renovation — General contribution`;

    const rewardsList = rewardsFor(activeAmount)
      .map((r) => r.key === 'certificate'  ? 'Certificate + progress updates'
                : r.key === 'darshanPass'  ? 'Special darshan pass'
                : 'Named archana + inauguration invite')
      .join(' · ');

    const result = await openCheckout({
      amount:      activeAmount,
      description: `${renovation.templeName} — Renovation donation`,
      prefill: { name: donorName, email: donorEmail, contact: donorPhone },
      meta: {
        type:        'donation',
        email:       donorEmail,
        donorName,
        templeName:  renovation.templeName,
        purpose:     purposeLabel,
        amountValue: formatInrShort(activeAmount),
        rewardsNote: rewardsList || undefined,
      },
    });

    if (result.success && result.referenceId) {
      setDone({ ref: result.referenceId, amount: activeAmount });
    } else if (result.error && result.error !== 'cancelled') {
      setPaymentError(ta ? 'பணம் செலுத்துவதில் பிழை. மீண்டும் முயற்சிக்கவும்.' : 'Payment failed. Please try again.');
    }
  }

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-[95] flex items-center justify-center p-2 md:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.35)] w-full max-w-[720px] h-[92vh] md:h-[720px] flex flex-col overflow-hidden">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-2.5 right-2.5 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-[--color-site-name] transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Header — locked to this renovation */}
        <div className="px-5 pt-4 pb-3 border-b border-neutral-100 flex-shrink-0">
          <div className="flex items-center gap-2 mb-0.5">
            <HandCoins className="w-3.5 h-3.5 text-[--color-site-name]" />
            <p className={cn('text-[10px] font-bold text-[--color-site-name] uppercase tracking-wide', taClass)}>
              {t(lang, 'renovDonate.eyebrow')}
            </p>
          </div>
          <h2 className={cn('text-[15px] md:text-[16px] font-bold text-neutral-900 pr-8 leading-snug', taClass)}>
            {templeName}
          </h2>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-[18px] font-black text-neutral-900 tracking-tight">{formatInrShort(renovation.raised)}</span>
            <span className={cn('text-[11px] text-neutral-500 font-medium', taClass)}>
              {t(lang, 'renovation.raisedOf')} <span className="font-extrabold text-neutral-900">{formatInrShort(renovation.goal)}</span>
            </span>
            <span className="ml-auto text-[11px] font-bold text-emerald-700">{overallPct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden mt-1.5">
            <div className="h-full bg-emerald-500" style={{ width: `${overallPct}%` }} />
          </div>
        </div>

        {/* Body — success / contact / paying / selection */}
        {done ? (
          <RenovationReceipt
            renovation={renovation}
            templeName={templeName}
            amount={done.amount}
            reference={done.ref}
            selection={sel}
            items={items}
            lang={lang}
            ta={ta}
            onClose={onClose}
          />
        ) : paying ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            <p className={cn('text-[13px] text-neutral-500', taClass)}>
              {ta ? 'பணம் செலுத்துகிறது…' : 'Processing payment…'}
            </p>
          </div>
        ) : showContact ? (
          <div className="flex-1 flex flex-col px-5 py-5 gap-4">
            <div>
              <p className={cn('text-[13px] font-bold text-neutral-900 mb-1', taClass)}>
                {ta ? 'தகவல் உள்ளிடவும்' : 'Your details'}
              </p>
              <p className={cn('text-[11px] text-neutral-500', taClass)}>
                {ta ? 'உங்கள் ரசீது மின்னஞ்சலில் அனுப்பப்படும்.' : 'Your receipt will be sent to this email.'}
              </p>
            </div>
            <div className="space-y-2.5">
              <RenovContactField
                label={ta ? 'பெயர்' : 'Full Name'} value={donorName}
                onChange={setDonorName} placeholder="Rajan M." type="text" taClass={taClass}
              />
              <RenovContactField
                label={ta ? 'மின்னஞ்சல்' : 'Email'} value={donorEmail}
                onChange={setDonorEmail} placeholder="name@example.com" type="email" taClass={taClass}
              />
              <RenovContactField
                label={ta ? 'தொலைபேசி' : 'Phone (optional)'} value={donorPhone}
                onChange={setDonorPhone} placeholder="+91 98765 43210" type="tel" taClass={taClass}
              />
            </div>
            {contactError && (
              <p className="text-[12px] text-red-600 font-semibold">{contactError}</p>
            )}
            <button
              onClick={handleContactSubmit}
              className={cn(
                'inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white text-[14px] font-bold bg-emerald-600 hover:bg-emerald-700 transition-colors',
                taClass
              )}
            >
              {ta ? `${formatInrShort(activeAmount)} செலுத்து` : `Pay ${formatInrShort(activeAmount)}`}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowContact(false)}
              className={cn('text-[12px] text-neutral-400 hover:underline self-start', taClass)}
            >
              {ta ? '← திரும்பு' : '← Back'}
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-5">
              {/* Rewards banner */}
              <RewardsBanner activeAmount={activeAmount} lang={lang} ta={ta} />

              {/* ── Section 1 — sponsor a work item ── */}
              <section>
                <SectionHeader
                  icon={<Gift className="w-3.5 h-3.5 text-[--color-site-name]" />}
                  title={t(lang, 'renovDonate.sponsorTitle')}
                  hint={t(lang, 'renovDonate.sponsorHint')}
                  taClass={taClass}
                />
                <div className="mt-3 space-y-2.5">
                  {items.map((it) => (
                    <WorkItemRow
                      key={it.id}
                      item={it}
                      selection={sel}
                      onSelect={(next) => setSel(next)}
                      lang={lang}
                      ta={ta}
                    />
                  ))}
                </div>
              </section>

              {/* ── Section 2 — any amount ── */}
              <section>
                <SectionHeader
                  icon={<Sparkles className="w-3.5 h-3.5 text-[--color-site-name]" />}
                  title={t(lang, 'renovDonate.anyAmountTitle')}
                  hint={t(lang, 'renovDonate.anyAmountHint')}
                  taClass={taClass}
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {PRESETS.map((p) => {
                    const active = sel.kind === 'preset' && sel.amount === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setSel({ kind: 'preset', amount: p })}
                        className={cn(
                          'px-4 py-2 rounded-full text-[13px] font-bold border transition-all',
                          active
                            ? 'bg-[--color-site-name] text-white border-[--color-site-name]'
                            : 'bg-white text-neutral-800 border-neutral-200 hover:border-neutral-300'
                        )}
                      >
                        {formatInrShort(p)}
                      </button>
                    );
                  })}
                  <OtherAmountChip selection={sel} onChange={setSel} lang={lang} ta={ta} />
                </div>
              </section>
            </div>

            {/* Payment error */}
            {paymentError && (
              <div className="mx-5 mb-1 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200">
                <p className={cn('text-[12px] font-semibold text-red-700', taClass)}>{paymentError}</p>
              </div>
            )}

            {/* Sticky footer CTA */}
            <div className="border-t border-neutral-100 px-5 py-3 flex items-center gap-3 flex-shrink-0 bg-white">
              <div className="flex-1 min-w-0">
                {activeItem ? (
                  <p className={cn('text-[12px] text-neutral-500 truncate', taClass)}>
                    {t(lang, 'renovDonate.footerSponsoring')}{' '}
                    <span className="text-neutral-900 font-bold">{ta ? (activeItem.nameTa ?? activeItem.name) : activeItem.name}</span>
                  </p>
                ) : sel.kind === 'preset' || sel.kind === 'other' ? (
                  <p className={cn('text-[12px] text-neutral-500 truncate', taClass)}>
                    {t(lang, 'renovDonate.footerAnyAmount')}
                  </p>
                ) : (
                  <p className={cn('text-[12px] text-neutral-400', taClass)}>{t(lang, 'renovDonate.footerPick')}</p>
                )}
              </div>
              <button
                type="button"
                disabled={!canDonate}
                onClick={handleDonate}
                className={cn(
                  'inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-[14px] font-bold transition-opacity',
                  canDonate ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-neutral-300 cursor-not-allowed'
                )}
              >
                {t(lang, 'renovDonate.donateAmount', { amount: formatInrShort(activeAmount || 0) })}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function amountFromSelection(sel: Selection, items: WorkItem[]): number {
  if (sel.kind === 'preset' || sel.kind === 'other') return Math.max(0, sel.amount || 0);
  if (sel.kind === 'item-full') return Math.max(0, sel.amount || 0);
  if (sel.kind === 'item-bulk') {
    const item = items.find((i) => i.id === sel.itemId);
    return item?.unitCost ? item.unitCost * sel.units : 0;
  }
  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
function SectionHeader({ icon, title, hint, taClass }: { icon: React.ReactNode; title: string; hint: string; taClass: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5">
        {icon}
        <h3 className={cn('text-[13px] font-bold text-neutral-900 uppercase tracking-wide', taClass)}>{title}</h3>
      </div>
      <p className={cn('text-[12px] text-neutral-500 mt-0.5', taClass)}>{hint}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function RewardsBanner({ activeAmount, lang, ta }: { activeAmount: number; lang: 'en' | 'ta'; ta: boolean }) {
  const taClass = ta ? 'ta-text' : '';
  const unlocked = new Set(rewardsFor(activeAmount).map((r) => r.key));

  const rewards: { key: RewardKey; label: string; from: string }[] = [
    { key: 'certificate',  label: t(lang, 'renovDonate.rewards.certificate'),  from: t(lang, 'renovDonate.rewards.fromAny') },
    { key: 'darshanPass',  label: t(lang, 'renovDonate.rewards.darshanPass'),  from: t(lang, 'renovDonate.rewards.from5k') },
    { key: 'namedArchana', label: t(lang, 'renovDonate.rewards.namedArchana'), from: t(lang, 'renovDonate.rewards.from25k') },
  ];

  return (
    <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/60 p-3">
      <div className="flex items-center gap-1.5 mb-2">
        <Award className="w-3.5 h-3.5 text-amber-700" />
        <p className={cn('text-[12px] font-bold text-amber-800 uppercase tracking-wide', taClass)}>
          {t(lang, 'renovDonate.rewards.title')}
        </p>
      </div>
      <ul className="space-y-1.5">
        {rewards.map((r) => {
          const on = unlocked.has(r.key);
          return (
            <li key={r.key} className="flex items-start gap-2">
              <span className={cn(
                'w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5',
                on ? 'bg-emerald-500 text-white' : 'bg-neutral-200 text-neutral-400'
              )}>
                <Check className="w-2.5 h-2.5" />
              </span>
              <p className={cn('text-[12px] leading-snug', on ? 'text-neutral-900' : 'text-neutral-500', taClass)}>
                <span className="font-semibold">{r.label}</span>{' '}
                <span className={cn('font-medium', on ? 'text-emerald-700' : 'text-neutral-400')}>· {r.from}</span>
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function WorkItemRow({
  item, selection, onSelect, lang, ta,
}: {
  item: WorkItem;
  selection: Selection;
  onSelect: (s: Selection) => void;
  lang: 'en' | 'ta';
  ta: boolean;
}) {
  const taClass = ta ? 'ta-text' : '';
  const name = ta ? (item.nameTa ?? item.name) : item.name;
  const unit = ta ? (item.unitTa ?? item.unit) : item.unit;
  const remaining = Math.max(0, item.cost - item.raised);
  const pct = Math.min(100, Math.round((item.raised / item.cost) * 100));
  const isFullSelected = selection.kind === 'item-full' && selection.itemId === item.id;
  const isBulkSelected = selection.kind === 'item-bulk' && selection.itemId === item.id;
  const isSelected = isFullSelected || isBulkSelected;

  return (
    <div
      className={cn(
        'rounded-xl border transition-all bg-white',
        isSelected ? 'border-emerald-500 shadow-sm' : 'border-neutral-200 hover:border-neutral-300'
      )}
    >
      <button
        type="button"
        onClick={() => {
          if (isSelected) { onSelect({ kind: 'idle' }); return; }
          if (item.mode === 'full') {
            onSelect({ kind: 'item-full', itemId: item.id, amount: Math.min(1000, remaining) });
          } else {
            onSelect({ kind: 'item-bulk', itemId: item.id, units: 1 });
          }
        }}
        className="w-full text-left px-3 py-2.5 flex items-start gap-3"
      >
        <span
          className={cn(
            'w-4 h-4 rounded-full border-2 flex-shrink-0 mt-1 flex items-center justify-center',
            isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-neutral-300'
          )}
        >
          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className={cn('text-[13px] font-bold text-neutral-900 truncate', taClass)}>{name}</span>
            {item.mode === 'bulk' && (
              <span className={cn('text-[11px] text-neutral-500', taClass)}>
                {formatInrShort(item.unitCost ?? 0)}/{unit}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1 rounded-full bg-neutral-100 overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
            </div>
            <span className={cn('text-[10px] text-neutral-500 font-semibold', taClass)}>
              {item.mode === 'bulk'
                ? `${item.unitsRaised} / ${item.totalUnits} ${unit}`
                : `${formatInrShort(item.raised)} / ${formatInrShort(item.cost)}`}
            </span>
          </div>
        </div>
      </button>

      {/* Selected → input */}
      {isFullSelected && (
        <div className="px-3 pb-3 pt-1 border-t border-emerald-100 bg-emerald-50/40 flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-emerald-200 rounded-lg px-2 py-1.5 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 flex-1">
            <IndianRupee className="w-3 h-3 text-neutral-500 flex-shrink-0" />
            <input
              autoFocus
              type="number"
              inputMode="numeric"
              value={selection.kind === 'item-full' ? String(selection.amount || '') : ''}
              onChange={(e) => onSelect({
                kind: 'item-full',
                itemId: item.id,
                amount: Number(e.target.value.replace(/[^0-9]/g, '')) || 0,
              })}
              placeholder={String(Math.min(1000, remaining))}
              max={remaining}
              className="flex-1 min-w-0 bg-transparent text-[13px] font-semibold text-neutral-900 outline-none"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <span className={cn('text-[11px] text-neutral-500 whitespace-nowrap', taClass)}>
            {t(lang, 'renovDonate.remaining')}: <span className="font-bold text-neutral-800">{formatInrShort(remaining)}</span>
          </span>
        </div>
      )}
      {isBulkSelected && (
        <div className="px-3 pb-3 pt-1 border-t border-emerald-100 bg-emerald-50/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={cn('text-[11px] text-neutral-500', taClass)}>{t(lang, 'renovDonate.units')}</span>
            <div className="flex items-center gap-1 bg-white border border-emerald-200 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onSelect({ kind: 'item-bulk', itemId: item.id, units: Math.max(1, (selection.kind === 'item-bulk' ? selection.units : 1) - 1) }); }}
                className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 font-bold"
              >−</button>
              <span className="w-8 text-center text-[13px] font-bold text-neutral-900">
                {selection.kind === 'item-bulk' ? selection.units : 1}
              </span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onSelect({ kind: 'item-bulk', itemId: item.id, units: Math.min((item.totalUnits ?? 1) - (item.unitsRaised ?? 0), (selection.kind === 'item-bulk' ? selection.units : 1) + 1) }); }}
                className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 font-bold"
              >+</button>
            </div>
          </div>
          <span className={cn('text-[12px]', taClass)}>
            <span className="text-neutral-500">{t(lang, 'renovDonate.total')}: </span>
            <span className="font-black text-neutral-900">{formatInrShort((item.unitCost ?? 0) * (selection.kind === 'item-bulk' ? selection.units : 1))}</span>
          </span>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function OtherAmountChip({
  selection, onChange, lang, ta,
}: { selection: Selection; onChange: (s: Selection) => void; lang: 'en' | 'ta'; ta: boolean }) {
  const taClass = ta ? 'ta-text' : '';
  const isOther = selection.kind === 'other';
  if (!isOther) {
    return (
      <button
        type="button"
        onClick={() => onChange({ kind: 'other', amount: 0 })}
        className="px-4 py-2 rounded-full text-[13px] font-bold border bg-white text-neutral-800 border-neutral-200 hover:border-neutral-300 transition-all"
      >
        <span className={taClass}>{t(lang, 'renovDonate.otherAmount')}</span>
      </button>
    );
  }
  return (
    <div className="flex items-center gap-1 bg-white border border-emerald-500 rounded-full px-3 py-1 ring-2 ring-emerald-100">
      <IndianRupee className="w-3 h-3 text-neutral-500 flex-shrink-0" />
      <input
        autoFocus
        type="number"
        inputMode="numeric"
        value={selection.kind === 'other' ? String(selection.amount || '') : ''}
        onChange={(e) => onChange({ kind: 'other', amount: Number(e.target.value.replace(/[^0-9]/g, '')) || 0 })}
        placeholder="500"
        min={1}
        className="w-24 bg-transparent text-[13px] font-semibold text-neutral-900 outline-none"
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function RenovationReceipt({
  renovation, templeName, amount, reference, selection, items, lang, ta, onClose,
}: {
  renovation: Renovation;
  templeName: string;
  amount: number;
  reference: string;
  selection: Selection;
  items: WorkItem[];
  lang: 'en' | 'ta';
  ta: boolean;
  onClose: () => void;
}) {
  const taClass = ta ? 'ta-text' : '';
  const unlocked = rewardsFor(amount);
  const unlockedKeys = new Set(unlocked.map((r) => r.key));

  let contributionLabel: string;
  if (selection.kind === 'item-full') {
    const item = items.find((i) => i.id === selection.itemId);
    const name = item ? (ta ? (item.nameTa ?? item.name) : item.name) : '';
    contributionLabel = `${t(lang, 'renovDonate.receipt.forItem')}: ${name}`;
  } else if (selection.kind === 'item-bulk') {
    const item = items.find((i) => i.id === selection.itemId);
    const name = item ? (ta ? (item.nameTa ?? item.name) : item.name) : '';
    const unit = item ? (ta ? (item.unitTa ?? item.unit) : item.unit) : '';
    contributionLabel = `${selection.units} × ${name} (${unit})`;
  } else {
    contributionLabel = t(lang, 'renovDonate.receipt.anyAmount');
  }

  const rows: { key: RewardKey; label: string; body: string }[] = [
    { key: 'certificate',  label: t(lang, 'renovDonate.rewards.certificate'),  body: t(lang, 'renovDonate.receipt.certificateBody') },
    { key: 'darshanPass',  label: t(lang, 'renovDonate.rewards.darshanPass'),  body: t(lang, 'renovDonate.receipt.darshanBody') },
    { key: 'namedArchana', label: t(lang, 'renovDonate.rewards.namedArchana'), body: t(lang, 'renovDonate.receipt.archanaBody') },
  ];

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-5 md:p-6">
      <div className="max-w-[540px] mx-auto">
        {/* Success crest */}
        <div className="text-center mb-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500 flex items-center justify-center mb-3">
            <Check className="w-7 h-7 text-white" />
          </div>
          <h3 className={cn('text-[18px] font-black text-neutral-900', taClass)}>{t(lang, 'renovDonate.receipt.title')}</h3>
          <p className={cn('text-[12px] text-neutral-500 mt-1', taClass)}>{t(lang, 'renovDonate.receipt.subtitle')}</p>
        </div>

        {/* Ticket body */}
        <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
          <div className="px-5 py-4 bg-neutral-50 border-b border-neutral-200">
            <p className={cn('text-[10px] font-bold text-neutral-500 uppercase tracking-wide', taClass)}>{t(lang, 'renovDonate.receipt.reference')}</p>
            <p className="text-[15px] font-black text-neutral-900 tracking-tight mt-0.5">{reference}</p>
          </div>
          <div className="px-5 py-4 space-y-3">
            <ReceiptRow icon={<Landmark className="w-4 h-4" />} label={t(lang, 'renovDonate.receipt.project')} value={templeName} taClass={taClass} />
            <ReceiptRow label={t(lang, 'renovDonate.receipt.contribution')} value={contributionLabel} taClass={taClass} />
            <ReceiptRow label={t(lang, 'renovDonate.receipt.amount')} value={<span className="text-[16px] font-black text-neutral-900">{formatInrShort(amount)}</span>} taClass={taClass} />
          </div>

          {/* Rewards block */}
          <div className="px-5 py-4 border-t border-neutral-100 bg-amber-50/40">
            <div className="flex items-center gap-1.5 mb-2">
              <Award className="w-3.5 h-3.5 text-amber-700" />
              <p className={cn('text-[11px] font-bold text-amber-800 uppercase tracking-wide', taClass)}>
                {t(lang, 'renovDonate.receipt.rewardsTitle')}
              </p>
            </div>
            <p className={cn('text-[11px] text-neutral-500 mb-3', taClass)}>{t(lang, 'renovDonate.receipt.deliveryNote')}</p>
            <ul className="space-y-2">
              {rows.map((r) => {
                const on = unlockedKeys.has(r.key);
                return (
                  <li key={r.key} className={cn('flex items-start gap-2', !on && 'opacity-50')}>
                    <span className={cn('w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5', on ? 'bg-emerald-500 text-white' : 'bg-neutral-200 text-neutral-400')}>
                      {on ? <Check className="w-3 h-3" /> : <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-[13px] font-bold', on ? 'text-neutral-900' : 'text-neutral-500', taClass)}>{r.label}</p>
                      <p className={cn('text-[11px] text-neutral-500 leading-snug', taClass)}>{r.body}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <button
          onClick={onClose}
          className={cn('mt-4 w-full py-3 rounded-xl bg-[--color-btn-primary-bg] text-white text-[14px] font-bold hover:opacity-90 transition-opacity', taClass)}
        >
          {t(lang, 'renovDonate.receipt.done')}
        </button>
      </div>
    </div>
  );
}

function ReceiptRow({ icon, label, value, taClass }: { icon?: React.ReactNode; label: string; value: React.ReactNode; taClass: string }) {
  return (
    <div className="flex items-baseline gap-2">
      {icon && <span className="text-neutral-400 flex-shrink-0">{icon}</span>}
      <p className={cn('text-[11px] text-neutral-500 uppercase font-semibold tracking-wide flex-shrink-0', taClass)}>{label}</p>
      <div className={cn('flex-1 min-w-0 text-right text-[13px] font-semibold text-neutral-900 truncate', taClass)}>{value}</div>
    </div>
  );
}

// ── Contact field for renovation modal ───────────────────────────────────────
function RenovContactField({
  label, value, onChange, placeholder, type, taClass,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder: string; type: string; taClass: string;
}) {
  return (
    <div className="flex items-center gap-3 bg-white border border-neutral-200 rounded-xl focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 px-3 py-2.5 transition-all">
      <label className={cn('text-[10px] font-bold uppercase tracking-wider text-neutral-400 w-[56px] flex-shrink-0', taClass)}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 min-w-0 bg-transparent text-[13px] font-medium text-neutral-900 outline-none placeholder:text-neutral-400"
      />
    </div>
  );
}
