/**
 * EVENING RESULTS & SETTLEMENT CRON JOB
 * Scheduled for 10:30 PM UTC daily.
 */
import { TelegramBotService } from "../../services/telegram/botService";

export interface SettledMatchPick {
  matchup: string;
  pick: string;
  score: string;
  odds: number;
  won: boolean;
}

export async function processEveningSettlementBroadcast(settledPicks: SettledMatchPick[]) {
  const today = new Date().toISOString().split("T")[0];
  const wins = settledPicks.filter((p) => p.won).length;
  const total = settledPicks.length;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

  let message = "🏆 <b>MIVAJ END-OF-DAY SETTLEMENT RECAP — " + today + "</b>\n";
  message += "<i>Full Model Transparency &amp; Outcome Verification</i>\n\n";

  settledPicks.forEach((p) => {
    const badge = p.won ? "🟢 WON ✅ 💰" : "🔴 LOST ❌";
    message += badge + " | <b>" + p.matchup + "</b> (FT: " + p.score + ")\n";
    message += "🎯 Pick: <code>" + p.pick + "</code> (@" + p.odds.toFixed(2) + ")\n";
    message += "⚡ Outcome: " + (p.won ? "<b>WON ✅ 💰</b>" : "<b>LOST ❌</b>") + "\n\n";
  });

  message += "📈 <b>Daily Scorecard:</b>\n";
  message += "• <b>Total Picks:</b> " + total + "\n";
  message += "• <b>Hits:</b> " + wins + "/" + total + "\n";
  message += "• <b>Model Accuracy:</b> <b>" + winRate + "%</b>\n\n";
  message += "🔥 <i>Tomorrow's high-value banker slate is compiling now. Stay tuned for 08:00 AM UTC dispatch!</i>";

  const inlineKeyboard = [
    [
      { text: "📊 View Full Verified Ledger", url: "https://mivaj.com" },
      { text: "📲 Share Results", url: "https://t.me/share/url?url=https://mivaj.com&text=" + encodeURIComponent("🔥 Mivaj hit " + winRate + "% accuracy today!") },
    ],
  ];

  return TelegramBotService.sendMessage(message, inlineKeyboard);
}