'use client';

import { useMemo, useState, useEffect } from 'react';
import { Search, X, SlidersHorizontal, ChevronDown, Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCity } from '@/contexts/CityContext';
import { useTemplesSearch } from '@/contexts/TemplesSearchContext';
import { t } from '@/lib/i18n';
import { searchTemples } from '@/data/temples';
import { fetchTemples } from '@/lib/wordpress-api';
import type { Temple } from '@/data/temples';
import TempleCard from '@/components/cards/TempleCard';
import { cn } from '@/lib/utils';

// ── Filter placeholder sidebar ────────────────────────────────────────────────
// Categories are shown as disabled controls — filter logic will be wired later.
function FiltersSidebar() {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const taClass = ta ? 'ta-text' : '';

  const groups = [
    { key: 'filterArea',  options: ['Mylapore', 'Vadapalani', 'Triplicane', 'Anna Nagar', 'Ambattur'] },
    { key: 'filterDeity', options: ['Shiva', 'Vishnu', 'Murugan', 'Amman', 'Ganesha'] },
    { key: 'filterType',  options: ['Ancient', 'Heritage', 'Modern', 'Cave'] },
  ];

  return (
    <aside className="hidden lg:block w-[260px] flex-shrink-0">
      <div className="sticky top-[88px] bg-white rounded-2xl border border-[--color-border] overflow-hidden">
        <div className="px-5 py-4 border-b border-[--color-border] flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[--color-text-primary]" />
          <h3 className={cn('text-[14px] font-bold text-[--color-text-primary]', taClass)}>
            {t(lang, 'templesPage.filtersHeading')}
          </h3>
          <span className="ml-auto text-[10px] font-semibold text-[--color-text-secondary] uppercase tracking-wider bg-neutral-100 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Lock className="w-2.5 h-2.5" />
            {t(lang, 'templesPage.comingSoon')}
          </span>
        </div>

        <div className="p-5 space-y-5 opacity-60 pointer-events-none">
          {groups.map(({ key, options }) => (
            <div key={key}>
              <label className={cn('flex items-center justify-between text-[12px] font-bold text-[--color-text-primary] mb-2 uppercase tracking-wide', taClass)}>
                {t(lang, `templesPage.${key}`)}
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </label>
              <div className="space-y-1.5">
                {options.slice(0, 4).map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-[13px] text-[--color-text-secondary]">
                    <input type="checkbox" disabled className="w-3.5 h-3.5 rounded border-neutral-300" />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ── Search bar (page-level, right-aligned with the title) ─────────────────────
function InlineSearch() {
  const { lang } = useLanguage();
  const { query, setQuery } = useTemplesSearch();
  return (
    <div className="flex items-center bg-white border border-[--color-border] rounded-xl focus-within:border-[--color-site-name] focus-within:ring-2 focus-within:ring-red-100 transition-all w-full md:w-[320px] lg:w-[360px]">
      <Search className="w-4 h-4 text-neutral-400 ml-3 flex-shrink-0" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t(lang, 'templesPage.searchPlaceholder')}
        className={cn(
          'flex-1 min-w-0 bg-transparent px-2 py-2.5 text-[13px] text-neutral-900 placeholder:text-neutral-400 outline-none font-medium truncate',
          lang === 'ta' && 'ta-text'
        )}
        autoComplete="off"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          aria-label="Clear"
          className="w-6 h-6 mr-1.5 flex items-center justify-center rounded-full bg-neutral-200 hover:bg-neutral-300 transition-colors flex-shrink-0"
        >
          <X className="w-3 h-3 text-neutral-600" />
        </button>
      )}
    </div>
  );
}

// ── Main listing page ────────────────────────────────────────────────────────
export default function TemplesListingPage() {
  const { lang } = useLanguage();
  const { city } = useCity();
  const { query } = useTemplesSearch();
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);

  const cityName = lang === 'ta' ? city.nameTa : city.name;
  const taClass = lang === 'ta' ? 'ta-text' : '';

  // Fetch temples from WordPress on mount
  useEffect(() => {
    setLoading(true);
    fetchTemples(100).then((data) => {
      setTemples(data);
      setLoading(false);
    });
  }, []);

  // Live search results (scoped to current city). If empty query, show all.
  const results = useMemo(() => {
    const q = query.trim();
    const cityTemples = temples.filter((t) => t.city.toLowerCase() === city.id.toLowerCase());
    if (!q) return cityTemples;
    return searchTemples(q, city.id);
  }, [query, city.id, temples]);

  const countLabel = results.length === 1
    ? t(lang, 'templesPage.resultsCountOne')
    : t(lang, 'templesPage.resultsCount', { count: results.length });

  return (
    <div className="container-page py-8 md:py-10">
      {/* Page header — title on left, search right-aligned */}
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={cn('text-[24px] md:text-[30px] font-bold text-[--color-text-primary] tracking-tight', taClass)}>
            {t(lang, 'templesPage.pageTitle', { city: cityName })}
          </h1>
          <p className={cn('text-[13px] text-[--color-text-secondary] mt-1 font-medium', taClass)}>
            {countLabel}
            {query && (
              <span className="ml-1 text-neutral-400">
                · &ldquo;{query}&rdquo;
              </span>
            )}
          </p>
        </div>
        <InlineSearch />
      </div>

      {/* Layout: sidebar + results */}
      <div className="flex gap-6">
        <FiltersSidebar />

        <div className="flex-1 min-w-0">
          {loading ? (
            <div className={cn('bg-white border border-[--color-border] rounded-2xl px-6 py-16 text-center', taClass)}>
              <p className="text-[16px] font-semibold text-[--color-text-primary]">
                {t(lang, 'templesPage.loading')}
              </p>
            </div>
          ) : results.length > 0 ? (
            <div key={city.id + query} className="city-fade grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {results.map((temple) => (
                <TempleCard key={temple.id} temple={temple} />
              ))}
            </div>
          ) : (
            <div className={cn('bg-white border border-[--color-border] rounded-2xl px-6 py-16 text-center', taClass)}>
              <p className="text-[16px] font-semibold text-[--color-text-primary]">
                {t(lang, 'templesPage.noResults')}
              </p>
              <p className="text-[13px] text-[--color-text-secondary] mt-1">
                {t(lang, 'templesPage.noResultsHint')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
