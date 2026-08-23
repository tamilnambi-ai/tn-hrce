'use client';

/**
 * HomeBookingModal — single-column progressive booking modal.
 *
 * Layout (720px wide, up to 720px tall):
 *   1. Temple dropdown (always visible until chat starts)
 *   2. Pooja | Darshan toggle (revealed once temple is picked)
 *   3. Service list (revealed once a type is picked; Pooja = non-sannathi, Darshan = sannathi)
 *   4. Once a service is picked → temple/type/list all hide and a compact
 *      **context strip** takes their place: "{temple} · {Pooja|Darshan}" +
 *      a "← Change" back link. Chat fills the remaining space.
 *   5. Success → BookingTicket (same as temple-detail flow).
 */

import { useEffect, useMemo, useState } from 'react';
import { X, ChevronDown, Flame, HandHeart, TicketCheck, ChevronLeft, Landmark, Loader2 } from 'lucide-react';
import { useRazorpay } from '@/hooks/useRazorpay';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCity, CITIES } from '@/contexts/CityContext';
import { t } from '@/lib/i18n';
import { templesByCity, type Temple } from '@/data/temples';
import { poojaServicesForTemple, formatInr, type PoojaService } from '@/data/poojaServices';
import ChatShell from '@/components/chat/ChatShell';
import { useChatFlow } from '@/components/chat/useChatFlow';
import { buildPoojaFlow } from '@/components/temples/detail/PoojaBooking/poojaFlow';
import PoojaList from '@/components/temples/detail/PoojaBooking/PoojaList';
import BookingTicket from '@/components/temples/detail/PoojaBooking/BookingTicket';
import { cn } from '@/lib/utils';

type BookKind = 'pooja' | 'darshan';

