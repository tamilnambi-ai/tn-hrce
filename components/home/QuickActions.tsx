'use client';

import Link from 'next/link';
import { CalendarDays, Sparkles, Droplets, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';

const actions = [
  { key: 'quickActions.templeBookings', href: '/placeholder?page=bookings',   Icon: CalendarDays, iconColor: 'text-[--color-quick-icon]',   iconBg: 'bg-[--color-quick-icon-bg]' },
  { key: 'quickActions.festivals',      href: '/placeholder?page=festivals',  Icon: Sparkles,     iconColor: 'text-rose-600',               iconBg: 'bg-rose-50' },
  { key: 'quickActions.kudamuluku',     href: '/placeholder?page=kudamuluku', Icon: Droplets,     iconColor: 'text-sky-600',                iconBg: 'bg-sky-50' },
  { key: 'quickActions.donate',         href: '/placeholder?page=donate',     Icon: Heart,        iconColor: 'text-emerald-600',            iconBg: 'bg-emerald-50' },
];

export default function QuickActions() {
  const { lang } = useLanguage();

  return (
    <section className="bg-[#ffefe0] border-b border-[--color-border]">
      <div className="container-page">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 divide-x divide-[--color-border]">
          {actions.map(({ key, href, Icon, iconColor, iconBg }) => (
            <Link
              key={key}
              href={href}
              className="group flex flex-col items-center gap-2.5 py-6 px-4 hover:bg-neutral-50 transition-colors"
            >
              <div className={`w-11 h-11 rounded-2xl ${iconBg} flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <span className={`text-[13px] font-semibold text-neutral-600 group-hover:text-neutral-900 transition-colors text-center leading-tight ${lang === 'ta' ? 'ta-text' : ''}`}>
                {t(lang, key)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
