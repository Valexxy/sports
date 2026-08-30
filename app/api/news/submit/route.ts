import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase-client';
import { SpamFilterEngine } from '../../../../lib/spam-filter-engine';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, category, authorName, lead, body: articleBody, quote, verdict, fullContent } = body;

    if (!title || !lead || !articleBody) {
      return NextResponse.json({ error: 'Missing required article fields' }, { status: 400 });
    }

    // 1. Spam & Profanity Filter
    const validation = SpamFilterEngine.validate(`${title} ${lead} ${articleBody} ${verdict || ''}`);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.reason || 'Article flagged by content moderation filter' }, { status: 422 });
    }

    const postId = `article-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    // 2. Persist to Supabase as PENDING
    try {
      await supabase.from('community_news_posts').insert([
        {
          id: postId,
          title: title.trim(),
          category: category || 'General Football',
          author_name: authorName || 'Ghost Writer',
          lead_hook: lead.trim(),
          body: articleBody.trim(),
          quote: quote?.trim() || null,
          verdict: verdict?.trim() || null,
          full_content: fullContent || `${lead}\n\n${articleBody}`,
          status: 'PENDING',
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (dbErr) {
      console.warn('Supabase article insert fallback:', dbErr);
    }

    // 3. Dispatch Telegram Review Request to Owner
    const botToken = process.env.TELEGRAM_BOT_TOKEN || '8896933022:AAG9zi7fpF-9X-OFW1i085g9S-6sk3khJvk';
    const channelId = process.env.TELEGRAM_OWNER_CHAT_ID || process.env.TELEGRAM_CHANNEL_ID || '@mivajsport';

    const tgHtml = [
      `✍️ <b>NEW GHOST BLOGGER POST — PENDING APPROVAL</b>`,
      `----------------------------------------`,
      `📰 <b>Title:</b> ${title.trim()}`,
      `🏷️ <b>Category:</b> ${category}`,
      `👤 <b>Author:</b> @${authorName || 'GhostWriter'}`,
      ``,
      `🎯 <b>Lead Hook:</b>`,
      `<i>"${lead.trim()}"</i>`,
      ``,
      `📊 <b>Tactical Body:</b>`,
      `<i>"${articleBody.slice(0, 300)}..."</i>`,
      ``,
      `⏳ <b>Status:</b> PENDING OWNER APPROVAL`,
      `🆔 <code>${postId}</code>`,
    ].join('\n');

    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: channelId,
          text: tgHtml,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [[
              { text: '✅ Approve Article', callback_data: `news_mod:approve:${postId}` },
              { text: '❌ Reject Article', callback_data: `news_mod:reject:${postId}` },
            ]],
          },
        }),
      });
    } catch (tgErr) {
      console.warn('Telegram news moderation dispatch warning:', tgErr);
    }

    return NextResponse.json({
      success: true,
      postId,
      status: 'PENDING',
      message: 'Article submitted for owner Telegram approval',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to submit article' }, { status: 500 });
  }
}
