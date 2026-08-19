'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Clock, Building2 } from 'lucide-react';
import { TourPackage } from '@/data/tourPackages';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  pkg: TourPackage;
  durationLabel: string;
  templesLabel: string;
}

function PackageImage({ pkg, alt, duration, price }: { pkg: TourPackage; alt: string; duration: string; price: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
      {!failed ? (
        <img
          src={pkg.imageUrl}
          alt={alt}
          className="card-img"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="w-full h-full"
          style={{ background: `linear-gradient(145deg, ${pkg.gradientFrom}, ${pkg.gradientTo})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
      <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/35 backdrop-blur-sm text-white text-[11px] font-bold rounded-full">
        {duration}
      </span>
      <span className="absolute top-3 right-3 px-2.5 py-1 bg-white text-[--color-site-name] text-[11px] font-bold rounded-full shadow-sm">
        {price}
      </span>
    </div>
  );
}

export default function TourPackageCard({ pkg, durationLabel, templesLabel }: Props) {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const name        = ta ? (pkg.nameTa       ?? pkg.name)       : pkg.name;
  const duration    = ta ? (pkg.durationTa   ?? pkg.duration)   : pkg.duration;
  const priceLabel  = ta ? (pkg.priceLabelTa ?? pkg.priceLabel) : pkg.priceLabel;
  const highlights  = ta && pkg.highlightsTa ? pkg.highlightsTa : pkg.highlights;
  const taClass     = ta ? 'ta-text' : '';

  return (
    <Link href="/placeholder?page=tour-packages" className="card-root group block">
      <PackageImage pkg={pkg} alt={name} duration={duration} price={priceLabel} />
      <div className="mt-3 px-0.5">
        <h3 className={`text-[15px] font-semibold text-neutral-900 leading-snug group-hover:text-[--color-site-name] transition-colors ${taClass}`}>
          {name}
        </h3>
        <div className="flex items-center gap-4 mt-1.5">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-neutral-400" />
            <span className={`text-[12px] text-neutral-500 ${taClass}`}>{durationLabel}: {duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Building2 className="w-3 h-3 text-neutral-400" />
            <span className={`text-[12px] text-neutral-500 ${taClass}`}>{pkg.templeCount} {templesLabel}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {highlights.map((h) => (
            <span
              key={h}
              className={`text-[11px] font-semibold px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-full ${taClass}`}
            >
              {h}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
