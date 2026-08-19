'use client';

import { Sparkles, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import type { Temple } from '@/data/temples';
import { cn } from '@/lib/utils';

// Custom implementation — the Festivals section gets its own hero-style background,
// so it doesn't share the standard SectionShell.
export default function FestivalsSection({ temple }: { temple: Temple }) {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const taClass = ta ? 'ta-text' : '';

  return (
    <section id="festivals" data-anchor className="scroll-mt-[140px]">
      <div className="relative rounded-3xl overflow-hidden">
        {/* Colorful festival gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B1A1A] via-[#A03018] to-[#C8680A]" />
        <div
          className="absolute inset-0 opacity-25 mix-blend-overlay"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, #FFD700 0%, transparent 45%), radial-gradient(circle at 80% 80%, #FF6B00 0%, transparent 45%)',
          }}
        />

        <div className="relative p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span className={cn('text-[11px] font-bold uppercase tracking-[0.2em] text-amber-100', taClass)}>
              {ta ? 'கொண்டாட்டங்கள்' : 'Celebrations'}
            </span>
          </div>
          <h2 className={cn('text-white text-[24px] md:text-[28px] font-bold leading-tight', taClass)}>
            {t(lang, 'templeDetail.section.festivals')}
          </h2>
          <p className={cn('text-white/85 text-[13px] md:text-[14px] mt-1', taClass)}>
            {ta
              ? 'ஆண்டு முழுவதும் நடைபெறும் திருவிழாக்கள்'
              : 'Festivals celebrated throughout the year'}
          </p>

          {/* Festival cards */}
          {temple.festivals && temple.festivals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
              {temple.festivals.map((f) => {
                const name = ta ? (f.nameTa ?? f.name) : f.name;
                return (
                  <div
                    key={f.name}
                    className="rounded-2xl bg-white/95 backdrop-blur-sm p-4 hover:bg-white transition-colors"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-amber-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn('text-[14px] font-bold text-[--color-text-primary] leading-snug', ta && 'ta-text')}>
                          {name}
                        </p>
                        <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide mt-0.5">
                          {f.period}
                        </p>
                      </div>
                    </div>
                    <p className="text-[12px] text-[--color-text-secondary] leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl bg-white/95 backdrop-blur-sm p-5">
              <p className={cn('text-[13px] text-[--color-text-secondary]', taClass)}>
                {t(lang, 'templeDetail.contentComing')}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
