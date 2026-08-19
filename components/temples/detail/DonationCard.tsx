'use client';

import { useState } from 'react';
import { HandCoins, Sparkles, ArrowRight, IndianRupee } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type Frequency = 'oneTime' | 'monthly' | 'yearly';
type PresetKey  = '101' | '201' | '501' | '1001' | 'other';

interface Preset {
  key: PresetKey;
  amount: number;               // ₹ value; 0 for "other"
  purposeKey: string;           // matches donateCard.purpose.*
}

const PRESETS: Preset[] = [
  { key: '101',   amount:   101, purposeKey: 'lamp'       },
  { key: '201',   amount:   201, purposeKey: 'archana'    },
  { key: '501',   amount:   501, purposeKey: 'dailyPooja' },
  { key: '1001',  amount: 1001,  purposeKey: 'annadanam'  },
  { key: 'other', amount:    0,  purposeKey: 'custom'     },
];

// Format numbers as Indian rupees with commas
const inr = (n: number) => '₹' + n.toLocaleString('en-IN');

export default function DonationCard({ compact = false }: { compact?: boolean } = {}) {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const taClass = ta ? 'ta-text' : '';

  const [freq,     setFreq]     = useState<Frequency>('oneTime');
  const [selected, setSelected] = useState<PresetKey>('501');
  const [customAmount, setCustomAmount] = useState<string>('');

  const activeAmount =
    selected === 'other'
      ? Number(customAmount) || 0
      : PRESETS.find((p) => p.key === selected)!.amount;

  const canDonate = activeAmount > 0;

  const ctaKey =
    freq === 'monthly' ? 'templeDetail.donateCard.ctaMonthly' :
    freq === 'yearly'  ? 'templeDetail.donateCard.ctaYearly'  :
                         'templeDetail.donateCard.cta';

  const ctaLabel = canDonate
    ? t(lang, ctaKey, { amount: inr(activeAmount) })
    : t(lang, 'templeDetail.donateCard.selectAmount');

  return (
    <div className={cn(
      'rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 shadow-sm',
      compact ? 'p-3' : 'p-4'
    )}>
      {/* Header — hidden in compact mode (modal already carries a title) */}
      {!compact && (
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
          <HandCoins className="w-5 h-5 text-emerald-700" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={cn('text-[14px] font-bold text-[--color-text-primary] leading-snug flex items-center gap-1.5', taClass)}>
            {t(lang, 'templeDetail.donateCard.heading')}
            <Sparkles className="w-3 h-3 text-amber-500" />
          </h4>
          <p className={cn('text-[11px] text-[--color-text-secondary] mt-0.5 leading-snug', taClass)}>
            {t(lang, 'templeDetail.donateCard.subheading')}
          </p>
        </div>
      </div>
      )}

      {/* Frequency toggle */}
      <div className={cn('flex items-center gap-0.5 p-0.5 bg-emerald-100/70 rounded-lg', compact ? 'mb-2' : 'mb-3')}>
        {(['oneTime', 'monthly', 'yearly'] as Frequency[]).map((f) => {
          const active = freq === f;
          return (
            <button
              key={f}
              onClick={() => setFreq(f)}
              className={cn(
                'flex-1 py-1.5 rounded-md text-[11px] font-bold transition-all',
                active
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-emerald-700/70 hover:text-emerald-800',
                taClass
              )}
            >
              {t(lang, `templeDetail.donateCard.${f}`)}
            </button>
          );
        })}
      </div>

      {/* Amount presets */}
      <div className={compact ? 'space-y-1' : 'space-y-1.5'}>
        {PRESETS.map((p) => {
          const isSelected = selected === p.key;
          const isOther    = p.key === 'other';
          return (
            <button
              key={p.key}
              onClick={() => setSelected(p.key)}
              className={cn(
                'w-full flex items-center gap-3 rounded-xl border-2 text-left transition-all',
                compact ? 'px-3 py-1.5' : 'px-3 py-2.5',
                isSelected
                  ? 'border-emerald-500 bg-white donate-option-selected'
                  : 'border-transparent bg-white/70 hover:bg-white hover:border-emerald-200'
              )}
            >
              {/* Radio */}
              <span
                className={cn(
                  'w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all',
                  isSelected ? 'border-emerald-600' : 'border-neutral-300'
                )}
              >
                {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
              </span>

              {/* Amount + purpose */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1">
                  {isOther ? (
                    <span className={cn('text-[14px] font-bold text-[--color-text-primary]', taClass)}>
                      {t(lang, 'templeDetail.donateCard.other')}
                    </span>
                  ) : (
                    <span className="text-[15px] font-bold text-[--color-text-primary]">
                      {inr(p.amount)}
                    </span>
                  )}
                </div>
                <p className={cn('text-[11px] text-[--color-text-secondary] leading-snug', taClass)}>
                  {t(lang, `templeDetail.donateCard.purpose.${p.purposeKey}`)}
                </p>

                {/* Custom amount input, shown only when 'other' is selected */}
                {isOther && isSelected && (
                  <div className="mt-1.5 flex items-center gap-1 bg-neutral-50 border border-emerald-200 rounded-lg px-2 py-1 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
                    <IndianRupee className="w-3 h-3 text-neutral-500 flex-shrink-0" />
                    <input
                      autoFocus
                      type="number"
                      inputMode="numeric"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="500"
                      min={1}
                      className="flex-1 min-w-0 bg-transparent text-[13px] font-semibold text-[--color-text-primary] outline-none"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* CTA */}
      <button
        disabled={!canDonate}
        className={cn(
          'w-full flex items-center justify-center gap-1.5 rounded-xl text-[13px] font-bold text-white transition-all',
          compact ? 'mt-3 py-2.5' : 'mt-4 py-3',
          canDonate
            ? 'bg-emerald-600 hover:bg-emerald-700 donate-pulse'
            : 'bg-neutral-300 cursor-not-allowed',
          taClass
        )}
      >
        {ctaLabel}
        {canDonate && <ArrowRight className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
