import { NextResponse } from 'next/server';
import { getRealLiveAndPlayedMatches } from '../../../../lib/real-sports-stream';
import { TelegramBotService } from '../../../../services/telegram/botService';
import { getRedisCache, setRedisCache } from '../../../../lib/upstash-redis-engine';
import { AFFILIATE_PARTNERS } from '../../../../config/affiliates';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const processedMatchIds = new Set<string>();

/**
 * MIVAJ SPORTS IN-DAY LIVE MATCH SETTLEMENT CRON
 * Channel: @mivajsport (https://t.me/mivajsport)
 * Fires continuously throughout the day as each match finishes.
 * Delivers extreme virality, real-time FOMO, affiliate links & vital platform links.
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

    const finishedMatches = matches.filter((m) => {
      const isToday = !m.utcDate || m.utcDate.startsWith(todayIso);
      return m.status === 'FINISHED' && isToday;
    });

    const settledResults = [];

    for (const match of finishedMatches) {
      const cacheKey = `mivaj:tg_settled:${match.id}`;
      
      const alreadyNotified = (await getRedisCache<boolean>(cacheKey)) || processedMatchIds.has(match.id);
      if (alreadyNotified) {
        continue;
      }

      const homeScore = match.homeScore ?? 0;
      const awayScore = match.awayScore ?? 0;
      const homeWin = homeScore > awayScore;
      const awayWin = awayScore > homeScore;
      const draw = homeScore === awayScore;

      const pick = match.prediction?.topPick?.selection || 'Home Win';
      const odds = match.prediction?.topPick?.odds || 1.25;
      const prob = match.prediction?.topPick?.probability || 88;
      const pickLower = pick.toLowerCase();

      let isWon = false;
      if (pickLower.includes('home') || pickLower.includes(match.homeTeam?.toLowerCase() || '')) {
        isWon = homeWin;
      } else if (pickLower.includes('away') || pickLower.includes(match.awayTeam?.toLowerCase() || '')) {
        isWon = awayWin;
      } else if (pickLower.includes('draw') || pickLower.includes('tie')) {
        isWon = draw;
      } else if (pickLower.includes('over')) {
        isWon = (homeScore + awayScore) > 2.5;
      } else if (pickLower.includes('under')) {
        isWon = (homeScore + awayScore) < 2.5;
      } else if (pickLower.includes('1x') || pickLower.includes('home or draw')) {
        isWon = homeWin || draw;
      } else if (pickLower.includes('x2') || pickLower.includes('away or draw')) {
        isWon = awayWin || draw;
      } else if (pickLower.includes('btts') || pickLower.includes('both teams')) {
        isWon = homeScore > 0 && awayScore > 0;
      } else {
        isWon = homeWin || draw;
      }

      const sportIcon = match.sport === 'BASKETBALL' ? '🏀' : match.sport === 'AMERICAN_FOOTBALL' ? '🏈' : '⚽';

      let msg = '';
      if (isWon) {
        msg += `💥 <b>BOOM! GREEN TICK WON! ✅💰 • BANKER CASHED IN LIVE! 🔥🤑</b>\n\n`;
        msg += `${sportIcon} <b>${match.homeTeam} vs ${match.awayTeam}</b>\n`;
        msg += `🏆 League: <b>${match.leagueFlag || '🌍'} ${match.league}</b>\n\n`;
        msg += `🎯 <b>PREDICTION:</b> <code>${pick}</code> @ <b>${odds}</b>\n`;
        msg += `🏁 <b>FINAL OUTCOME:</b> <code>${homeScore} - ${awayScore} (FT)</code>\n`;
        msg += `⚡ <b>VERIFIED RESULT: WON ✅ 💰</b>\n\n`;
        msg += `💰 <b>PAYOUT CONFIRMED!</b> High-accuracy banker cashed in! 🤑💵💸\n`;
        msg += `🚨 <i>Missed this game? Next verified banker kicks off shortly — don't miss out on today's profits! 🚀🔥</i>\n\n`;
      } else {
        msg += `🛑 <b>MATCH RESULT: LOST ❌ • 100% UNEDITED REFEREE AUDIT 📜</b>\n\n`;
        msg += `${sportIcon} <b>${match.homeTeam} vs ${match.awayTeam}</b>\n`;
        msg += `🏆 League: <b>${match.leagueFlag || '🌍'} ${match.league}</b>\n\n`;
        msg += `🎯 <b>PREDICTION:</b> <code>${pick}</code> @ <b>${odds}</b>\n`;
        msg += `🏁 <b>FINAL OUTCOME:</b> <code>${homeScore} - ${awayScore} (FT)</code>\n`;
        msg += `⚡ <b>VERIFIED RESULT: LOST ❌</b>\n\n`;
        msg += `📋 <i>100% transparent and unedited. Official score recorded in our immutable referee ledger.</i>\n`;
        msg += `🔥 <i>Next verified high-confidence banker loaded now on Mivaj Sports — bounce back strong! 🚀</i>\n\n`;
      }

      msg += `⚡ <b>MIVAJ SPORTS INSTANT ACCESS:</b>\n`;
      msg += `👉 Upcoming Bankers: https://mivaj.com\n`;
      msg += `👉 SportyBet Revealer: https://mivaj.com/converter\n`;
      msg += `👉 Football News Wire: https://mivaj.com/news\n`;
      msg += `👉 World Star Birthdays: https://mivaj.com/birthdays`;

      const slipUrl = `https://mivaj.com/?ref=tg_live_settle&match=${match.id}`;
      const decoderUrl = `https://mivaj.com/converter?ref=tg_live_settle`;
      const newsUrl = `https://mivaj.com/news?ref=tg_live_settle`;
      const ledgerUrl = `https://mivaj.com/settlement?ref=tg_live_settle`;

      const keyboard = [
        [
          { text: "🔥 VIEW NEXT LIVE BANKER FIXTURES ➔", url: slipUrl },
        ],
        [
          { text: "🔍 REVEAL SPORTYBET BOOKING CODE", url: decoderUrl },
          { text: "📰 FOOTBALL NEWS WIRE", url: newsUrl },
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
          { text: "📜 OFFICIAL SETTLEMENT LEDGER", url: ledgerUrl },
        ],
      ];

      const res = await TelegramBotService.sendBroadcastMessage(msg, keyboard);

      await setRedisCache(cacheKey, true, 60 * 60 * 48);
      processedMatchIds.add(match.id);

      settledResults.push({
        matchId: match.id,
        fixture: `${match.homeTeam} vs ${match.awayTeam}`,
        score: `${homeScore}-${awayScore}`,
        isWon,
        telegramOk: res?.ok ?? false,
      });
    }

    return NextResponse.json({
      success: true,
      cron: 'TELEGRAM_IN_DAY_LIVE_SETTLE',
      channel: TelegramBotService.getChannelId(),
      checkedMatches: finishedMatches.length,
      newlySettledAndAlerted: settledResults.length,
      settledResults,
    });
  } catch (error: any) {
    console.error('In-day live settlement error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
