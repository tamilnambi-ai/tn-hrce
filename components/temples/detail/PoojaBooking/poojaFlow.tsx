'use client';

/**
 * Builds the 8-turn conversation flow for a given pooja service.
 * Uses the generic chat controls; nothing in here is chat-runtime-specific.
 */

import React from 'react';
import { t, type Language } from '@/lib/i18n';
import { formatInr, slotsForDate, type PoojaService, type TimeSlot } from '@/data/poojaServices';
import type { ChatTurn } from '@/components/chat/types';
import {
  DateChips,
  ChipsPicker,
  TextInputBubble,
  MultiFieldInput,
  SummaryCard,
  PrimaryCtaButton,
  CountBreakdown,
  TimeSlotPicker,
} from '@/components/chat/controls';
import WelcomeCard from './WelcomeCard';
import RulesBlock  from './RulesBlock';

function formatDateRange(fromIso: string, toIso: string): string {
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  const f = new Date(fromIso).toLocaleDateString('en-IN', opts);
  const t = new Date(toIso).toLocaleDateString('en-IN', opts);
  return `${f} – ${t}`;
}

// Build a list of ISO dates between two ISO dates
function dateRange(fromIso: string, toIso: string): string[] {
  const out: string[] = [];
  const cur = new Date(fromIso);
  const end = new Date(toIso);
  while (cur <= end) {
    out.push(cur.toISOString().slice(0, 10));
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

function mask(v: string, keep = 4): string {
  if (!v) return v;
  if (v.length <= keep) return v;
  return '•'.repeat(v.length - keep) + v.slice(-keep);
}

export function buildPoojaFlow({
  service,
  lang,
  templeCity,
  onFinish,
}: {
  service: PoojaService;
  lang: Language;
  templeCity: string;   // e.g. "Chennai"
  onFinish: (referenceId: string) => void;
}): ChatTurn[] {
  const ta = lang === 'ta';
  const taClass = ta ? 'ta-text' : '';
  const price   = formatInr(service.price);
  const name    = ta ? (service.nameTa ?? service.name) : service.name;
  const dates   = dateRange(service.dateFrom, service.dateTo);
  const isGroupBooking = service.group === 'sannathi';   // group entry — ask count instead of gender

  const answers: {
    date?: string;
    slot?: { id: string; timeLabel: string };
    count?: { adults: number; kids: number; amount: number };
    devoteeName?: string;
    gender?: string;
    contact?: { mobile: string; email: string };
    proof?: { type: string; number: string };
    address?: { door: string; village: string; pin: string };
  } = {};

  return [
    // 1) Welcome — hero card with prominent Get Started CTA
    {
      id: 'confirm-pick',
      hero: true,
      message: (
        <WelcomeCard
          ta={ta}
          serviceName={name}
          priceLabel={price}
          dateRangeLabel={formatDateRange(service.dateFrom, service.dateTo)}
          namasteLabel={{
            primary:   ta ? t(lang, 'bookPooja.welcomeGreeting') : 'வணக்கம்',
            secondary: ta ? 'Namaste' : t(lang, 'bookPooja.welcomeGreeting'),
          }}
          headline={t(lang, 'bookPooja.welcomeHeadline', { name })}
          subline={t(lang, 'bookPooja.welcomeSubline')}
        />
      ),
      renderInput: ({ onSubmit }) => (
        <div className="mt-3">
          <PrimaryCtaButton
            bilingualClass={taClass}
            label={t(lang, 'bookPooja.getStarted')}
            onClick={() => onSubmit('started', t(lang, 'bookPooja.getStarted'))}
          />
        </div>
      ),
    },

    // 2) Date — first 6 chips + 7th "Pick a date" picker
    {
      id: 'date',
      message: t(lang, 'bookPooja.askDate'),
      renderInput: ({ onSubmit }) => (
        <DateChips
          dates={dates}
          pickerLabel={t(lang, 'bookPooja.pickAnotherDate')}
          onPick={(iso, echo) => { answers.date = iso; onSubmit(iso, echo); }}
        />
      ),
    },

    // 3a) Group booking (Sannathi Special Entrance) — timing slot selection
    //     Static data; slots depend on the chosen date. Uses answers.date
    //     which is set at render time (the turn only builds after date is picked).
    ...(isGroupBooking ? [{
      id: 'slot',
      message: t(lang, 'bookPooja.askSlot'),
      renderInput: ({ onSubmit }) => {
        const slots: TimeSlot[] = answers.date ? slotsForDate(answers.date) : [];
        return (
          <TimeSlotPicker
            bilingualClass={taClass}
            slots={slots}
            labels={{
              seatsLeft:  (n) => t(lang, 'bookPooja.slotSeatsLeft',  { n }),
              filled:     (n) => t(lang, 'bookPooja.slotFilled',     { n }),
              full:       t(lang, 'bookPooja.slotFull'),
              totalAvail: (left, total) => t(lang, 'bookPooja.slotTotalAvail', { n: left, total }),
              entryAt:    (time) => t(lang, 'bookPooja.slotEntryAt', { time }),
            }}
            onPick={(id, echo) => {
              const s = slots.find((x) => x.id === id);
              if (s) answers.slot = { id: s.id, timeLabel: s.timeLabel };
              onSubmit(id, echo);
            }}
          />
        );
      },
    } as ChatTurn] : []),

    // 3b) Group booking (Sannathi Special Entrance) — count breakdown
    ...(isGroupBooking ? [{
      id: 'count',
      message: t(lang, 'bookPooja.askCount'),
      renderInput: ({ onSubmit }) => {
        const passesLabel = (n: number) => t(
          lang,
          n === 1 ? 'bookPooja.passesLabel' : 'bookPooja.passesLabelPlural',
          { count: n }
        );
        return (
          <CountBreakdown
            bilingualClass={taClass}
            pricePerAdult={service.price}
            maxTotal={10}
            labels={{
              adults:         t(lang, 'bookPooja.countAdults'),
              kids:           t(lang, 'bookPooja.countKids'),
              kidsHint:       t(lang, 'bookPooja.kidsHint'),
              maxHint:        t(lang, 'bookPooja.groupMaxHint'),
              total:          t(lang, 'bookPooja.groupTotal'),
              needsAdult:     t(lang, 'bookPooja.needsAdult'),
              passesLabel,
              submit:         t(lang, 'bookPooja.continueLabel'),
              formatCurrency: (n) => formatInr(n),
            }}
            onSubmit={(v, echo) => { answers.count = v; onSubmit(v, echo); }}
          />
        );
      },
    } as ChatTurn] : []),

    // 3) Name
    {
      id: 'name',
      message: t(lang, 'bookPooja.askName'),
      renderInput: ({ onSubmit }) => (
        <TextInputBubble
          placeholder={t(lang, 'bookPooja.fields.name')}
          bilingualClass={taClass}
          onSubmit={(v, echo) => { answers.devoteeName = v; onSubmit(v, echo); }}
        />
      ),
    },

    // 4) Gender — skipped for group Sannathi Special Entrance bookings
    ...(!isGroupBooking ? [{
      id: 'gender',
      message: t(lang, 'bookPooja.askGender'),
      renderInput: ({ onSubmit }) => (
        <ChipsPicker
          options={[
            { key: 'male',   label: t(lang, 'bookPooja.genderMale')   },
            { key: 'female', label: t(lang, 'bookPooja.genderFemale') },
            { key: 'other',  label: t(lang, 'bookPooja.genderOther')  },
          ]}
          onPick={(k, echo) => { answers.gender = k; onSubmit(k, echo); }}
        />
      ),
    } as ChatTurn] : []),

    // 5) Contact (mobile + email)
    {
      id: 'contact',
      message: t(lang, 'bookPooja.askContact'),
      renderInput: ({ onSubmit }) => (
        <MultiFieldInput
          bilingualClass={taClass}
          submitLabel={t(lang, 'bookPooja.confirmPay', { amount: '' }).replace(/{amount}/g, '').trim() || 'Send'}
          fields={[
            { key: 'mobile', label: t(lang, 'bookPooja.fields.mobile'), placeholder: '+91 …', type: 'tel',   required: true },
            { key: 'email',  label: t(lang, 'bookPooja.fields.email'),  placeholder: 'name@example.com', type: 'email', required: true },
          ]}
          onSubmit={(v, echo) => {
            answers.contact = { mobile: v.mobile, email: v.email };
            onSubmit(v, echo);
          }}
        />
      ),
    },

    // 6) ID proof
    {
      id: 'proof',
      message: t(lang, 'bookPooja.askProof'),
      renderInput: ({ onSubmit }) => {
        return (
          <IdProofControl
            lang={lang}
            onSubmit={(v, echo) => { answers.proof = v; onSubmit(v, echo); }}
          />
        );
      },
    },

    // 7) Address — silent auto-fill + editable door/village/pin
    {
      id: 'address',
      message: t(lang, 'bookPooja.askAddress'),
      optional: true,
      renderInput: ({ onSubmit }) => (
        <div className="max-w-[420px]">
          <div className={`flex flex-wrap gap-1 mb-2`}>
            <AutoChip label={ta ? 'இந்தியா' : 'India'} />
            <AutoChip label={ta ? 'தமிழ்நாடு' : 'Tamil Nadu'} />
            <AutoChip label={templeCity} />
          </div>
          <MultiFieldInput
            bilingualClass={taClass}
            fields={[
              { key: 'door',    label: t(lang, 'bookPooja.fields.door'),    placeholder: '12/3A' },
              { key: 'village', label: t(lang, 'bookPooja.fields.village'), placeholder: 'Mylapore' },
              { key: 'pin',     label: t(lang, 'bookPooja.fields.pin'),     placeholder: '600004', type: 'tel' },
            ]}
            onSubmit={(v, echo) => {
              answers.address = { door: v.door, village: v.village, pin: v.pin };
              onSubmit(v, echo || (ta ? '— முகவரி பதிவு செய்யப்பட்டது —' : '— address saved —'));
            }}
          />
        </div>
      ),
    },

    // Review + Confirm — total amount depends on whether this is a group booking
    {
      id: 'review',
      message: t(lang, 'bookPooja.askReview'),
      renderInput: ({ onSubmit }) => {
        const finalAmount = answers.count ? answers.count.amount : service.price;
        const finalAmountLabel = formatInr(finalAmount);
        const rows = buildSummaryRows({ lang, service, answers, ta });
        return (
          <SummaryCard
            bilingualClass={taClass}
            title={t(lang, 'bookPooja.summary.title')}
            rows={rows}
            amountLabel={t(lang, 'bookPooja.summary.amount')}
            amountValue={finalAmountLabel}
            acceptLabel={t(lang, 'bookPooja.accept')}
            ctaLabel={t(lang, 'bookPooja.confirmPay', { amount: finalAmountLabel })}
            extras={(
              <RulesBlock
                ta={ta}
                heading={t(lang, 'bookPooja.rulesHeading')}
                collapseLabel={t(lang, 'bookPooja.rulesCollapse')}
                expandLabel={t(lang, 'bookPooja.rulesExpand')}
                bilingualClass={taClass}
              />
            )}
            onConfirm={() => {
              const ref = generateRef();
              onSubmit({ confirmed: true, ref }, ta ? '— உறுதி செய்யப்பட்டது —' : '— confirmed —');
              onFinish(ref);
            }}
          />
        );
      },
      terminal: true,
    },
  ];
}

function AutoChip({ label }: { label: string }) {
  return (
    <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-100 rounded-full px-2 py-0.5">
      {label}
    </span>
  );
}

// ── ID proof control (proof type dropdown + number input) ────────────────────
function IdProofControl({
  lang,
  onSubmit,
}: {
  lang: Language;
  onSubmit: (v: { type: string; number: string }, echo: string) => void;
}) {
  const ta = lang === 'ta';
  const taClass = ta ? 'ta-text' : '';
  const proofOptions = [
    { key: 'aadhaar',  label: t(lang, 'bookPooja.proofTypes.aadhaar')  },
    { key: 'pan',      label: t(lang, 'bookPooja.proofTypes.pan')      },
    { key: 'voter',    label: t(lang, 'bookPooja.proofTypes.voter')    },
    { key: 'driving',  label: t(lang, 'bookPooja.proofTypes.driving')  },
    { key: 'passport', label: t(lang, 'bookPooja.proofTypes.passport') },
  ];

  return (
    <MultiFieldInputWithSelect
      lang={lang}
      typeOptions={proofOptions}
      bilingualClass={taClass}
      onSubmit={onSubmit}
    />
  );
}

function MultiFieldInputWithSelect({
  lang,
  typeOptions,
  bilingualClass,
  onSubmit,
}: {
  lang: Language;
  typeOptions: { key: string; label: string }[];
  bilingualClass?: string;
  onSubmit: (v: { type: string; number: string }, echo: string) => void;
}) {
  const ta = lang === 'ta';
  const [type, setType] = React.useState(typeOptions[0].key);
  const [num,  setNum]  = React.useState('');
  const canSubmit = num.trim().length >= 4;
  const typeLabel = typeOptions.find((o) => o.key === type)?.label ?? type;

  function commit() {
    if (!canSubmit) return;
    const cleanNum = num.trim();
    const echo = `${typeLabel} · ${'•'.repeat(Math.max(0, cleanNum.length - 4)) + cleanNum.slice(-4)}`;
    onSubmit({ type, number: cleanNum }, echo);
  }

  return (
    <div className="space-y-2 max-w-[420px]">
      <div className="flex items-center gap-2 bg-white border border-[--color-border] rounded-xl px-3 py-2">
        <label className={`text-[11px] font-bold uppercase tracking-wider text-[--color-text-secondary] w-[76px] flex-shrink-0 ${bilingualClass ?? ''}`}>
          {ta ? 'வகை' : 'Type'}
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={`flex-1 min-w-0 bg-transparent text-[13px] text-[--color-text-primary] outline-none font-medium ${bilingualClass ?? ''}`}
        >
          {typeOptions.map((o) => (<option key={o.key} value={o.key}>{o.label}</option>))}
        </select>
      </div>
      <div className="flex items-center gap-2 bg-white border border-[--color-border] rounded-xl focus-within:border-[--color-site-name] focus-within:ring-2 focus-within:ring-red-100 transition-all px-3 py-2">
        <label className={`text-[11px] font-bold uppercase tracking-wider text-[--color-text-secondary] w-[76px] flex-shrink-0 ${bilingualClass ?? ''}`}>
          {t(lang, 'bookPooja.fields.proofNum')}
        </label>
        <input
          value={num}
          onChange={(e) => setNum(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') commit(); }}
          placeholder="XXXX XXXX 1234"
          className="flex-1 min-w-0 bg-transparent text-[13px] text-[--color-text-primary] outline-none font-medium"
        />
      </div>
      <button
        onClick={commit}
        disabled={!canSubmit}
        className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[13px] font-bold transition-colors ${canSubmit ? 'bg-[--color-site-name] hover:bg-[--color-btn-primary-hover] text-white' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'} ${bilingualClass ?? ''}`}
      >
        {ta ? 'சமர்ப்பி' : 'Send'}
      </button>
    </div>
  );
}
// ── Summary row builder ──────────────────────────────────────────────────────
function buildSummaryRows({
  lang, service, answers, ta,
}: {
  lang: Language;
  service: PoojaService;
  answers: {
    date?: string; devoteeName?: string; gender?: string;
    contact?: { mobile: string; email: string };
    proof?: { type: string; number: string };
    address?: { door: string; village: string; pin: string };
    slot?: { id: string; timeLabel: string };
    count?: { adults: number; kids: number; amount: number };
  };
  ta: boolean;
}) {
  const rows: { key: string; label: string; value: string }[] = [];
  rows.push({ key: 'pooja',   label: t(lang, 'bookPooja.summary.pooja'),   value: ta ? (service.nameTa ?? service.name) : service.name });
  if (answers.date) {
    const d = new Date(answers.date);
    rows.push({ key: 'date',  label: t(lang, 'bookPooja.summary.date'),    value: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) });
  }
  if (answers.slot) {
    rows.push({ key: 'time', label: t(lang, 'bookPooja.ticket.time'), value: answers.slot.timeLabel });
  }
  if (answers.count) {
    const { adults, kids } = answers.count;
    const parts: string[] = [`${adults} ${t(lang, 'bookPooja.countAdults')}`];
    if (kids > 0) parts.push(`${kids} ${t(lang, 'bookPooja.countKids')}`);
    rows.push({
      key: 'passes',
      label: t(lang, 'bookPooja.passesLabelPlural', { count: adults + kids }).replace(/[0-9]+/, '').trim() || t(lang, 'bookPooja.groupTotal'),
      value: parts.join(' · '),
    });
  }
  if (answers.devoteeName) {
    const genderLabel = answers.gender
      ? ' · ' + t(lang, `bookPooja.gender${answers.gender.charAt(0).toUpperCase()}${answers.gender.slice(1)}` as never)
      : '';
    rows.push({ key: 'devotee', label: t(lang, 'bookPooja.summary.devotee'), value: answers.devoteeName + genderLabel });
  }
  if (answers.contact) {
    rows.push({ key: 'contact', label: t(lang, 'bookPooja.summary.contact'), value: `${answers.contact.mobile} · ${answers.contact.email}` });
  }
  if (answers.proof) {
    const num = answers.proof.number;
    const masked = num.length > 4 ? '•'.repeat(num.length - 4) + num.slice(-4) : num;
    const typeLabel = t(lang, `bookPooja.proofTypes.${answers.proof.type}` as never);
    rows.push({ key: 'id', label: t(lang, 'bookPooja.summary.id'), value: `${typeLabel} · ${masked}` });
  }
  if (answers.address) {
    const parts = [answers.address.door, answers.address.village, answers.address.pin].filter(Boolean);
    if (parts.length) rows.push({ key: 'address', label: t(lang, 'bookPooja.summary.address'), value: parts.join(', ') });
  }
  return rows;
}

function generateRef() {
  const now = Date.now().toString(36).toUpperCase();
  return 'HRCE-' + now.slice(-8);
}
