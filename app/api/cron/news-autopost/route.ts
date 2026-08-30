import { NextResponse } from 'next/server';
import { broadcastBreakingNewsToSocials } from '../../../../lib/news-autoposter';

export const dynamic = 'force-dynamic';
export const maxDuration = 45;

/**
 * AUTOMATED BREAKING NEWS MULTI-CHANNEL DISPATCH CRON
 * Drops breaking sports news to Telegram (@mivajsport) and Facebook (TipsBros NG)
 */
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  const expected = process.env.CRON_SECRET;
  if (expected && authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const result = await broadcastBreakingNewsToSocials();
  return NextResponse.json(result);
}
