import { NextResponse } from 'next/server';
import { sendWebPush } from '../../../../lib/web-push-sender';
import { getVapidKeys, isVapidConfigured } from '../../../../lib/vapid-keys';
import { getAllSubscriptions } from '../../../../lib/push-subscription-store';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { clientId, title, body } = await req.json().catch(() => ({}));
    if (!isVapidConfigured()) {
      return NextResponse.json({ success: false, error: 'VAPID keys not configured in environment' }, { status: 500 });
    }

    const vapid = getVapidKeys();
    const subs = await getAllSubscriptions();
    const target = clientId ? subs.find((s) => s.clientId === clientId) : subs[0];

    if (!target) {
      return NextResponse.json({ success: false, error: 'No active push subscription found for client' }, { status: 404 });
    }

    const payload = JSON.stringify({
      title: title || '⚡ Mivaj Sports Live Alert',
      body: body || '🟢 Test Push Notification connected successfully! Live matchday goals and bankers are now active.',
      icon: '/icons/icon-192.png',
      badge: '/icons/badge-96.png',
      url: '/?ref=test_push',
      tag: 'mivaj-test-alert',
    });

    const sent = await sendWebPush(target, payload, vapid);
    return NextResponse.json({ success: sent, clientId: target.clientId });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
