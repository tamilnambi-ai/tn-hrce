'use client';

/**
 * 5-turn conversation flow for the "Enter the Draw" free-pass entry.
 *   1) Welcome hero (live counter + odds)
 *   2) Name
 *   3) Contact (mobile + email)
 *   4) ID proof (Aadhaar / PAN / …)
 *   5) Review + Enter → success (ticket rendered outside the flow)
 *
 * Reuses generic chat controls; the shared `bookPooja.*` i18n strings are
 * borrowed for the field/prompt copy so we don't fork translations.
 */

import React from 'react';
import { t, type Language } from '@/lib/i18n';
import type { ChatTurn } from '@/components/chat/types';
import type { TempleAnnouncement } from '@/data/temples';
import {
  TextInputBubble,
  MultiFieldInput,
  SummaryCard,
  PrimaryCtaButton,
} from '@/components/chat/controls';
import DrawWelcomeCard from './DrawWelcomeCard';
import { drawStatsFor, generateEntryCode } from './drawStats';

export interface DrawAnswers {
  devoteeName?: string;
  contact?: { mobile: string; email: string };
  proof?:   { type: string; number: string };
}

export function buildDrawFlow({
  announcement,
  lang,
  onFinish,
}: {
  announcement: TempleAnnouncement;
  lang: Language;
  onFinish: (entryCode: string) => void;
}): { turns: ChatTurn[]; answers: DrawAnswers } {
  const ta = lang === 'ta';
  const taClass = ta ? 'ta-text' : '';
  const stats = drawStatsFor(announcement.id);
  const eventName = ta ? (announcement.titleTa ?? announcement.title) : announcement.title;
  const dateLabel = ta ? (announcement.dateTa   ?? announcement.date)  : announcement.date;

  const answers: DrawAnswers = {};

  const turns: ChatTurn[] = [
    // 1) Welcome hero
    {
      id: 'welcome',
      hero: true,
      message: (
        <DrawWelcomeCard
          ta={ta}
          eventName={eventName}
          eventEmoji={announcement.emoji}
          dateLabel={dateLabel}
          stats={stats}
          namasteLabel={{
            primary:   ta ? t(lang, 'bookPooja.welcomeGreeting') : 'வணக்கம்',
            secondary: ta ? 'Namaste' : t(lang, 'bookPooja.welcomeGreeting'),
          }}
          headline={ta
            ? `${eventName} — குலுக்கல் நுழைவு`
            : `Enter the ${eventName} draw`}
          subline={ta
            ? 'உங்கள் பெயர் மற்றும் ஆதார் விவரங்களை பதிவு செய்யுங்கள். வெற்றியாளர்கள் நிகழ்வுக்கு 48 மணி நேரம் முன் SMS மற்றும் மின்னஞ்சல் மூலம் தெரிவிக்கப்படுவார்கள்.'
            : 'Register your name and Aadhaar to enter. Winners will be notified by SMS and email 48 hours before the event. One entry per person.'}
          statLabels={{
            entries: ta ? 'இதுவரை பதிவு' : 'Entered so far',
            passes:  ta ? 'மொத்த அனுமதிகள்' : 'Passes',
            odds:    ta ? 'வெற்றி வாய்ப்பு' : 'Win chance',
          }}
        />
      ),
      renderInput: ({ onSubmit }) => (
        <div className="mt-3">
          <PrimaryCtaButton
            bilingualClass={taClass}
            label={ta ? 'குலுக்கலில் பங்கேற்க' : 'Enter the draw'}
            onClick={() => onSubmit('started', ta ? 'தொடங்குகிறேன்' : 'Let\'s go')}
          />
        </div>
      ),
    },

    // 2) Name
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

    // 3) Contact
    {
      id: 'contact',
      message: t(lang, 'bookPooja.askContact'),
      renderInput: ({ onSubmit }) => (
        <MultiFieldInput
          bilingualClass={taClass}
          submitLabel={ta ? 'சமர்ப்பி' : 'Send'}
          fields={[
            { key: 'mobile', label: t(lang, 'bookPooja.fields.mobile'), placeholder: '+91 …',            type: 'tel',   required: true },
            { key: 'email',  label: t(lang, 'bookPooja.fields.email'),  placeholder: 'name@example.com', type: 'email', required: true },
          ]}
          onSubmit={(v, echo) => {
            answers.contact = { mobile: v.mobile, email: v.email };
            onSubmit(v, echo);
          }}
        />
      ),
    },

    // 4) ID proof
    {
      id: 'proof',
      message: t(lang, 'bookPooja.askProof'),
      renderInput: ({ onSubmit }) => (
        <IdProofControl
          lang={lang}
          onSubmit={(v, echo) => { answers.proof = v; onSubmit(v, echo); }}
        />
      ),
    },

    // 5) Review + Enter (terminal)
    {
      id: 'review',
      message: ta
        ? 'உங்கள் நுழைவை உறுதி செய்யுங்கள்.'
        : 'Confirm your draw entry.',
      renderInput: ({ onSubmit }) => {
        const rows: { key: string; label: string; value: string }[] = [
          { key: 'event',   label: ta ? 'நிகழ்வு'   : 'Event',   value: eventName },
          { key: 'date',    label: ta ? 'தேதி'      : 'Draw for', value: dateLabel },
        ];
        if (answers.devoteeName) {
          rows.push({ key: 'name', label: t(lang, 'bookPooja.summary.devotee'), value: answers.devoteeName });
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
        return (
          <SummaryCard
            bilingualClass={taClass}
            title={ta ? 'நுழைவு சுருக்கம்' : 'Entry summary'}
            rows={rows}
            amountLabel={ta ? 'கட்டணம்' : 'Entry fee'}
            amountValue={ta ? 'இலவசம்' : 'Free'}
            acceptLabel={ta
              ? 'மேலே உள்ள விவரங்கள் சரியானவை என உறுதி செய்கிறேன்.'
              : 'I confirm the details above are correct.'}
            ctaLabel={ta ? 'குலுக்கலில் பங்கேற்க' : 'Enter the draw'}
            onConfirm={() => {
              const code = generateEntryCode();
              onSubmit({ confirmed: true, code }, ta ? '— நுழைவு முடிந்தது —' : '— entered —');
              onFinish(code);
            }}
          />
        );
      },
      terminal: true,
    },
  ];

  return { turns, answers };
}

// ── ID proof control (proof type dropdown + number input) ────────────────────
// Kept in-file (small enough) — same shape as the pooja flow's IdProofControl.

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
  const [type, setType] = React.useState(proofOptions[0].key);
  const [num,  setNum]  = React.useState('');
  const canSubmit = num.trim().length >= 4;
  const typeLabel = proofOptions.find((o) => o.key === type)?.label ?? type;

  function commit() {
    if (!canSubmit) return;
    const clean = num.trim();
    const echo = `${typeLabel} · ${'•'.repeat(Math.max(0, clean.length - 4)) + clean.slice(-4)}`;
    onSubmit({ type, number: clean }, echo);
  }

  return (
    <div className="space-y-2 max-w-[420px]">
      <div className="flex items-center gap-2 bg-white border border-[--color-border] rounded-xl px-3 py-2">
        <label className={`text-[11px] font-bold uppercase tracking-wider text-[--color-text-secondary] w-[76px] flex-shrink-0 ${taClass}`}>
          {ta ? 'வகை' : 'Type'}
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={`flex-1 min-w-0 bg-transparent text-[13px] text-[--color-text-primary] outline-none font-medium ${taClass}`}
        >
          {proofOptions.map((o) => (<option key={o.key} value={o.key}>{o.label}</option>))}
        </select>
      </div>
      <div className="flex items-center gap-2 bg-white border border-[--color-border] rounded-xl focus-within:border-[--color-site-name] focus-within:ring-2 focus-within:ring-red-100 transition-all px-3 py-2">
        <label className={`text-[11px] font-bold uppercase tracking-wider text-[--color-text-secondary] w-[76px] flex-shrink-0 ${taClass}`}>
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
      <ChipsChoiceHint ta={ta} />
      <button
        onClick={commit}
        disabled={!canSubmit}
        className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[13px] font-bold transition-colors ${canSubmit ? 'bg-[--color-site-name] hover:bg-[--color-btn-primary-hover] text-white' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'} ${taClass}`}
      >
        {ta ? 'சமர்ப்பி' : 'Send'}
      </button>
    </div>
  );
}

function ChipsChoiceHint({ ta }: { ta: boolean }) {
  return (
    <p className={`text-[10.5px] text-[--color-text-secondary] leading-snug px-1 ${ta ? 'ta-text' : ''}`}>
      {ta
        ? 'உங்கள் ஆதார்/அடையாள எண் காண்பிக்கப்படும் போது கடைசி 4 எண்கள் மட்டும் தெரியும்.'
        : 'Only the last 4 digits of your ID are shown on the entry ticket.'}
    </p>
  );
}

