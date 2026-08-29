/**
 * TELEGRAM & WHATSAPP SOCIAL AUTOPOSTER
 * Manages direct open community links, daily morning prediction drops,
 * and end-of-day settlement summaries.
 */

export const SOCIAL_LINKS = {
  TELEGRAM_COMMUNITY: 'https://t.me/mivajsport',
  WHATSAPP_COMMUNITY: 'https://chat.whatsapp.com/L7p41jJq82C6L0w9s4Y',
};

export class SocialAutoPosterService {
  /**
   * Formats daily morning predictions for Telegram Bot posting
   */
  static formatDailyPredictionsTelegram(matches: any[]): string {
    const topMatches = matches.slice(0, 5);
    let msg = `🔥 *MIVAJ (AURASCORE) DAILY AI PREDICTIONS* 🎯\n\n`;
    topMatches.forEach((m, idx) => {
      msg += `*${idx + 1}. ${m.homeTeam} vs ${m.awayTeam}*\n`;
      msg += `🎯 Top Pick: *${m.prediction?.topPick?.selection || '1X'}* (Odds: ${m.prediction?.topPick?.odds || 1.45})\n`;
      msg += `⚡ Confidence: ${m.prediction?.topPick?.probability || 78}%\n\n`;
    });
    msg += `👉 *View all fixtures & live commentary:* https://mivaj.com`;
    return msg;
  }

  /**
   * Formats end-of-day settlement report
   */
  static formatEndOfDaySettlement(wonCount: number, totalCount: number): string {
    const winRate = totalCount > 0 ? Math.round((wonCount / totalCount) * 100) : 0;
    return `👑 *MIVAJ END-OF-DAY SETTLEMENT REPORT* 📊\n\n` +
           `✅ Won: *${wonCount}/${totalCount} Picks*\n` +
           `📈 Model Accuracy: *${winRate}%*\n\n` +
           `Join our official Telegram for tomorrow's banker drops:\n${SOCIAL_LINKS.TELEGRAM_COMMUNITY}`;
  }
}
