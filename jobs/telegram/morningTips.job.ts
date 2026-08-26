/**
 * MORNING TIPS DISPATCHER CRON JOB
 * Scheduled for 08:00 AM UTC daily.
 */
import { TelegramBotService } from "../../services/telegram/botService";

export interface BankerTip {
  homeTeam: string;
  awayTeam: string;
  league: string;
  kickoff: string;
  selection: string;
  odds: number;
  confidence: number;
}

export async function processMorningTipsBroadcast(tips: BankerTip[]) {
  const today = new Date().toISOString().split("T")[0];
  let message = "⚡ <b>MIVAJ DAILY ANALYTICS WIRE — " + today + "</b>\n";
  message += "<i>Institutional Poisson-Model Predictions &amp; Banker Accas</i>\n\n";

  tips.forEach((tip, idx) => {
    message += "<b>" + (idx + 1) + ". " + tip.homeTeam + " vs " + tip.awayTeam + "</b> (" + tip.league + ")\n";
    message += "⏱ Kickoff: <code>" + tip.kickoff + " UTC</code>\n";
    message += "🎯 Pick: <b>" + tip.selection + "</b> (@" + tip.odds.toFixed(2) + ")\n";
    message += "🔥 Model Confidence: <b>" + tip.confidence + "%</b>\n\n";
  });

  const totalOdds = tips.reduce((acc, t) => acc * t.odds, 1).toFixed(2);
  message += "📊 <b>Combined Multi-Slip Odds: " + totalOdds + "</b>\n\n";
  message += "🔑 <b>Multi-Bookmaker Booking Codes:</b>\n";
  message += "• <b>SportyBet:</b> <code>BC892KA</code>\n";
  message += "• <b>Bet9ja:</b> <code>9JA4721</code>\n";
  message += "• <b>1xBet:</b> <code>1X9842M</code>\n\n";
  message += "<i>⚠️ Strictly for sports analytics and statistical evaluation.</i>";

  const inlineKeyboard = [
    [
      { text: "📊 Deep Match Stats on Mivaj", url: "https://mivaj.com" },
      { text: "📲 Forward to Squad", url: "https://t.me/share/url?url=https://mivaj.com&text=" + encodeURIComponent("Check today's Mivaj bankers!") },
    ],
    [
      { text: "🟢 Bet on SportyBet", url: process.env.AFFILIATE_SPORTYBET_URL || "https://sportybet.com" },
      { text: "🔴 Bet on Bet9ja", url: process.env.AFFILIATE_BET9JA_URL || "https://bet9ja.com" },
    ],
  ];

  return TelegramBotService.sendMessage(message, inlineKeyboard);
}