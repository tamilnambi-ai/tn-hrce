'use client';

/**
 * SpotlightActions — homepage triple-tile band
 *
 * Sits between the hero and the Events rail.
 * Three front doors: Book Pooja/Darshan | Renovation Donation | Upkeep Donation
 *
 * The first tile opens a booking flow instead of navigating: temple picker →
 * type picker (pooja/darshan) → BookPoojaModal (or darshan coming-soon).
 * Donation tiles remain plain links (placeholder pages) until wired up.
 */

import { useState } from 'react';
import Link from 'next/link';
import { HandHeart, Flame, Landmark, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import HomeBookingModal from './HomeBookingModal';
import HomeDonationModal from './HomeDonationModal';

type TileBase = {
  accentBgClass: string;
  accentTextClass: string;
  Icon: React.ComponentType<{ className?: string }>;
  headline: string;
  benefit: string;
  cta: string;
  ta: boolean;
};
type TileProps = TileBase & ({ href: string } | { onClick: () => void });

function ActionTile(props: TileProps) {
  const { accentBgClass, accentTextClass, Icon, headline, benefit, cta, ta } = props;
  const taClass = ta ? 'ta-text' : '';

  const inner = (
    <>
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <Icon className={`w-7 h-7 md:w-8 md:h-8 ${accentTextClass}`} />
      </div>

      <div className="relative flex-1 min-w-0 h-[72px] md:h-[76px]">
        <div className="absolute inset-0 flex items-center opacity-100 group-hover:opacity-0 transition-opacity duration-200">
          <h3 className={`text-neutral-900 text-[15px] md:text-[16px] font-bold leading-tight w-full ${taClass}`}>
            {headline}
          </h3>
        </div>
        <div className="absolute inset-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <p className={`text-neutral-600 text-[12px] md:text-[13px] leading-snug line-clamp-3 w-full ${taClass}`}>
            {benefit}
          </p>
        </div>
      </div>

      <span
        className={`relative inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-white text-[12px] font-semibold shadow-sm flex-shrink-0 group-hover:gap-1.5 transition-all ${accentBgClass} ${taClass}`}
      >
        {cta}
        <ArrowRight className="w-3 h-3" />
      </span>
    </>
  );

  const shellClass =
    'relative overflow-hidden rounded-2xl px-5 py-8 md:px-6 md:py-10 flex items-center gap-4 group bg-[#ffefe0] border border-neutral-200 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-neutral-300';

  return 'onClick' in props ? (
    <button type="button" onClick={props.onClick} className={`${shellClass} text-left w-full`}>
      {inner}
    </button>
  ) : (
    <Link href={props.href} className={shellClass}>
      {inner}
    </Link>
  );
}

export default function SpotlightActions() {
  const { lang } = useLanguage();
  const ta = lang === 'ta';

  const [bookOpen, setBookOpen] = useState(false);
  const openBook  = () => setBookOpen(true);
  const closeBook = () => setBookOpen(false);

  const [upkeepOpen, setUpkeepOpen] = useState(false);
  const openUpkeep  = () => setUpkeepOpen(true);
  const closeUpkeep = () => setUpkeepOpen(false);

  return (
    <>
      <section className="bg-[#ffefe0]">
        <div className="container-page pt-[56px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            <ActionTile
              onClick={openBook}
              accentBgClass="bg-orange-600"
              accentTextClass="text-orange-600"
              Icon={Flame}
              headline={t(lang, 'spotlight.pooja.headline')}
              benefit={t(lang, 'spotlight.pooja.benefit')}
              cta={t(lang, 'spotlight.pooja.cta')}
              ta={ta}
            />
            <ActionTile
              href="/temples/renovation"
              accentBgClass="bg-[--color-btn-primary-bg]"
              accentTextClass="text-[--color-btn-primary-bg]"
              Icon={Landmark}
              headline={t(lang, 'spotlight.renovation.headline')}
              benefit={t(lang, 'spotlight.renovation.benefit')}
              cta={t(lang, 'spotlight.renovation.cta')}
              ta={ta}
            />
            <ActionTile
              onClick={openUpkeep}
              accentBgClass="bg-[--color-btn-primary-bg]"
              accentTextClass="text-[--color-btn-primary-bg]"
              Icon={HandHeart}
              headline={t(lang, 'spotlight.upkeep.headline')}
              benefit={t(lang, 'spotlight.upkeep.benefit')}
              cta={t(lang, 'spotlight.upkeep.cta')}
              ta={ta}
            />
          </div>
        </div>
      </section>

      {/* ── Unified booking modal (temple dropdown + type toggle + chat) ── */}
      <HomeBookingModal open={bookOpen} onClose={closeBook} />
      <HomeDonationModal open={upkeepOpen} onClose={closeUpkeep} />
    </>
  );
}
