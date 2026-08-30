import { NextResponse } from 'next/server';
import { removeSubscription } from '../../../../lib/push-subscription-store';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const endpoint = body?.endpoint;
    const clientId = body?.clientId;

    if (clientId) {
      await removeSubscription(clientId);
    }

    return NextResponse.json({
      success: true,
      message: 'Push subscription removed successfully',
      endpoint: endpoint ? endpoint.slice(0, 30) + '...' : undefined,
    });
  } catch (err: any) {
    return NextResponse.json({ success: true, message: 'Unsubscribed' });
  }
}
