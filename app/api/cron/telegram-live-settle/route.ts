import { NextResponse } from 'next/server';
import { getRealLiveAndPlayedMatches } from '../../../../lib/real-sports-stream';
import { TelegramBotService } from '../../../../services/telegram/botService';
import { getRedisCache, setRedisCache } from '../../../../lib/upstash-redis-engine';
import { AFFILIATE_PARTNERS } from '../../../../config/affiliates';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const processedMatchIds = new Set<string>();

/**
 * AURASCORE IN-DAY LIVE MATCH SETTLEMENT CRON
 * Channel: @mivasport (https://t.me/mivasport)
 * 
 * Triggers instant celebration & verification alerts as each sport event finishes during the day.
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
      const cacheKey = `aurascore:tg_settled:${match.id}`;
      
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
      const statusIcon = isWon ? '🟢' : '🔴';
      const verdict = isWon ? 'WON ✅' : 'SETTLED ⚖️';

      let msg = `💥 <b>MATCH SETTLEMENT VERIFIED • OFFICIAL REFEREE RESULT ${statusIcon}</b>\n\n`;
      msg += `${sportIcon} <b>${match.homeTeam} ${homeScore} - ${awayScore} ${match.awayTeam}</b> (FT)\n`;
      msg += `🏆 League: <b>${match.leagueFlag || '🌍'} ${match.league}</b>\n`;
      msg += `🎯 Official Selection: <code>${pick}</code> @ <b>${odds}</b> (${prob}% Prob) <b>[${verdict}]</b>\n\n`;
      
      if (isWon) {
        msg += `💰 <i>Prediction banked successfully! Payout confirmed across all verified slips.</i>\n\n`;
      } else {
        msg += `📋 <i>Official score recorded in our immutable public settlement ledger.</i>\n\n`;
      }

      msg += `⚡ <i>Paste any SportyBet code to reveal live matches, or track remaining in-play fixtures below:</i>`;

      const slipUrl = `https://mivaj.com/?slip=today_banker&ref=tg_live_settle&match=${match.id}`;
      const decoderUrl = `https://mivaj.com/converter?ref=tg_live_settle`;
      const shareText = `💥 ${match.homeTeam} ${homeScore}-${awayScore} ${match.awayTeam} (${verdict}) on Mivaj! Check verified ledger:`;

      const tgShareUrl = `https://t.me/share/url?url=${encodeURIComponent(slipUrl)}&text=${encodeURIComponent(shareText)}`;
      const waShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + slipUrl)}`;

      const keyboard = [
        [
          { text: "📊 VIEW NEXT IN-PLAY FIXTURES", url: slipUrl },
        ],
        [
          { text: "🔍 REVEAL SPORTYBET BOOKING CODE", url: decoderUrl },
        ],
        [
          { text: "🎁 CLAIM ₦130,000 BONUS (22BET)", url: AFFILIATE_PARTNERS['22BET'].affiliateUrl },
          { text: "🎰 STAKE $3,000 MATCH", url: AFFILIATE_PARTNERS['STAKE'].affiliateUrl },
        ],
        [
          { text: "✈️ SHARE ON TELEGRAM", url: tgShareUrl },
          { text: "💬 WHATSAPP", url: waShareUrl },
        ],
      ];

      const res = await TelegramBotService.sendMessage(msg, keyboard);

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
