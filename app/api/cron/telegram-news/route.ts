import { NextResponse } from 'next/server';
import { TelegramBotService } from '../../../../services/telegram/botService';
import { getRedisCache, setRedisCache } from '../../../../lib/upstash-redis-engine';
import { AFFILIATE_PARTNERS } from '../../../../config/affiliates';

export const dynamic = 'force-dynamic';
export const maxDuration = 45;

/**
 * MIVAJ SPORTS TELEGRAM BREAKING NEWS BROADCAST CRON
 * Channel: @mivajsport (https://t.me/mivajsport)
 * Broadcasts top breaking football stories, tactical updates & injury wire to Telegram.
 */
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  const expected = process.env.CRON_SECRET;
  if (expected && authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Fetch top live news from ESPN feeds
    const espnRes = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/news', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      signal: AbortSignal.timeout(10000),
    });

    if (!espnRes.ok) {
      return NextResponse.json({ success: false, error: 'Failed to fetch ESPN news' }, { status: 502 });
    }

    const data = await espnRes.json();
    const articles = data.articles || [];
    if (articles.length === 0) {
      return NextResponse.json({ success: true, message: 'No articles available' });
    }

    // 2. Find an article that has not been posted to Telegram yet
    let selectedArticle: any = null;
    for (const article of articles.slice(0, 10)) {
      const articleId = String(article.id || article.headline?.slice(0, 30));
      const cacheKey = `mivaj:tg_news:${articleId}`;
      const alreadyPosted = await getRedisCache<boolean>(cacheKey);
      if (!alreadyPosted) {
        selectedArticle = article;
        break;
      }
    }

    if (!selectedArticle) {
      return NextResponse.json({
        success: true,
        message: 'All top breaking news articles have already been broadcast to Telegram.',
      });
    }

    const articleId = String(selectedArticle.id || selectedArticle.headline?.slice(0, 30));
    const title = selectedArticle.headline || 'Breaking Football Wire';
    const description = selectedArticle.description || selectedArticle.story || 'Stay tuned to Mivaj Sports for live updates.';
    const imageUrl = selectedArticle.images?.[0]?.url || '';

    // 3. Format Telegram Viral Post
    let msg = `🚨 <b>BREAKING FOOTBALL NEWS WIRE 📰⚡</b>\n\n`;
    msg += `⚽ <b>${title.toUpperCase()}</b>\n\n`;
    msg += `📋 ${description}\n\n`;
    msg += `🔥 <i>Live tactical breakdown & banker odds impact available right now on Mivaj Sports!</i>\n\n`;
    msg += `⚡ <b>INSTANT ACCESS LINKS:</b>\n`;
    msg += `👉 Read Full Story: https://mivaj.com/news\n`;
    msg += `👉 Live Match Bankers: https://mivaj.com\n`;
    msg += `👉 SportyBet Code Revealer: https://mivaj.com/converter\n`;

    const keyboard = [
      [
        { text: '📰 READ FULL STORY ON MIVAJ ➔', url: 'https://mivaj.com/news' },
      ],
      [
        { text: '🔥 VIEW TODAY\'S BANKERS', url: 'https://mivaj.com' },
        { text: '🔄 CODE REVEALER', url: 'https://mivaj.com/converter' },
      ],
      [
        { text: '🎁 22Bet 200% Bonus', url: AFFILIATE_PARTNERS['22BET'].affiliateUrl },
        { text: '🎁 Stake VIP Bonus', url: AFFILIATE_PARTNERS['STAKE'].affiliateUrl },
      ],
    ];

    const res = await TelegramBotService.sendBroadcastMessage(msg, keyboard);

    // 4. Mark article as posted (TTL 3 days)
    await setRedisCache(`mivaj:tg_news:${articleId}`, true, 60 * 60 * 24 * 3);

    return NextResponse.json({
      success: true,
      cron: 'TELEGRAM_NEWS_BROADCAST',
      channel: TelegramBotService.getChannelId(),
      article: {
        id: articleId,
        title,
      },
      telegramOk: res?.ok ?? false,
    });
  } catch (err: any) {
    console.error('Telegram news broadcast error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
