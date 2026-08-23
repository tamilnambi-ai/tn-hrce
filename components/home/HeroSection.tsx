'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCity } from '@/contexts/CityContext';
import { t } from '@/lib/i18n';
import { searchTemples, Temple } from '@/data/temples';
import { cn } from '@/lib/utils';

// ── Hero background image (aerial/dramatic temple shot) ───────────────────────
// picsum.photos seed — real photo, always loads. Replace with actual temple CDN image when available.
const HERO_IMAGE = '/hero/hero.png';

// ── Gradient fallback for search result thumbnails ────────────────────────────
function TempleThumb({ temple }: { temple: Temple }) {
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0">
      {!imgFailed ? (
        <img
          src={temple.imageUrl}
          alt={temple.name}
          className="w-full h-full object-cover"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div
          className="w-full h-full"
          style={{ background: `linear-gradient(135deg, ${temple.gradientFrom}, ${temple.gradientTo})` }}
        />
      )}
    </div>
  );
}

// ── Single search result row ──────────────────────────────────────────────────
function ResultRow({ temple, onSelect, lang }: { temple: Temple; onSelect: () => void; lang: 'en' | 'ta' }) {
  const name = lang === 'ta' ? (temple.nameTa ?? temple.name) : temple.name;
  const area = lang === 'ta' ? (temple.areaTa ?? temple.area) : temple.area;
  const taClass = lang === 'ta' ? 'ta-text' : '';
  return (
    <Link
      href={`/temples/${temple.id}`}
      onClick={onSelect}
      className="flex items-center gap-3 px-5 py-3 hover:bg-neutral-50 transition-colors group"
    >
      <TempleThumb temple={temple} />
      <div className="flex-1 min-w-0">
        <p className={`text-[14px] font-semibold text-neutral-800 truncate group-hover:text-[--color-site-name] transition-colors ${taClass}`}>
          {name}
        </p>
        <p className={`text-[12px] text-neutral-400 mt-0.5 ${taClass}`}>
          {area} · {temple.pincode}
        </p>
      </div>
      <ArrowRight className="w-4 h-4 text-neutral-300 flex-shrink-0 group-hover:text-[--color-site-name] transition-colors" />
    </Link>
  );
}

