import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { broadcastPushMessage } from '../../../../lib/push-broadcast-engine';
import { WebPushMessage } from '../../../../lib/web-push-sender';

export const dynamic = 'force-dynamic';

function verifyQstashSignature(rawBody: string, signature: string): boolean {
  const signingKey = process.env.QSTASH_CURRENT_SIGNING_KEY || process.env.QSTASH_NEXT_SIGNING_KEY;
  if (!signingKey) return true; // verification skipped when no key configured

  try {
    const expected = crypto
      .createHmac('sha256', signingKey)
      .update(rawBody)
      .digest('base64url');
    const provided = signature.replace(/^v1=/, '');
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(provided));
  } catch {
    return false;
  }
}

/**
 * QStash delivery webhook.
 * QStash calls this endpoint (server-side, no browser involved) with the
 * message to fan out as real Web Push to all subscribed devices.
 */
export async function POST(req: Request) {
  try {
    const signature = req.headers.get('upstash-signature') || '';
    const rawBody = await req.text();

    if (signature && !verifyQstashSignature(rawBody, signature)) {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 401 });
    }

    let parsed: any = {};
    try {
      parsed = rawBody ? JSON.parse(rawBody) : {};
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
    }

    const message = parsed?.message as WebPushMessage;
    if (!message || !message.title || !message.body) {
      return NextResponse.json({ success: false, error: 'message.title and message.body are required' }, { status: 400 });
    }

    const result = await broadcastPushMessage(message);
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    console.error('/api/push/deliver error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}