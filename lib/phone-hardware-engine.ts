'use client';

// Advanced Phone Hardware & Background Service Worker Integration Engine
export type VibrationPattern = 'GOAL_SCORED' | 'RED_CARD' | 'MATCH_SETTLED_WON' | 'BANKER_LOCKED' | 'HEARTBEAT' | 'SELECTION';

class PhoneHardwareEngine {
  private wakeLock: any = null;
  public isNotificationSupported: boolean = false;
  public isVibrationSupported: boolean = false;
  public isWakeLockSupported: boolean = false;
  public isBadgingSupported: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.isNotificationSupported = 'Notification' in window && 'serviceWorker' in navigator;
      this.isVibrationSupported = 'vibrate' in navigator;
      this.isWakeLockSupported = 'wakeLock' in navigator;
      this.isBadgingSupported = 'setAppBadge' in navigator;
    }
  }

  // 1. Request Native Background Notification Permissions (Lock-Screen Push)
  public async requestNotificationPermission(): Promise<boolean> {
    if (!this.isNotificationSupported) return false;
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        this.sendNativeNotification(
          '⚡ AuraScore Stadium Connected',
          'Live goal alerts, banker locks, and referee settlements will wake your phone in the background.',
          '/favicon.ico'
        );
        return true;
      }
      return false;
    } catch (e) {
      console.warn('Notification permission error:', e);
      return false;
    }
  }

  // 2. Dispatch Native OS Lock-Screen Push Notification (Via Service Worker or Notification API)
  public async sendNativeNotification(title: string, body: string, icon: string = '/favicon.ico', data?: any) {
    if (!this.isNotificationSupported || Notification.permission !== 'granted') return;

    try {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready;
        if (reg && reg.showNotification) {
          reg.showNotification(title, {
            body,
            icon,
            badge: icon,
            vibrate: [200, 100, 200, 100, 400],
            data: data || { url: '/' },
            tag: 'aurascore-match-alert',
          } as NotificationOptions);
          return;
        }
      }
      // Fallback
      new Notification(title, { body, icon });
    } catch (e) {
      console.warn('Native notification dispatch failed:', e);
    }
  }

  // 3. Hardware Haptic Feedback (Phone Vibration Motor)
  public triggerHaptic(pattern: VibrationPattern = 'BANKER_LOCKED') {
    if (!this.isVibrationSupported) return;

    try {
      switch (pattern) {
        case 'GOAL_SCORED':
          navigator.vibrate([200, 80, 200, 80, 400]); // Energetic goal celebration rumble
          break;
        case 'RED_CARD':
          navigator.vibrate([500, 150, 500]); // Strong double alarm
          break;
        case 'MATCH_SETTLED_WON':
          navigator.vibrate([100, 50, 100, 50, 250, 50, 400]); // Fan victory pulse
          break;
        case 'HEARTBEAT':
          navigator.vibrate([80, 120, 80]); // High tension in-play
          break;
        case 'SELECTION':
          navigator.vibrate([40]); // Crisp tactile tap feedback
          break;
        case 'BANKER_LOCKED':
        default:
          navigator.vibrate([80]); // Subtle confirmation click
          break;
      }
    } catch (e) {
      // Ignored if user has disabled haptics in OS
    }
  }

  // 4. Screen Wake Lock (Keeps screen alive during critical matches)
  public async enableStadiumWakeLock(): Promise<boolean> {
    if (!this.isWakeLockSupported) return false;
    try {
      if (!this.wakeLock) {
        this.wakeLock = await (navigator as any).wakeLock.request('screen');
        this.wakeLock.addEventListener('release', () => {
          this.wakeLock = null;
        });
        return true;
      }
      return true;
    } catch (e) {
      console.warn('WakeLock request failed:', e);
      return false;
    }
  }

  public releaseStadiumWakeLock() {
    if (this.wakeLock) {
      this.wakeLock.release().catch(() => {});
      this.wakeLock = null;
    }
  }

  // 5. Phone App Icon Badging API (Shows live goal counts on home screen)
  public updateAppBadge(count: number) {
    if (this.isBadgingSupported) {
      try {
        if (count > 0) {
          (navigator as any).setAppBadge(count).catch(() => {});
        } else {
          (navigator as any).clearAppBadge().catch(() => {});
        }
      } catch (e) {}
    }
  }
}

export const phoneHardware = new PhoneHardwareEngine();
