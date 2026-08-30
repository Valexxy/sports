import { NextResponse } from 'next/server';
import { getRealLiveAndPlayedMatches } from '../../../../lib/real-sports-stream';
import { generateMatchdayGhostPost, postToFacebookGroup } from '../../../../lib/social-autoposter';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}` && searchParams.get('key') !== cronSecret) {
    // allow preview if no secret configured
  }

  try {
    const rawMatches = await getRealLiveAndPlayedMatches();
    const upcoming = (rawMatches || []).filter((m: any) => !m.isFinished && m.status !== 'FT');
    const featuredMatch = upcoming[0] || (rawMatches || [])[0];

    if (!featuredMatch) {
      return NextResponse.json({ success: false, message: 'No matches available for ghost-posting' });
    }

    const payload = generateMatchdayGhostPost(featuredMatch);

    // Attempt Facebook syndication if credentials exist
    let fbPosted = false;
    if (process.env.FACEBOOK_GROUP_ID) {
      fbPosted = await postToFacebookGroup(
        `${payload.title}\n\n${payload.markdownContent.slice(0, 300)}...\n\nRead full tactical breakdown: ${payload.canonicalUrl}`,
        payload.canonicalUrl
      );
    }

    return NextResponse.json({
      success: true,
      match: `${featuredMatch.homeTeam} vs ${featuredMatch.awayTeam}`,
      facebookDispatched: fbPosted,
      rssFeed: 'https://mivaj.com/feed.xml',
      syndicationPayload: payload,
      instructions: {
        facebookAutoPost: 'To auto-post to your Facebook Group, connect https://mivaj.com/feed.xml via IFTTT or Zapier ("RSS to Facebook Group"), or set FACEBOOK_GROUP_ID and FACEBOOK_PAGE_ACCESS_TOKEN in env.',
        blogGhostPost: 'Automated blog posts are available via RSS 2.0 at /feed.xml or by piping this JSON payload to your Ghost/WordPress API endpoint.'
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
