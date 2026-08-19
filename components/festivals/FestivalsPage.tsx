'use client';

import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { FESTIVALS, type TamilMonth, type Tithi } from '@/data/festivals';
import { cn } from '@/lib/utils';
import FestivalCard from './FestivalCard';
import FestivalsFilters from './FestivalsFilters';

// Season tab type
type Season = 'jan-mar' | 'apr-jun' | 'jul-sep' | 'oct-dec';

// Map season to month range for display
const SEASON_MONTHS: Record<Season, TamilMonth[]> = {
  'jan-mar': ['thai', 'masi', 'panguni'],
  'apr-jun': ['chithirai', 'vaigasi', 'aadi'],
  'jul-sep': ['aadi', 'aavani', 'purattasi'],
  'oct-dec': ['iyppasi', 'margazhi', 'thai'],
};

export default function FestivalsPage() {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const taClass = ta ? 'ta-text' : '';

  // State
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<Season>('jan-mar');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedTamilMonth, setSelectedTamilMonth] = useState<TamilMonth | null>(null);
  const [selectedTithi, setSelectedTithi] = useState<Tithi | null>(null);
  const [selectedDeity, setSelectedDeity] = useState<string | null>(null);

  // Filter festivals
  const filteredFestivals = useMemo(() => {
    let result = [...FESTIVALS];

    // City filter
    if (selectedCity !== 'all') {
      result = result.filter((f) => f.city === selectedCity);
    }

    // Season filter (if no specific lunar month is selected)
    if (!selectedTamilMonth) {
      const seasonMonths = SEASON_MONTHS[selectedSeason];
      result = result.filter((f) => seasonMonths.includes(f.tamilMonth));
    }

    // Tamil month filter (overrides season selection)
    if (selectedTamilMonth) {
      result = result.filter((f) => f.tamilMonth === selectedTamilMonth);
    }

    // Tithi filter
    if (selectedTithi) {
      result = result.filter((f) => f.tithi === selectedTithi);
    }

    // Deity filter
    if (selectedDeity) {
      result = result.filter((f) => f.deity === selectedDeity);
    }

    // Sort by date
    return result.sort((a, b) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime());
  }, [selectedCity, selectedSeason, selectedTamilMonth, selectedTithi, selectedDeity]);

  // Season tabs
  const seasonTabs: Array<{ value: Season; label: string }> = [
    { value: 'jan-mar', label: t(lang, 'festivals.seasonTabs.janMar') },
    { value: 'apr-jun', label: t(lang, 'festivals.seasonTabs.aprJun') },
    { value: 'jul-sep', label: t(lang, 'festivals.seasonTabs.julSep') },
    { value: 'oct-dec', label: t(lang, 'festivals.seasonTabs.octDec') },
  ];

  return (
    <div className={taClass}>
      {/* Page header with season tabs on the right */}
      <div className="container-page pt-8 pb-8">
        <div className="flex items-start justify-between gap-8 mb-4">
          <div className="flex-1">
            <h1 className={cn('text-[28px] md:text-[32px] font-bold text-neutral-900 mb-2', taClass)}>
              {t(lang, 'festivals.pageTitle')}
            </h1>
            <p className={cn('text-[15px] text-neutral-600 max-w-[600px] leading-relaxed', taClass)}>
              {t(lang, 'festivals.pageSubtitle')}
            </p>
          </div>

          {/* Year and Season tabs - Right aligned */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Year Dropdown */}
            <div className="relative">
              <button
                onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                className={cn('flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors text-[13px] font-semibold',
                  yearDropdownOpen
                    ? 'bg-red-700 text-white'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700',
                  taClass
                )}>
                {selectedYear}
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', yearDropdownOpen && 'rotate-180')} />
              </button>
              {yearDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-32 bg-white rounded-lg border border-neutral-200 shadow-lg overflow-hidden z-50">
                  {[2026, 2027, 2028].map((year) => (
                    <button
                      key={year}
                      onClick={() => {
                        setSelectedYear(year);
                        setYearDropdownOpen(false);
                      }}
                      className={cn(
                        'w-full px-4 py-2 text-left text-[13px] font-medium transition-colors',
                        selectedYear === year
                          ? 'bg-amber-50 text-amber-900'
                          : 'text-neutral-700 hover:bg-neutral-50'
                      )}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Season tabs */}
            <div className="flex items-center gap-2.5">
              {seasonTabs.map((season) => (
                <button
                  key={season.value}
                  onClick={() => setSelectedSeason(season.value)}
                  className={cn(
                    'px-6 py-3 rounded-xl text-[15px] font-bold transition-all whitespace-nowrap border-2',
                    selectedSeason === season.value
                      ? 'bg-red-700 text-white border-red-800'
                      : 'bg-neutral-200 text-neutral-700 border-neutral-300 hover:bg-neutral-300',
                    taClass
                  )}
                >
                  {season.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container-page py-8">
        <div className="flex gap-8">
          {/* Left sidebar — filters */}
          <aside className="hidden lg:block w-[260px] flex-shrink-0">
            <div className="sticky top-[200px]">
              <FestivalsFilters
                selectedCity={selectedCity}
                onCityChange={setSelectedCity}
                selectedTamilMonth={selectedTamilMonth}
                onTamilMonthChange={setSelectedTamilMonth}
                selectedTithi={selectedTithi}
                onTithiChange={setSelectedTithi}
                selectedDeity={selectedDeity}
                onDeityChange={setSelectedDeity}
              />
            </div>
          </aside>

          {/* Right content — cards grid */}
          <div className="flex-1 min-w-0">
            {filteredFestivals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFestivals.map((festival) => (
                  <FestivalCard key={festival.id} festival={festival} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4">
                  <span className="text-[24px]">🙏</span>
                </div>
                <p className={cn('text-[15px] font-bold text-neutral-900 mb-1', taClass)}>
                  {t(lang, 'festivals.card.noResults')}
                </p>
                <p className={cn('text-[13px] text-neutral-600', taClass)}>
                  {t(lang, 'festivals.card.noResultsHint')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filters button (mobile-only) */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <details className="group">
          <summary className={cn(
            'cursor-pointer flex items-center justify-center w-14 h-14 rounded-full bg-neutral-900 text-white shadow-lg hover:bg-neutral-800 transition-colors',
            taClass
          )}>
            <span className="text-[20px]">⚙️</span>
          </summary>
          <div className={cn(
            'absolute bottom-full right-0 mb-3 bg-white rounded-2xl border border-neutral-200 shadow-lg p-6 w-[320px] max-h-[70vh] overflow-y-auto',
            taClass
          )}>
            <FestivalsFilters
              selectedCity={selectedCity}
              onCityChange={setSelectedCity}
              selectedTamilMonth={selectedTamilMonth}
              onTamilMonthChange={setSelectedTamilMonth}
              selectedTithi={selectedTithi}
              onTithiChange={setSelectedTithi}
              selectedDeity={selectedDeity}
              onDeityChange={setSelectedDeity}
            />
          </div>
        </details>
      </div>
    </div>
  );
}
