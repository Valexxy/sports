import { NextRequest, NextResponse } from 'next/server';
import { TelegramVipDispatcher } from '../../../../lib/telegram-vip-dispatcher';
import { TelegramModeratorService } from '../../../../lib/telegram-moderator-service';
import { supabase } from '../../../../lib/supabase-client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const botToken = process.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_TOKEN;

    if (!botToken) {
      return NextResponse.json({ ok: false, message: 'TELEGRAM_BOT_TOKEN not configured' }, { status: 200 });
    }

    // 0. Handle Owner Moderation Inline Button Clicks (Approve / Reject Posts & News Articles)
    if (body.callback_query) {
      const data: string = body.callback_query?.data || '';
      
      // Handle Ghost News Articles
      if (data.startsWith('news_mod:')) {
        const [, action, postId] = data.split(':');
        const isApprove = action === 'approve';
        const queryId = body.callback_query.id;
        const msgObj = body.callback_query.message;

        await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ callback_query_id: queryId, text: isApprove ? '✅ Article approved & live on Mivaj Sports!' : '❌ Article rejected.', show_alert: false }),
        });

        if (msgObj?.chat?.id && msgObj?.message_id) {
          const updated = msgObj.text + `\n\n----------------------------------------\n${isApprove ? '🟢 APPROVED & PUBLISHED' : '🔴 REJECTED'} at ${new Date().toLocaleTimeString('en-GB')} by Owner`;
          await fetch(`https://api.telegram.org/bot${botToken}/editMessageText`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: msgObj.chat.id, message_id: msgObj.message_id, text: updated, parse_mode: 'HTML', reply_markup: { inline_keyboard: [] } }),
          });
        }

        try {
          await supabase
            .from('community_news_posts')
            .update({
              status: isApprove ? 'APPROVED' : 'REJECTED',
              moderated_at: new Date().toISOString(),
              moderated_by: body.callback_query.from?.username || 'owner',
            })
            .eq('id', postId);
        } catch (dbErr) {
          console.warn('Supabase article status update warning:', dbErr);
        }
        return NextResponse.json({ ok: true, type: 'news_moderation_handled', action, postId });
      }

      // Handle Match Forum Posts
      const result = await TelegramModeratorService.handleCallbackQuery(body.callback_query);
      if (result.handled && result.postId) {
        const isApprove = result.action === 'approve';
        try {
          await supabase
            .from('fan_comments')
            .update({
              status: isApprove ? 'APPROVED' : 'REJECTED',
              moderated_at: new Date().toISOString(),
              moderated_by: body.callback_query.from?.username || 'owner',
            })
            .eq('id', result.postId);
        } catch (dbErr) {
          console.warn('Supabase post moderation status update warning:', dbErr);
        }
        return NextResponse.json({ ok: true, type: 'moderation_callback_handled', action: result.action, postId: result.postId });
      }
    }

    // 1. Detect Channel / Group Member Join (chat_member update)
    if (body.chat_member) {
      const chatMember = body.chat_member;
      const newStatus = chatMember.new_chat_member?.status;
      const oldStatus = chatMember.old_chat_member?.status;
      const user = chatMember.new_chat_member?.user || chatMember.from;

      if ((newStatus === 'member' || newStatus === 'administrator') && oldStatus !== 'member' && user?.id) {
        const name = user.first_name || user.username || 'Punter';
        const msg = TelegramVipDispatcher.buildVipWelcomeMessage({
          name,
          username: user.username,
          isReturning: false,
        });

        // Send private 1-way VIP transmission directly to the user
        await TelegramVipDispatcher.sendPrivateVipMessage(botToken, user.id, msg);
        return NextResponse.json({ ok: true, type: 'chat_member_welcomed' });
      }
    }

    // 2. Detect Direct Message / /start command (with optional referral query)
    if (body.message) {
      const msg = body.message;
      const text: string = msg.text || '';
      const user = msg.from;
      const chatId = msg.chat?.id;

      if (user && chatId) {
        const name = user.first_name || user.username || 'Punter';
        let referralCode: string | undefined;

        if (text.startsWith('/start')) {
          const parts = text.split(' ');
          if (parts[1]) {
            referralCode = parts[1].replace(/^(ref_|ref=)/, '');
          }

          const isReturning = false; // Could check DB/cache
          const welcomeText = TelegramVipDispatcher.buildVipWelcomeMessage({
            name,
            username: user.username,
            isReturning,
            referralCode,
          });

          await TelegramVipDispatcher.sendPrivateVipMessage(botToken, chatId, welcomeText);
          return NextResponse.json({ ok: true, type: 'start_dispatched' });
        }

        // For any other text, send polite system reminder that this is a 1-way VIP intel terminal
        const systemNotice = [
          `📡 <b>MIVAJ SPORTS CORE // 1-WAY TERMINAL</b>`,
          `----------------------------------------`,
          `This channel operates as an encrypted outbound transmission line.`,
          `To browse live scores, place bets, or check your profile balance, please use the main stadium console:`,
          ``,
          `👉 <a href="https://mivaj.com">https://mivaj.com</a>`
        ].join('\n');

        await TelegramVipDispatcher.sendPrivateVipMessage(botToken, chatId, systemNotice);
        return NextResponse.json({ ok: true, type: 'direct_system_notice' });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Webhook processing error' }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ONLINE',
    service: 'MIVAJ TELEGRAM VIP DISPATCH ENGINE',
    version: '4.8',
    timestamp: new Date().toISOString(),
  });
}
