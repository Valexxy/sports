import { NextResponse } from 'next/server';
import { getRealLiveAndPlayedMatches } from '../../../../lib/real-sports-stream';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(req: Request) {
  try {
    const matches = await getRealLiveAndPlayedMatches();
    const upcoming = matches.find(m => m.status === 'TIMED' || m.status === 'SCHEDULED');
    if (!upcoming) return NextResponse.json({ success: true, message: 'No upcoming matches.' });

    const pick = upcoming.prediction?.topPick?.selection || 'Home/Draw';
    const payload = {
      message: {
        title: `?? MIVAJ AI BANKER: ${upcoming.homeTeam} vs ${upcoming.awayTeam}`,
        body: `AI System predicts: ${pick}. Tap to get the SportyBet code instantly!`,
      }
    };

    const host = req.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    
    await fetch(`${protocol}://${host}/api/push/deliver`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
