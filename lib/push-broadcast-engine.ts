/**
 * PUSH BROADCAST ENGINE
 * Fans out server-initiated Web Push notifications to all subscribed devices,
 * and provides a QStash-scheduled variant for true background delivery.
 */

import { Client } from '@upstash/qstash';
import { sendWebPush, WebPushMessage } from './web-push-sender';
import { getVapidKeys, isVapidConfigured } from './vapid-keys';
import { getAllSubscriptions } from './push-subscription-store';

export interface BroadcastResult {
  ok: boolean;
  sent: number;
  failed: number;
  total: number;
  mode: 'real_push' | 'no_vapid' | 'qstash_queued' | 'empty';
}

const ICON = '/icons/icon-192.png';
const BADGE = '/icons/badge-96.png';

function resolveVapid() {
  if (!isVapidConfigured()) return null;
  return getVapidKeys();
}

export async function broadcastPushMessage(
  message: WebPushMessage,
  options: { url?: string } = {},
): Promise<BroadcastResult> {
  const vapid = resolveVapid();
  if (!vapid) {
    console.warn('[push-broadcast] VAPID not configured; skipping external fan-out.');
    return { ok: true, sent: 0, failed: 0, total: 0, mode: 'no_vapid' };
  }

  const subscriptions = await getAllSubscriptions();
  if (subscriptions.length === 0) {
    return { ok: true, sent: 0, failed: 0, total: 0, mode: 'empty' };
  }

  const fullMessage: WebPushMessage = {
    ...message,
    icon: message.icon || ICON,
    badge: message.badge || BADGE,
    url: options.url || message.url || '/',
  };

  const payload = JSON.stringify(fullMessage);

  let sent = 0;
  let failed = 0;
  await Promise.all(
    subscriptions.map(async (sub) => {
      const ok = await sendWebPush(sub, payload, vapid);
      if (ok) sent += 1;
      else failed += 1;
    }),
  );

  return { ok: true, sent, failed, total: subscriptions.length, mode: 'real_push' };
}

/**
 * Schedule a one-off or recurring background broadcast via QStash.
 * The QStash service will hit the configured webhook endpoint, which in turn
 * fans out the real Web Push to all devices. This is the true
 * server-initiated/background path.
 */
export async function schedulePushViaQstash(
  message: WebPushMessage,
  scheduleAt?: Date,
): Promise<{ messageId?: string; ok: boolean; error?: string }> {
  try {
    const token = process.env.QSTASH_TOKEN;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL;
    const webhook = process.env.QSTASH_PUSH_WEBHOOK_URL || (siteUrl ? `${siteUrl}/api/push/deliver` : undefined);

    if (!token || !webhook) {
      return { ok: false, error: 'QStash token/webhook not configured' };
    }

    const client = new Client({ token });

    const response = await client.publishJSON({
      url: webhook,
      body: { message },
      ...(scheduleAt ? { notBefore: Math.floor(scheduleAt.getTime() / 1000) } : {}),
    });

    return { ok: true, messageId: response.messageId };
  } catch (err: any) {
    console.warn('[push-broadcast] QStash schedule error:', err?.message);
    return { ok: false, error: err?.message || 'qstash_schedule_failed' };
  }
}