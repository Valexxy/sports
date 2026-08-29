import { NextResponse } from 'next/server';
import { getRealLiveAndPlayedMatches } from '../../../../lib/real-sports-stream';
import { TelegramBotService } from '../../../../services/telegram/botService';
import { AFFILIATE_PARTNERS } from '../../../../config/affiliates';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * MIVAJ SPORTS DAILY MORNING BANKER CRON
 * Channel: @mivajsport (https://t.me/mivajsport)
 * Extreme Virality, High-FOMO & Affiliate Driven
 */
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  const expected = process.env.CRON_SECRET;
  if (expected && authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const matches = await getRealLiveAndPlayedMatches();
    const todayIso = new Date().toISOString().split('T')[0];

    const todayMatches = matches.filter((m) => {
      if (m.utcDate && m.utcDate.startsWith(todayIso)) return true;
      return false;
    });

    const pool = todayMatches.length > 0 ? todayMatches : matches;
    const scheduled = pool.filter((m) => m.status === 'SCHEDULED');
    const fixturesPool = scheduled.length > 0 ? scheduled : pool;

    const FREE_TEASER_COUNT = 3;
    const teaserCount = Math.min(FREE_TEASER_COUNT, fixturesPool.length);
    const teaserFixtures = fixturesPool.slice(0, teaserCount);
    const lockedFixtures = fixturesPool.slice(teaserCount);
    const remainingCount = lockedFixtures.length;

    // Combined mathematical odds
    const teaserOddsNum = teaserFixtures.reduce((acc, m) => acc * (m.prediction?.topPick?.odds || 1.15), 1);
    const teaserOdds = teaserOddsNum.toFixed(2);

    const fullOddsNum = fixturesPool.reduce((acc, m) => acc * (m.prediction?.topPick?.odds || 1.15), 1);
    const fullAccumulatorOdds = fullOddsNum.toFixed(2);

    const avgProb = Math.round(
      teaserFixtures.reduce((acc, m) => acc + (m.prediction?.topPick?.probability || 85), 0) / (teaserFixtures.length || 1)
    );

    let msg = `🔥 <b>6:00 AM MIVAJ BANKER SLIP IS LIVE! 🚨</b>\n`;
    msg += `📅 <i>${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} • Model Win Rate: ${avgProb}% 🎯</i>\n\n`;
    msg += `👑 <b>TODAY'S TOP FEATURED BANKERS (${teaserCount} of ${fixturesPool.length} Fixtures):</b>\n\n`;

    teaserFixtures.forEach((m, idx) => {
      const p = m.prediction?.topPick;
      const sportIcon = m.sport === 'BASKETBALL' ? '🏀' : m.sport === 'AMERICAN_FOOTBALL' ? '🏈' : '⚽';
      msg += `${idx + 1}. ${sportIcon} <b>${m.homeTeam} vs ${m.awayTeam}</b>\n`;
      msg += `   🏆 <b>${m.leagueFlag || '🌍'} ${m.league}</b>\n`;
      msg += `   ⏰ Kickoff: <b>${m.matchTime || 'TBD'}</b>\n`;
      msg += `   🎯 Pick: <code>${p?.selection || 'Home Win'}</code> @ <b>${p?.odds || 1.15}</b> (${p?.probability || 85}% Confidence)\n\n`;
    });

    msg += `📊 <b>Featured 3-Fold Odds:</b> <code>${teaserOdds}x</code>\n`;
    msg += `🚀 <b>Full Master Accumulator:</b> <code>${fullAccumulatorOdds}x Total Odds</code>\n\n`;

    if (remainingCount > 0) {
      msg += `🔒 <b>+${remainingCount} HIGH-CONFIDENCE BANKERS STILL LOCKED!</b>\n`;
      msg += `🚨 <i>Don't miss today's payout — unlock all remaining ${remainingCount} games on our site now for 100% free!</i>\n\n`;
    }

    msg += `⚡ <b>SPORTYBET CODE REVEALER:</b>\n`;
    msg += `<i>Paste any 6-digit SportyBet booking code on Mivaj Sports to instantly reveal hidden matches & test against our winning picks!</i>`;

    const slipUrl = `https://mivaj.com/?slip=today_banker&ref=tg_morning_cron&date=${todayIso}`;
    const decoderUrl = `https://mivaj.com/converter?ref=tg_morning_cron`;
    const shareText = `🚨 TODAY'S ${fullAccumulatorOdds}x MIVAJ BANKER SLIP IS LIVE! Don't miss out — 3 Free Bankers + ${remainingCount} Locked Games:`;

    const tgShareUrl = `https://t.me/share/url?url=${encodeURIComponent(slipUrl)}&text=${encodeURIComponent(shareText)}`;
    const waShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + slipUrl)}`;
    const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(slipUrl)}`;

    const keyboard = [
      [
        { 
          text: remainingCount > 0 
            ? `🔥 UNLOCK ALL ${remainingCount} REMAINING BANKERS (${fullAccumulatorOdds}x) ➔` 
            : `🔥 VIEW FULL ${fullAccumulatorOdds}x MASTER ACCUMULATOR ➔`, 
          url: slipUrl 
        },
      ],
      [
        { text: "🔍 REVEAL MATCHES FROM SPORTYBET CODE", url: decoderUrl },
      ],
      [
        { text: "🎁 22Bet 200% Bonus", url: AFFILIATE_PARTNERS['22BET'].affiliateUrl },
        { text: "🎁 Stake VIP Bonus", url: AFFILIATE_PARTNERS['STAKE'].affiliateUrl },
      ],
      [
        { text: "🎁 Bet9ja Signup Bonus", url: AFFILIATE_PARTNERS['BET9JA'].affiliateUrl },
        { text: "🎁 1xBet Match Bonus", url: AFFILIATE_PARTNERS['1XBET'].affiliateUrl },
      ],
      [
        { text: "📲 Share on Telegram", url: tgShareUrl },
        { text: "💬 Share on WhatsApp", url: waShareUrl },
      ],
    ];

    const result = await TelegramBotService.sendBroadcastMessage(msg, keyboard);

    return NextResponse.json({
      success: true,
      message: 'Mivaj Sports Morning Viral Telegram broadcast sent successfully',
      result,
      summary: {
        totalFixtures: fixturesPool.length,
        teaserCount,
        remainingCount,
        teaserOdds,
        fullAccumulatorOdds,
        avgProb,
      },
    });
  } catch (err: any) {
    console.error('Morning Telegram Broadcast Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
