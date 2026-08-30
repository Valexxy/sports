import { NextResponse } from 'next/server';
import { getRealLiveAndPlayedMatches } from '../../../../lib/real-sports-stream';
import { publishToTipsBrosFacebook, formatTipsBrosFacebookPost, TIPS_BROS_PAGE_URL } from '../../../../lib/facebook-page-autoposter';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rawMatches = await getRealLiveAndPlayedMatches();
    const upcoming = (rawMatches || []).filter((m: any) => {
      if (m.isFinished || m.status === 'FINISHED' || m.status === 'FT') return false;
      if (m.prediction?.hasPrediction === false) return false;
      const sel = (m.prediction?.topPick?.selection || '').toLowerCase();
      if (sel.includes('watch only') || sel === 'n/a') return false;
      return true;
    });
    const targetMatch = upcoming[0] || (rawMatches || []).find((m: any) => m.prediction?.hasPrediction !== false && !(m.prediction?.topPick?.selection || '').toLowerCase().includes('watch only'));

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
