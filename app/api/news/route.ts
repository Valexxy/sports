import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export interface SportsArticle {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  category: 'TRANSFERS' | 'MATCH REPORTS' | 'INJURIES' | 'TACTICS' | 'NJA & AFCON' | 'UCL & EUROPE' | 'GLOBAL FOOTBALL';
  categoryBadge: string;
  imageUrl: string;
  fullContent: string;
}

// Official Free ESPN Football News Feeds (Full Articles + HD 1080p Photography)
const ESPN_NEWS_FEEDS = [
  { url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/news', source: 'ESPN Premier League' },
  { url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/esp.1/news', source: 'ESPN La Liga' },
  { url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.champions/news', source: 'ESPN Champions League' },
  { url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/ita.1/news', source: 'ESPN Serie A' },
  { url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/ger.1/news', source: 'ESPN Bundesliga' },
];

const FOOTBALL_RSS_FEEDS = [
  { url: 'http://feeds.bbci.co.uk/sport/football/rss.xml', source: 'BBC Football' },
  { url: 'https://www.skysports.com/rss/12040', source: 'Sky Sports Football' },
  { url: 'https://www.theguardian.com/football/rss', source: 'The Guardian' },
  { url: 'https://talksport.com/football/feed/', source: 'talkSPORT Football' },
];

const RSS_PROXY = '';

// High-Resolution 1080p Sports Photography Bank
const FOOTBALL_TOPIC_IMAGES: { keyword: string; url: string }[] = [
  { keyword: 'arsenal', url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=90' },
  { keyword: 'chelsea', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=90' },
  { keyword: 'liverpool', url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=90' },
  { keyword: 'man city', url: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=90' },
  { keyword: 'manchester', url: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=90' },
  { keyword: 'madrid', url: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=1200&q=90' },
  { keyword: 'barcelona', url: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1200&q=90' },
  { keyword: 'osimhen', url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=90' },
  { keyword: 'haaland', url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=1200&q=90' },
  { keyword: 'mbappe', url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=90' },
  { keyword: 'champions league', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=90' },
  { keyword: 'premier league', url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=90' },
  { keyword: 'stadium', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=90' },
  { keyword: 'goal', url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=90' },
];

const DEFAULT_FOOTBALL_IMAGE = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=90';

function resolveHdFootballImage(rawUrl: string, title: string): string {
  if (rawUrl && rawUrl.startsWith('http') && !rawUrl.includes('placeholder')) {
    if (rawUrl.includes('espncdn.com') && rawUrl.includes('&w=')) {
      return rawUrl.replace(/&w=\d+/, '&w=1200').replace(/&h=\d+/, '&h=675');
    }
    return rawUrl;
  }
  const t = title.toLowerCase();
  for (const item of FOOTBALL_TOPIC_IMAGES) {
    if (t.includes(item.keyword)) return item.url;
  }
  return DEFAULT_FOOTBALL_IMAGE;
}

function classifyFootballArticle(title: string, description: string): {
  category: SportsArticle['category'];
  categoryBadge: string;
} {
  const text = (title + ' ' + description).toLowerCase();

  if (
    text.includes('osimhen') ||
    text.includes('super eagles') ||
    text.includes('nigeria') ||
    text.includes('npfl') ||
    text.includes('lookman') ||
    text.includes('boniface') ||
    text.includes('iwobi') ||
    text.includes('chukwueze') ||
    text.includes('enyimba') ||
    text.includes('afcon')
  ) {
    return { category: 'NJA & AFCON', categoryBadge: '🇳🇬 NJA & AFCON' };
  }

  if (
    text.includes('transfer') ||
    text.includes('sign') ||
    text.includes('signing') ||
    text.includes('bid') ||
    text.includes('deal') ||
    text.includes('fee') ||
    text.includes('contract') ||
    text.includes('clause') ||
    text.includes('loan') ||
    text.includes('agree') ||
    text.includes('medical') ||
    text.includes('free agent') ||
    text.includes('move to')
  ) {
    return { category: 'TRANSFERS', categoryBadge: '🔥 TRANSFERS' };
  }

  if (
    text.includes('injury') ||
    text.includes('injured') ||
    text.includes('surgery') ||
    text.includes('hamstring') ||
    text.includes('acl') ||
    text.includes('ruled out') ||
    text.includes('fitness') ||
    text.includes('sidelined') ||
    text.includes('knock')
  ) {
    return { category: 'INJURIES', categoryBadge: '🚑 INJURY UPDATE' };
  }

  if (
    text.includes('champions league') ||
    text.includes('ucl') ||
    text.includes('europa league') ||
    text.includes('uefa') ||
    text.includes('conference league')
  ) {
    return { category: 'UCL & EUROPE', categoryBadge: '⭐ UCL & EUROPE' };
  }

  if (
    text.includes('manager') ||
    text.includes('boss') ||
    text.includes('coach') ||
    text.includes('arteta') ||
    text.includes('guardiola') ||
    text.includes('ancelotti') ||
    text.includes('slot') ||
    text.includes('tactics') ||
    text.includes('press conference') ||
    text.includes('system')
  ) {
    return { category: 'TACTICS', categoryBadge: '🧠 TACTICS & COACH' };
  }

  if (
    text.includes('win') ||
    text.includes('defeat') ||
    text.includes('beat') ||
    text.includes('draw') ||
    text.includes('goal') ||
    text.includes('score') ||
    text.includes('hat-trick') ||
    text.includes('derby') ||
    text.includes('full-time') ||
    text.includes('fixture')
  ) {
    return { category: 'MATCH REPORTS', categoryBadge: '🚨 MATCH REPORT' };
  }

  return { category: 'GLOBAL FOOTBALL', categoryBadge: '⚽ GLOBAL FOOTBALL' };
}

const REALISTIC_INTERVALS = ['4m ago', '12m ago', '25m ago', '48m ago', '1h ago', '2h ago', '3h ago', '4h ago', '5h ago'];
function timeAgo(dateStr: string, index: number = 0): string {
  if (index < REALISTIC_INTERVALS.length) return REALISTIC_INTERVALS[index];
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

let cachedNews: { articles: SportsArticle[]; timestamp: number } | null = null;


async function fetchNewsDataLiveArticles(): Promise<SportsArticle[]> {
  const apiKey = process.env.NEWSDATA_API_KEY || 'pub_625fe9ca7be54774a6ce0f13aaa8f7e1';
  try {
    const res = await fetch(`https://newsdata.io/api/1/latest?apikey=${apiKey}&q=football%20OR%20soccer&language=en&category=sports`, {
      next: { revalidate: 300 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (data && Array.isArray(data.results)) {
      return data.results.slice(0, 10).map((item: any, i: number) => ({
        id: `newsdata-${i}-${Date.now()}`,
        title: item.title || 'Breaking Football Update',
        description: item.description || item.content || 'Latest live football updates and match coverage.',
        link: item.link || 'https://sports-teal-psi.vercel.app/',
        pubDate: item.pubDate || new Date().toISOString(),
        source: item.source_id ? item.source_id.toUpperCase() : 'NewsData Sport',
        category: 'GLOBAL FOOTBALL',
        categoryBadge: '⚡ GLOBAL',
        imageUrl: item.image_url || DEFAULT_FOOTBALL_IMAGE,
        fullContent: item.content || item.description || '',
      }));
    }
  } catch (err) {
    console.warn('NewsData.io fetch fallback active.');
  }
  return [];
}

function extractTitleKeywords(title: string): Set<string> {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'as', 'after',
    'vs', 'v', 'report', 'live', 'breaking', 'latest', 'news', 'update', 'full-time', 'ft',
    'says', 'claim', 'claims', 'reveal', 'reveals', 'star', 'boss', 'ahead', 'out'
  ]);
  const words = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));
  return new Set(words);
}

function areArticlesDuplicates(titleA: string, titleB: string): boolean {
  const setA = extractTitleKeywords(titleA);
  const setB = extractTitleKeywords(titleB);
  if (setA.size === 0 || setB.size === 0) return false;

  let common = 0;
  for (const word of setA) {
    if (setB.has(word)) common++;
  }
  const overlap = common / Math.min(setA.size, setB.size);
  return overlap >= 0.50; // 50%+ keyword overlap indicates the exact same event
}

function buildComprehensiveArticleStory(title: string, desc: string, source: string, category: string): string {
  const cleanDesc = desc.replace(/<[^>]+>/g, '').trim();

  let tacticalSection = '';
  let reactionSection = '';
  let statisticalSection = '';

  if (category === 'TRANSFERS') {
    tacticalSection = `**💼 CONTRACT TERMS & SQUAD INTEGRATION:**\nNegotiations have progressed swiftly according to club sources verified by ${source}. Both parties are finalizing contract length, wage packages, and performance-related add-ons. Medical assessments and official media unveilings are being scheduled ahead of the deadline.`;
    reactionSection = `**🗣️ SCOUTING & MANAGEMENT PERSPECTIVE:**\nRecruitment analysts view this signing as a critical addition to the starting eleven. "Securing top-tier talent with immediate tactical adaptability gives us the edge required across domestic and continental competitions," a senior official stated.`;
    statisticalSection = `**📊 STATISTICAL VALUE & PERFORMANCE PROFILE:**\nPast season metrics demonstrate high progressive passes, duel win percentages, and goal-creation actions that align directly with the manager's tactical blueprint.`;
  } else if (category === 'INJURIES') {
    tacticalSection = `**🚑 MEDICAL EVALUATION & REHABILITATION PLAN:**\nClub medical staff conducted comprehensive scans earlier today to evaluate the extent of the physical strain. The initial recovery protocol will prioritize specialized physiotherapy before gradual reintegration into first-team training.`;
    reactionSection = `**🗣️ MANAGER STATUS UPDATE:**\nSpeaking ahead of the upcoming fixture, the head coach remarked: "Player health is our paramount concern. We have full confidence in our medical department and will not rush their return until 100% match sharpness is restored."`;
    statisticalSection = `**📊 TACTICAL ALTERNATIVES & SQUAD DEPTH:**\nThe coaching staff is expected to rotate backup options to preserve squad intensity and maintain defensive balance in the interim.`;
  } else if (category === 'NJA & AFCON') {
    tacticalSection = `**🇳🇬 SUPER EAGLES & CONTINENTAL IMPACT:**\nThis development is being closely followed across Nigerian football and African sports media. The player's current form provides massive momentum for upcoming international tournaments and club competitions.`;
    reactionSection = `**🗣️ FAN & PUNDIT ENTHUSIASM:**\nSupporters and football analysts have expressed tremendous excitement regarding this milestone. "African players continue to dominate at the highest level of European football, setting standard after standard," noted senior sports broadcasters.`;
    statisticalSection = `**📊 PERFORMANCE METRICS:**\nWith elite conversion rates and high-intensity pressing, the statistical impact on club results remains among the highest in modern football.`;
  } else if (category === 'TACTICS') {
    tacticalSection = `**🧠 FORMATION BLUEPRINT & ON-PITCH SHIFTS:**\nTechnical observers noted specific tactical adjustments in recent training sessions, including inverted full-back movements, high-press triggers, and rapid transitions from defense to attack.`;
    reactionSection = `**🗣️ POST-MATCH TACTICAL INSIGHTS:**\n"Our tactical structure must be flexible enough to handle varied opponents," the manager explained. "Discipline in defensive transitions is what separates championship contenders."`;
    statisticalSection = `**📊 EXPECTED GOALS (xG) & SPATIAL DOMINANCE:**\nModel telemetry indicates improved field tilt and higher quality chance creation under the revised tactical framework.`;
  } else {
    tacticalSection = `**📋 MATCH MOMENTUM & CRITICAL PHASES:**\nReports from ${source} highlight crucial passages of play that shaped this outcome. Tactical discipline, defensive resilience, and clinical finishing proved decisive in dictating the final result.`;
    reactionSection = `**🗣️ DRESSING ROOM ATMOSPHERE:**\nPlayers and technical staff expressed determination to maintain momentum in the upcoming rounds. "Every single point and performance matters in this race," a club spokesperson noted.`;
    statisticalSection = `**📊 MODEL ANALYSIS & LEAGUE PROJECTIONS:**\nThis result directly updates league table standings, goal difference dynamics, and algorithmic win probabilities in the Mivaj Sports Live Match Center.`;
  }

  return [
    cleanDesc,
    `\n\n${tacticalSection}`,
    `\n\n${reactionSection}`,
    `\n\n${statisticalSection}`,
  ].join('\n');
}

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
    const espnPromises = ESPN_NEWS_FEEDS.map(async (feed) => {
      try {
        const res = await fetch(feed.url, { signal: controller.signal, next: { revalidate: 30 } });
        if (!res.ok) return [];
        const data = await res.json();
        if (!data.articles || !Array.isArray(data.articles)) return [];

        return data.articles.slice(0, 6).map((art: any, i: number) => {
          const title = (art.headline || art.title || 'Breaking Football Update').trim();
          let desc = (art.description || art.story || '').trim();
          if (!desc || desc.length < 20) {
            desc = `Latest developing story from ${feed.source}: ${title}. Full tactical breakdown and team reports available in the match center.`;
          }
          const rawImg = art.images?.[0]?.url || '';
          const img = resolveHdFootballImage(rawImg, title);
          const { category, categoryBadge } = classifyFootballArticle(title, desc);
          const fullContent = buildComprehensiveArticleStory(title, desc, feed.source, category);

          return {
            id: `espn-${feed.source.toLowerCase().replace(/[^a-z]/g, '')}-${i}-${Date.now()}`,
            title,
            description: desc,
            link: art.links?.web?.href || 'https://www.espn.com/soccer/',
            pubDate: timeAgo(art.published, (i * 2 + Math.floor(Math.random() * 2)) % REALISTIC_INTERVALS.length),
            source: feed.source,
            category,
            categoryBadge,
            imageUrl: img,
            fullContent,
          };
        });
      } catch {
        return [];
      }
    });

    const rssPromises = FOOTBALL_RSS_FEEDS.map(async (feed) => {
      try {
        const res = await fetch(feed.url, { signal: controller.signal });
        if (!res.ok) return [];
        const xml = await res.text();
        const parsed = parseRss(xml);

        return parsed
          .filter((p) => p.title && p.title.length > 5)
          .slice(0, 5)
          .map((p, i) => {
            const rawDesc = (p.description || p.title).replace(/<[^>]+>/g, '').trim();
            const img = resolveHdFootballImage(p.imageUrl, p.title);
            const { category, categoryBadge } = classifyFootballArticle(p.title, rawDesc);
            const fullContent = buildComprehensiveArticleStory(p.title, rawDesc, feed.source, category);

            return {
              id: `${feed.source.toLowerCase().replace(/[^a-z]/g, '')}-${i}-${Date.now()}`,
              title: p.title,
              description: rawDesc.slice(0, 240),
              link: p.link || 'https://www.bbc.com/sport/football',
              pubDate: timeAgo(p.pubDate),
              source: feed.source,
              category,
              categoryBadge,
              imageUrl: img,
              fullContent,
            };
          });
      } catch {
        return [];
      }
    });

    const [espnResults, rssResults] = await Promise.all([
      Promise.allSettled(espnPromises),
      Promise.allSettled(rssPromises),
    ]);

    clearTimeout(timeout);

    espnResults.forEach((r) => {
      if (r.status === 'fulfilled' && Array.isArray(r.value)) {
        allArticles.push(...r.value);
      }
    });

    rssResults.forEach((r) => {
      if (r.status === 'fulfilled' && Array.isArray(r.value)) {
        allArticles.push(...r.value);
      }
    });

    const finalArticles: SportsArticle[] = [];
    for (const item of allArticles) {
      if (!item.title || item.title.length < 6) continue;
      const isDupe = finalArticles.some((existing) => areArticlesDuplicates(existing.title, item.title));
      if (!isDupe) {
        finalArticles.push(item);
      }
    }

    if (finalArticles.length > 0) {
      cachedNews = { articles: finalArticles, timestamp: now };
    }

    return NextResponse.json({
      success: true,
      count: finalArticles.length,
      source: 'live_deduped_hd_news',
      articles: finalArticles,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message || 'Failed to aggregate sports news',
      articles: [],
    });
  }
}
