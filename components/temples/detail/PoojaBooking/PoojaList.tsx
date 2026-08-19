'use client';

import { useMemo, useState } from 'react';
import { Search, Flame, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { groupServices, formatInr, type PoojaService } from '@/data/poojaServices';
import { cn } from '@/lib/utils';

export default function PoojaList({
  services,
  selectedId,
  onSelect,
}: {
  services: PoojaService[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const taClass = ta ? 'ta-text' : '';
  const [q, setQ] = useState('');
  const [showAllAfterSelect, setShowAllAfterSelect] = useState(false);

  // Filter by search
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return services;
    return services.filter((s) =>
      (s.name + (s.nameTa ?? '')).toLowerCase().includes(needle)
    );
  }, [q, services]);

  const grouped = useMemo(() => groupServices(filtered), [filtered]);
  const selected = services.find((s) => s.id === selectedId) ?? null;

  // Once a pooja is selected the list collapses to just that pooja on top.
  // A "Change selection" chevron re-expands the full list beneath it.
  const showList = !selected || showAllAfterSelect;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Selected card on top (when there is one) */}
      {selected && (
        <div className="p-3 border-b border-[--color-border] bg-red-50/40 flex-shrink-0">
          <div className="flex items-start gap-3 bg-white border-2 border-[--color-site-name] rounded-xl p-3">
            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
              <Flame className="w-4 h-4 text-[--color-site-name]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className={cn('inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[--color-site-name] text-white', taClass)}>
                  <Check className="w-2.5 h-2.5" />
                  {t(lang, 'bookPooja.selectedBadge')}
                </span>
              </div>
              <p className={cn('text-[13.5px] font-bold text-[--color-text-primary] leading-snug', taClass)}>
                {ta ? (selected.nameTa ?? selected.name) : selected.name}
              </p>
              <p className="text-[12px] font-bold text-[--color-site-name] mt-0.5">
                {formatInr(selected.price)}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAllAfterSelect((v) => !v)}
            className={cn(
              'mt-2 w-full flex items-center justify-center gap-1 text-[12px] font-semibold text-[--color-text-secondary] hover:text-[--color-site-name] transition-colors py-1',
              taClass
            )}
          >
            {t(lang, 'bookPooja.changeSelection')}
            {showAllAfterSelect ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      )}

      {/* Search bar */}
      {showList && (
        <div className="p-3 border-b border-[--color-border] flex-shrink-0">
          <div className="flex items-center bg-neutral-50 border border-[--color-border] rounded-lg px-2.5 py-1.5 focus-within:border-[--color-site-name]">
            <Search className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t(lang, 'bookPooja.searchPlaceholder')}
              className={cn('flex-1 min-w-0 bg-transparent px-2 text-[12.5px] text-[--color-text-primary] outline-none font-medium', taClass)}
            />
          </div>
        </div>
      )}

      {/* Grouped list */}
      {showList && (
        <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-4">
          {(['abishegam', 'sannathi', 'special'] as const).map((g) => {
            const items = grouped[g];
            if (items.length === 0) return null;
            return (
              <div key={g}>
                <p className={cn('text-[11px] font-bold uppercase tracking-widest text-[--color-text-secondary] mb-1.5 px-1', taClass)}>
                  {t(lang, `bookPooja.groups.${g}`)}
                </p>
                <div className="space-y-1.5">
                  {items.map((s) => {
                    const isSelected = s.id === selectedId;
                    return (
                      <button
                        key={s.id}
                        onClick={() => { onSelect(s.id); setShowAllAfterSelect(false); }}
                        className={cn(
                          'w-full text-left flex items-start gap-2.5 rounded-lg p-2.5 border transition-colors',
                          isSelected
                            ? 'border-[--color-site-name] bg-red-50/60'
                            : 'border-[--color-border] bg-white hover:border-[--color-site-name] hover:bg-red-50/30'
                        )}
                      >
                        <div className={cn(
                          'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0',
                          isSelected ? 'bg-[--color-site-name]' : 'bg-amber-50'
                        )}>
                          <Flame className={cn('w-3.5 h-3.5', isSelected ? 'text-white' : 'text-amber-600')} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn('text-[12.5px] font-semibold text-[--color-text-primary] leading-snug', ta && 'ta-text')}>
                            {ta ? (s.nameTa ?? s.name) : s.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[12px] font-bold text-[--color-site-name]">{formatInr(s.price)}</span>
                            <span className="text-[10.5px] text-[--color-text-secondary]">
                              {formatDateRange(s.dateFrom, s.dateTo)}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <p className={cn('text-[12px] text-[--color-text-secondary] text-center pt-6', taClass)}>
              —
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function formatDateRange(from: string, to: string): string {
  const f = new Date(from), t = new Date(to);
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  return `${f.toLocaleDateString('en-IN', opts)} – ${t.toLocaleDateString('en-IN', opts)}`;
}
