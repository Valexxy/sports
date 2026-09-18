import { NextResponse } from 'next/server';
import { getRealLiveAndPlayedMatches } from '../../../../lib/real-sports-stream';
import { TelegramBotService } from '../../../../services/telegram/botService';
import { getRedisCache, setRedisCache } from '../../../../lib/database-service';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const OMNIBOARD_CACHE_KEY = 'mivaj_telegram_omniboard_msg_id';

export async function GET(req: Request) {
  try {
    const matches = await getRealLiveAndPlayedMatches();
    const liveMatches = matches.filter(m => m.status === 'IN_PLAY' || m.status === 'PAUSED' || m.status === 'LIVE' || String(m.matchTime).includes("'"));

    if (liveMatches.length === 0) {
      return NextResponse.json({ success: true, message: 'No live matches to display on Omni-Board.' });
    }

    let msg = `? <b>MIVAJ LIVE OMNI-BOARD [${liveMatches.length} GAMES ACTIVE]</b> ?\n`;
    msg += `????????????????????????????\n`;

    liveMatches.forEach(m => {
      const time = m.status === 'PAUSED' ? 'HT' : (m.matchTime || 'LIVE');
      const score = `${m.homeScore ?? 0}-${m.awayScore ?? 0}`;
      const pick = m.prediction?.topPick?.selection || 'Home/Draw';
      const homeTeam = m.homeTeam.substring(0, 3).toUpperCase();
      const awayTeam = m.awayTeam.substring(0, 3).toUpperCase();
      
      msg += `?? <code>${time.padEnd(4, ' ')} | ${homeTeam} ${score} ${awayTeam}</code> | ?? AI: ${pick}\n`;
    });

    msg += `????????????????????????????\n`;
    msg += `?? <i>Board auto-updates every 60s. Tap below for deep tactical reads.</i>`;

    const keyboard = [
      [{ text: '?? OPEN MIVAJ TACTICAL DESK', url: 'https://mivaj.com/?ref=tg_omniboard' }]
    ];

    let messageId = await getRedisCache<number>(OMNIBOARD_CACHE_KEY);
    let result;

    if (messageId) {
      result = await TelegramBotService.editMessageText(messageId, msg, keyboard);
      if (result && result.ok === false && result.description?.includes('message to edit not found')) {
        result = await TelegramBotService.sendBroadcastMessage(msg, keyboard);
        if (result && result.ok && result.result?.message_id) {
          await setRedisCache(OMNIBOARD_CACHE_KEY, result.result.message_id, 60 * 60 * 12);
        }
      }
    } else {
      result = await TelegramBotService.sendBroadcastMessage(msg, keyboard);
      if (result && result.ok && result.result?.message_id) {
        await setRedisCache(OMNIBOARD_CACHE_KEY, result.result.message_id, 60 * 60 * 12);
      }
    }

    return NextResponse.json({ success: true, activeGames: liveMatches.length, result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
