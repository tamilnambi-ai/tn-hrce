'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Temple } from '@/data/temples';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props { temple: Temple }

function TempleImage({ temple, alt }: { temple: Temple; alt: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl">
      {!failed ? (
        <img
          src={temple.imageUrl}
          alt={alt}
          className="card-img"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="w-full h-full"
          style={{ background: `linear-gradient(145deg, ${temple.gradientFrom}, ${temple.gradientTo})` }}
        />
      )}
    </div>
  );
}

export default function TempleCard({ temple }: Props) {
  const { lang } = useLanguage();
  const name = lang === 'ta' ? (temple.nameTa ?? temple.name) : temple.name;
  const area = lang === 'ta' ? (temple.areaTa ?? temple.area) : temple.area;

  return (
    <Link href={`/temples/${temple.id}`} className="card-root group block">
      <TempleImage temple={temple} alt={name} />
      <div className="mt-3 px-0.5">
        <h3 className={`text-[15px] font-semibold text-neutral-900 leading-snug group-hover:text-[--color-site-name] transition-colors line-clamp-2 ${lang === 'ta' ? 'ta-text' : ''}`}>
          {name}
        </h3>
        <div className="flex items-center gap-1 mt-1">
          <MapPin className="w-3 h-3 text-neutral-400 flex-shrink-0" />
          <span className={`text-[13px] text-neutral-500 ${lang === 'ta' ? 'ta-text' : ''}`}>{area}</span>
        </div>
      </div>
    </Link>
  );
}
