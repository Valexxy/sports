'use client';

/**
 * PUSH CLIENT ENGINE (Browser & PWA Web Push Manager)
 * Provides 1-tap permission request, VAPID key registration, and client subscription.
 */

export class PushClientEngine {
  private static CLIENT_ID_KEY = 'mivaj_push_client_id';

  public static getOrCreateClientId(): string {
    if (typeof window === 'undefined') return '';
    let cid = localStorage.getItem(this.CLIENT_ID_KEY);
    if (!cid) {
      cid = 'client_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      localStorage.setItem(this.CLIENT_ID_KEY, cid);
    }
    return cid;
  }

  private static urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  public static async isSubscribed(): Promise<boolean> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) return false;
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      return !!sub;
    } catch {
      return false;
    }
  }

  public static async subscribe(): Promise<{ ok: boolean; error?: string }> {
    if (typeof window === 'undefined') return { ok: false, error: 'SSR environment' };
    
    if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      return { 
        ok: false, 
        error: 'Web Push is not supported in this browser. On iOS, tap "Share" ➔ "Add to Home Screen" first.' 
      };
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return { ok: false, error: 'Notification permission was denied in browser settings.' };
      }

      // Fetch dynamic VAPID public key from backend
      const vapidRes = await fetch('/api/push/vapid').then((r) => r.json()).catch(() => ({}));
      const publicKey = vapidRes.publicKey || process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BOlf5oEh7Vxd1DcjVgZKQLbZSEeNIZOD2l5vJsPNCV5YMRoY8AQ4TneomdIpkMHzNymAMRAU1eGFkX65_OLTinI';

      const reg = await navigator.serviceWorker.ready;
      let sub = await reg.pushManager.getSubscription();

      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(publicKey),
        });
      }

      const clientId = this.getOrCreateClientId();
      const saveRes = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: sub.toJSON(),
          clientId,
        }),
      });

      if (!saveRes.ok) throw new Error('Failed to record subscription on server');

      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err.message || 'Push registration failed' };
    }
  }

  public static async triggerTestNotification(): Promise<boolean> {
    try {
      const clientId = this.getOrCreateClientId();
      const res = await fetch('/api/push/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}