// ── Main Hero Section ─────────────────────────────────────────────────────────
export default function HeroSection() {
  const { lang } = useLanguage();
  const { city } = useCity();
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState<Temple[]>([]);
  const [open, setOpen]       = useState(false);
  const [imgOk, setImgOk]     = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef     = useRef<HTMLInputElement>(null);

  // Live search — scoped to selected city
  useEffect(() => {
    const q = query.trim();
    if (!q) { setResults([]); setOpen(false); return; }
    setResults(searchTemples(q, city.id));
    setOpen(true);
  }, [query, city.id]);

  // When dropdown opens, scroll the search card near the top of the viewport
  // so the results list underneath has full room to render.
  useEffect(() => {
    if (!open || !results.length || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const target = rect.top + window.scrollY - 96; // leave room for the sticky header
    window.scrollTo({ top: target, behavior: 'smooth' });
  }, [open, results.length]);

  // Close on outside click
  const onOutside = useCallback((e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);
  useEffect(() => {
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [onOutside]);

  function clear() {
    setQuery(''); setResults([]); setOpen(false);
    inputRef.current?.focus();
  }

  // The hero has no fixed height. Its old clamp() was driven by vh while the
  // image scales with width, so on any tall-and-narrow viewport (phone, tablet
  // portrait) the section outgrew the image and left a gap above the search card.
  // Now the image sits in normal flow and the section is exactly as tall as its
  // content; the card is pulled up by a responsive negative margin so it always
  // tucks into the image's bottom fade at every width.
  return (
    <section className="relative w-full bg-[#ffefe0] overflow-hidden">

      {/* ── Hero image — always in normal flow, so it defines the section height ── */}
      <div className="relative pointer-events-none overflow-hidden flex items-start justify-center">
        {imgOk ? (
          <img
            src={HERO_IMAGE}
            alt="Tamil Nadu Temple"
            className="w-auto max-w-[94%] max-h-[58vh]"
            style={{
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 2%, rgba(0,0,0,0.8) 6%, black 9%, black 91%, rgba(0,0,0,0.8) 94%, rgba(0,0,0,0.3) 98%, transparent 100%)',
              maskImage:
                'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 2%, rgba(0,0,0,0.8) 6%, black 9%, black 91%, rgba(0,0,0,0.8) 94%, rgba(0,0,0,0.3) 98%, transparent 100%)',
            }}
            onError={() => setImgOk(false)}
          />
        ) : null}
        {/* Bottom veil — lifts heading + search readability */}
        <div className="absolute inset-x-0 bottom-0 h-[20%] bg-gradient-to-t from-[#ffefe0]/80 to-transparent" />
      </div>

      {/* ── Content: heading + search, top-aligned with breathing room from header ── */}
      <div className="relative z-20 container-page flex flex-col items-center -mt-5 sm:-mt-10 md:-mt-16 lg:-mt-28 pb-8 md:pb-10">

        {/* Unified search card — heading + input as one surface blended with background */}
        <div ref={containerRef} className="relative w-full max-w-[640px]">
          <div
            className={cn(
              'transition-all duration-200 bg-[#ffefe0] border border-white/40 shadow-sm backdrop-blur-sm search-card-fade',
              open && results.length ? 'rounded-t-2xl rounded-b-none bg-[#ffefe0]' : 'rounded-2xl overflow-hidden'
            )}
          >
            {/* Heading row */}
            {(() => {
              const cityName = lang === 'ta' ? city.nameTa : city.name;
              const heading  = t(lang, 'hero.heading', { city: '__CITY__' });
              const parts    = heading.split('__CITY__');
              return (
                <h1 className={`text-neutral-900 text-center font-bold pt-5 pb-2 px-6 ${lang === 'ta' ? 'ta-text text-[16px] md:text-[20px]' : 'text-[20px] md:text-[26px]'}`}>
                  {parts[0]}
                  <span className="text-amber-600">{cityName}</span>
                  {parts[1]}
                </h1>
              );
            })()}

            {/* Thin divider */}
            <div className="mx-6 border-t border-neutral-200/70" />

            {/* Input row */}
            <div className="flex items-center gap-3 px-5 py-3.5">
              <Search className="w-5 h-5 text-neutral-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => { if (results.length) setOpen(true); }}
                placeholder={t(lang, 'search.placeholder')}
                className="flex-1 bg-transparent text-[15px] text-[--color-site-name] placeholder:text-[#C9706E] outline-none font-medium border-b-2 border-[--color-site-name] py-1"
                autoComplete="off"
              />
              {query ? (
                <button
                  onClick={clear}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5 text-neutral-500" />
                </button>
              ) : (
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[--color-btn-primary-bg] flex-shrink-0">
                  <Search className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" />
                </div>
              )}
            </div>
          </div>

          {/* ── Dropdown results ── */}
          {open && (
            <div className="absolute left-0 right-0 top-full bg-[#ffefe0] rounded-b-2xl shadow-2xl search-dropdown z-50 border-t border-white/40 border-l border-r border-white/40">
              {results.length > 0 ? (
                <>
                  <div className="px-5 py-2.5 border-b border-neutral-100">
                    <p className={`text-[12px] text-neutral-400 font-medium ${lang === 'ta' ? 'ta-text' : ''}`}>
                      {t(lang, results.length === 1 ? 'search.resultsFor' : 'search.resultsForPlural', { count: results.length })}{' '}
                      <span className="font-semibold text-neutral-700">&ldquo;{query}&rdquo;</span>
                    </p>
                  </div>
                  <div className="max-h-[280px] overflow-y-auto divide-y divide-neutral-50">
                    {results.slice(0, 6).map((temple) => (
                      <ResultRow
                        key={temple.id}
                        temple={temple}
                        lang={lang}
                        onSelect={() => { setOpen(false); setQuery(''); }}
                      />
                    ))}
                  </div>
                  {results.length > 6 && (
                    <Link
                      href={`/placeholder?page=search&q=${encodeURIComponent(query)}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center gap-2 px-5 py-3.5 text-[13px] font-semibold text-[--color-site-name] hover:bg-neutral-50 transition-colors border-t border-neutral-100"
                    >
                      <span className={lang === 'ta' ? 'ta-text' : ''}>{t(lang, 'search.allResults', { count: results.length })}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </>
              ) : (
                <div className="px-5 py-6 text-center">
                  <p className={`text-[14px] text-neutral-400 ${lang === 'ta' ? 'ta-text' : ''}`}>
                    {t(lang, 'search.noResults')}{' '}
                    <span className="font-semibold text-neutral-700">&ldquo;{query}&rdquo;</span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
