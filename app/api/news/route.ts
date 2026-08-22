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

/** Real, verifiable RSS feeds — zero mock data. */
const RSS_FEEDS: { url: string; source: string; category: string }[] = [
  { url: 'https://feeds.bbci.co.uk/sport/rss.xml', source: 'BBC Sport', category: 'FOOTBALL' },
  { url: 'https://www.skysports.com/rss/12040', source: 'Sky Sports Football', category: 'FOOTBALL' },
  { url: 'https://feeds.bbci.co.uk/sport/football/rss.xml', source: 'BBC Football', category: 'FOOTBALL' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Soccer.xml', source: 'NYT Soccer', category: 'FOOTBALL' },
];

const RSS_PROXY = 'https://api.allorigins.win/raw?url=';

/** Parse XML RSS into articles with pure Node (no DOM lib needed). */
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

function toImage(text: string): string {
  const imgRe = /<img[^>]+src=["']([^"']+)["']/i;
  const m = text.match(imgRe);
  return m ? m[1] : '';
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

export async function GET() {
  const articles: SportsArticle[] = [];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const results = await Promise.allSettled(
      RSS_FEEDS.map(async (feed) => {
        try {
          const res = await fetch(`${RSS_PROXY}${encodeURIComponent(feed.url)}`, { signal: controller.signal });
          if (!res.ok) return [];
          const xml = await res.text();
          const parsed = parseRss(xml);
          return parsed.slice(0, 6).map((p, i) => {
            const raw = p.description || '';
            const img = toImage(raw);
            return {
              id: `${feed.source.toLowerCase().replace(/[^a-z]/g, '')}-${i}`,
              title: p.title || 'Football Update',
              description: raw.replace(/<[^>]+>/g, '').slice(0, 220),
              link: p.link || 'https://www.bbc.com/sport',
              pubDate: timeAgo(p.pubDate),
              source: feed.source,
              category: feed.category,
              imageUrl: img || '',
              fullContent: raw.replace(/<[^>]+>/g, '').slice(0, 600),
            };
          });
        } catch (e) {
          return [];
        }
      })
    );

    clearTimeout(timeout);
    for (const r of results) {
      if (r.status === 'fulfilled') articles.push(...r.value);
    }

    // De-duplicate by title
    const seen = new Set<string>();
    const unique = articles.filter((a) => {
      const key = a.title.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return NextResponse.json({ success: true, count: unique.length, articles: unique });
  } catch (err) {
    clearTimeout(timeout);
    console.error('/api/news error:', err);
    return NextResponse.json({ success: false, count: 0, articles: [] }, { status: 500 });
  }
}
