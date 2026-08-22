import { NextResponse } from 'next/server';
import { followMatch, unfollowMatch, getFollowsForClient } from '../../../lib/follow-store';

export const dynamic = 'force-dynamic';

/**
 * POST  { clientId, matchId, matchTitle, lastHomeScore, lastAwayScore }
 * DELETE ?clientId=&matchId=
 * GET ?clientId=
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clientId, matchId, matchTitle, lastHomeScore, lastAwayScore } = body || {};

    if (!clientId || !matchId) {
      return NextResponse.json({ success: false, error: 'clientId and matchId are required' }, { status: 400 });
    }

    await followMatch(clientId, matchId, matchTitle || matchId, lastHomeScore || 0, lastAwayScore || 0);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const clientId = url.searchParams.get('clientId');
    const matchId = url.searchParams.get('matchId');
    if (!clientId || !matchId) {
      return NextResponse.json({ success: false, error: 'clientId and matchId are required' }, { status: 400 });
    }
    await unfollowMatch(clientId, matchId);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const clientId = url.searchParams.get('clientId');
    if (!clientId) {
      return NextResponse.json({ success: false, error: 'clientId is required' }, { status: 400 });
    }
    const follows = await getFollowsForClient(clientId);
    return NextResponse.json({ success: true, follows });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}