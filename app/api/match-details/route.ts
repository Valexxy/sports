import { NextRequest, NextResponse } from 'next/server';
import { fetchEspnMatchDetails } from '../../../lib/real-sports-stream';
import { fetchRealLiveCommentary, extractEspnEventId } from '../../../lib/real-live-commentary';

export const dynamic = 'force-dynamic';

/**
 * AURASCORE MATCH DETAILS API
 * Returns the FULL real match details for a single match:
 * - Scorers, cards, substitutions (ESPN summary)
 * - Full lineups (ESPN roster)
 * - Real match stats (possession, shots, corners...)
 * - Real per-minute commentary feed
 */
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ success: false, error: 'Missing match id' }, { status: 400 });
  }

  try {
    const espnEventId = extractEspnEventId(id);
    if (!espnEventId) {
      return NextResponse.json({ success: false, error: 'Details only available for ESPN matches' }, { status: 422 });
    }

    const [details, commentary] = await Promise.all([
      fetchEspnMatchDetails(id),
      fetchRealLiveCommentary(id, 'Premier League', '', ''),
    ]);

    if (!details) {
      return NextResponse.json({ success: false, error: 'Match details unavailable' }, { status: 404 });
    }

    // Merge real commentary feed into keyEvents for the full minute-by-minute match report
    const mergedKeyEvents = [
      ...(commentary.length > 0 ? commentary : details.keyEvents),
    ];

    return NextResponse.json({
      success: true,
      matchId: id,
      details: {
        ...details,
        keyEvents: mergedKeyEvents,
      },
      commentaryCount: commentary.length,
    });
  } catch (err: any) {
    console.error('/api/match-details error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
