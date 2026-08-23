'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Menu, X, MapPin, ChevronDown, Check, Home, Landmark, Sparkles, Droplets } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCity, type City } from '@/contexts/CityContext';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';

// ── Logo mark ─────────────────────────────────────────────────────────────────
function LogoMark() {
  return (
    <svg viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-7 flex-shrink-0" aria-hidden="true">
      <rect x="1"  y="25" width="26" height="7"  rx="1.5" fill="currentColor" opacity="1"   />
      <rect x="5"  y="18" width="18" height="8"  rx="1"   fill="currentColor" opacity="0.92"/>
      <rect x="8"  y="12" width="12" height="7"  rx="1"   fill="currentColor" opacity="0.84"/>
      <rect x="10" y="7"  width="8"  height="6"  rx="1"   fill="currentColor" opacity="0.76"/>
      <rect x="12" y="3"  width="4"  height="5"  rx="0.5" fill="currentColor" opacity="0.68"/>
      <polygon points="14,0 11,3 17,3"            fill="currentColor" opacity="0.9" />
    </svg>
  );
}

// ── Language switcher ─────────────────────────────────────────────────────────
function LangToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex items-center gap-0.5 text-[13px] font-semibold">
      <button
        onClick={() => setLang('en')}
        className={cn(
          'px-1.5 py-0.5 rounded transition-colors',
          lang === 'en' ? 'text-[--color-lang-active]' : 'text-[--color-lang-inactive] hover:text-[--color-text-primary]'
        )}
      >EN</button>
      <span className="text-[--color-border-strong] select-none">|</span>
      <button
        onClick={() => setLang('ta')}
        className={cn(
          'px-1.5 py-0.5 rounded transition-colors ta-text',
          lang === 'ta' ? 'text-[--color-lang-active]' : 'text-[--color-lang-inactive] hover:text-[--color-text-primary]'
        )}
      >தமிழ்</button>
    </div>
  );
}

