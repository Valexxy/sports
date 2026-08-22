import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export interface SportsArticle {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  category: string;
  imageUrl: string;
  fullContent: string;
}

// 100% Pure Verified Legal Global Football RSS Feeds
const FOOTBALL_RSS_FEEDS = [
  { url: 'http://feeds.bbci.co.uk/sport/football/rss.xml', source: 'BBC Football', category: 'FOOTBALL' },
  { url: 'https://www.skysports.com/rss/12040', source: 'Sky Sports Football', category: 'PREMIER LEAGUE' },
  { url: 'https://www.theguardian.com/football/rss', source: 'The Guardian', category: 'EUROPEAN' },
  { url: 'https://www.espn.com/espn/rss/soccer/news', source: 'ESPN FC', category: 'GLOBAL' },
  { url: 'https://talksport.com/football/feed/', source: 'talkSPORT Football', category: 'BREAKING' },
];

const RSS_PROXY = 'https://api.allorigins.win/raw?url=';

// Topic-Aware High-Resolution Verified Sports Photography Bank
const FOOTBALL_TOPIC_IMAGES: { keyword: string; url: string }[] = [
  { keyword: 'arsenal', url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80' },
  { keyword: 'chelsea', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80' },
  { keyword: 'liverpool', url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80' },
  { keyword: 'man city', url: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=800&q=80' },
  { keyword: 'manchester', url: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=800&q=80' },
  { keyword: 'madrid', url: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=800&q=80' },
  { keyword: 'barcelona', url: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=800&q=80' },
  { keyword: 'osimhen', url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80' },
  { keyword: 'haaland', url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=800&q=80' },
  { keyword: 'mbappe', url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80' },
  { keyword: 'champions league', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80' },
  { keyword: 'premier league', url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80' },
  { keyword: 'stadium', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80' },
  { keyword: 'goal', url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80' },
];

const DEFAULT_FOOTBALL_IMAGE = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80';

function resolveFootballImage(rawUrl: string, title: string): string {
  if (rawUrl && rawUrl.startsWith('http') && !rawUrl.includes('placeholder')) {
    return rawUrl;
  }
  const t = title.toLowerCase();
  for (const item of FOOTBALL_TOPIC_IMAGES) {
    if (t.includes(item.keyword)) return item.url;
  }
  return DEFAULT_FOOTBALL_IMAGE;
}

// Strict filter to exclude non-football sports
function isPureFootball(title: string, desc: string): boolean {
  const text = (title + ' ' + desc).toLowerCase();
  const nonFootballTerms = ['formula 1', 'grand prix', 'f1', 'cricket', 'root', 'tennis', 'djokovic', 'alcaraz', 'golf', 'mcilroy', 'rugby', 'nba', 'nfl', 'boxing', 'joshua', 'ufc'];
  for (const term of nonFootballTerms) {
    if (text.includes(term)) return false;
  }
  return true;
}

function parseRss(xml: string): { title: string; link: string; description: string; pubDate: string; imageUrl: string }[] {
  const items: { title: string; link: string; description: string; pubDate: string; imageUrl: string }[] = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;

  const tag = (block: string, name: string) => {
    const m = block.match(new RegExp('<' + name + '[^>]*>([\\s\\S]*?)<\/' + name + '>'));
    return m ? m[1].replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '').trim() : '';
  };

  const extractImage = (block: string): string => {
    const thumbMatch = block.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i);
    if (thumbMatch) return thumbMatch[1];

    const encMatch = block.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
    if (encMatch) return encMatch[1];

    const contentMatch = block.match(/<media:content[^>]+url=["']([^"']+)["']/i);
    if (contentMatch) return contentMatch[1];

    const imgMatch = block.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch) return imgMatch[1];

    return '';
  };

  let match: RegExpExecArray | null;
  while ((match = itemRe.exec(xml)) !== null) {
    const block = match[1];
    items.push({
      title: tag(block, 'title'),
      link: tag(block, 'link'),
      description: tag(block, 'description'),
      pubDate: tag(block, 'pubDate'),
      imageUrl: extractImage(block),
    });
  }
  return items;
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return 'Just now';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Just now';
  const diff = Math.max(0, Date.now() - d.getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// In-memory cache with 30s TTL
let cachedNews: { articles: SportsArticle[]; timestamp: number } | null = null;

export async function GET() {
  const now = Date.now();
  if (cachedNews && (now - cachedNews.timestamp) < 30000) {
    return NextResponse.json({
      success: true,
      count: cachedNews.articles.length,
      source: 'cached_feed',
      articles: cachedNews.articles,
    });
  }

  const allArticles: SportsArticle[] = [];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const results = await Promise.allSettled(
      FOOTBALL_RSS_FEEDS.map(async (feed) => {
        try {
          const res = await fetch(`${RSS_PROXY}${encodeURIComponent(feed.url)}`, { signal: controller.signal });
          if (!res.ok) return [];
          const xml = await res.text();
          const parsed = parseRss(xml);

          return parsed
            .filter((p) => p.title && p.title.length > 5 && isPureFootball(p.title, p.description))
            .slice(0, 8)
            .map((p, i) => {
              const rawDesc = p.description || p.title;
              const img = resolveFootballImage(p.imageUrl, p.title);
              return {
                id: `${feed.source.toLowerCase().replace(/[^a-z]/g, '')}-${i}-${Date.now()}`,
                title: p.title,
                description: rawDesc.replace(/<[^>]+>/g, '').slice(0, 220),
                link: p.link || 'https://www.bbc.com/sport/football',
                pubDate: timeAgo(p.pubDate),
                source: feed.source,
                category: feed.category,
                imageUrl: img,
                fullContent: rawDesc.replace(/<[^>]+>/g, '').slice(0, 800),
              };
            });
        } catch (e) {
          return [];
        }
      })
    );

    clearTimeout(timeout);

    results.forEach((r) => {
      if (r.status === 'fulfilled' && Array.isArray(r.value)) {
        allArticles.push(...r.value);
      }
    });

    // Deduplicate by title
    const uniqueMap = new Map<string, SportsArticle>();
    allArticles.forEach((a) => {
      if (!uniqueMap.has(a.title)) uniqueMap.set(a.title, a);
    });

    const finalArticles = Array.from(uniqueMap.values());
    if (finalArticles.length > 0) {
      cachedNews = { articles: finalArticles, timestamp: now };
    }

    return NextResponse.json({
      success: true,
      count: finalArticles.length,
      source: 'live_football_rss',
      articles: finalArticles,
    });
  } catch (err: any) {
    if (cachedNews) {
      return NextResponse.json({ success: true, count: cachedNews.articles.length, source: 'fallback', articles: cachedNews.articles });
    }
    return NextResponse.json({ success: false, error: err.message, articles: [] }, { status: 500 });
  }
}
