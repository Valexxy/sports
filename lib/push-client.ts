'use client';

/**
 * CLIENT PUSH SUBSCRIPTION MANAGER
 * Handles VAPID public key retrieval, Notification permission, and registering
 * the browser PushSubscription with the server so true server-initiated push
 * works even after the tab is closed.
 */

function generateClientId(): string {
  const KEY = 'aurascore_push_client_id';
  try {
    const existing = localStorage.getItem(KEY);
    if (existing) return existing;
    const id = `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(KEY, id);
    return id;
  } catch {
    return `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

export const pushClientId = typeof window !== 'undefined' ? generateClientId() : '';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export interface PushRegistrationResult {
  supported: boolean;
  granted: boolean;
  configured: boolean;
  registered: boolean;
  error?: string;
}

export async function registerPushClient(): Promise<PushRegistrationResult> {
  const notSupported: PushRegistrationResult = { supported: false, granted: false, configured: false, registered: false };

  if (typeof window === 'undefined') return notSupported;
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return { ...notSupported, error: 'push_not_supported' };
  }

  // 1. Permission
  let permission = Notification.permission;
  if (permission === 'default') {
    try {
      permission = await Notification.requestPermission();
    } catch {
      permission = 'denied';
    }
  }
  if (permission !== 'granted') {
    return { supported: true, granted: false, configured: false, registered: false, error: 'permission_denied' };
  }

  // 2. Fetch VAPID public key
  let publicKey = '';
  let configured = false;
  try {
    const res = await fetch('/api/push/vapid', { cache: 'no-store' });
    const data = await res.json();
    configured = !!data.configured;
    publicKey = data.publicKey || '';
  } catch {
    publicKey = '';
  }

  if (!configured || !publicKey) {
    return { supported: true, granted: true, configured: false, registered: false, error: 'vapid_not_configured' };
  }

  // 3. Register with SW and subscribe
  try {
    const reg = await navigator.serviceWorker.ready;
    const applicationServerKey = urlBase64ToUint8Array(publicKey);

    // Reuse an existing subscription, or create a new one.
    let subscription = await reg.pushManager.getSubscription();
    if (!subscription) {
      subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey as unknown as BufferSource,
      });
    }

    const payload = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.toJSON().keys?.p256dh || '',
        auth: subscription.toJSON().keys?.auth || '',
      },
    };

    const res = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId: pushClientId, subscription: payload }),
    });

    return { supported: true, granted: true, configured: true, registered: res.ok };
  } catch (err: any) {
    return { supported: true, granted: true, configured: true, registered: false, error: err?.message };
  }
}

export async function unregisterPushClient(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    await fetch(`/api/push/subscribe?clientId=${encodeURIComponent(pushClientId)}`, { method: 'DELETE' });
    return true;
  } catch {
    return false;
  }
}