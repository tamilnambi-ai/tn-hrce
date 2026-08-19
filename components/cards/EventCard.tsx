'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { TempleEvent } from '@/data/events';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props { event: TempleEvent }

function EventImage({ event, alt, badge }: { event: TempleEvent; alt: string; badge: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
      {!failed ? (
        <img
          src={event.imageUrl}
          alt={alt}
          className="card-img"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="w-full h-full"
          style={{ background: `linear-gradient(145deg, ${event.gradientFrom}, ${event.gradientTo})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 text-neutral-800 text-[11px] font-bold rounded-full tracking-wide uppercase">
        {badge}
      </span>
    </div>
  );
}

export default function EventCard({ event }: Props) {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const title       = ta ? (event.titleTa           ?? event.title)           : event.title;
  const temple      = ta ? (event.templeShortNameTa ?? event.templeShortName) : event.templeShortName;
  const area        = ta ? (event.areaTa            ?? event.area)            : event.area;
  const dateLabel   = ta ? (event.dateLabelTa       ?? event.dateLabel)       : event.dateLabel;
  const timeLabel   = ta ? (event.timeLabelTa       ?? event.timeLabel)       : event.timeLabel;
  const description = ta ? (event.descriptionTa     ?? event.description)     : event.description;
  const badge       = ta ? (event.badgeLabelTa      ?? event.badgeLabel)      : event.badgeLabel;
  const taClass     = ta ? 'ta-text' : '';

  return (
    <Link href={`/placeholder?page=events&id=${event.id}`} className="card-root group block">
      <EventImage event={event} alt={title} badge={badge} />
      <div className="mt-3 px-0.5">
        <h3 className={`text-[15px] font-semibold text-neutral-900 leading-snug group-hover:text-[--color-site-name] transition-colors ${taClass}`}>
          {title}
        </h3>
        <div className="flex items-center gap-1 mt-1.5">
          <MapPin className="w-3 h-3 text-neutral-400 flex-shrink-0" />
          <span className={`text-[13px] text-neutral-500 truncate ${taClass}`}>{temple}, {area}</span>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-neutral-400" />
            <span className={`text-[12px] text-neutral-500 ${taClass}`}>{dateLabel}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-neutral-400" />
            <span className={`text-[12px] text-neutral-500 ${taClass}`}>{timeLabel}</span>
          </div>
        </div>
        <p className={`text-[13px] text-neutral-400 mt-2 leading-relaxed line-clamp-2 ${taClass}`}>
          {description}
        </p>
      </div>
    </Link>
  );
}
