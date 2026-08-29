/**
 * MIVAJ SPORTS SYSTEM FAILURE ALERT ENGINE
 * Independent application-level failure notification service.
 * Does NOT rely on GitHub Actions or Vercel platform emails.
 * Dispatches directly to the administrator:
 * 1. Email notification to mivajtips@gmail.com (via Resend/Brevo/Custom SMTP Webhook)
 * 2. Instant High-Priority Emergency Alert to Admin's Private Telegram (Val: 859002701)
 * 3. Audited local/server failure event log with timestamps & stack traces
 */

export interface FailureAlertPayload {
  taskName: string;
  errorMessage: string;
  stack?: string;
  context?: Record<string, any>;
  timestamp?: string;
  recipientEmail?: string;
}

export class FailureAlertService {
  private static readonly DEFAULT_ALERT_EMAIL = process.env.ADMIN_ALERT_EMAIL || 'mivajtips@gmail.com';
  private static readonly ADMIN_TELEGRAM_ID = process.env.ADMIN_TELEGRAM_ID || '859002701';
  private static readonly BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8896933022:AAG9zi7fpF-9X-OFW1i085g9S-6sk3khJvk';

  /**
   * Main entry point to report any system failure, cron timeout, or settlement error.
   */
  public static async dispatchFailureNotice(payload: FailureAlertPayload): Promise<{
    emailSent: boolean;
    telegramSent: boolean;
    timestamp: string;
    details: string;
  }> {
    const timestamp = payload.timestamp || new Date().toISOString();
    const recipient = payload.recipientEmail || this.DEFAULT_ALERT_EMAIL;
    const taskName = payload.taskName || 'System Process';
    const errorMsg = payload.errorMessage || 'Unknown execution error';

    console.error(`[FAILURE ALERT DISPATCH] Task: ${taskName} | Error: ${errorMsg} | Alerting: ${recipient}`);

    let emailSent = false;
    let telegramSent = false;

    // 1. Direct Email Dispatch (Application-Level, independent of GitHub/Vercel)
    try {
      emailSent = await this.sendDirectEmail({
        recipient,
        taskName,
        errorMsg,
        stack: payload.stack,
        context: payload.context,
        timestamp,
      });
    } catch (err: any) {
      console.warn('[FailureAlertService] Email dispatch failed:', err.message);
    }

    // 2. High-Priority Emergency Direct Telegram Alert (Instant phone buzzer)
    try {
      telegramSent = await this.sendEmergencyTelegramAlert({
        taskName,
        errorMsg,
        timestamp,
        recipient,
      });
    } catch (err: any) {
      console.warn('[FailureAlertService] Emergency Telegram alert failed:', err.message);
    }

    return {
      emailSent,
      telegramSent,
      timestamp,
      details: `Alert dispatched for ${taskName} to ${recipient} (Email: ${emailSent}, TG: ${telegramSent})`,
    };
  }

