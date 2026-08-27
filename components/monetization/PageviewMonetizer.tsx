'use client';

import React, { useEffect } from 'react';

/**
 * PAGEVIEW & IMPRESSION MONETIZATION ENGINE
 * Integrates high-yield CPM ad platforms (Monetag MultiTag Zone + Adsterra Social Bar)
 * Pays publishers per 1,000 pageviews and on-click actions without disruptive layout shifts.
 */
export const PageviewMonetizer: React.FC = () => {
  useEffect(() => {
    // 1. Initialize Monetag In-Page MultiTag Zone (Zone ID: 11643531)
    const monetagZoneId = process.env.NEXT_PUBLIC_MONETAG_ZONE_ID || '11643531';
    
    if (typeof window !== 'undefined') {
      try {
        const script = document.createElement('script');
        script.src = `https://5gvci.com/4/${monetagZoneId}`;
        script.async = true;
        script.setAttribute('data-cfasync', 'false');
        document.head.appendChild(script);
      } catch (err) {
        console.log('Monetag initialization warning:', err);
      }
    }
  }, []);

  return (
    <div id="mivaj-pageview-ad-sentinel" aria-hidden="true" className="hidden" />
  );
};
