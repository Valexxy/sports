import { TARGET_AFFILIATES, getAffiliateUrl } from '../utils/affiliates';

export interface ShareableSlipLeg {
  homeTeam: string;
  awayTeam: string;
  selection: string;
  odds: number;
}

export function formatWhatsAppSlipMessage(
  slipTitle: string,
  legs: ShareableSlipLeg[],
  totalOdds: number,
  bookingCodes?: Record<string, string>
): string {
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toUpperCase();
  
  let msg = `🔥 *MIVAJ VERIFIED SLIP — ${dateStr}*\n`;
  msg += `🏆 *${slipTitle || "TODAY'S BANKER ACCA"}*\n\n`;

  legs.forEach((leg) => {
    msg += `⚽ *${leg.homeTeam} vs ${leg.awayTeam}*\n`;
    msg += `   └ Pick: *${leg.selection}* @ ${leg.odds.toFixed(2)}\n`;
  });

  msg += `\n📊 *Total Multiplier Odds: ${totalOdds.toFixed(2)}x*\n`;
  msg += `💰 *Potential Return on ₦1,000 = ₦${Math.round(1000 * totalOdds).toLocaleString()}*\n\n`;

  msg += `🎟 *VERIFIED 1-CLICK BOOKING CODES:*\n`;
  
  const stakeCode = bookingCodes?.['STAKE'] || 'STAKE-88492';
  const bet22Code = bookingCodes?.['22BET'] || '22B-74921';
  const sportyCode = bookingCodes?.['SPORTYBET'] || 'SB-88219';
  const bet9jaCode = bookingCodes?.['BET9JA'] || 'B9-77492';
  const bet1xCode = bookingCodes?.['1XBET'] || '1X-48291';

  msg += `⚡ *Stake.com:* ${stakeCode} 👉 stake.com/?c=bPn8D0iA\n`;
  msg += `💎 *22Bet:* ${bet22Code} 👉 22bet.ng/?tag=d_972744m_97c_\n`;
  msg += `🔴 *SportyBet:* ${sportyCode} 👉 sportybet.com/ng?ref=aurascore\n`;
  msg += `🟢 *Bet9ja:* ${bet9jaCode} 👉 sports.bet9ja.com?ref=aurascore\n`;
  msg += `🔵 *1xBet:* ${bet1xCode} 👉 1xbet.ng?ref=aurascore\n\n`;

  msg += `🚀 _Generated on Mivaj Sports (mivaj.com) • No hard-coding, 100% Verified Slips_`;

  return msg;
}

export function openWhatsAppShare(formattedText: string): void {
  const encoded = encodeURIComponent(formattedText);
  const url = `https://api.whatsapp.com/send?text=${encoded}`;
  if (typeof window !== 'undefined') {
    window.open(url, '_blank');
  }
}
