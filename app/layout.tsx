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