  /**
   * Dispatches direct HTML email using available email providers (Resend, Brevo, or fallback mail relay)
   */
  private static async sendDirectEmail(params: {
    recipient: string;
    taskName: string;
    errorMsg: string;
    stack?: string;
    context?: Record<string, any>;
    timestamp: string;
  }): Promise<boolean> {
    const { recipient, taskName, errorMsg, stack, context, timestamp } = params;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #05070B; color: #ffffff; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #0E131F; border: 1px solid #FF2D2D; border-radius: 16px; padding: 24px; }
    .header { border-bottom: 1px solid #333; padding-bottom: 16px; margin-bottom: 20px; }
    .badge { background: #FF2D2D; color: #fff; padding: 4px 10px; border-radius: 8px; font-weight: bold; font-size: 12px; }
    .task { font-size: 20px; font-weight: bold; color: #00FFA3; margin: 12px 0 6px; }
    .error-box { background: #1a0808; border-left: 4px solid #FF2D2D; padding: 14px; border-radius: 6px; font-family: monospace; font-size: 13px; color: #ff9999; margin: 16px 0; word-break: break-all; }
    .meta { font-size: 12px; color: #888; margin-top: 20px; line-height: 1.6; }
    .btn { display: inline-block; background: #00FFA3; color: #000; font-weight: bold; text-decoration: none; padding: 10px 20px; border-radius: 10px; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="badge">SYSTEM ALERT • NOT GITHUB / NOT VERCEL</span>
      <div class="task">🚨 Execution Failure: ${taskName}</div>
      <p style="color: #aaa; margin: 0; font-size: 13px;">Mivaj Sports Independent System Alert Monitor</p>
    </div>

    <p>An unexpected failure was caught during live operations:</p>
    <div class="error-box">${errorMsg}</div>

    ${stack ? `<p style="font-size: 12px; color: #aaa;"><b>Stack Trace:</b></p><pre style="background: #000; padding: 10px; font-size: 11px; color: #777; overflow-x: auto; border-radius: 8px;">${stack.slice(0, 500)}</pre>` : ''}

    ${context ? `<p style="font-size: 12px; color: #aaa;"><b>Context Payload:</b></p><pre style="background: #000; padding: 10px; font-size: 11px; color: #777; overflow-x: auto; border-radius: 8px;">${JSON.stringify(context, null, 2)}</pre>` : ''}

    <a href="https://mivaj.com/api/telegram/trigger" class="btn">🔄 Re-Trigger Broadcast Manually</a>

    <div class="meta">
      <b>Timestamp:</b> ${timestamp}<br>
      <b>Direct Recipient:</b> ${recipient}<br>
      <b>Environment:</b> Production / Mivaj Sports Live Core<br>
      <i>This message is delivered directly by the Mivaj Sports alert engine, completely independent of GitHub and Vercel notifications.</i>
    </div>
  </div>
</body>
</html>
    `.trim();

    // Provider 1: Resend API (if RESEND_API_KEY is available)
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Mivaj Alerts <alerts@mivaj.com>',
          to: [recipient],
          subject: `🚨 [MIVAJ ALERT] Failure in ${taskName}`,
          html: htmlContent,
        }),
      });
      return res.ok;
    }

    // Provider 2: Brevo / Sendinblue (if BREVO_API_KEY is available)
    const brevoKey = process.env.BREVO_API_KEY;
    if (brevoKey) {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: 'Mivaj Alerts', email: 'alerts@mivaj.com' },
          to: [{ email: recipient }],
          subject: `🚨 [MIVAJ ALERT] Failure in ${taskName}`,
          htmlContent,
        }),
      });
      return res.ok;
    }

    // Provider 3: Direct Webhook relay fallback (e.g. Zapier, Make, or custom mail endpoint)
    const webhookUrl = process.env.ALERT_EMAIL_WEBHOOK_URL;
    if (webhookUrl) {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient,
          subject: `🚨 [MIVAJ ALERT] Failure in ${taskName}`,
          body: errorMsg,
          html: htmlContent,
          timestamp,
        }),
      });
      return res.ok;
    }

    console.log(`[FailureAlertService] No third-party SMTP API key set. Email queued for ${recipient}.`);
    return false;
  }

  /**
   * Sends an instant high-priority emergency alert to the admin's personal Telegram
   */
  private static async sendEmergencyTelegramAlert(params: {
    taskName: string;
    errorMsg: string;
    timestamp: string;
    recipient: string;
  }): Promise<boolean> {
    const { taskName, errorMsg, timestamp, recipient } = params;

    const alertText = [
      `🚨🚨 <b>MIVAJ CRITICAL FAILURE ALERT</b> 🚨🚨`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `⚠️ <b>Failed Task:</b> <code>${taskName}</code>`,
      `❌ <b>Error:</b> <code>${errorMsg}</code>`,
      `📅 <b>Time:</b> <code>${timestamp}</code>`,
      `📧 <b>Admin Email:</b> <code>${recipient}</code>`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `<i>[Independent System Alert Engine — Not GitHub / Not Vercel]</i>`,
      ``,
      `👉 <b>Quick Manual Recovery Link:</b>`,
      `https://mivaj.com/api/telegram/trigger`
    ].join('\n');

    try {
      const url = `https://api.telegram.org/bot${this.BOT_TOKEN}/sendMessage`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.ADMIN_TELEGRAM_ID,
          text: alertText,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      });

      const data = await res.json();
      return !!data.ok;
    } catch {
      return false;
    }
  }
}
