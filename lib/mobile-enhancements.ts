/**
 * MOBILE ENHANCEMENTS FOR AURASCORE STADIUM
 * Advanced mobile-specific features for premium user experience
 */

import { cacheOffline } from './offline-manager';

// Mobile-specific feature detection
export const mobileFeatures = {
  // Check if device supports advanced features
  hasVibration: typeof navigator !== 'undefined' && 'vibrate' in navigator,
  hasGeolocation: typeof navigator !== 'undefined' && 'geolocation' in navigator,
  hasAccelerometer: typeof window !== 'undefined' && 'DeviceOrientationEvent' in window,
  hasTouch: typeof window !== 'undefined' && 'ontouchstart' in window,
  isPWA: typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches,
};

// Advanced offline capabilities
export class MobileOfflineManager {
  static async cacheEssentialData() {
    try {
      // Cache critical data for offline use
      await cacheOffline('essential_matches', []);
      await cacheOffline('user_preferences', {});
      await cacheOffline('cached_predictions', []);
      
      if ('caches' in window) {
        // Cache essential API responses
        const cache = await caches.open('aurascore-essential');
        await cache.addAll([
          '/api/matches?limit=20',
          '/api/standings',
          '/api/news?limit=10'
        ]);
      }
    } catch (error) {
      console.warn('Mobile offline caching failed:', error);
    }
  }

  static async backgroundSync() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        // Check if sync manager is available
        if ('sync' in registration) {
          await (registration as any).sync.register('background-sync');
          console.log('Background sync registered');
        }
      } catch (error) {
        console.warn('Background sync not supported:', error);
      }
    }
  }
}

// Mobile-optimized UI utilities
export class MobileUI {
  static enableSmoothScrolling() {
    if (typeof document !== 'undefined') {
      document.documentElement.style.scrollBehavior = 'smooth';
    }
  }

  static addTouchEffects() {
    if (typeof document !== 'undefined' && mobileFeatures.hasTouch) {
      // Add touch-friendly styles
      const style = document.createElement('style');
      style.textContent = `
        button, .clickable {
          min-height: 44px;
          min-width: 44px;
          touch-action: manipulation;
        }
        
        .touch-feedback:active {
          transform: scale(0.97);
          opacity: 0.8;
        }
      `;
      document.head.appendChild(style);
    }
  }

  static optimizeImages() {
    // Lazy load images for mobile
    if (typeof document !== 'undefined') {
      const images = document.querySelectorAll('img[data-src]');
      images.forEach(img => {
        if ('loading' in HTMLImageElement.prototype) {
          img.setAttribute('loading', 'lazy');
        }
      });
    }
  }
}

// Hardware integration
export class MobileHardware {
  static async requestNotificationPermission() {
    if ('Notification' in window) {
      return await Notification.requestPermission();
    }
    return 'denied';
  }

  static vibrate(pattern: number | number[] = 200) {
    if (mobileFeatures.hasVibration) {
      try {
        navigator.vibrate(pattern);
      } catch (error) {
        console.warn('Vibration failed:', error);
      }
    }
  }

  static async getGeolocation(): Promise<{lat: number; lon: number} | null> {
    if (mobileFeatures.hasGeolocation) {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude
            });
          },
          () => resolve(null),
          { timeout: 5000, maximumAge: 300000 }
        );
      });
    }
    return null;
  }
}

// Battery optimization
export class BatteryManager {
  static async getBatteryStatus() {
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        return {
          level: battery.level,
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime
        };
      } catch (error) {
        console.warn('Battery API not supported:', error);
        return null;
      }
    }
    return null;
  }

  static optimizeForLowBattery(callback: (isLow: boolean) => void) {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const checkBattery = () => {
          callback(battery.level < 0.2 && !battery.charging);
        };
        
        checkBattery();
        battery.addEventListener('levelchange', checkBattery);
        battery.addEventListener('chargingchange', checkBattery);
      });
    }
  }
}

// Network status monitoring
export class NetworkManager {
  static onNetworkChange(callback: (online: boolean) => void) {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => callback(true));
      window.addEventListener('offline', () => callback(false));
      callback(navigator.onLine);
    }
  }

  static getConnectionInfo() {
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      return {
        effectiveType: conn.effectiveType,
        downlink: conn.downlink,
        rtt: conn.rtt,
        saveData: conn.saveData
      };
    }
    return null;
  }
}