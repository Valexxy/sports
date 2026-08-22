'use client';

import { stadiumAudio } from './sound-synthesizer';

export type VibrationPattern = 
  | 'GOAL_SCORED' 
  | 'RED_CARD' 
  | 'MATCH_SETTLED_WON' 
  | 'BANKER_LOCKED' 
  | 'HEARTBEAT' 
  | 'SELECTION'
  | 'OFFLINE_ALERT'
  | 'ONLINE_RESTORED'
  | 'BATTERY_LOW';

class PhoneHardwareEngine {
  private wakeLock: any = null;
  public isNotificationSupported: boolean = false;
  public isVibrationSupported: boolean = false;
  public isWakeLockSupported: boolean = false;
  public isBadgingSupported: boolean = false;
  private isListeningOffline: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.isNotificationSupported = 'Notification' in window && 'serviceWorker' in navigator;
      this.isVibrationSupported = 'vibrate' in navigator;
      this.isWakeLockSupported = 'wakeLock' in navigator;
      this.isBadgingSupported = 'setAppBadge' in navigator;
      this.initHardwareAlertListeners();
    }
  }

  // Initialize Inbuilt Hardware & Offline Listeners
  public initHardwareAlertListeners() {
    if (typeof window === 'undefined' || this.isListeningOffline) return;
    this.isListeningOffline = true;

    // 1. Inbuilt Offline Hardware Alert
    window.addEventListener('offline', () => {
      this.triggerHaptic('OFFLINE_ALERT');
      this.sendNativeNotification(
        '📶 Offline Mode Active (Zero Data)',
        'Cached match predictions and offline Dixon-Coles AI engine are running seamlessly.',
        '/favicon.ico'
      );
    });

    // 2. Inbuilt Online Restored Alert
    window.addEventListener('online', () => {
      this.triggerHaptic('ONLINE_RESTORED');
      stadiumAudio.playCrowdRoar();
      this.sendNativeNotification(
        '⚡ AuraScore Online Connected',
        'Live match odds, scores and telemetry synchronized from global edge servers.',
        '/favicon.ico'
      );
    });

    // 3. Low Battery Optimization Alert (< 20%)
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        battery.addEventListener('levelchange', () => {
          if (battery.level <= 0.20 && !battery.charging) {
            this.triggerHaptic('BATTERY_LOW');
          }
        });
      }).catch(() => {});
    }

    // 4. Device Shake Gesture for Surprise Banker of the Day
    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      let lastX = 0, lastY = 0, lastZ = 0, lastTime = 0;
      window.addEventListener('devicemotion', (e) => {
        const current = e.accelerationIncludingGravity;
        if (!current) return;
        const now = Date.now();
        if ((now - lastTime) > 300) {
          const diffTime = now - lastTime;
          lastTime = now;
          const speed = Math.abs((current.x || 0) + (current.y || 0) + (current.z || 0) - lastX - lastY - lastZ) / diffTime * 10000;
          if (speed > 800) {
            this.triggerHaptic('MATCH_SETTLED_WON');
            stadiumAudio.playCrowdRoar();
          }
          lastX = current.x || 0;
          lastY = current.y || 0;
          lastZ = current.z || 0;
        }
      });
    }
  }

  // Request Native Lock-Screen Push Notification Permissions
  public async requestNotificationPermission(): Promise<boolean> {
    if (!this.isNotificationSupported) return false;
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        this.sendNativeNotification(
          '⚡ AuraScore Stadium Connected',
          'Live goal alerts, banker locks, and referee settlements will wake your phone in the background even offline.',
          '/favicon.ico'
        );
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  // Dispatch Native OS Notification (Even when phone is locked or app is in background)
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
      new Notification(title, { body, icon });
    } catch (e) {}
  }

  // Inbuilt Vibration Motor Alert Patterns
  public triggerHaptic(pattern: VibrationPattern = 'BANKER_LOCKED') {
    if (!this.isVibrationSupported) return;

    try {
      switch (pattern) {
        case 'GOAL_SCORED':
          navigator.vibrate([200, 80, 200, 80, 400]); // Goal rumble
          break;
        case 'RED_CARD':
          navigator.vibrate([500, 150, 500]); // Strong double alarm
          break;
        case 'MATCH_SETTLED_WON':
          navigator.vibrate([100, 50, 100, 50, 250, 50, 400]); // Victory pulse
          break;
        case 'OFFLINE_ALERT':
          navigator.vibrate([150, 50, 150]); // Offline pattern
          break;
        case 'ONLINE_RESTORED':
          navigator.vibrate([80, 40, 80, 40, 120]); // Online chime
          break;
        case 'BATTERY_LOW':
          navigator.vibrate([300, 100, 300]);
          break;
        case 'HEARTBEAT':
          navigator.vibrate([80, 120, 80]);
          break;
        case 'SELECTION':
          navigator.vibrate([40]);
          break;
        case 'BANKER_LOCKED':
        default:
          navigator.vibrate([80]);
          break;
      }
    } catch (e) {}
  }

  // Screen Wake Lock (Keeps phone screen awake during live matches)
  public async enableStadiumWakeLock(): Promise<boolean> {
    if (!this.isWakeLockSupported) return false;
    try {
      this.wakeLock = await (navigator as any).wakeLock.request('screen');
      return true;
    } catch (err) {
      return false;
    }
  }

  public releaseWakeLock() {
    if (this.wakeLock) {
      this.wakeLock.release().catch(() => {});
      this.wakeLock = null;
    }
  }

  public releaseStadiumWakeLock() {
    this.releaseWakeLock();
  }
}

export const phoneHardware = new PhoneHardwareEngine();
