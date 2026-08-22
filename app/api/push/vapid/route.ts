import { NextResponse } from 'next/server';
import { getVapidKeys, isVapidConfigured } from '../../../../lib/vapid-keys';

export const dynamic = 'force-dynamic';

/**
 * Exposes the application's VAPID public key to the browser so it can create
 * a PushSubscription against the application server key.
 */
export async function GET() {
  const configured = isVapidConfigured();
  const keys = getVapidKeys();

  return NextResponse.json({
    success: true,
    configured,
    publicKey: keys.publicKey,
  });
}