import { PwaRegister } from '../components/pwa-register';
import { PwaInstallPromptModal } from '../components/pwa/PwaInstallPromptModal';
import { PersistentDynamicIslandPlayer } from '../components/audio/PersistentDynamicIslandPlayer';
import './globals.css';
import { LanguageProvider } from '../lib/translation-engine';
import type { Metadata, Viewport } from 'next';


import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#05070B',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://aurascore.stadium.app'),
  title: {
    default: 'Mivaj Sports | 100% Free Football Predictions & Live Match Center | World-First Live Sports Analytics & Matchday Super-App',
    template: '%s | Mivaj Sports | 100% Free Football Predictions & Live Match Center',
  },
  description: 'Real-time live scores, Expected goals (xG), referee-verified match settlement ledger, and Gen-Z stadium atmosphere across 12 top leagues.',
  keywords: [
    'Live sports scores',
    'Football predictions',
    'Premier League live scores',
    'La Liga standings',
    'Champions League match center',
    'Arbitrage odds calculator',
    'Match settlement ledger',
    'Sports betting edge',
    'Verified banker picks',
    'AuraScore Stadium'
  ],
  authors: [{ name: 'AuraScore Stadium Engineering' }],
  creator: 'AuraScore Stadium',
  publisher: 'AuraScore Global Media',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Mivaj Sports | 100% Free Football Predictions & Live Match Center | World-First Live Sports Analytics & Matchday Super-App',
    description: 'Sub-second live scores, verified referee settlement ledger, Goal Power curves, and viral social flex slip generator.',
    url: 'https://aurascore.stadium.app',
    siteName: 'Mivaj Sports | 100% Free Football Predictions & Live Match Center',
    images: [
      {
        url: '/favicon.ico',
        width: 512,
        height: 512,
        alt: 'Mivaj Sports | 100% Free Football Predictions & Live Match Center Banner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mivaj Sports | 100% Free Football Predictions & Live Match Center | Live Sports Analytics & Matchday Super-App',
    description: 'Real-time live scores, verified referee match settlement ledger, and viral social flex slips.',
    images: ['/favicon.ico'],
    creator: '@AuraScoreStadium',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-token',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icon.svg',
    shortcut: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsOrganization',
    name: 'Mivaj Sports | 100% Free Football Predictions & Live Match Center',
    url: 'https://aurascore.stadium.app',
    logo: 'https://aurascore.stadium.app/favicon.ico',
    description: 'World-First Live Sports Analytics, Match Predictions & Stadium Crowd Atmosphere Super-App',
    sport: 'Football, Basketball, Tennis',
    sameAs: [
      'https://twitter.com/AuraScoreStadium',
      'https://instagram.com/AuraScoreStadium',
    ],
  };

  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover" />
        <meta name="theme-color" content="#0a0f1d" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AuraScore" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icons/icon-192.png" sizes="192x192" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="description" content="Real-time live scores, xG analytics, and match commentary across top football leagues." />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-void text-white min-h-screen antialiased selection:bg-stadiumGreen selection:text-black">
        
        {/* OFFICIAL GOOGLE TRANSLATE ENGINE (100% UNIVERSAL COVERAGE) */}
        <div id="google_translate_element" style={{ display: 'none' }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                if (window.google && window.google.translate) {
                  new window.google.translate.TranslateElement({
                    pageLanguage: 'en',
                    includedLanguages: 'en,ha,yo,ig,fr,es,de,ar,pt,sw',
                    autoDisplay: false
                  }, 'google_translate_element');
                }
              }
            `,
          }}
        />
        <script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" async />

        <LanguageProvider>
          <PwaRegister />
          <PwaInstallPromptModal />
          <PersistentDynamicIslandPlayer />
          {children}
        </LanguageProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('⚡ ServiceWorker registered with scope:', registration.scope);
                  }).catch(function(err) {
                    console.warn('ServiceWorker registration error:', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
