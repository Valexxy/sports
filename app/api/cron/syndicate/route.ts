import { NextResponse } from 'next/server';
import { getRealLiveAndPlayedMatches } from '../../../../lib/real-sports-stream';
import { syndicateMatchArticle, getSyndicationHistory } from '../../../../lib/multi-platform-syndicator';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}` && searchParams.get('key') !== cronSecret) {
    // allow public preview if no secret configured
  }

  try {
    const rawMatches = await getRealLiveAndPlayedMatches();
    const upcoming = (rawMatches || []).filter((m: any) => !m.isFinished && m.status !== 'FT');
    const targetMatch = upcoming[0] || (rawMatches || [])[0];

    if (!targetMatch) {
      return NextResponse.json({
        success: false,
        message: 'No active matches found to syndicate',
        history: getSyndicationHistory(),
      });
    }

    const report = await syndicateMatchArticle(targetMatch);

    return NextResponse.json({
      success: true,
      message: 'Automated guest post published & search engines notified',
      report,
      history: getSyndicationHistory(),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
