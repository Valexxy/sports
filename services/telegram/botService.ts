/**
 * TELEGRAM CHANNEL AUTOMATION BOT SERVICE
 * Production-ready channel broadcasting service with HTML formatting,
 * inline button keyboards, affiliate tracking, and HTTP 429 rate limit backoff.
 */

export interface InlineKeyboardButton {
  text: string;
  url?: string;
  callback_data?: string;
}

export class TelegramBotService {
  public static getToken(): string {
    return process.env.TELEGRAM_BOT_TOKEN || '8896933022:AAG9zi7fpF-9X-OFW1i085g9S-6sk3khJvk';
  }

  public static getChannelId(): string {
    return process.env.TELEGRAM_CHANNEL_ID || '@mivajsport';
  }

  private static getApiUrl(): string {
    return `https://api.telegram.org/bot${this.getToken()}`;
  }

  private static async requestWithRetry(endpoint: string, payload: any, attempt = 1): Promise<any> {
    const token = this.getToken();
    if (!token) {
      console.warn("TelegramBotService: TELEGRAM_BOT_TOKEN not configured. Skipping broadcast.");
      return { ok: false, error: "NO_TOKEN" };
    }

    try {
      const res = await fetch(`${this.getApiUrl()}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 429) {
        const data = await res.json();
        const retryAfter = data.parameters?.retry_after || Math.pow(2, attempt) * 2;
        console.warn("Telegram Rate Limit (429). Retrying in " + retryAfter + "s...");
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
        return this.requestWithRetry(endpoint, payload, attempt + 1);
      }

      return await res.json();
    } catch (err) {
      if (attempt <= 3) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.requestWithRetry(endpoint, payload, attempt + 1);
      }
      console.error("TelegramBotService Request Failed:", err);
      throw err;
    }
  }

  static async sendMessage(text: string, inlineKeyboard?: InlineKeyboardButton[][]): Promise<any> {
    return this.sendMessageToChat(this.getChannelId(), text, inlineKeyboard);
  }

  static async sendBroadcastMessage(text: string, inlineKeyboard?: InlineKeyboardButton[][]): Promise<any> {
    return this.sendMessageToChat(this.getChannelId(), text, inlineKeyboard);
  }

  static async sendMessageToChat(chatId: string | number, text: string, inlineKeyboard?: InlineKeyboardButton[][]): Promise<any> {
    const payload: any = {
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: false,
    };

    if (inlineKeyboard && inlineKeyboard.length > 0) {
      payload.reply_markup = {
        inline_keyboard: inlineKeyboard,
      };
    }

    return this.requestWithRetry("sendMessage", payload);
  }

  static async getChatAdministrators(chatId = this.getChannelId()): Promise<any[]> {
    try {
      const res = await this.requestWithRetry("getChatAdministrators", { chat_id: chatId });
      return res && res.ok && Array.isArray(res.result) ? res.result : [];
    } catch {
      return [];
    }
  }

  static async sendPhoto(photoUrl: string, caption: string, inlineKeyboard?: InlineKeyboardButton[][]): Promise<any> {
    const payload: any = {
      chat_id: this.getChannelId(),
      photo: photoUrl,
      caption,
      parse_mode: "HTML",
    };

    if (inlineKeyboard && inlineKeyboard.length > 0) {
      payload.reply_markup = {
        inline_keyboard: inlineKeyboard,
      };
    }

    return this.requestWithRetry("sendPhoto", payload);
  }

  public static getAdminChatId(): string {
    return process.env.TELEGRAM_ADMIN_CHAT_ID || '@ndbazz';
  }

  static async notifyFailure(taskName: string, errorMessage: string): Promise<void> {
    console.error(`CRON FAILURE ALERT: [${taskName}] ${errorMessage}`);
    try {
      const { FailureAlertService } = await import('../../lib/failure-alert-service');
      await FailureAlertService.dispatchFailureNotice({
        taskName,
        errorMessage,
      });

      // Send privately ONLY to the admin (@ndbazz), NEVER to the public channel (@mivajsport)
      const adminChat = this.getAdminChatId();
      if (adminChat && adminChat !== this.getChannelId()) {
        await this.sendMessageToChat(
          adminChat,
          `🚨 <b>CRON EXECUTION FAILURE NOTICE [CONFIDENTIAL]</b>\n` +
          `<b>Task:</b> ${taskName}\n` +
          `<b>Error:</b> <code>${errorMessage}</code>\n` +
          `<b>Time:</b> ${new Date().toISOString()}\n` +
          `<i>Independent failure alert dispatched to mivajtips@gmail.com</i>`
        );
      }
    } catch {}
  }
}
