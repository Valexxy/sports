import { NextResponse } from 'next/server';
import { getRealLiveAndPlayedMatches, normalizeTeamKey } from '../../../../lib/real-sports-stream';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(req: Request) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return NextResponse.json({ success: false, message: 'No discord webhook' });

  try {
    const matches = await getRealLiveAndPlayedMatches();
    const upcoming = matches.filter(m => m.status === 'TIMED' || m.status === 'SCHEDULED').slice(0, 3);
    if (upcoming.length === 0) return NextResponse.json({ success: true, message: 'No upcoming matches.' });

    const embeds = upcoming.map(m => {
      const homeTeam = m.homeTeam;
      const awayTeam = m.awayTeam;
      const pick = m.prediction?.topPick?.selection || 'Home/Draw';
      const odds = m.prediction?.topPick?.odds || '1.80';
      const homeSlug = normalizeTeamKey(homeTeam);
      const awaySlug = normalizeTeamKey(awayTeam);
      
      return {
        title: `[BANKER] ${homeTeam} vs ${awayTeam}`,
        description: `**Mivaj AI Engine has detected a high-value market.**`,
        color: 5763719,
        url: `https://mivaj.com/match/${homeSlug}-vs-${awaySlug}`,
        thumbnail: { url: "https://mivaj.com/icons/icon-192x192.png" },
        fields: [
          { name: "ALGORITHMIC PICK", value: `\`\`\`fix\n${pick}\n\`\`\``, inline: false },
          { name: "VALUE ODDS", value: `**@ ${odds}**`, inline: true },
          { name: "LEAGUE", value: `${m.league || 'Global'}`, inline: true },
          { name: "KICKOFF", value: `<t:${Math.floor(new Date(m.utcDate).getTime() / 1000)}:R>`, inline: true }
        ],
        footer: { text: "Mivaj Quantum Sports Engine", icon_url: "https://mivaj.com/icons/icon-192x192.png" },
        timestamp: new Date().toISOString()
      };
    });

    const payload = {
      content: "<@&1550527915010039890> PREMIUM BANKER ALERTS DEPLOYED\nTap the title of any match below to read the deep AI analysis, or grab the raw SportyBet codes in our Telegram: https://t.me/mivajsport",
      embeds: embeds,
      username: "Mivaj AI",
      avatar_url: "https://mivaj.com/icons/icon-192x192.png"
    };

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    return NextResponse.json({ success: true, message: 'Posted premium to Discord' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}