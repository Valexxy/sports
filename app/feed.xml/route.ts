import { NextResponse } from 'next/server';
import { getRealLiveAndPlayedMatches } from '../../lib/real-sports-stream';

export const dynamic = 'force-dynamic';
export const revalidate = 900; // 15 minutes

export async function GET() {
  const baseUrl = 'https://mivaj.com';
  const now = new Date();

  let matches: any[] = [];
  try {
    const rawMatches = await getRealLiveAndPlayedMatches();
    matches = (rawMatches || []).slice(0, 15);
  } catch {}

  const rssItems = matches.map((m) => {
    const title = `${m.homeTeam} vs ${m.awayTeam} — Match Intelligence, xG & Banker Pick`;
    const link = `${baseUrl}/?match=${encodeURIComponent(m.id)}`;
    const pubDate = new Date(m.kickoff || now).toUTCString();
    const prediction = m.prediction?.topPick?.selection || 'Matchday Intelligence Active';
    const confidence = m.prediction?.topPick?.confidenceTier || 'BANKER';
    const league = m.league || 'World Football';

    return `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="false">mivaj-match-${m.id}</guid>
      <pubDate>${pubDate}</pubDate>
      <category><![CDATA[${league}]]></category>
      <author>contact@mivaj.com (Mivaj Sports Desk)</author>
      <description><![CDATA[
        <p><strong>Fixture:</strong> ${m.homeTeam} vs ${m.awayTeam}</p>
        <p><strong>League:</strong> ${league}</p>
        <p><strong>Mivaj AI Top Banker:</strong> ${prediction} (${confidence})</p>
        <p><strong>Status:</strong> ${m.status || 'Upcoming'} ${m.homeScore !== undefined ? `| Current Score: ${m.homeScore} - ${m.awayScore}` : ''}</p>
        <p>Verified in Mivaj Referee-Audited Settlement Ledger. Live goal haptics available at <a href="${link}">${link}</a>.</p>
        <p>📢 <strong>Join 50,000+ Football Fans on Telegram:</strong> <a href="https://t.me/mivajsport">👉 Tap to Join @mivajsport for Free Daily Banker Drops &amp; Sub-Second Goal Heartbeats</a></p>
      ]]></description>
      <enclosure url="https://mivaj.com/logo.svg" length="1024" type="image/svg+xml" />
    </item>`;
  }).join('\n');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Mivaj Sports — Live Football Intelligence, Banker Predictions &amp; News Wire</title>
    <link>${baseUrl}</link>
    <description>Sub-second live scores, Dixon-Coles Poisson Banker models, referee-audited match settlement ledger, and sports intelligence across top world leagues.</description>
    <language>en-US</language>
    <lastBuildDate>${now.toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/icons/icon-192.png</url>
      <title>Mivaj Sports</title>
      <link>${baseUrl}</link>
    </image>
    ${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rssXml.trim(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
    },
  });
}
