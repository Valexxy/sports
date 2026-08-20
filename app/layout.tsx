import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://aurascore.stadium.app'),
  title: {
    default: 'AuraScore Stadium 2.0 | World-First Live Sports Analytics & Matchday Super-App',
    template: '%s | AuraScore Stadium 2.0',
  },
  description: 'Real-time live scores, Poisson expected goals (xG), referee-verified match settlement ledger, and Gen-Z stadium atmosphere across 12 top leagues.',
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
    title: 'AuraScore Stadium 2.0 | World-First Live Sports Analytics & Matchday Super-App',
    description: 'Sub-second live scores, verified referee settlement ledger, Poisson goal power curves, and viral social flex slip generator.',
    url: 'https://aurascore.stadium.app',
    siteName: 'AuraScore Stadium 2.0',
    images: [
      {
        url: '/favicon.ico',
        width: 512,
        height: 512,
        alt: 'AuraScore Stadium 2.0 Banner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AuraScore Stadium 2.0 | Live Sports Analytics & Matchday Super-App',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsOrganization',
    name: 'AuraScore Stadium 2.0',
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
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a0f1d" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-void text-white min-h-screen antialiased selection:bg-stadiumGreen selection:text-black">
        {children}
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
