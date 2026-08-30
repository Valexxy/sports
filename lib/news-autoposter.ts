import { TelegramBotService } from '../services/telegram/botService';
import { getRedisCache, setRedisCache } from './upstash-redis-engine';
import { publishToTipsBrosFacebook, DEFAULT_PAGE_TOKEN, TIPS_BROS_PAGE_ID, TIPS_BROS_PAGE_URL } from './facebook-page-autoposter';

export interface NewsAutopostResult {
  success: boolean;
  articleId?: string;
  title?: string;
  telegramPosted: boolean;
  facebookPosted: boolean;
  error?: string;
}

export async function broadcastBreakingNewsToSocials(): Promise<NewsAutopostResult> {
  try {
    // 1. Fetch fresh live news from internal API or ESPN
    const res = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/news', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return { success: false, telegramPosted: false, facebookPosted: false, error: 'Failed to fetch ESPN news' };
    }

    const data = await res.json();
    const articles = data.articles || [];
    if (articles.length === 0) {
      return { success: true, telegramPosted: false, facebookPosted: false };
    }

    // 2. Find fresh article not yet posted
    let selected: any = null;
    let articleId = '';
    for (const art of articles.slice(0, 10)) {
      const rawId = String(art.id || (art.headline || '').slice(0, 35));
      const key = `mivaj:news_posted:${rawId}`;
      const posted = await getRedisCache<boolean>(key);
      if (!posted) {
        selected = art;
        articleId = rawId;
        break;
      }
    }

    if (!selected) {
      return { success: true, telegramPosted: false, facebookPosted: false };
    }

    const title = (selected.headline || selected.title || 'Breaking Football News').trim();
    const desc = (selected.description || selected.story || '').trim() || 'Breaking football updates and tactical developments.';
    const rawImg = selected.images?.[0]?.url || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=90';
    const hdImg = rawImg.replace(/&w=\d+/, '&w=1200').replace(/&h=\d+/, '&h=675');

    // 3. Post to Telegram (@mivajsport)
    let tgOk = false;
    try {
      let msg = `🚨 <b>BREAKING FOOTBALL NEWS WIRE 📰⚡</b>\n\n`;
      msg += `⚽ <b>${title.toUpperCase()}</b>\n\n`;
      msg += `📋 ${desc}\n\n`;
      msg += `🔥 <i>Full tactical breakdown, starting lineups, and referee data verified live on Mivaj Sports!</i>\n\n`;
      msg += `👉 Read Full Story: https://mivaj.com/news\n`;
      msg += `👉 Live Match Center: https://mivaj.com\n`;
      msg += `👉 Free Banker Signals: https://t.me/mivajsport\n`;

      const keyboard = [
        [
          { text: '📰 READ FULL STORY ON MIVAJ ➔', url: 'https://mivaj.com/news' },
        ],
        [
          { text: '🔥 TODAY\'S 84% WIN BANKERS', url: 'https://mivaj.com' },
          { text: '📲 GET NATIVE APP (APK)', url: 'https://mivaj.com/download' },
        ],
      ];

      const tgRes = await TelegramBotService.sendBroadcastMessage(msg, keyboard);
      tgOk = tgRes?.ok ?? false;
    } catch (e) {
      console.warn('Telegram news broadcast error:', e);
    }

    // 4. Post to Facebook (TipsBros NG)
    let fbOk = false;
    try {
      const pageId = process.env.FACEBOOK_PAGE_ID || TIPS_BROS_PAGE_ID;
      const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN || DEFAULT_PAGE_TOKEN;
      if (token) {
        const fbCaption = `🚨 BREAKING FOOTBALL NEWS WIRE 🚨\n\n⚽ ${title.toUpperCase()}\n\n📋 ${desc}\n\n🔥 Read the full tactical breakdown & live score impact on Mivaj Sports:\n👉 https://mivaj.com/news\n\n📢 Join 50,000+ Football Fans on Telegram:\n👉 https://t.me/mivajsport\n\n#FootballNews #PremierLeague #ChampionsLeague #Transfers #TipsBrosNG #MivajSports`;
        const fbRes = await fetch(`https://graph.facebook.com/v19.0/${pageId}/photos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: hdImg,
            caption: fbCaption,
            access_token: token,
          }),
        });
        const fbData = await fbRes.json();
        fbOk = fbRes.ok && !!(fbData.id || fbData.post_id);
      }
    } catch (e) {
      console.warn('Facebook news broadcast error:', e);
    }

    // 5. Mark as posted in Redis (TTL 4 days)
    await setRedisCache(`mivaj:news_posted:${articleId}`, true, 60 * 60 * 24 * 4);

    return {
      success: true,
      articleId,
      title,
      telegramPosted: tgOk,
      facebookPosted: fbOk,
    };
  } catch (err: any) {
    return {
      success: false,
      telegramPosted: false,
      facebookPosted: false,
      error: err?.message || 'News autopost error',
    };
  }
}
