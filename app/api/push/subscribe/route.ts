import { NextResponse } from 'next/server';
import { addSubscription, removeSubscription, getSubscriptionCount } from '../../../../lib/push-subscription-store';

export const dynamic = 'force-dynamic';

/**
 * POST   -> store a browser Web Push subscription (server-initiated push)
 * DELETE -> remove a subscription by clientId
 * GET    -> return subscription count (used by admin dashboard)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const subscription = body?.subscription;
    const clientId = body?.clientId;

    if (!subscription || !subscription.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
      return NextResponse.json({ success: false, error: 'Invalid subscription payload' }, { status: 400 });
    }

    if (!clientId || typeof clientId !== 'string') {
      return NextResponse.json({ success: false, error: 'clientId is required' }, { status: 400 });
    }

    const userAgent = req.headers.get('user-agent') || undefined;
    await addSubscription(clientId, subscription, userAgent);

    return NextResponse.json({ success: true, clientId });
  } catch (err: any) {
    console.error('/api/push/subscribe error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const clientId = url.searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json({ success: false, error: 'clientId is required' }, { status: 400 });
    }

    await removeSubscription(clientId);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('/api/push/subscribe DELETE error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const count = await getSubscriptionCount();
    return NextResponse.json({ success: true, subscriptions: count });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}