export default function HomeBookingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang } = useLanguage();
  const { city } = useCity();
  const ta = lang === 'ta';
  const taClass = ta ? 'ta-text' : '';
  const cityName = ta ? city.nameTa : city.name;

  const templeList = useMemo(() => templesByCity(city.id, 50), [city.id]);
  const { openCheckout, paying } = useRazorpay();

  const [templeId,     setTempleId]     = useState<string | null>(null);
  const [kind,         setKind]         = useState<BookKind | null>(null);
  const [selectedId,   setSelectedId]   = useState<string | null>(null);
  const [reference,    setReference]    = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const temple: Temple | null =
    templeId ? templeList.find((tp) => tp.id === templeId) ?? null : null;
  const services = useMemo(
    () => (temple ? poojaServicesForTemple(temple.id) : []),
    [temple]
  );
  const poojaServices    = useMemo(() => services.filter((s) => s.group !== 'sannathi'), [services]);
  const darshanServices  = useMemo(() => services.filter((s) => s.group === 'sannathi'), [services]);
  const activeList       = kind === 'darshan' ? darshanServices : poojaServices;
  const selected: PoojaService | null =
    selectedId ? services.find((s) => s.id === selectedId) ?? null : null;

  // Reset selection when temple/kind changes
  useEffect(() => { setKind(null); setSelectedId(null); setReference(null); setPaymentError(null); }, [templeId]);
  useEffect(() => { setSelectedId(null); setReference(null); setPaymentError(null); }, [kind]);

  // Full reset when modal closes
  useEffect(() => {
    if (!open) {
      setTempleId(null); setKind(null); setSelectedId(null); setReference(null); setPaymentError(null);
    }
  }, [open]);

  // Body scroll lock + Esc
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  // Chat flow — only when a service is selected
  const turns = useMemo(() => {
    if (!selected || !temple) return [];
    const cityMeta = CITIES.find((c) => c.id === temple.city);
    const cName = cityMeta ? (ta ? cityMeta.nameTa : cityMeta.name) : temple.city;
    return buildPoojaFlow({
      service: selected, lang, templeCity: cName,
      onRequestPayment: (amount) => { void handlePayment(amount); },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, lang, temple, ta]);
  const flow = useChatFlow({ turns });

  // Payment handler
  async function handlePayment(amount: number) {
    if (!selected || !temple) return;
    setPaymentError(null);
    const answers = flow.answers as {
      devoteeName?: string;
      contact?:     { mobile: string; email: string };
      date?:        string;
      slot?:        { id: string; timeLabel: string };
      count?:       { adults: number; kids: number; amount: number };
    };
    const contact  = answers.contact;
    const isGroup  = selected.group === 'sannathi';
    const dateStr  = answers.date
      ? new Date(answers.date).toLocaleDateString('en-IN', {
          weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
        })
      : '—';
    const passesValue = answers.count
      ? `${answers.count.adults + answers.count.kids} · ${answers.count.adults} adults${answers.count.kids ? ` · ${answers.count.kids} kids` : ''}`
      : undefined;

    const result = await openCheckout({
      amount,
      description: `${isGroup ? 'Darshan' : 'Pooja'} — ${ta ? (temple.nameTa ?? temple.name) : temple.name}`,
      prefill: {
        name:    answers.devoteeName ?? '',
        email:   contact?.email     ?? '',
        contact: contact?.mobile    ?? '',
      },
      meta: {
        type:        'booking',
        email:       contact?.email ?? '',
        isGroup:     isGroup ? 'true' : 'false',
        templeName:  ta ? (temple.nameTa ?? temple.name) : temple.name,
        poojaName:   ta ? (selected.nameTa ?? selected.name) : selected.name,
        devoteeName: answers.devoteeName ?? '',
        dateValue:   dateStr,
        timeValue:   answers.slot?.timeLabel,
        passesValue,
        amountValue: formatInr(amount),
      },
    });

    if (result.success && result.referenceId) {
      setReference(result.referenceId);
    } else if (result.error && result.error !== 'cancelled') {
      setPaymentError(ta ? 'பணம் செலுத்துவதில் பிழை. மீண்டும் முயற்சிக்கவும்.' : 'Payment failed. Please try again.');
    }
  }

  if (!open) return null;

  const templeName = temple ? (ta ? (temple.nameTa ?? temple.name) : temple.name) : '';
  const chatActive = !!selected;                // once a service is picked → chat mode
  const showTicket = chatActive && !!reference;

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-[95] flex items-center justify-center p-2 md:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-[#ffefe0] rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.35)] w-full max-w-[720px] h-[92vh] md:h-[720px] flex flex-col overflow-hidden">
        <button
          onClick={onClose}
          aria-label={t(lang, 'bookPooja.closeModal')}
          className="absolute top-2.5 right-2.5 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-[--color-site-name] transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Header */}
        <div className="px-5 pt-4 pb-3 border-b border-neutral-100 flex-shrink-0">
          <div className="flex items-center gap-2 mb-0.5">
            <TicketCheck className="w-3.5 h-3.5 text-[--color-site-name]" />
            <p className={cn('text-[10px] font-bold text-[--color-site-name] uppercase tracking-wide', taClass)}>
              {t(lang, 'homeBook.eyebrow')}
            </p>
          </div>
          <h2 className={cn('text-[16px] md:text-[17px] font-bold text-neutral-900 pr-8 leading-snug', taClass)}>
            {t(lang, 'bookPooja.modalTitle')}
          </h2>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 flex flex-col">
          {showTicket && temple && selected ? (
            <TicketView
              flow={flow} lang={lang} ta={ta} temple={temple} templeName={templeName}
              selected={selected} reference={reference!} onClose={onClose}
            />
          ) : paying ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8">
              <Loader2 className="w-8 h-8 text-[--color-site-name] animate-spin" />
              <p className={cn('text-[13px] text-[--color-text-secondary]', taClass)}>
                {ta ? 'பணம் செலுத்துகிறது…' : 'Processing payment…'}
              </p>
            </div>
          ) : chatActive && temple && selected ? (
            <>
              <ContextStrip
                templeName={templeName}
                kindLabel={t(lang, kind === 'darshan' ? 'homeBook.darshan' : 'homeBook.pooja')}
                serviceName={ta ? (selected.nameTa ?? selected.name) : selected.name}
                onChange={() => setSelectedId(null)}
                changeLabel={t(lang, 'homeBook.changeSelection')}
                taClass={taClass}
              />
              {paymentError && (
                <div className="mx-4 mt-3 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200">
                  <p className={cn('text-[12px] font-semibold text-red-700', taClass)}>{paymentError}</p>
                </div>
              )}
              <div className="flex-1 min-h-0">
                <ChatShell
                  posted={flow.posted}
                  currentTurn={flow.currentTurn}
                  onSubmit={flow.advance}
                  onSkip={flow.skip}
                  totalTurns={turns.length}
                  currentIndex={flow.index}
                  isComplete={flow.isComplete}
                  bilingualClass={taClass}
                  progressLabel={t(lang, 'bookPooja.progress', {
                    n: Math.min(flow.index + 1, turns.length),
                    total: turns.length,
                  })}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-4 pb-4 space-y-4">
              {/* Temple dropdown */}
              <div className="relative">
                <select
                  value={templeId ?? ''}
                  onChange={(e) => setTempleId(e.target.value)}
                  className={cn(
                    'w-full appearance-none rounded-lg border border-neutral-300 bg-[#ffefe0]',
                    'px-3 py-2.5 pr-9 text-[14px] font-semibold text-neutral-900',
                    'focus:outline-none focus:ring-2 focus:ring-[--color-site-name]/30 focus:border-[--color-site-name]',
                    taClass
                  )}
                >
                  <option value="" disabled>{t(lang, 'homeBook.templePlaceholder')} — {cityName}</option>
                  {templeList.map((tp) => {
                    const available = poojaServicesForTemple(tp.id).length > 0;
                    const name = ta ? (tp.nameTa ?? tp.name) : tp.name;
                    return (
                      <option key={tp.id} value={tp.id} disabled={!available}>
                        {name} {available ? '' : `— ${t(lang, 'homeBook.comingSoon')}`}
                      </option>
                    );
                  })}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              </div>

              {/* Type toggle */}
              {temple && (
                <TypeToggle kind={kind} onChange={setKind} ta={ta} lang={lang} />
              )}

              {/* Service list — only shown when type is picked */}
              {temple && kind && (
                activeList.length > 0 ? (
                  <div className="border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50/40">
                    <PoojaList
                      services={activeList}
                      selectedId={selectedId}
                      onSelect={setSelectedId}
                    />
                  </div>
                ) : (
                  <PaneMessage taClass={taClass} text={t(lang, 'bookPooja.noServices')} />
                )
              )}

              {/* Empty guidance */}
              {!temple && (
                <PromptCard
                  taClass={taClass}
                  icon={<Landmark className="w-6 h-6 text-[--color-site-name]" />}
                  title={t(lang, 'homeBook.emptyTempleTitle')}
                  body={t(lang, 'homeBook.emptyTempleBody')}
                />
              )}
              {temple && !kind && (
                <PromptCard
                  taClass={taClass}
                  icon={<Flame className="w-6 h-6 text-[--color-site-name]" />}
                  title={templeName}
                  body={t(lang, 'homeBook.emptyTypeBody')}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Type toggle ──────────────────────────────────────────────────────────────
function TypeToggle({
  kind, onChange, ta, lang,
}: { kind: BookKind | null; onChange: (k: BookKind) => void; ta: boolean; lang: 'en' | 'ta' }) {
  const taClass = ta ? 'ta-text' : '';
  const btn = (active: boolean) => cn(
    'flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-colors',
    active
      ? 'bg-[--color-site-name] text-white'
      : 'bg-[#ffefe0] text-neutral-700 border border-neutral-200 hover:border-neutral-300'
  );
  return (
    <div className="flex gap-2">
      <button type="button" onClick={() => onChange('pooja')} className={btn(kind === 'pooja')}>
        <Flame className="w-4 h-4" />
        <span className={taClass}>{t(lang, 'homeBook.pooja')}</span>
      </button>
      <button type="button" onClick={() => onChange('darshan')} className={btn(kind === 'darshan')}>
        <HandHeart className="w-4 h-4" />
        <span className={taClass}>{t(lang, 'homeBook.darshan')}</span>
      </button>
    </div>
  );
}

// ── Context strip (shown once chat is active) ────────────────────────────────
function ContextStrip({
  templeName, kindLabel, serviceName, onChange, changeLabel, taClass,
}: {
  templeName: string; kindLabel: string; serviceName: string;
  onChange: () => void; changeLabel: string; taClass: string;
}) {
  return (
    <div className="flex items-center gap-2 px-5 py-2.5 border-b border-neutral-100 bg-neutral-50/60 flex-shrink-0">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
      <p className={cn('flex-1 min-w-0 text-[12px] font-semibold text-neutral-700 truncate', taClass)}>
        <span className="text-neutral-900 font-bold">{templeName}</span>
        <span className="text-neutral-400"> · </span>
        <span>{kindLabel}</span>
        <span className="text-neutral-400"> · </span>
        <span className="text-neutral-500 font-medium">{serviceName}</span>
      </p>
      <button
        type="button"
        onClick={onChange}
        className={cn('inline-flex items-center gap-1 text-[12px] font-semibold text-[--color-site-name] hover:underline flex-shrink-0', taClass)}
      >
        <ChevronLeft className="w-3 h-3" />
        {changeLabel}
      </button>
    </div>
  );
}

// ── Small helpers ────────────────────────────────────────────────────────────
function PromptCard({ taClass, icon, title, body }: { taClass: string; icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-6 text-center flex flex-col items-center">
      <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-2">
        {icon}
      </div>
      <p className={cn('text-[14px] font-bold text-neutral-900', taClass)}>{title}</p>
      <p className={cn('text-[12px] text-neutral-500 mt-1 max-w-[320px]', taClass)}>{body}</p>
    </div>
  );
}

function PaneMessage({ taClass, text }: { taClass: string; text: string }) {
  return (
    <div className={cn('rounded-xl border border-neutral-200 bg-neutral-50 p-6 text-center text-[13px] text-neutral-500', taClass)}>
      {text}
    </div>
  );
}

// ── Success ticket ───────────────────────────────────────────────────────────
function TicketView({
  flow, lang, ta, temple, templeName, selected, reference, onClose,
}: {
  flow: ReturnType<typeof useChatFlow>;
  lang: 'en' | 'ta'; ta: boolean;
  temple: Temple; templeName: string; selected: PoojaService;
  reference: string; onClose: () => void;
}) {
  const answers = flow.answers as {
    date?: string; devoteeName?: string;
    slot?: { id: string; timeLabel: string };
    count?: { adults: number; kids: number; amount: number };
  };
  const dateVal = answers.date
    ? new Date(answers.date).toLocaleDateString('en-IN', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
      })
    : '—';
  const amount = answers.count ? answers.count.amount : selected.price;
  const passesVal = answers.count
    ? `${answers.count.adults + answers.count.kids} · ${answers.count.adults} ${t(lang, 'bookPooja.countAdults')}${answers.count.kids ? ` · ${answers.count.kids} ${t(lang, 'bookPooja.countKids')}` : ''}`
    : undefined;
  const bookedAt = new Date().toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  });
  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 flex items-start justify-center">
      <BookingTicket
        ta={ta}
        templeName={templeName}
        reference={`${t(lang, 'bookPooja.referencePrefix')}: ${reference}`}
        poojaLabel={t(lang, 'bookPooja.ticket.pooja')}
        poojaName={ta ? (selected.nameTa ?? selected.name) : selected.name}
        dateLabel={t(lang, 'bookPooja.ticket.date')}
        dateValue={dateVal}
        timeLabel={answers.slot ? t(lang, 'bookPooja.ticket.time') : undefined}
        timeValue={answers.slot?.timeLabel}
        devoteeLabel={t(lang, 'bookPooja.ticket.devotee')}
        devoteeName={answers.devoteeName ?? '—'}
        passesLabel={passesVal ? t(lang, 'bookPooja.ticket.passes') : undefined}
        passesValue={passesVal}
        amountLabel={t(lang, 'bookPooja.ticket.amount')}
        amountValue={formatInr(amount)}
        bookedLabel={t(lang, 'bookPooja.ticket.booked')}
        bookedValue={bookedAt}
        qrHint={t(lang, 'bookPooja.ticket.qrHint')}
        sealLabel={t(lang, 'bookPooja.ticket.seal')}
        title={t(lang, 'bookPooja.ticket.title')}
        subtitle={t(lang, 'bookPooja.ticket.subtitle')}
        actions={{
          print:    t(lang, 'bookPooja.ticket.print'),
          download: t(lang, 'bookPooja.ticket.download'),
          share:    t(lang, 'bookPooja.ticket.share'),
        }}
        toastMessage={t(lang, 'bookPooja.ticket.actionsToast')}
        onClose={onClose}
        closeLabel={t(lang, 'bookPooja.closeModal')}
      />
    </div>
  );
}
