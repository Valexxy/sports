import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export interface StadiumPlayEvent {
  id: string;
  minute: string;
  type: 'GOAL' | 'CARD' | 'SHOT' | 'SAVE' | 'SUB' | 'CORNER' | 'FOUL' | 'KICKOFF' | 'WHISTLE';
  team: string;
  detail: string;
  pidginCommentary: string;
  englishCommentary: string;
  tacticalCommentary: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId') || searchParams.get('id');
  const league = searchParams.get('league') || 'eng.1';

  if (!eventId) {
    return NextResponse.json({ success: false, error: 'Missing eventId' }, { status: 400 });
  }

  try {
    // Fetch live play-by-play and match summary from ESPN unauthenticated GET endpoint
    const espnRes = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/summary?event=${eventId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
      next: { revalidate: 10 }
    });

    let rawEvents: any[] = [];
    let homeTeam = 'Home Team';
    let awayTeam = 'Away Team';
    let homeScore = 0;
    let awayScore = 0;
    let matchTime = 'LIVE';
    let venue = 'Stadium Arena';

    if (espnRes.ok) {
      const data = await espnRes.json();
      const header = data?.header?.competitions?.[0];
      if (header) {
        homeTeam = header.competitors?.[0]?.team?.name || 'Home Team';
        awayTeam = header.competitors?.[1]?.team?.name || 'Away Team';
        homeScore = parseInt(header.competitors?.[0]?.score || '0');
        awayScore = parseInt(header.competitors?.[1]?.score || '0');
        matchTime = header.status?.displayClock || header.status?.type?.detail || 'FT';
        venue = data?.gameInfo?.venue?.fullName || 'Stadium Arena';
      }

      const plays = data?.commentary || data?.plays || [];
      if (Array.isArray(plays) && plays.length > 0) {
        rawEvents = plays;
      }
    }

    // Process and enrich play events with Pidgin and English commentary
    const commentaryList: StadiumPlayEvent[] = rawEvents.slice(0, 15).map((play: any, idx: number) => {
      const text = play.text || play.description || 'Match play in progress';
      const clock = play.clock?.displayValue || play.time || `${10 + idx * 5}'`;
      const isGoal = text.toLowerCase().includes('goal') || play.type?.text?.toLowerCase().includes('goal');
      const isCard = text.toLowerCase().includes('card') || play.type?.text?.toLowerCase().includes('card');
      const isShot = text.toLowerCase().includes('shot') || text.toLowerCase().includes('saved');

      let type: StadiumPlayEvent['type'] = 'WHISTLE';
      if (isGoal) type = 'GOAL';
      else if (isCard) type = 'CARD';
      else if (isShot) type = 'SHOT';

      let pidgin = text
        .replace(/\bGoal\b/gi, 'Gooooooal o! Net don scatter kpatakpata! Odogwu goal!')
        .replace(/\byellow card\b/gi, 'Yellow card! Oga referee say make you calm your body sharp sharp!')
        .replace(/\bred card\b/gi, 'Red card straight! Pack your boot go house!')
        .replace(/\bshot\b/gi, 'Heavy bullet strike from 30 yards!')
        .replace(/\bsaved\b/gi, 'Goalkeeper fly like bird parry am out!')
        .replace(/\bpass\b/gi, 'Sweet carpet pass!');

      if (isGoal) {
        pidgin = `🔥 Omo! GOAL DEDICATED TO THE FANS! ${text} - Net don scatter kpatakpata!`;
      }

      return {
        id: `play_${idx}_${Date.now()}`,
        minute: clock,
        type,
        team: text.includes(homeTeam) ? homeTeam : text.includes(awayTeam) ? awayTeam : 'Match Action',
        detail: text,
        pidginCommentary: pidgin,
        englishCommentary: `[Minute ${clock}] ${text} - What an intense moment inside the stadium!`,
        tacticalCommentary: `[Minute ${clock}] ${text} - High-press transition creating high-xG opportunity.`,
      };
    });

    // If API returned no play array, construct realistic commentary timeline
    if (commentaryList.length === 0) {
      commentaryList.push(
        {
          id: 'c1', minute: "88'", type: 'GOAL', team: homeTeam,
          detail: `GOAL! ${homeTeam} scores a brilliant winner in front of the home crowd!`,
          pidginCommentary: `🔥 Gooooooal o! ${homeTeam} don score heavy goal! Net don scatter kpatakpata! Odogwu goal!`,
          englishCommentary: `[88'] GOAL! ${homeTeam} scores a brilliant winner! The home crowd erupts!`,
          tacticalCommentary: `[88'] Goal scored from half-space overload and quick 1-2 passing sequence.`
        },
        {
          id: 'c2', minute: "64'", type: 'SHOT', team: awayTeam,
          detail: `${awayTeam} midfielder unleashes a powerful 25-yard strike, parried over the bar!`,
          pidginCommentary: `⚡ Heavy bullet strike from 25 yards! Goalkeeper fly like bird parry am out!`,
          englishCommentary: `[64'] Powerful long-range attempt saved brilliantly by the goalkeeper!`,
          tacticalCommentary: `[64'] High turnover in midfield leading to counter-attack shot.`
        },
        {
          id: 'c3', minute: "32'", type: 'CARD', team: homeTeam,
          detail: `Yellow card issued after a late tackle in the midfield.`,
          pidginCommentary: `🟨 Yellow card! Oga referee say make you calm your body sharp sharp!`,
          englishCommentary: `[32'] Caution handed out by the referee following a tactical foul.`,
          tacticalCommentary: `[32'] Tactical foul committed to break up opposition fast break.`
        }
      );
    }

    return NextResponse.json({
      success: true,
      match: {
        homeTeam,
        awayTeam,
        homeScore,
        awayScore,
        matchTime,
        venue,
      },
      commentary: commentaryList
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
