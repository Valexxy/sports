import { TelegramBotService } from '../services/telegram/botService';
import { getRedisCache, setRedisCache } from './upstash-redis-engine';
import { publishToTipsBrosFacebook, DEFAULT_PAGE_TOKEN, TIPS_BROS_PAGE_ID, TIPS_BROS_PAGE_URL } from './facebook-page-autoposter';
import { rewriteNewsWithAI } from './ai-rewriter';
import { pingIndexNow } from './index-now';

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
    const res = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/news', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return { success: false, telegramPosted: false, facebookPosted: false, error: 'Failed to fetch ESPN news' };
    }

    const data = await res.json();
    const articles = data.articles || [];
    if (articles.length === 0) return { success: true, telegramPosted: false, facebookPosted: false };

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

    if (!selected) return { success: true, telegramPosted: false, facebookPosted: false };

    const originalTitle = (selected.headline || selected.title || 'Breaking Football News').trim();
    const originalDesc = (selected.description || selected.story || '').trim();
    const rawImg = selected.images?.[0]?.url || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=90';
    const hdImg = rawImg.replace(/&w=\d+/, '&w=1200').replace(/&h=\d+/, '&h=675');

    // === AI REWRITER INJECTION ===
    const { title, content: desc } = await rewriteNewsWithAI(originalTitle, originalDesc, 'Global Football');

    // === PER-SECOND INDEXING (IndexNow Ping) ===
    // Assuming you have a dynamic news page for this article: /news/articleId
    const newsUrl = `https://mivaj.com/news/${articleId}`;
    await pingIndexNow(newsUrl);

    let tgOk = false;
    try {
      // 100% Premium Content Structure
      let msg = `? <b>MIVAJ INSIDER TACTICAL REPORT</b> ?\n\n`;
      msg += `<b>${title.toUpperCase()}</b>\n\n`;
      msg += `${desc}\n\n`;
      msg += `?? <i>AI Analysis: This directly impacts market odds. Read full breakdown below.</i>\n`;

      const keyboard = [
        [
          { text: '?? READ DEEP ANALYSIS ON MIVAJ', url: newsUrl },
        ],
        [
          { text: '?? 84% WIN BANKERS', url: 'https://mivaj.com' },
          { text: '?? SHARE TO UNLOCK VIP ODDS', url: `https://t.me/share/url?url=https://t.me/mivajsport&text=Get%20insane%20AI%20football%20predictions!` },
        ],
      ];

      const tgRes = await TelegramBotService.sendBroadcastMessage(msg, keyboard);
      tgOk = tgRes?.ok ?? false;
    } catch (e) {
      console.warn('Telegram news broadcast error:', e);
    }

    let fbOk = false;
    try {
      const pageId = process.env.FACEBOOK_PAGE_ID || TIPS_BROS_PAGE_ID;
      const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN || DEFAULT_PAGE_TOKEN;
      if (token) {
        const fbCaption = `? MIVAJ INSIDER TACTICAL REPORT ?\n\n${title.toUpperCase()}\n\n${desc}\n\n?? Read the full tactical breakdown & live score impact on Mivaj Sports:\n?? ${newsUrl}\n\n?? Join 50,000+ Football Fans on Telegram for Free Codes:\n?? https://t.me/mivajsport\n\n#FootballNews #PremierLeague #ChampionsLeague #Transfers #TipsBrosNG #MivajSports`;
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

