/**
 * DYNAMIC LIVE RSS & MULTI-SPORT NEWS ENGINE
 * Fetches real verified articles directly from BBC Sport / Sky Sports / NYT Soccer RSS
 * through the allorigins CORS proxy. Works both client-side and server-side (cron).
 */

export interface LiveRssArticle {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  source: string;
  category: string;
  description: string;
  imageUrl?: string;
}

const RSS_FEEDS: { url: string; source: string; category: string }[] = [
  { url: 'https://feeds.bbci.co.uk/sport/rss.xml', source: 'BBC Sport', category: 'FOOTBALL' },
  { url: 'https://www.skysports.com/rss/12040', source: 'Sky Sports Football', category: 'FOOTBALL' },
  { url: 'https://feeds.bbci.co.uk/sport/football/rss.xml', source: 'BBC Football', category: 'FOOTBALL' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Soccer.xml', source: 'NYT Soccer', category: 'FOOTBALL' },
];

const RSS_PROXY = 'https://api.allorigins.win/raw?url=';

function parseRss(xml: string): { title: string; link: string; description: string; pubDate: string }[] {
  const items: { title: string; link: string; description: string; pubDate: string }[] = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  const tag = (block: string, name: string) => {
    const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`));
    return m ? m[1].replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '').trim() : '';
  };
  let match: RegExpExecArray | null;
  while ((match = itemRe.exec(xml)) !== null) {
    const block = match[1];
    items.push({
      title: tag(block, 'title'),
      link: tag(block, 'link'),
      description: tag(block, 'description'),
      pubDate: tag(block, 'pubDate'),
    });
  }
  return items;
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return 'Recent';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Recent';
  const diff = Math.max(0, Date.now() - d.getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

/** Direct real RSS fetch — used by cron (server-side) and browser via absolute URL. */
export async function fetchLiveRssNews(): Promise<LiveRssArticle[]> {
  try {
    // Server-side: fetch feeds directly. Browser: hits local /api/news first.
    if (typeof window === 'undefined') {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const results = await Promise.allSettled(
        RSS_FEEDS.map(async (feed) => {
          try {
            const res = await fetch(`${RSS_PROXY}${encodeURIComponent(feed.url)}`, { signal: controller.signal });
            if (!res.ok) return [] as LiveRssArticle[];
            const xml = await res.text();
            const parsed = parseRss(xml);
            return parsed.slice(0, 6).map((p, i) => ({
              id: `${feed.source.toLowerCase().replace(/[^a-z]/g, '')}-${i}`,
              title: p.title || 'Football Update',
              link: p.link || 'https://www.bbc.com/sport',
              pubDate: timeAgo(p.pubDate),
              source: feed.source,
              category: feed.category,
              description: p.description.replace(/<[^>]+>/g, '').slice(0, 220),
              imageUrl: (p.description.match(/<img[^>]+src=["']([^"']+)["']/i) || [])[1] || '',
            }));
          } catch (e) {
            return [] as LiveRssArticle[];
          }
        })
      );
      clearTimeout(timeout);
      const articles: LiveRssArticle[] = [];
      for (const r of results) {
        if (r.status === 'fulfilled') articles.push(...r.value);
      }
      const seen = new Set<string>();
      return articles.filter((a) => {
        const key = a.title.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    // Browser: use local endpoint
    const res = await fetch('/api/news', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.articles && Array.isArray(data.articles) && data.articles.length > 0) {
        return data.articles;
      }
    }
  } catch (err) {
    console.warn('RSS fetch error.');
  }

  // Honest empty fallback — never fabricate headlines.
  return [];
}

