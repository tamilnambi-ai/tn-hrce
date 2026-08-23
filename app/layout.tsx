import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider }        from '@/contexts/LanguageContext';
import { CityProvider }            from '@/contexts/CityContext';
import { TemplesSearchProvider }   from '@/contexts/TemplesSearchContext';
import WelcomeModal                from '@/components/WelcomeModal';

export const metadata: Metadata = {
  title: 'Tamil Nadu HR&CE — Hindu Religious and Charitable Endowments',
  description:
    'Official portal of the Tamil Nadu Hindu Religious and Charitable Endowments Department. Explore temples, festivals, bookings, and sacred heritage across Tamil Nadu.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts — preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Google Fonts — Merriweather + Noto Serif Tamil */}
        <link
          href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&family=Noto+Sans+Tamil:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LanguageProvider>
          <CityProvider>
            <TemplesSearchProvider>
              {children}
              <WelcomeModal />
            </TemplesSearchProvider>
          </CityProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
