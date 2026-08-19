'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Construction } from 'lucide-react';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';

// Readable labels for each placeholder destination
const PAGE_LABELS: Record<string, string> = {
  temples:       'Temples',
  festivals:     'Festivals',
  bookings:      'Bookings',
  kudamuluku:    'Kudamuluku',
  donate:        'Donate',
  login:         'Login',
  events:        'Events',
  'tour-packages': 'Tour Packages',
  temple:        'Temple Detail',
  search:        'Search Results',
};

function PlaceholderContent() {
  const params   = useSearchParams();
  const page     = params.get('page') ?? 'page';
  const { lang } = useLanguage();
  const label    = PAGE_LABELS[page] ?? page;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-[--color-quick-action-icon-bg] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Construction className="w-10 h-10 text-[--token-brand-primary]" />
          </div>

          {/* Page name */}
          <span className="inline-block px-3 py-1 bg-[--color-quick-action-icon-bg] text-[--token-brand-primary] text-xs font-semibold rounded-full mb-4 uppercase tracking-wide">
            {label}
          </span>

          <h1 className="text-2xl font-bold text-[--color-text-primary] mb-3">
            {t(lang, 'common.comingSoon')}
          </h1>

          <p className="text-[--color-text-secondary] leading-relaxed mb-8">
            {t(lang, 'common.placeholderMsg')}
          </p>

          <Button variant="outline" asChild size="lg">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-1" />
              {t(lang, 'common.backToHome')}
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}

export default function PlaceholderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <PlaceholderContent />
    </Suspense>
  );
}
