import { NextResponse } from 'next/server';
import { TelegramBotService } from '../../../../services/telegram/botService';
import { AFFILIATE_PARTNERS } from '../../../../config/affiliates';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mivaj.com';
    const dateFormatted = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const photoUrl = `${baseUrl}/api/og/winning-card?t=${Date.now()}`;

    const caption = [
      `🔥 <b>BOOM! TODAY'S MIVAJ SPORTS WINNING ACCUMULATOR CASHED!</b> 💰`,
      ``,
      `📅 <b>Game Day:</b> <code>${dateFormatted}</code>`,
      `🏆 <b>Status:</b> <code>100% Referee Audited Ledger Verified</code>`,
      `💰 <b>Verified Multiplier:</b> <code>14.85x Total Odds Won ✅</code>`,
      ``,
      `🚀 <b>GET TOMORROW'S 15.00x MASTER BANKER SLIP BEFORE ODDS DROP!</b>`,
      `👉 <b>Free Portal:</b> <a href="${baseUrl}">${baseUrl}</a>`,
      ``,
      `<i>[100% Free Access • Zero VIP Fees • Verified Daily Scorecards]</i>`,
    ].join('\n');

    const keyboard = [
      [
        { text: '📜 VIEW IMMUTABLE MATCH LEDGER', url: `${baseUrl}/settlement` },
      ],
      [
        { text: '🔥 UNLOCK TOMORROW\'S 15.00x ACCUMULATOR ➔', url: `${baseUrl}/?ref=tg_card` },
      ],
      [
        { text: '🎁 22Bet 200% Bonus', url: AFFILIATE_PARTNERS['22BET'].affiliateUrl },
        { text: '🎁 Stake VIP Bonus', url: AFFILIATE_PARTNERS['STAKE'].affiliateUrl },
      ],
      [
        { text: '🎁 Bet9ja Signup Bonus', url: AFFILIATE_PARTNERS['BET9JA'].affiliateUrl },
        { text: '🎁 1xBet Match Bonus', url: AFFILIATE_PARTNERS['1XBET'].affiliateUrl },
      ],
    ];

    const result = await TelegramBotService.sendPhoto(photoUrl, caption, keyboard);

    return NextResponse.json({
      success: true,
      message: 'Daily winning card picture dispatched to Telegram channel successfully',
      result,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  return POST(req);
}
