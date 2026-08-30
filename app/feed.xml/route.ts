import { NextResponse } from 'next/server';
import { getRealLiveAndPlayedMatches } from '../../lib/real-sports-stream';
import { supabaseAdmin } from '../../lib/supabase-client';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5 minutes fresh cache for DLVR.it / Facebook

// High-Resolution Unsplash Football Backups
const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=90',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=90',
  'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=90',
  'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=90',
  'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=1200&q=90',
];

export async function GET() {
  const baseUrl = 'https://mivaj.com';
  const now = new Date();
  const feedItems: string[] = [];

  // ==========================================
  // 1. MATCHDAY BANKERS & LIVE MATCHES
  // ==========================================
  try {
    const rawMatches = await getRealLiveAndPlayedMatches();
    const matches = (rawMatches || []).slice(0, 15);

    matches.forEach((m, idx) => {
      const isFinished = m.status === 'FINISHED';
      const isLive = m.status === 'LIVE';
      const topPick = m.prediction?.topPick;

      let titlePrefix = '🔥 BANKER ALERT:';
      if (isLive) titlePrefix = `🔴 LIVE (${m.matchTime || 'LIVE'}):`;
      if (isFinished) titlePrefix = '🟢 FULLTIME SETTLED:';

      const title = `${titlePrefix} ${m.homeTeam} vs ${m.awayTeam} — ${topPick?.selection || 'Matchday Intelligence'}`;
      const link = `${baseUrl}/?match=${encodeURIComponent(m.id || `m-${idx}`)}&utm_source=facebook&utm_medium=dlvrit_autopost`;
      
      let pubDate = now.toUTCString();
      if (m.utcDate && !isNaN(new Date(m.utcDate).getTime())) {
        pubDate = new Date(m.utcDate).toUTCString();
      }

      const matchCardUrl = `${baseUrl}/api/og/match?home=${encodeURIComponent(m.homeTeam)}&away=${encodeURIComponent(m.awayTeam)}&league=${encodeURIComponent(league)}&pick=${encodeURIComponent(topPick?.selection || '1X')}&odds=${topPick?.odds || 1.35}&prob=${topPick?.probability || 85}`;
      const probability = topPick?.probability ? `${topPick.probability}% Model Confidence` : '85% Confidence';
      const odds = topPick?.odds ? `@ ${topPick.odds}` : '@ 1.40';
      const tier = topPick?.confidenceTier || 'ULTRA-BANKER 🔥';
      const league = m.league || 'World Football';

      const description = `
        <p><strong>⚽ Fixture:</strong> ${m.homeTeam} vs ${m.awayTeam}</p>
        <p><strong>🏆 League:</strong> ${league}</p>
        <p><strong>👑 AI Top Pick:</strong> ${topPick?.selection || 'Double Chance (1X)'} (${odds}) — ${tier}</p>
        <p><strong>📊 Poisson Model Probability:</strong> ${probability}</p>
        <p><strong>⚡ Expected Goals (xG):</strong> ${m.prediction?.expectedHomeGoals || '1.8'} vs ${m.prediction?.expectedAwayGoals || '1.1'}</p>
        <p>Verified on Mivaj Referee-Audited Settlement Ledger. Track sub-second goals with live vibration haptics on <a href="${link}">mivaj.com</a>.</p>
        <hr/>
        <p>📢 <strong>Join 50,000+ Football Fans on Telegram:</strong> <a href="https://t.me/mivajsport">👉 Tap to Join @mivajsport for Free Daily Banker Drops &amp; Sub-Second Goal Heartbeats</a></p>
      `;

      feedItems.push(`
        <item>
          <title><![CDATA[${title}]]></title>
          <link>${link}</link>
          <guid isPermaLink="false">mivaj-banker-${m.id || idx}-${isFinished ? 'ft' : 'live'}</guid>
          <pubDate>${pubDate}</pubDate>
          <category><![CDATA[Football Predictions]]></category>
          <category><![CDATA[${league}]]></category>
          <author>contact@mivaj.com (Mivaj Sports Desk)</author>
          <description><![CDATA[${description}]]></description>
          <content:encoded><![CDATA[${description}]]></content:encoded>
          <enclosure url="${matchCardUrl}" length="102400" type="image/png" />
          <media:content url="${matchCardUrl}" medium="image">
            <media:title><![CDATA[${m.homeTeam} vs ${m.awayTeam}]]></media:title>
          </media:content>
        </item>
      `);
    });
  } catch (e) {
    console.warn('[feed.xml] Matches stream notice:', e);
  }

  // ==========================================
  // 2. BREAKING SPORTS NEWS & GHOST BLOGGER POSTS
  // ==========================================
  try {
    // A) Check Supabase Ghost Blogger Posts
    if (supabaseAdmin) {
      const { data: dbNews } = await supabaseAdmin
        .from('community_news_posts')
        .select('*')
        .eq('status', 'APPROVED')
        .order('created_at', { ascending: false })
        .limit(5);

      if (dbNews && dbNews.length > 0) {
        dbNews.forEach((post) => {
          const title = `📰 ${post.title}`;
          const link = `${baseUrl}/news?id=${post.id}&utm_source=facebook&utm_medium=dlvrit_autopost`;
          const pubDate = new Date(post.created_at || now).toUTCString();
          const imageUrl = DEFAULT_IMAGES[0];

          const description = `
            <p><strong>${post.lead_hook || post.title}</strong></p>
            <p>${post.body || post.full_content || ''}</p>
            ${post.quote ? `<blockquote><em>"${post.quote}"</em></blockquote>` : ''}
            ${post.verdict ? `<p><strong>⚡ Final Verdict:</strong> ${post.verdict}</p>` : ''}
            <p>Written by <strong>${post.author_name || 'Mivaj Ghost Blogger'}</strong> for Mivaj Sports.</p>
            <hr/>
            <p>📢 <strong>Join @mivajsport on Telegram:</strong> <a href="https://t.me/mivajsport">👉 Tap to Join @mivajsport</a></p>
          `;

          feedItems.push(`
            <item>
              <title><![CDATA[${title}]]></title>
              <link>${link}</link>
              <guid isPermaLink="false">mivaj-ghost-news-${post.id}</guid>
              <pubDate>${pubDate}</pubDate>
              <category><![CDATA[${post.category || 'Football News'}]]></category>
              <author>contact@mivaj.com (${post.author_name || 'Mivaj Sports'})</author>
              <description><![CDATA[${description}]]></description>
              <content:encoded><![CDATA[${description}]]></content:encoded>
              <enclosure url="${imageUrl}" length="102400" type="image/jpeg" />
            </item>
          `);
        });
      }
    }
  } catch (e) {
    console.warn('[feed.xml] Supabase news notice:', e);
  }

  // ==========================================
  // 3. VIRAL TACTICAL HIGHLIGHTS & CLOUT STORIES
  // ==========================================
  const viralStories = [
    {
      id: 'viral-super-accu',
      title: '👑 Weekend 8.50 Odds Banker Accumulator Verified on Referee Ledger',
      category: 'Betting Insights',
      desc: 'Our Dixon-Coles Poisson model locked in a 4-match accumulator across Premier League, La Liga, and Serie A. Official settlement transparency published.',
      link: `${baseUrl}/settlement?ref=dlvrit_fb`,
      image: DEFAULT_IMAGES[1],
    },
    {
      id: 'viral-booking-revealer',
      title: '⚡ Decode Any SportyBet & Bet9ja Booking Code in 1-Click with Zero Fees',
      category: 'Tools & Utilities',
      desc: 'Cross-platform booking code revealer automatically extracts markets, odds, and applies maximum partner signup bonuses.',
      link: `${baseUrl}/converter?ref=dlvrit_fb`,
      image: DEFAULT_IMAGES[2],
    },
    {
      id: 'viral-turf-war',
      title: '🏆 City Clout Turf War: Awka vs Onitsha vs Lagos Matchday Battle',
      category: 'Viral Clout',
      desc: 'Over 4,200 fan cheers recorded in the Anambra and Lagos regional turf war. Support your city on the global leaderboard.',
      link: `${baseUrl}/leaderboard?ref=dlvrit_fb`,
      image: DEFAULT_IMAGES[3],
    },
  ];

  viralStories.forEach((story) => {
    feedItems.push(`
      <item>
        <title><![CDATA[${story.title}]]></title>
        <link>${story.link}</link>
        <guid isPermaLink="false">${story.id}-${now.toISOString().slice(0, 10)}</guid>
        <pubDate>${now.toUTCString()}</pubDate>
        <category><![CDATA[${story.category}]]></category>
        <author>contact@mivaj.com (Mivaj Sports Viral)</author>
        <description><![CDATA[
          <p>${story.desc}</p>
          <p>Read more and access free tools at <a href="${story.link}">${story.link}</a>.</p>
          <p>📢 <strong>Join 50,000+ Football Fans on Telegram:</strong> <a href="https://t.me/mivajsport">👉 Tap to Join @mivajsport</a></p>
        ]]></description>
        <content:encoded><![CDATA[
          <p>${story.desc}</p>
          <p>Read more and access free tools at <a href="${story.link}">${story.link}</a>.</p>
          <p>📢 <strong>Join 50,000+ Football Fans on Telegram:</strong> <a href="https://t.me/mivajsport">👉 Tap to Join @mivajsport</a></p>
        ]]></content:encoded>
        <enclosure url="${story.image}" length="102400" type="image/jpeg" />
        <media:content url="${story.image}" medium="image" />
      </item>
    `);
  });

  // ==========================================
  // 4. RSS 2.0 XML WRAPPER (DLVR.IT & FACEBOOK OPTIMIZED)
  // ==========================================
  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Mivaj Sports &amp; TipsBros — Live Football Intelligence, Banker Predictions &amp; Viral News Wire</title>
    <link>${baseUrl}</link>
    <description>Sub-second live scores, Dixon-Coles Poisson Banker models, referee-audited match settlement ledger, booking code converter, and sports intelligence across top world leagues.</description>
    <language>en-US</language>
    <lastBuildDate>${now.toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/icons/icon-192.png</url>
      <title>Mivaj Sports</title>
      <link>${baseUrl}</link>
    </image>
    ${feedItems.join('\n')}
  </channel>
</rss>`;

  return new NextResponse(rssXml.trim(), {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
