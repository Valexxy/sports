export interface ModDispatchParams {
  postId: string;
  matchId: string;
  matchTitle: string;
  userName: string;
  flair: string;
  category: string;
  text: string;
}

export class TelegramModeratorService {
  private static getToken = () => process.env.TELEGRAM_BOT_TOKEN || '';
  private static getOwnerChatId = () => process.env.TELEGRAM_OWNER_CHAT_ID || process.env.TELEGRAM_CHANNEL_ID || '@mivajsport';

  public static async dispatchPostForReview(p: ModDispatchParams): Promise<{ success: boolean; messageId?: number }> {
    const token = this.getToken();
    const chatId = this.getOwnerChatId();
    if (!token) return { success: false };

    const html = [
      `🏟️ <b>NEW MATCH THREAD POST — PENDING REVIEW</b>`,
      ``,
      `⚽ <b>Match:</b> ${p.matchTitle}`,
      `👤 <b>Author:</b> ${p.userName} [${p.flair}]`,
      `🏷️ <b>Category:</b> ${p.category}`,
      ``,
      `💬 <b>Post:</b>`,
      `<i>"${p.text}"</i>`,
      ``,
      `⏳ <b>Status:</b> PENDING`,
      `🆔 <code>${p.postId}</code>`,
    ].join('\n');

    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: html,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [[
              { text: '✅ Approve', callback_data: `mod:approve:${p.postId}` },
              { text: '❌ Reject', callback_data: `mod:reject:${p.postId}` },
            ]],
          },
        }),
      });
      const data = await res.json();
      return { success: data.ok, messageId: data.result?.message_id };
    } catch { return { success: false }; }
  }

  public static async handleCallbackQuery(callbackQuery: any): Promise<{ handled: boolean; postId?: string; action?: string }> {
    const token = this.getToken();
    const data: string = callbackQuery?.data || '';
    if (!data.startsWith('mod:')) return { handled: false };

    const [, action, postId] = data.split(':');
    const queryId = callbackQuery.id;
    const message = callbackQuery.message;
    const isApprove = action === 'approve';

    await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: queryId, text: isApprove ? '✅ Post approved and live!' : '❌ Post rejected.', show_alert: false }),
    });

    if (message?.chat?.id && message?.message_id) {
      const updatedText = message.text + `\n\n----------------------------------------\n${isApprove ? '🟢 APPROVED' : '🔴 REJECTED'} at ${new Date().toLocaleTimeString('en-GB')} by Owner`;
      await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: message.chat.id, message_id: message.message_id, text: updatedText, parse_mode: 'HTML', reply_markup: { inline_keyboard: [] } }),
      });
    }

    return { handled: true, postId, action };
  }
}
