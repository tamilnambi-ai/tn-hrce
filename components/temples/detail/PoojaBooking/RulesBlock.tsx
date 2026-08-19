'use client';

import { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import { BOOKING_RULES } from '@/data/poojaServices';
import { cn } from '@/lib/utils';

export default function RulesBlock({
  ta,
  heading,
  collapseLabel,
  expandLabel,
  bilingualClass,
  defaultOpen = true,
}: {
  ta: boolean;
  heading: string;
  collapseLabel: string;
  expandLabel:   string;
  bilingualClass?: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mt-3 border border-neutral-200 rounded-xl bg-neutral-50/60 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-neutral-100 transition-colors text-left"
      >
        <span className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-[--color-text-secondary]" />
          <span className={cn('text-[12px] font-bold text-[--color-text-primary]', bilingualClass)}>
            {heading}
          </span>
        </span>
        <span className={cn('flex items-center gap-1 text-[11px] font-semibold text-[--color-text-secondary]', bilingualClass)}>
          {open ? collapseLabel : expandLabel}
          {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </span>
      </button>
      {open && (
        <ol className="px-4 pb-3 pt-1 space-y-1.5 list-decimal list-inside">
          {BOOKING_RULES.map((r) => (
            <li
              key={r.key}
              className={cn(
                'text-[11.5px] leading-relaxed text-[--color-text-secondary]',
                ta && 'ta-text'
              )}
            >
              {ta ? r.ta : r.en}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
