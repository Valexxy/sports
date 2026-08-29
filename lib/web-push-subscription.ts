'use client';
/**
 * WEB PUSH NOTIFICATION SUBSCRIPTION MANAGER
 * Enables background notifications (goal alerts, match start, banker tips)
 * even when the app is closed. Requires a service worker at /sw.js.
 *
 * Battery-safe: PushManager is already extremely efficient. The browser
 * handles push wake-ups natively; no background polling needed.
 */

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_KEY || '';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Subscribe the browser to Web Push notifications.
 * Requests permission, registers with the VAPID key, and posts
 * the subscription endpoint to our /api/push/subscribe endpoint.
 */
export async function subscribeToWebPush(): Promise<PushSubscription | null> {
  if (
    typeof window === 'undefined' ||
    !('serviceWorker' in navigator) ||
    !('PushManager' in window)
  ) {
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;

    const reg = await navigator.serviceWorker.ready;

    // Return existing subscription if already subscribed
    const existing = await reg.pushManager.getSubscription();
    if (existing) return existing;

    if (!VAPID_PUBLIC_KEY) {
      console.warn('[WebPush] No VAPID_KEY configured. Skipping push subscription.');
      return null;
    }

    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    // Register subscription with our backend
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription }),
    }).catch(() => {/* ignore — subscription still works locally */});

    return subscription;
  } catch {
    return null;
  }
}

/** Unsubscribe from Web Push notifications */
export async function unsubscribeFromWebPush(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return false;
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (!sub) return true;
    const result = await sub.unsubscribe();
    // Also notify backend to clean up
    await fetch('/api/push/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint: sub.endpoint }),
    }).catch(() => {});
    return result;
  } catch { return false; }
}

/** Check if push notifications are currently active */
export async function isPushSubscribed(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return false;
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    return !!sub;
  } catch { return false; }
}
