'use client';

import { Clock, Landmark, Calendar, TicketCheck, ArrowRight, MapPin, Phone, Plane, TrainFront, Building2, Waves, Navigation, ExternalLink, Flame, type LucideIcon } from 'lucide-react';
import { useBookPooja } from '../BookPoojaContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import type { Temple } from '@/data/temples';
import SectionShell from './SectionShell';
import { cn } from '@/lib/utils';

// Icons for the distance list
const DISTANCE_ICONS: Record<string, LucideIcon> = {
  airport:  Plane,
  railway:  TrainFront,
  egmore:   TrainFront,
  tnagar:   Building2,
  marina:   Waves,
  guindy:   Building2,
};

// Build a static OpenStreetMap image URL (no API key needed)
function mapImageUrl(lat: number, lng: number, w = 800, h = 320) {
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=15&size=${w}x${h}&maptype=mapnik&markers=${lat},${lng},red-pushpin`;
}

function googleDirectionsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export default function OverviewSection({ temple }: { temple: Temple }) {
  const { lang } = useLanguage();
  const { open: openBooking } = useBookPooja();
  const ta = lang === 'ta';
  const taClass = ta ? 'ta-text' : '';
  const deity = ta ? (temple.deityTa ?? temple.deity) : temple.deity;

  return (
    <SectionShell id="overview" title={t(lang, 'templeDetail.section.overview')} taTitle={ta}>
      <div className="bg-white rounded-2xl border border-[--color-border] p-5 md:p-6">
        {/* Timing card — with Book Puja / Darshan CTA */}
        {temple.timingSummary && (
          <div className="flex items-center gap-4 pb-5 mb-5 border-b border-[--color-border] flex-wrap">
            <div className="flex items-start gap-3 flex-1 min-w-[220px]">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-[--color-site-name]" />
              </div>
              <div>
                <p className={cn('text-[12px] font-bold uppercase tracking-wider text-[--color-text-secondary]', taClass)}>
                  {t(lang, 'templeDetail.timing')}
                </p>
                <p className="text-[15px] font-semibold text-[--color-text-primary] mt-0.5">
                  {temple.timingSummary}
                </p>
                {temple.timingNote && (
                  <p className={cn('text-[12px] text-[--color-text-secondary] mt-0.5', taClass)}>
                    {ta ? t(lang, 'templeDetail.openAllDays') : temple.timingNote}
                  </p>
                )}
              </div>
            </div>

            {/* Book Pooja / Darshan button — opens the booking modal */}
            <button
              onClick={openBooking}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[--color-site-name] hover:bg-[--color-btn-primary-hover] text-white text-[13px] font-bold transition-colors flex-shrink-0',
                taClass
              )}
            >
              <TicketCheck className="w-4 h-4" />
              {t(lang, 'templeDetail.bookingCta')}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Key facts grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {deity && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                <Landmark className="w-4 h-4 text-neutral-600" />
              </div>
              <div>
                <p className={cn('text-[11px] font-bold uppercase tracking-wider text-[--color-text-secondary]', taClass)}>
                  {t(lang, 'templeDetail.primaryDeity')}
                </p>
                <p className={cn('text-[14px] font-semibold text-[--color-text-primary] mt-0.5', taClass)}>
                  {deity}
                </p>
              </div>
            </div>
          )}
          {temple.established && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-neutral-600" />
              </div>
              <div>
                <p className={cn('text-[11px] font-bold uppercase tracking-wider text-[--color-text-secondary]', taClass)}>
                  {t(lang, 'templeDetail.established')}
                </p>
                <p className="text-[14px] font-semibold text-[--color-text-primary] mt-0.5">
                  {temple.established}
                </p>
              </div>
            </div>
          )}
        </div>

        {!temple.deity && !temple.established && !temple.timingSummary && (
          <p className={cn('text-[13px] text-[--color-text-secondary]', taClass)}>
            {t(lang, 'templeDetail.contentComing')}
          </p>
        )}

        {/* ── Pooja timings (moved from its own section) ───────────────── */}
        {temple.poojas && temple.poojas.length > 0 && (
          <div className="mt-5 pt-5 border-t border-[--color-border]">
            <p className={cn('text-[11px] font-bold uppercase tracking-wider text-[--color-text-secondary] mb-3', taClass)}>
              {t(lang, 'templeDetail.section.pooja')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {temple.poojas.map((p) => {
                const label = ta ? (p.nameTa ?? p.name) : p.name;
                return (
                  <div
                    key={p.name}
                    className="flex items-center gap-3 bg-neutral-50 rounded-lg px-3 py-2"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <Flame className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-[13px] font-semibold text-[--color-text-primary] leading-tight truncate', ta && 'ta-text')}>
                        {label}
                      </p>
                    </div>
                    <span className="text-[12px] font-bold text-[--color-text-secondary] tabular-nums flex-shrink-0">
                      {p.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Contact & Address (moved from right rail) ─────────────────── */}
        {(temple.phone || temple.address) && (
          <div className="mt-5 pt-5 border-t border-[--color-border] space-y-3">
            <p className={cn('text-[11px] font-bold uppercase tracking-wider text-[--color-text-secondary]', taClass)}>
              {t(lang, 'templeDetail.contact')}
            </p>
            {temple.address && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-neutral-600" />
                </div>
                <p className="text-[14px] text-[--color-text-primary] leading-relaxed">
                  {temple.address}
                </p>
              </div>
            )}
            {temple.phone && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-neutral-600" />
                </div>
                <a
                  href={`tel:${temple.phone.replace(/\s/g, '')}`}
                  className="text-[14px] font-semibold text-[--color-text-primary] hover:text-[--color-site-name] transition-colors"
                >
                  {temple.phone}
                </a>
              </div>
            )}
          </div>
        )}

        {/* ── Location map + directions ─────────────────────────────────── */}
        {temple.coords && (
          <div className="mt-5 pt-5 border-t border-[--color-border]">
            <div className="flex items-center justify-between mb-3">
              <p className={cn('text-[11px] font-bold uppercase tracking-wider text-[--color-text-secondary]', taClass)}>
                {t(lang, 'templeDetail.location')}
              </p>
              <a
                href={googleDirectionsUrl(temple.coords.lat, temple.coords.lng)}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center gap-1 text-[12px] font-semibold text-[--color-site-name] hover:opacity-70 transition-opacity',
                  taClass
                )}
              >
                {t(lang, 'templeDetail.openInMaps')}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <a
              href={googleDirectionsUrl(temple.coords.lat, temple.coords.lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="block relative rounded-xl overflow-hidden border border-[--color-border] hover:border-[--color-site-name] transition-colors group"
            >
              {/* Static map placeholder — swap in a real map image later */}
              <div
                className="relative w-full h-[220px] md:h-[260px] flex items-center justify-center"
                style={{
                  backgroundColor: '#E8F0E4',
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px),
                    linear-gradient(135deg, #E8F0E4 0%, #DDE7DA 50%, #D4DFD1 100%)
                  `,
                  backgroundSize: '32px 32px, 32px 32px, 100% 100%',
                }}
              >
                {/* Center pin */}
                <div className="relative flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-[--color-site-name] shadow-lg flex items-center justify-center animate-bounce">
                    <MapPin className="w-5 h-5 text-white fill-white" />
                  </div>
                  <div className="w-3 h-3 rounded-full bg-[--color-site-name]/30 mt-1" />
                  <span className="mt-3 px-2.5 py-1 rounded-md bg-white text-[--color-text-primary] text-[11px] font-bold shadow-sm">
                    {ta ? (temple.nameTa ?? temple.name) : temple.name}
                  </span>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-full bg-white text-[--color-site-name] text-[12px] font-bold shadow-md flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5" />
                  {t(lang, 'templeDetail.openInMaps')}
                </span>
              </div>
            </a>
          </div>
        )}

        {/* ── How to reach — distances ──────────────────────────────────── */}
        {temple.distances && temple.distances.length > 0 && (
          <div className="mt-5 pt-5 border-t border-[--color-border]">
            <p className={cn('text-[11px] font-bold uppercase tracking-wider text-[--color-text-secondary] mb-3', taClass)}>
              {t(lang, 'templeDetail.howToReach')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {temple.distances.map((d) => {
                const Icon = DISTANCE_ICONS[d.key] ?? MapPin;
                const label = ta ? (d.placeTa ?? d.place) : d.place;
                return (
                  <div
                    key={d.key}
                    className="flex items-center gap-3 bg-neutral-50 rounded-lg px-3 py-2"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 text-neutral-500">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-[13px] font-semibold text-[--color-text-primary] leading-tight truncate', ta && 'ta-text')}>
                        {label}
                      </p>
                    </div>
                    <span className="text-[13px] font-bold text-[--color-site-name] tracking-tight flex-shrink-0">
                      {d.km} km
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </SectionShell>
  );
}
