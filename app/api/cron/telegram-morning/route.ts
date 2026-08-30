import { NextResponse } from 'next/server';
import { getRealLiveAndPlayedMatches } from '../../../../lib/real-sports-stream';
import { TelegramBotService } from '../../../../services/telegram/botService';
import { TelegramVipDispatcher } from '../../../../lib/telegram-vip-dispatcher';
import { AFFILIATE_PARTNERS } from '../../../../config/affiliates';
import { broadcastPushMessage } from '../../../../lib/push-broadcast-engine';

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
    
    // Sort chronologically by earliest kickoff time
    const sortedScheduled = [...scheduled].sort((a, b) => {
      const timeA = a.utcDate ? new Date(a.utcDate).getTime() : Infinity;
      const timeB = b.utcDate ? new Date(b.utcDate).getTime() : Infinity;
      return timeA - timeB;
    });

    const fixturesPool = sortedScheduled.length > 0 ? sortedScheduled : pool;

    // Detect earliest kickoff of the day
    const firstMatch = fixturesPool[0];
    const firstMatchKickoff = firstMatch?.matchTime || (firstMatch?.utcDate ? new Date(firstMatch.utcDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '06:00');
    
    // Check if earliest fixture plays early before 6:00 AM
    let isEarlyBird = false;
    if (firstMatch?.utcDate) {
      const firstHour = new Date(firstMatch.utcDate).getUTCHours() + 1; // WAT is UTC+1
      if (firstHour < 6) isEarlyBird = true;
    }

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

    let msg = isEarlyBird
      ? `⚡ <b>EARLY-BIRD MATCH ALERT: FIRST KICKOFF AT ${firstMatchKickoff} WAT! 🚨</b>\n`
      : `🔥 <b>TODAY'S OFFICIAL MIVAJ BANKER SLIP IS LIVE! 🚨</b>\n`;
    msg += `📅 <i>${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} • Model Win Rate: ${avgProb}% 🎯</i>\n`;
    msg += `⏳ <b>Earliest Match Starts:</b> <code>${firstMatchKickoff} WAT</code>\n\n`;
    msg += `👑 <b>TODAY'S EARLIEST HIGH-CONFIDENCE BANKERS (${teaserCount} of ${fixturesPool.length} Fixtures):</b>\n\n`;

    teaserFixtures.forEach((m, idx) => {
      const p = m.prediction?.topPick;
      const sportIcon = m.sport === 'BASKETBALL' ? '🏀' : m.sport === 'AMERICAN_FOOTBALL' ? '🏈' : '⚽';
      msg += `${idx + 1}. ${sportIcon} <b>${m.homeTeam} vs ${m.awayTeam}</b>\n`;
      msg += `   🏆 <b>${m.leagueFlag || '🌍'} ${m.league}</b>\n`;
      msg += `   ⏰ Kickoff: <b>${m.matchTime || 'TBD'}</b>\n`;
      msg += `   🎯 Pick: <code>${p?.selection || 'Home Win'}</code> @ <b>${p?.odds || 1.15}</b> (${p?.probability || 85}% Confidence)\n\n`;
    });

    msg += `📊 <b>Featured ${teaserCount}-Fold Odds:</b> <code>${teaserOdds}x</code>\n`;
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

    // Dispatch 1-way private VIP transmissions to all members & administrators
    let directDispatchesCount = 0;
    try {
      const botToken = TelegramBotService.getToken();
      const admins = await TelegramBotService.getChatAdministrators();
      const topBankerList = teaserFixtures.map(m => ({
        match: `${m.homeTeam} vs ${m.awayTeam}`,
        pick: m.prediction?.topPick?.selection || '1X',
        odds: m.prediction?.topPick?.odds || 1.15,
        winProb: m.prediction?.topPick?.probability || 85,
      }));

      for (const admin of admins) {
        if (admin.user && !admin.user.is_bot && admin.user.id) {
          const directMsg = TelegramVipDispatcher.buildVipWelcomeMessage({
            name: admin.user.first_name || admin.user.username || 'VIP Member',
            username: admin.user.username,
            isReturning: true,
            topBankers: topBankerList,
          });

          const sent = await TelegramVipDispatcher.sendPrivateVipMessage(botToken, admin.user.id, directMsg);
          if (sent) directDispatchesCount++;
        }
      }
    } catch (e: any) {
      console.warn('Direct member dispatch warning:', e?.message);
    }

    // Web Push Fanout to all subscribed devices
    try {
      await broadcastPushMessage({
        title: `🔥 8:00 AM MIVAJ BANKER SLIP IS LIVE!`,
        body: `Top ${teaserCount} bankers @ ${teaserOdds} odds are ready. Win rate: ${avgProb}%. Tap to view matches.`,
        url: '/?ref=morning_push',
        tag: 'mivaj-morning-banker',
      });
    } catch (e: any) {
      console.warn('Web push broadcast warning:', e?.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Mivaj Sports Morning Viral Telegram broadcast sent successfully',
      result,
      directDispatchesCount,
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
    try {
      await TelegramBotService.notifyFailure('Morning Banker Broadcast', err?.message || 'Unknown network error');
    } catch {}
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
