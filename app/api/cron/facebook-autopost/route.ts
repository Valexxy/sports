import { NextResponse } from 'next/server';
import { getRealLiveAndPlayedMatches } from '../../../../lib/real-sports-stream';
import { publishToTipsBrosFacebook, formatTipsBrosFacebookPost, TIPS_BROS_PAGE_URL } from '../../../../lib/facebook-page-autoposter';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rawMatches = await getRealLiveAndPlayedMatches();
    const upcoming = (rawMatches || []).filter((m: any) => !m.isFinished && m.status !== 'FT');
    const targetMatch = upcoming[0] || (rawMatches || [])[0];

    if (!targetMatch) {
      return NextResponse.json({
        success: false,
        message: 'No matchday fixture found to post',
        page: TIPS_BROS_PAGE_URL,
      });
    }

    const result = await publishToTipsBrosFacebook(targetMatch);

    return NextResponse.json({
      success: true,
      message: 'Matchday update prepared for facebook.com/tipsbrosNG',
      page: TIPS_BROS_PAGE_URL,
      result,
      preview: formatTipsBrosFacebookPost(targetMatch),
      rssFeed: 'https://mivaj.com/feed.xml',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST() {
  return GET();
}
