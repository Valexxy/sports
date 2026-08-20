'use client';

import { useEffect, useState } from 'react';

export function useScreenWakeLock() {
  const [wakeLockActive, setWakeLockActive] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('wakeLock' in navigator)) return;

    let wakeLockSentinel: any = null;

    const requestWakeLock = async () => {
      try {
        wakeLockSentinel = await (navigator as any).wakeLock.request('screen');
        setWakeLockActive(true);
        console.log('⚡ Screen Wake Lock Active: Phone screen will stay awake during live match updates.');
      } catch (err) {
        console.warn('Wake Lock request failed or denied:', err);
      }
    };

    requestWakeLock();

    const handleVisibilityChange = () => {
      if (wakeLockSentinel !== null && document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLockSentinel) {
        wakeLockSentinel.release();
      }
    };
  }, []);

  return wakeLockActive;
}
