import { PwaRegister } from '../components/pwa-register';
import { PwaInstallPromptModal } from '../components/pwa/PwaInstallPromptModal';
import { PersistentDynamicIslandPlayer } from '../components/audio/PersistentDynamicIslandPlayer';
import { PageviewMonetizer } from '../components/monetization/PageviewMonetizer';
import { EnvironmentIntelHeader } from '../components/environment-intel-header';
import './globals.css';
import { LanguageProvider } from '../lib/translation-engine';
import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#05070B',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://mivaj.com'),
  title: {
    default: 'Mivaj Sports | 100% Free Football Predictions, Live Scores & Matchday Intelligence',
    template: '%s | Mivaj Sports | 100% Free Football Predictions & Live Match Center',
  },
  description: 'Real-time live scores, Expected Goals (xG), Referee-Audited match settlement ledger, live goal haptic notifications, and football intelligence across top world leagues.',
  keywords: [
    'Mivaj Sports',
    'Free football predictions',
    'Premier League live scores',
    'La Liga predictions',
    'Champions League match center',
    'Audited match settlement ledger',
    'Live sports betting intelligence',
    'Football banker picks',
    'xG pitch analytics',
    'Mivaj Tips'
  ],
  authors: [{ name: 'Mivaj Sports Intelligence' }],
  creator: 'Mivaj Sports',
  publisher: 'Mivaj Sports Global Media',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://mivaj.com',
  },
  openGraph: {
    title: 'Mivaj Sports | 100% Free Football Predictions & Live Match Center',
    description: 'Sub-second live scores, verified referee settlement ledger, xG pitch heatmaps, and live goal haptic vibrations.',
    url: 'https://mivaj.com',
    siteName: 'Mivaj Sports',
    images: [
      {
        url: '/logo.svg',
        width: 512,
        height: 512,
        alt: 'Mivaj Sports Banner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mivaj Sports | 100% Free Football Predictions & Live Match Center',
    description: 'Real-time live scores, verified referee match settlement ledger, and football match intelligence.',
    images: ['/logo.svg'],
    creator: '@MivajSports',
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
    name: 'Mivaj Sports',
    url: 'https://mivaj.com',
    logo: 'https://mivaj.com/logo.svg',
    email: 'mivajtips@gmail.com',
    description: 'World-First Free Football Match Predictions, Live Goal Heartbeat Haptics, Referee-Audited Settlement Ledger, and Real-time Matchday Intelligence.',
    sport: 'Football, Soccer',
    sameAs: [
      'https://t.me/mivasport',
      'https://twitter.com/MivajSports',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'mivajtips@gmail.com',
      contactType: 'Customer Support & Tips Inquiries',
    },
  };

  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover" />
        <meta name="theme-color" content="#05070B" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Mivaj Sports" />
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

        <LanguageProvider>
          {/* Universal Environment, Location, Dialect & Weather Header */}
          <EnvironmentIntelHeader />

          {children}

          {/* Persistent Dynamic Island Global Player Bar */}
          <PersistentDynamicIslandPlayer />

          {/* PWA Lifecycle Engine */}
          <PwaRegister />
          <PwaInstallPromptModal />

          {/* Pageview Monetization Core */}
          <PageviewMonetizer />
        </LanguageProvider>

        {/* Universal Script for Google Translate */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                if (window.google && window.google.translate) {
                  new window.google.translate.TranslateElement({
                    pageLanguage: 'en',
                    autoDisplay: false
                  }, 'google_translate_element');
                }
              }
            `
          }}
        />
        <script
          type="text/javascript"
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          async
          defer
        />
      </body>
    </html>
  );
}
