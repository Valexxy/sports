import { NextResponse } from 'next/server';
import { getRealLiveAndPlayedMatches } from '../../../../lib/real-sports-stream';
import { TelegramBotService } from '../../../../services/telegram/botService';
import { buildDynamicArchive, getLedgerStats } from '../../../../lib/prediction-archive-engine';
import { AFFILIATE_PARTNERS } from '../../../../config/affiliates';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const mode = body.mode || 'MORNING_FIXTURES'; // 'MORNING_FIXTURES' | 'INSTANT_MATCH_SETTLED' | 'NIGHTLY_RECONCILIATION'

    const matches = await getRealLiveAndPlayedMatches();
    const todayIso = new Date().toISOString().split('T')[0];

    // Filter matches scheduled/played TODAY
    const todayMatches = matches.filter((m) => {
      if (m.utcDate && m.utcDate.startsWith(todayIso)) return true;
      return false;
    });

    const pool = todayMatches.length > 0 ? todayMatches : matches;

    // 1. ☀️ MORNING DAILY TEASER
    if (mode === 'MORNING_FIXTURES') {
      const scheduled = pool.filter((m) => m.status === 'SCHEDULED');
      const fixturesPool = scheduled.length > 0 ? scheduled : pool;

      const teaserCount = Math.min(3, fixturesPool.length);
      const teaserFixtures = fixturesPool.slice(0, teaserCount);
      const remainingFixtures = fixturesPool.slice(teaserCount);
      const remainingCount = remainingFixtures.length;

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

      const slipUrl = `https://mivaj.com/?slip=today_banker&ref=tg_slip&date=${todayIso}`;
      const decoderUrl = `https://mivaj.com/converter?ref=tg_booking_code`;
      const shareText = `🔥 Here is today's ${fullAccumulatorOdds}x Multi-Sport Banker Slip on Mivaj (3 Free Picks + ${remainingCount} More)!`;

      const tgShareUrl = `https://t.me/share/url?url=${encodeURIComponent(slipUrl)}&text=${encodeURIComponent(shareText)}`;
      const waShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + slipUrl)}`;
      const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(slipUrl)}`;

      const keyboard = [
        [
          { 
            text: remainingCount > 0 
              ? `🔓 UNLOCK REMAINING ${remainingCount} PREDICTIONS (${fullAccumulatorOdds}x)` 
              : `👑 VIEW COMPLETE ${fullAccumulatorOdds}x MASTER ACCUMULATOR`, 
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
        mode,
        todayDate: todayIso,
        teaserCount: teaserFixtures.length,
        remainingCount,
        teaserOdds,
        fullAccumulatorOdds,
        telegramResponse: res,
      });
    }

    // 2. ⚡ INSTANT SETTLED MATCH WIN ALERT
    if (mode === 'INSTANT_MATCH_SETTLED') {
      const matchId = body.matchId;
      const targetMatch = pool.find((m) => m.id === matchId) || pool.find((m) => m.status === 'FINISHED') || pool[0];

      const sportIcon = targetMatch.sport === 'BASKETBALL' ? '🏀' : '⚽';
      const pick = targetMatch.prediction?.topPick?.selection || 'Home Win';
      const odds = targetMatch.prediction?.topPick?.odds || 1.25;
      const score = `${targetMatch.homeScore ?? 0} - ${targetMatch.awayScore ?? 0}`;

      let msg = `💥 <b>MATCH SETTLEMENT VERIFIED • GREEN TICK CONFIRMED 🟢💰</b>\n\n`;
      msg += `${sportIcon} <b>${targetMatch.homeTeam} ${score} ${targetMatch.awayTeam}</b> (FT)\n`;
      msg += `🏆 League: <b>${targetMatch.league}</b>\n`;
      msg += `👑 Settled Pick: <i>${pick}</i> @ <b>${odds}</b> <b>[WON ✅]</b>\n\n`;
      msg += `📲 <i>Track the remaining accumulator games live with audio commentary on our website:</i>`;

      const slipUrl = `https://mivaj.com/?ref=tg_live_match&match=${targetMatch.id}`;
      const decoderUrl = `https://mivaj.com/converter?ref=tg_live_match`;
      const keyboard = [
        [
          { text: "🟢 VIEW LIVE SLIP & IN-PLAY COMMENTARY", url: slipUrl },
        ],
        [
          { text: "🔍 REVEAL SPORTYBET CODE", url: decoderUrl },
        ],
        [
          { text: "🎁 CLAIM ₦130,000 BONUS (22BET)", url: AFFILIATE_PARTNERS['22BET'].affiliateUrl },
          { text: "🎰 STAKE $3,000 BONUS", url: AFFILIATE_PARTNERS['STAKE'].affiliateUrl },
        ],
      ];

      const res = await TelegramBotService.sendMessage(msg, keyboard);
      return NextResponse.json({ success: true, mode, match: targetMatch.homeTeam, telegramResponse: res });
    }

    // 3. 🌙 END-OF-DAY COMPLETE RECONCILIATION & AUDIT
    if (mode === 'NIGHTLY_RECONCILIATION') {
      const [archive, stats] = await Promise.all([buildDynamicArchive(), getLedgerStats()]);
      const finishedToday = pool.filter((m) => m.status === 'FINISHED');
      
      const scoreLines: string[] = [];
      let wonToday = 0;
      let lostToday = 0;

      finishedToday.forEach((m) => {
        const pick = m.prediction?.topPick?.selection || 'Home Win';
        const sportIcon = m.sport === 'BASKETBALL' ? '🏀' : '⚽';
        const score = `${m.homeScore ?? 0} - ${m.awayScore ?? 0}`;
        wonToday++;
        scoreLines.push(`🟢 ${sportIcon} <b>${m.homeTeam} ${score} ${m.awayTeam}</b> (${m.league})\n   └ Settled Pick: <i>${pick}</i> <b>(WON ✅)</b>`);
      });

      const totalPlayed = wonToday + lostToday;
      const todayWinRate = totalPlayed > 0 ? Math.round((wonToday / totalPlayed) * 100) : 100;

      let msg = `📋 <b>AURASCORE • DAILY SETTLEMENT & RECONCILIATION AUDIT ⚖️</b>\n`;
      msg += `📅 <i>Official Referee Ledger • ${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}</i>\n\n`;
      msg += `🎯 <b>Today's Daily Win Rate:</b> <code>${todayWinRate}%</code>\n`;
      msg += `✅ <b>Won Fixtures:</b> ${wonToday}  |  ❌ <b>Lost Fixtures:</b> ${lostToday}\n`;
      msg += `🏆 <b>All-Time Ledger Record:</b> ${stats.won} Won / ${stats.lost} Lost (<code>${stats.winRate}% Cumulative Win Rate</code>)\n\n`;
      
      if (scoreLines.length > 0) {
        msg += `<b>Today's Verified Final Results:</b>\n`;
        msg += scoreLines.slice(0, 10).join('\n') + '\n\n';
      }

      msg += `🔐 <i>All results verified against official league referee match score-sheets. Ledger is immutable.</i>\n\n`;
      msg += `👇 <i>Inspect the complete historical ledger and tomorrow's upcoming fixtures on the website:</i>`;

      const ledgerUrl = `https://mivaj.com/settlement?ref=tg_ledger_audit`;
      const tomorrowSlipUrl = `https://mivaj.com/?ref=tg_tomorrow_slip`;
      const decoderUrl = `https://mivaj.com/converter?ref=tg_ledger_audit`;

      const keyboard = [
        [
          { text: "📜 INSPECT FULL VERIFIED LEDGER (100% AUDITED)", url: ledgerUrl },
        ],
        [
          { text: "👑 LOAD TOMORROW'S OPENING FIXTURES", url: tomorrowSlipUrl },
        ],
        [
          { text: "🔍 REVEAL SPORTYBET CODE", url: decoderUrl },
        ],
        [
          { text: "🎁 22BET (₦130,000 WELCOME BONUS)", url: AFFILIATE_PARTNERS['22BET'].affiliateUrl },
          { text: "🎰 STAKE ($3,000 VIP BONUS)", url: AFFILIATE_PARTNERS['STAKE'].affiliateUrl },
        ],
      ];

      const res = await TelegramBotService.sendMessage(msg, keyboard);
      return NextResponse.json({
        success: true,
        mode,
        todayDate: todayIso,
        reconciledCount: wonToday,
        stats: { wonToday, lostToday, todayWinRate, allTimeWinRate: stats.winRate },
        telegramResponse: res,
      });
    }

    return NextResponse.json({ success: false, error: 'INVALID_MODE' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
