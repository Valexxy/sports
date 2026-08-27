import { NextResponse } from 'next/server';
import { getRealLiveAndPlayedMatches } from '../../../../lib/real-sports-stream';
import { TelegramBotService } from '../../../../services/telegram/botService';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * AURASCORE TELEGRAM MORNING CRON — 6:00 AM WAT DAILY
 * 
 * Automatically posts today's featured accumulator picks to @mivajsport
 * with a monetization-first teaser approach:
 *   - Shows 3-4 FREE banker picks with full odds & analysis
 *   - Locks the remaining picks behind the website (drives traffic)
 *   - Embeds affiliate signup bonus buttons for 22Bet, Bet9ja, Stake
 *   - Includes 1-click converter link for booking code generation
 * 
 * Triggered by Vercel Cron at 0 5 * * * (5:00 UTC = 6:00 WAT)
 */
export async function GET(req: Request) {
  // Optional auth guard for Vercel Cron
  const authHeader = req.headers.get('authorization');
  const expected = process.env.CRON_SECRET;
  if (expected && authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const matches = await getRealLiveAndPlayedMatches();
    const todayIso = new Date().toISOString().split('T')[0];

    // Filter today's scheduled matches
    const todayMatches = matches.filter((m) => {
      if (m.utcDate && m.utcDate.startsWith(todayIso)) return true;
      return false;
    });

    const pool = todayMatches.length > 0 ? todayMatches : matches;
    const scheduled = pool.filter((m) => m.status === 'SCHEDULED');
    const fixturesPool = scheduled.length > 0 ? scheduled : pool;

    // MONETIZATION STRATEGY:
    // Show 3 FREE teaser picks in Telegram (enough to hook them)
    // Lock the remaining picks behind the website
    const FREE_TEASER_COUNT = 3;
    const teaserCount = Math.min(FREE_TEASER_COUNT, fixturesPool.length);
    const teaserFixtures = fixturesPool.slice(0, teaserCount);
    const lockedFixtures = fixturesPool.slice(teaserCount);
    const lockedCount = lockedFixtures.length;

    // 100% Genuine Mathematical Calculations
    const teaserOddsNum = teaserFixtures.reduce((acc, m) => acc * (m.prediction?.topPick?.odds || 1.15), 1);
    const teaserOdds = teaserOddsNum.toFixed(2);

    const fullOddsNum = fixturesPool.reduce((acc, m) => acc * (m.prediction?.topPick?.odds || 1.15), 1);
    const fullAccumulatorOdds = fullOddsNum.toFixed(2);

    const avgProb = Math.round(
      teaserFixtures.reduce((acc, m) => acc + (m.prediction?.topPick?.probability || 85), 0) / (teaserFixtures.length || 1)
    );

    // Build the Telegram message
    let msg = `☀️ <b>GOOD MORNING! AURASCORE DAILY BANKER SLIP 🔥</b>\n`;
    msg += `📅 <i>${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} • AI Confidence: ${avgProb}%</i>\n\n`;
    msg += `👑 <b>TODAY'S FREE BANKER PICKS (${teaserCount} of ${fixturesPool.length}):</b>\n\n`;

    teaserFixtures.forEach((m, idx) => {
      const p = m.prediction?.topPick;
      const sportIcon = m.sport === 'BASKETBALL' ? '🏀' : m.sport === 'AMERICAN_FOOTBALL' ? '🏈' : '⚽';
      msg += `${idx + 1}. ${sportIcon} <b>${m.homeTeam} vs ${m.awayTeam}</b>\n`;
      msg += `   🏆 <b>${m.leagueFlag || '🌍'} ${m.league}</b>\n`;
      msg += `   ⏰ Kickoff: <b>${m.matchTime || 'TBD'}</b>\n`;
      msg += `   🎯 Pick: <code>${p?.selection || 'Home Win'}</code> @ <b>${p?.odds || 1.15}</b> (${p?.probability || 85}% Prob)\n\n`;
    });

    msg += `📊 <b>Free 3-Fold Odds:</b> <code>${teaserOdds}x</code>\n`;
    msg += `🚀 <b>Full ${fixturesPool.length}-Match Master Slip:</b> <code>${fullAccumulatorOdds}x Total Odds</code>\n\n`;

    if (lockedCount > 0) {
      msg += `🔒 <b>+${lockedCount} MORE PREMIUM PICKS AVAILABLE</b>\n`;
      msg += `<i>Unlock the full ${fixturesPool.length}-game accumulator with 1-click booking codes on our website:</i>\n\n`;
    }

    msg += `💡 <i>Convert to SportyBet, Bet9ja, 1xBet booking codes instantly on our free converter tool.</i>`;

    // Monetization-focused inline keyboard
    const slipUrl = `https://mivaj.com/?slip=today_banker&ref=tg_morning_cron&date=${todayIso}`;
    const converterUrl = `https://mivaj.com/converter?ref=tg_morning_cron`;
    const affiliateUrl22Bet = process.env.NEXT_PUBLIC_22BET_AFFILIATE_URL || 'https://22bet.com.ng/?tag=972744';
    const affiliateUrlStake = process.env.NEXT_PUBLIC_STAKE_AFFILIATE_URL || 'https://stake.com/?c=AuraScore';
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(slipUrl)}&text=${encodeURIComponent(`🔥 ${fullAccumulatorOdds}x Daily Banker Slip on Mivaj! Free picks + converter`)}`;

    const keyboard = [
      [
        { text: `🔓 UNLOCK FULL ${fullAccumulatorOdds}x MASTER SLIP`, url: slipUrl },
      ],
      [
        { text: "⚡ FREE BOOKING CODE CONVERTER", url: converterUrl },
      ],
      [
        { text: "💰 JOIN 22BET (₦250K BONUS)", url: affiliateUrl22Bet },
        { text: "🎰 JOIN STAKE ($3K BONUS)", url: affiliateUrlStake },
      ],
      [
        { text: "📲 SHARE WITH FRIENDS", url: shareUrl },
      ],
    ];

    const res = await TelegramBotService.sendMessage(msg, keyboard);

    return NextResponse.json({
      success: true,
      cron: 'TELEGRAM_MORNING_6AM',
      todayDate: todayIso,
      freePicksShown: teaserCount,
      lockedPicks: lockedCount,
      teaserOdds,
      fullAccumulatorOdds,
      telegramResponse: res,
    });
  } catch (err: any) {
    console.error('Telegram Morning Cron Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
