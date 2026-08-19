'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { getTamilMonths, getTithiEmoji, getUniqueDeitiesInFestivals, getCitiesWithFestivals, type TamilMonth, type Tithi } from '@/data/festivals';
import { cn } from '@/lib/utils';

export default function FestivalsFilters({
  selectedCity,
  onCityChange,
  selectedTamilMonth,
  onTamilMonthChange,
  selectedTithi,
  onTithiChange,
  selectedDeity,
  onDeityChange,
}: {
  selectedCity: string;
  onCityChange: (city: string) => void;
  selectedTamilMonth: TamilMonth | null;
  onTamilMonthChange: (month: TamilMonth | null) => void;
  selectedTithi: Tithi | null;
  onTithiChange: (tithi: Tithi | null) => void;
  selectedDeity: string | null;
  onDeityChange: (deity: string | null) => void;
}) {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const taClass = ta ? 'ta-text' : '';

  const cities = getCitiesWithFestivals();
  const tamilMonths = getTamilMonths();
  const deities = getUniqueDeitiesInFestivals();

  const filterGroup = 'flex flex-col gap-2.5';
  const filterLabel = 'text-[12px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5';
  const radioBtn = (active: boolean) =>
    cn(
      'flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer text-left',
      active
        ? 'bg-neutral-900 text-white'
        : 'text-neutral-700 hover:bg-neutral-100',
      taClass
    );

  return (
    <div className={cn('space-y-6', taClass)}>
      {/* Cities */}
      <div>
        <label className={filterLabel}>
          {t(lang, 'festivals.filters.cities')}
        </label>
        <div className="space-y-1">
          <button
            onClick={() => onCityChange('all')}
            className={radioBtn(selectedCity === 'all')}
          >
            {t(lang, 'festivals.filters.allTamilNadu')}
          </button>
          {cities.map((city) => (
            <button
              key={city.id}
              onClick={() => onCityChange(city.id)}
              className={radioBtn(selectedCity === city.id)}
            >
              {ta ? city.labelTa : city.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lunar month */}
      <div>
        <label className={filterLabel}>
          {t(lang, 'festivals.filters.lunarMonth')}
        </label>
        <div className="space-y-1">
          <button
            onClick={() => onTamilMonthChange(null)}
            className={radioBtn(selectedTamilMonth === null)}
          >
            {t(lang, 'festivals.filters.anyMonth')}
          </button>
          {tamilMonths.map((m) => (
            <button
              key={m.value}
              onClick={() => onTamilMonthChange(m.value)}
              className={radioBtn(selectedTamilMonth === m.value)}
            >
              {ta ? m.labelTa : m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tithi */}
      <div>
        <label className={filterLabel}>
          {t(lang, 'festivals.filters.tithi')}
        </label>
        <div className="space-y-1">
          <button
            onClick={() => onTithiChange(null)}
            className={radioBtn(selectedTithi === null)}
          >
            {t(lang, 'festivals.filters.anyTithi')}
          </button>
          <button
            onClick={() => onTithiChange('pournami')}
            className={radioBtn(selectedTithi === 'pournami')}
          >
            <span className="text-[16px]">☾</span>
            {ta ? 'பௌர்ணமி' : 'Pournami (Full Moon)'}
          </button>
          <button
            onClick={() => onTithiChange('amavasya')}
            className={radioBtn(selectedTithi === 'amavasya')}
          >
            <span className="text-[16px]">◑</span>
            {ta ? 'அமாவாசை' : 'Amavasya (New Moon)'}
          </button>
        </div>
      </div>

      {/* Deity (search + list) */}
      <div>
        <label className={filterLabel}>
          {t(lang, 'festivals.filters.deity')}
        </label>
        <div className="space-y-1">
          <button
            onClick={() => onDeityChange(null)}
            className={radioBtn(selectedDeity === null)}
          >
            {ta ? 'அனைத்து தெய்வங்கள்' : 'All Deities'}
          </button>
          {deities.map((d) => (
            <button
              key={d.label}
              onClick={() => onDeityChange(d.label)}
              className={radioBtn(selectedDeity === d.label)}
            >
              {ta ? d.labelTa : d.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
