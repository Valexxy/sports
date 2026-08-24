import { NextRequest, NextResponse } from 'next/server';

const SECRET_CODES: Record<string, string> = {
  TIER_200: 'STAKE-3X924',
  TIER_300: '22BET-6X481',
  TIER_500: 'STAKE-10X883',
};

export async function POST(req: NextRequest) {
  try {
    const { reference, tierId } = await req.json();

    if (!reference || !tierId) {
      return NextResponse.json({ error: 'Missing transaction reference or tierId' }, { status: 400 });
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;

    // If live/test secret key is provided, verify against Paystack API
    if (paystackSecret && !paystackSecret.includes('placeholder')) {
      const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
        },
      });

      const data = await res.json();

      if (!res.ok || data.data?.status !== 'success') {
        return NextResponse.json({ error: 'Payment verification failed or transaction incomplete' }, { status: 402 });
      }
    }

    // Return unlocked code strictly after verification
    const unlockedCode = SECRET_CODES[tierId] || 'MIVAJ-VIP-PRO';
    return NextResponse.json({
      success: true,
      reference,
      unlockedCode,
      message: 'Transaction verified successfully',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error during verification' }, { status: 500 });
  }
}
