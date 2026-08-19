'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { DETAIL_SECTIONS } from './TempleDetailPage';

export default function StickyTabNav({ active, hideEvents = false }: { active: string; hideEvents?: boolean }) {
  const { lang } = useLanguage();
  const ta = lang === 'ta';

  function jump(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    // Site header (72) + this sticky nav (~56) worth of offset
    const y = el.getBoundingClientRect().top + window.scrollY - 128;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  const sections = hideEvents
    ? DETAIL_SECTIONS.filter((s) => s.id !== 'events')
    : DETAIL_SECTIONS;

  return (
    <nav className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-sm border-b border-[--color-border] shadow-sm">
      <div className="container-page">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
          {sections.map(({ id, labelKey }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => jump(id)}
                className={cn(
                  'flex-shrink-0 px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-all whitespace-nowrap',
                  isActive
                    ? 'bg-[--color-site-name] text-white'
                    : 'text-[--color-nav-link] hover:bg-neutral-100',
                  ta && 'ta-text'
                )}
              >
                {t(lang, `templeDetail.section.${labelKey}`)}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
