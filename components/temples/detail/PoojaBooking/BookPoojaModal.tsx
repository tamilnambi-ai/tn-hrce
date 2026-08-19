'use client';

import { useEffect, useMemo, useState } from 'react';
import { X, Info, TicketCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CITIES } from '@/contexts/CityContext';
import { t } from '@/lib/i18n';
import { poojaServicesForTemple, type PoojaService } from '@/data/poojaServices';
import type { Temple } from '@/data/temples';
import ChatShell from '@/components/chat/ChatShell';
import { useChatFlow } from '@/components/chat/useChatFlow';
import { buildPoojaFlow } from './poojaFlow';
import PoojaList from './PoojaList';
import BookingTicket from './BookingTicket';
import { formatInr } from '@/data/poojaServices';
import { cn } from '@/lib/utils';

export default function BookPoojaModal({
  open,
  onClose,
  temple,
}: {
  open: boolean;
  onClose: () => void;
  temple: Temple;
}) {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const taClass = ta ? 'ta-text' : '';
  const services = useMemo(() => poojaServicesForTemple(temple.id), [temple.id]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected: PoojaService | null =
    selectedId ? services.find((s) => s.id === selectedId) ?? null : null;

  const [reference, setReference] = useState<string | null>(null);

  // Build the flow once per selected service
  const turns = useMemo(() => {
    if (!selected) return [];
    const cityMeta = CITIES.find((c) => c.id === temple.city);
    const cityName = cityMeta ? (ta ? cityMeta.nameTa : cityMeta.name) : temple.city;
    return buildPoojaFlow({
      service: selected,
      lang,
      templeCity: cityName,
      onFinish: (ref) => setReference(ref),
    });
  }, [selected, lang, temple.city, ta]);

  const flow = useChatFlow({ turns });

  // Reset when modal closes
  useEffect(() => {
    if (!open) {
      setSelectedId(null);
      setReference(null);
    }
  }, [open]);

  // Lock body scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Esc closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const templeName = ta ? (temple.nameTa ?? temple.name) : temple.name;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-pooja-title"
      className="fixed inset-0 z-[95] flex items-center justify-center p-2 md:p-4"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative flex flex-col md:flex-row w-full max-w-[1100px] h-[92vh] md:h-[720px]',
          'bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.35)] overflow-hidden'
        )}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label={t(lang, 'bookPooja.closeModal')}
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-[--color-site-name] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left pane — pooja list */}
        <div className="w-full md:w-[340px] flex-shrink-0 border-b md:border-b-0 md:border-r border-[--color-border] flex flex-col bg-neutral-50/50 max-h-[45vh] md:max-h-none">
          <div className="px-4 py-3 border-b border-[--color-border] flex items-center gap-2">
            <TicketCheck className="w-4 h-4 text-[--color-site-name]" />
            <h2 id="book-pooja-title" className={cn('text-[14px] font-bold text-[--color-text-primary]', taClass)}>
              {t(lang, 'bookPooja.modalTitle')}
            </h2>
          </div>
          {services.length > 0 ? (
            <PoojaList
              services={services}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          ) : (
            <div className={cn('flex-1 flex items-center justify-center text-center p-6 text-[13px] text-[--color-text-secondary]', taClass)}>
              {t(lang, 'bookPooja.noServices')}
            </div>
          )}
        </div>

        {/* Right pane — conversation */}
        <div className="flex-1 min-w-0 min-h-0 flex flex-col bg-white">
          {!selected ? (
            <EmptyRightPane taClass={taClass} label={t(lang, 'bookPooja.selectPoojaHint')} templeName={templeName} />
          ) : reference && selected ? (
            (() => {
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
            })()
          ) : (
            <ChatShell
              header={<HeaderStrip taClass={taClass} templeName={templeName} />}
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
          )}
        </div>
      </div>
    </div>
  );
}

function HeaderStrip({ taClass, templeName }: { taClass: string; templeName: string }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
      <p className={cn('text-[12px] font-semibold text-[--color-text-secondary] truncate', taClass)}>
        <span className="text-[--color-text-primary] font-bold">{templeName}</span>
      </p>
    </div>
  );
}

function EmptyRightPane({ taClass, label, templeName }: { taClass: string; label: string; templeName: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
        <Info className="w-6 h-6 text-[--color-site-name]" />
      </div>
      <p className={cn('text-[15px] font-bold text-[--color-text-primary]', taClass)}>{templeName}</p>
      <p className={cn('text-[13px] text-[--color-text-secondary] mt-1 max-w-[280px]', taClass)}>
        {label}
      </p>
    </div>
  );
}