// ── City selector ─────────────────────────────────────────────────────────────
function CitySelector() {
  const { city, setCity, cities } = useCity();
  const { lang } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const displayName = lang === 'ta' ? city.nameTa : city.name;

  // Picking a city from the header always drops the user on the home page
  // so they see the right city's dashboard.
  function handlePick(c: typeof city) {
    setCity(c);
    setOpen(false);
    if (pathname !== '/') router.push('/');
  }

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all duration-150',
          open
            ? 'bg-[--color-site-name] border-[--color-site-name] text-white shadow-md'
            : 'bg-white border-[--color-border] text-[--color-text-primary] hover:border-[--color-site-name] hover:text-[--color-site-name]'
        )}
        aria-label="Select city"
      >
        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
        <span className={cn('text-[13px] font-bold tracking-tight', lang === 'ta' && 'ta-text')}>{displayName}</span>
        <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', open && 'rotate-180')} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-52 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-[--color-border] overflow-hidden z-[60]">
          <div className="px-4 py-2.5 border-b border-[--color-border]">
            <p className={cn('text-[11px] font-bold text-[--color-text-secondary] uppercase tracking-widest', lang === 'ta' && 'ta-text')}>
              {t(lang, 'header.tamilNaduLabel')}
            </p>
          </div>
          <div className="py-1.5">
            {cities.map((c) => {
              const primary   = lang === 'ta' ? c.nameTa : c.name;
              const secondary = lang === 'ta' ? c.name   : c.nameTa;
              return (
                <button
                  key={c.id}
                  onClick={() => handlePick(c)}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors',
                    c.id === city.id
                      ? 'bg-red-50 text-[--color-site-name]'
                      : 'text-[--color-text-primary] hover:bg-[--color-surface-muted]'
                  )}
                >
                  <div>
                    <span className={cn('text-[14px] font-semibold block', lang === 'ta' && 'ta-text')}>{primary}</span>
                    <span className={cn('text-[12px] text-[--color-text-secondary]', lang !== 'ta' && 'ta-text')}>{secondary}</span>
                  </div>
                  {c.id === city.id && (
                    <Check className="w-4 h-4 text-[--color-site-name] flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Header ───────────────────────────────────────────────────────────────
export default function Header() {
  return (
    <Suspense fallback={<HeaderShell />}>
      <HeaderInner />
    </Suspense>
  );
}

// Fallback while useSearchParams warms up on first paint
function HeaderShell() {
  return (
    <header className="sticky top-0 z-50 bg-[--color-header-bg] border-b border-[--color-header-border]">
      <div className="container-page">
        <div className="h-[72px]" />
      </div>
    </header>
  );
}

function HeaderInner() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navItems = [
    { key: 'nav.home',      href: '/',                             Icon: Home,          match: () => pathname === '/' },
    { key: 'nav.temples',   href: '/temples',                       Icon: Landmark,      match: () => pathname === '/temples' || (pathname === '/placeholder' && searchParams.get('page') === 'temples') },
    { key: 'nav.kudamuluku', href: '/placeholder?page=kudamuluku', Icon: Droplets,      match: () => pathname === '/placeholder' && searchParams.get('page') === 'kudamuluku' },
    { key: 'nav.festivals',  href: '/temples/festivals',            Icon: Sparkles,      match: () => pathname === '/temples/festivals' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[--color-header-bg] border-b border-[--color-header-border]">
      <div className="container-page">
        <div className="flex items-center h-[72px] gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group text-[--color-site-name]">
            <LogoMark />
            <span className={cn(
              'font-bold leading-tight tracking-tight transition-opacity group-hover:opacity-75',
              lang === 'ta' ? 'text-[11px] ta-text max-w-[120px]' : 'text-[15px]'
            )}>
              {t(lang, 'header.siteName')}
            </span>
          </Link>

          {/* City selector — prominent, next to logo */}
          <div className="flex-shrink-0">
            <CitySelector />
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-6 bg-[--color-border] flex-shrink-0" />

          {/* Desktop nav — held until lg: the bold uppercase labels are wide
              enough that logo + city + nav + lang + Login overflows at md. */}
          <nav className="hidden lg:flex items-center flex-1 gap-1">
            {navItems.map(({ key, href, Icon, match }) => {
              const active = match();
              return (
                <Link
                  key={key}
                  href={href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-bold uppercase transition-all duration-150 relative',
                    active
                      ? 'text-[--color-site-name] bg-red-50'
                      : 'text-[--color-nav-link] hover:text-[--color-nav-link-hover] hover:bg-neutral-50'
                  )}
                >
                  <Icon className={cn('w-4 h-4 flex-shrink-0', active && 'text-[--color-site-name]')} />
                  <span className={lang === 'ta' ? 'ta-text' : ''}>{t(lang, key)}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop right actions */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <LangToggle />
            <div className="w-px h-5 bg-[--color-border]" />
            <Link
              href="/placeholder?page=login"
              className="px-4 py-2 rounded-lg bg-[--color-btn-primary-bg] text-[--color-btn-primary-text] text-[13px] font-semibold hover:bg-[--color-btn-primary-hover] transition-colors"
            >
              {t(lang, 'nav.login')}
            </Link>
          </div>

          {/* Mobile right */}
          <div className="flex lg:hidden items-center gap-2 ml-auto">
            <LangToggle />
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-xl text-[--color-text-secondary] hover:text-[--color-text-primary] hover:bg-[--color-surface-muted] transition-colors"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-[--color-border] bg-[--color-surface] animate-slideDown">
          <div className="container-page py-4 space-y-0.5">
            {navItems.map(({ key, href, Icon, match }) => {
              const active = match();
              return (
                <Link
                  key={key}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 text-[14px] font-semibold rounded-xl transition-colors',
                    active
                      ? 'text-[--color-site-name] bg-red-50'
                      : 'text-[--color-nav-link] hover:text-[--color-nav-link-hover] hover:bg-[--color-surface-muted]'
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className={lang === 'ta' ? 'ta-text' : ''}>{t(lang, key)}</span>
                </Link>
              );
            })}
            <div className="pt-3 pb-1 border-t border-[--color-border] mt-2 flex gap-2.5">
              <Link
                href="/placeholder?page=login"
                onClick={() => setOpen(false)}
                className="flex-1 text-center px-4 py-2.5 rounded-xl bg-[--color-btn-primary-bg] text-[--color-btn-primary-text] text-[13px] font-semibold hover:bg-[--color-btn-primary-hover] transition-colors"
              >
                {t(lang, 'nav.login')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
