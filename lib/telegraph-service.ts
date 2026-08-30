/**
 * MIVAJ SPORTS TELEGRAPH GUEST-BLOGGING PUBLISHER
 * Publishes long-form, SEO-optimized sports articles to Telegra.ph (DA 93+)
 * with verified contextual backlinks to https://mivaj.com, /standings, /injuries, and /settlement.
 */

export interface TelegraphPublishResult {
  success: boolean;
  url?: string;
  path?: string;
  title: string;
  error?: string;
  publishedAt: string;
}

let cachedAccessToken: string = process.env.TELEGRAPH_ACCESS_TOKEN || 'e56664ffbee3354ed416dc77096a020e42d446427458678aa3b78360143b';

export async function getOrInitTelegraphToken(): Promise<string> {
  if (cachedAccessToken) return cachedAccessToken;

  try {
    const res = await fetch('https://api.telegra.ph/createAccount', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        short_name: 'MivajSports',
        author_name: 'Mivaj Sports Editorial',
        author_url: 'https://mivaj.com',
      }),
    });
    const data = await res.json();
    if (data.ok && data.result?.access_token) {
      cachedAccessToken = data.result.access_token;
      return cachedAccessToken;
    }
  } catch {}

  return 'e56664ffbee3354ed416dc77096a020e42d446427458678aa3b78360143b';
}

export interface MatchGuestPostOptions {
  homeTeam: string;
  awayTeam: string;
  league: string;
  prediction: string;
  confidenceTier: string;
  probability: number;
  odds: number;
  expectedHomeGoals?: number;
  expectedAwayGoals?: number;
}

export async function publishMatchdayGuestArticle(opts: MatchGuestPostOptions): Promise<TelegraphPublishResult> {
  const token = await getOrInitTelegraphToken();
  const title = `${opts.homeTeam} vs ${opts.awayTeam} Tactical Preview, xG & Banker Pick (${opts.league})`;

  // High-authority semantic DOM nodes for Telegraph
  const nodes = [
    {
      tag: 'p',
      children: [
        'The international football spotlight shifts to ',
        { tag: 'b', children: [opts.homeTeam] },
        ' versus ',
        { tag: 'b', children: [opts.awayTeam] },
        ` in the ${opts.league}. Today, our statistical models analyze historical goal expectations, squad depth, and tactical probabilities to deliver a comprehensive matchday briefing.`,
      ],
    },
    { tag: 'h3', children: ['📊 Match Intelligence & Poisson Probability Models'] },
    {
      tag: 'ul',
      children: [
        { tag: 'li', children: [`Competition: ${opts.league}`] },
        { tag: 'li', children: [`Fixture: ${opts.homeTeam} vs ${opts.awayTeam}`] },
        { tag: 'li', children: [`Calculated Consensus: ${opts.prediction} (${opts.probability}% Model Probability)`] },
        { tag: 'li', children: [`Confidence Classification: ${opts.confidenceTier}`] },
        { tag: 'li', children: [`Projected Fair Value Odds: @${opts.odds.toFixed(2)}`] },
      ],
    },
    { tag: 'h3', children: ['🏥 Squad Depth, Injuries & Tactical Radar'] },
    {
      tag: 'p',
      children: [
        'Squad availability and transfer dynamics play a decisive role in matchday performance. Access the up-to-the-minute ',
        {
          tag: 'a',
          attrs: { href: 'https://mivaj.com/injuries' },
          children: ['Hospital Ward & Injury Report'],
        },
        ' as well as the complete ',
        {
          tag: 'a',
          attrs: { href: 'https://mivaj.com/transfers' },
          children: ['Summer Transfer Intelligence Radar'],
        },
        ' for both squads.',
      ],
    },
    { tag: 'h3', children: ['🏆 Official League Standings & Form Matrix'] },
    {
      tag: 'p',
      children: [
        'Track verified club standings, points tallies, goal differentials, and 5-game recent form sequences on the official ',
        {
          tag: 'a',
          attrs: { href: 'https://mivaj.com/standings' },
          children: ['Mivaj Official Standings Matrix'],
        },
        ' before locking in your matchday pick.',
      ],
    },
    { tag: 'h3', children: ['📜 Audited Referee Ledger & Live Haptics'] },
    {
      tag: 'p',
      children: [
        'Every pick is transparently audited post-whistle in the permanent ',
        {
          tag: 'a',
          attrs: { href: 'https://mivaj.com/settlement' },
          children: ['Mivaj Referee Settlement Ledger'],
        },
        '. Experience real-time sub-second goal heartbeat vibrations directly on your mobile device at ',
        {
          tag: 'a',
          attrs: { href: 'https://mivaj.com' },
          children: ['Mivaj Sports Live Match Center'],
        },
        '.',
      ],
    },
    { tag: 'h3', children: ['📢 Join 50,000+ Fans on Official Telegram Wire (@mivajsport)'] },
    {
      tag: 'p',
      children: [
        '⚡ Never miss an instant goal heartbeat vibration, breaking squad injury alert, or referee settlement audit. Join the fastest-growing football intelligence network on Telegram: ',
        {
          tag: 'a',
          attrs: { href: 'https://t.me/mivajsport' },
          children: ['👉 Tap Here to Join @mivajsport on Telegram Free'],
        },
        ' for real-time matchday drops.',
      ],
    },
    {
      tag: 'blockquote',
      children: [
        'Disclaimer: Mivaj Sports analysis is provided for informational and entertainment purposes. 18+ only. Play responsibly.',
      ],
    },
  ];

  try {
    const res = await fetch('https://api.telegra.ph/createPage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_token: token,
        title,
        author_name: 'Mivaj Sports Editorial',
        author_url: 'https://mivaj.com',
        content: JSON.stringify(nodes),
        return_content: false,
      }),
    });

    const data = await res.json();
    if (data.ok && data.result?.url) {
      return {
        success: true,
        url: data.result.url,
        path: data.result.path,
        title,
        publishedAt: new Date().toISOString(),
      };
    } else {
      return {
        success: false,
        title,
        error: data.error || 'Failed to publish to Telegraph',
        publishedAt: new Date().toISOString(),
      };
    }
  } catch (err: any) {
    return {
      success: false,
      title,
      error: err.message,
      publishedAt: new Date().toISOString(),
    };
  }
}
