import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get('x-paystack-signature');
    const secret = process.env.PAYSTACK_SECRET_KEY || '';

    // Verify HMAC SHA512 signature
    if (secret && signature) {
      const hash = crypto.createHmac('sha512', secret).update(bodyText).digest('hex');
      if (hash !== signature) {
        return NextResponse.json({ error: 'Invalid Paystack webhook signature' }, { status: 400 });
      }
    }

    const event = JSON.parse(bodyText);

    if (event.event === 'charge.success') {
      const { reference, amount, customer } = event.data;
      console.log(`[PAYSTACK WEBHOOK SUCCESS] Ref: ${reference}, Amount: ${amount / 100} NGN, Email: ${customer?.email}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
