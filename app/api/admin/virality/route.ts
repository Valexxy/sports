import { NextResponse } from 'next/server';
import { getRealLiveAndPlayedMatches } from '../../../../lib/real-sports-stream';
import { syndicateMatchArticle, getSyndicationHistory } from '../../../../lib/multi-platform-syndicator';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    success: true,
    history: getSyndicationHistory(),
  });
}

export async function POST() {
  try {
    const rawMatches = await getRealLiveAndPlayedMatches();
    const upcoming = (rawMatches || []).filter((m: any) => !m.isFinished && m.status !== 'FT');
    const targetMatch = upcoming[0] || (rawMatches || [])[0];

    if (!targetMatch) {
      return NextResponse.json({ success: false, message: 'No match available for syndication' }, { status: 400 });
    }

    const report = await syndicateMatchArticle(targetMatch);
    return NextResponse.json({
      success: true,
      report,
      history: getSyndicationHistory(),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
