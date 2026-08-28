import { NextResponse } from 'next/server';
import { getRealLiveAndPlayedMatches } from '../../../../lib/real-sports-stream';
import { TelegramBotService } from '../../../../services/telegram/botService';
import { AFFILIATE_PARTNERS } from '../../../../config/affiliates';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * AURASCORE TELEGRAM MORNING CRON — 6:00 AM WAT DAILY
 * Channel: @mivasport (https://t.me/mivasport)
 * 
 * Features:
 *   - Shows 3 FREE teaser banker picks with full odds, markets & probability
 *   - States the EXACT number of remaining unrevealed matches
 *   - Masks and displays ALL registered affiliate bonus partners (22Bet, Stake, Bet9ja, 1xBet)
 *   - Provides direct 1-click sharing to Telegram, WhatsApp, and X/Twitter
 *   - SportyBet Code Decoder promotion (revealing live matches)
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

    let msg = `☀️ <b>GOOD MORNING! AURASCORE DAILY BANKER ACCUMULATOR 🔥</b>\n`;
    msg += `📅 <i>${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} • AI Model Confidence: ${avgProb}%</i>\n\n`;
    msg += `👑 <b>TODAY'S FREE FEATURED PICKS (${teaserCount} of ${fixturesPool.length} Fixtures):</b>\n\n`;

    teaserFixtures.forEach((m, idx) => {
      const p = m.prediction?.topPick;
      const sportIcon = m.sport === 'BASKETBALL' ? '🏀' : m.sport === 'AMERICAN_FOOTBALL' ? '🏈' : '⚽';
      msg += `${idx + 1}. ${sportIcon} <b>${m.homeTeam} vs ${m.awayTeam}</b>\n`;
      msg += `   🏆 <b>${m.leagueFlag || '🌍'} ${m.league}</b>\n`;
      msg += `   ⏰ Kickoff: <b>${m.matchTime || 'TBD'}</b>\n`;
      msg += `   🎯 Selection: <code>${p?.selection || 'Home Win'}</code> @ <b>${p?.odds || 1.15}</b> (${p?.probability || 85}% Math Prob)\n\n`;
    });

    msg += `📊 <b>Free 3-Fold Odds:</b> <code>${teaserOdds}x</code>\n`;
    msg += `🚀 <b>Full ${fixturesPool.length}-Match Master Slip:</b> <code>${fullAccumulatorOdds}x Total Odds</code>\n\n`;

    if (remainingCount > 0) {
      msg += `🔒 <b>+${remainingCount} MORE MATCHES NOT CAPTURED IN THIS TEASER</b>\n`;
      msg += `<i>Unlock all ${remainingCount} remaining banker predictions on our website for free:</i>\n\n`;
    }

    msg += `⚡ <i>Paste any SportyBet booking code on our website to instantly reveal all hidden matches, markets & odds.</i>`;

    const slipUrl = `https://mivaj.com/?slip=today_banker&ref=tg_morning_cron&date=${todayIso}`;
    const decoderUrl = `https://mivaj.com/converter?ref=tg_morning_cron`;
    const shareText = `🔥 Here is today's ${fullAccumulatorOdds}x Multi-Sport Banker Slip on Mivaj (3 Free Picks + ${remainingCount} More)!`;

    const tgShareUrl = `https://t.me/share/url?url=${encodeURIComponent(slipUrl)}&text=${encodeURIComponent(shareText)}`;
    const waShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + slipUrl)}`;
    const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(slipUrl)}`;

    const keyboard = [
      [
        { 
          text: remainingCount > 0 
            ? `🔓 UNLOCK REMAINING ${remainingCount} PREDICTIONS (${fullAccumulatorOdds}x)` 
            : `🔓 VIEW FULL ${fullAccumulatorOdds}x MASTER ACCUMULATOR`, 
          url: slipUrl 
        },
      ],
      [
        { text: "🔍 REVEAL MATCHES FROM SPORTYBET CODE", url: decoderUrl },
      ],
      [
        { text: "🎁 22BET (₦130,000 WELCOME BONUS)", url: AFFILIATE_PARTNERS['22BET'].affiliateUrl },
        { text: "🎰 STAKE ($3,000 VIP BONUS)", url: AFFILIATE_PARTNERS['STAKE'].affiliateUrl },
      ],
      [
        { text: "🟢 BET9JA (170% ACCA BOOST)", url: AFFILIATE_PARTNERS['BET9JA'].affiliateUrl },
        { text: "🔵 1XBET (300% DEPOSIT MATCH)", url: AFFILIATE_PARTNERS['1XBET'].affiliateUrl },
      ],
      [
        { text: "✈️ SHARE ON TELEGRAM", url: tgShareUrl },
        { text: "💬 WHATSAPP", url: waShareUrl },
        { text: "🐦 SHARE ON X", url: xShareUrl },
      ],
    ];

    const res = await TelegramBotService.sendMessage(msg, keyboard);

    return NextResponse.json({
      success: true,
      cron: 'TELEGRAM_MORNING_6AM',
      channel: TelegramBotService.getChannelId(),
      todayDate: todayIso,
      freePicksShown: teaserCount,
      remainingUncaptured: remainingCount,
      teaserOdds,
      fullAccumulatorOdds,
      telegramResponse: res,
    });
  } catch (err: any) {
    console.error('Telegram Morning Cron Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
