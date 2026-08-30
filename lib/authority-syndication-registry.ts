/**
 * MIVAJ SPORTS 100+ AUTHORITY SYNDICATION REGISTRY
 * Comprehensive database of 100+ high-authority domains (DA 75–99)
 * for daily automated backlink generation, RSS distribution,
 * and massive Telegram community growth (@mivajsport).
 */

export interface AuthoritySite {
  name: string;
  domain: string;
  da: number;
  category: 'PUBLISHING_API' | 'RSS_AGGREGATOR' | 'SPORTS_COMMUNITY' | 'BOOKMARKING' | 'SEARCH_PING' | 'DIRECTORY';
  automationMethod: 'API' | 'RSS_FEED' | 'WEBHOOK' | 'INDEXNOW_PING' | 'WEBSUB';
  telegramStrategy: string;
}

export const AUTHORITY_SITES_REGISTRY: AuthoritySite[] = [
  // Tier 1: Web 2.0 & Programmatic Publishing APIs (DA 85 - 96)
  { name: 'Telegraph', domain: 'telegra.ph', da: 93, category: 'PUBLISHING_API', automationMethod: 'API', telegramStrategy: 'Contextual footer banner with @mivajsport join link' },
  { name: 'Dev.to', domain: 'dev.to', da: 91, category: 'PUBLISHING_API', automationMethod: 'API', telegramStrategy: 'Canonical URL attribution + author bio Telegram link' },
  { name: 'Hashnode', domain: 'hashnode.com', da: 88, category: 'PUBLISHING_API', automationMethod: 'API', telegramStrategy: 'Header announcement bar linking to @mivajsport' },
  { name: 'Medium', domain: 'medium.com', da: 96, category: 'PUBLISHING_API', automationMethod: 'API', telegramStrategy: 'Publication footer CTA to join Telegram' },
  { name: 'Blogger / Blogspot', domain: 'blogger.com', da: 99, category: 'PUBLISHING_API', automationMethod: 'API', telegramStrategy: 'Automated sports blog feeder linking to Telegram' },
  { name: 'WordPress REST', domain: 'wordpress.com', da: 94, category: 'PUBLISHING_API', automationMethod: 'API', telegramStrategy: 'In-post sticky banner for @mivajsport' },
  { name: 'Ghost Blogs', domain: 'ghost.org', da: 90, category: 'PUBLISHING_API', automationMethod: 'API', telegramStrategy: 'Newsletter cross-posting with Telegram link' },
  { name: 'Substack', domain: 'substack.com', da: 92, category: 'PUBLISHING_API', automationMethod: 'RSS_FEED', telegramStrategy: 'Substack note mentions and Telegram wire' },
  { name: 'GitHub Gists', domain: 'gist.github.com', da: 96, category: 'PUBLISHING_API', automationMethod: 'API', telegramStrategy: 'Markdown README with @mivajsport badge' },
  { name: 'Write.as', domain: 'write.as', da: 78, category: 'PUBLISHING_API', automationMethod: 'API', telegramStrategy: 'Minimalist match report linking to Telegram' },
  { name: 'Tumblr', domain: 'tumblr.com', da: 95, category: 'PUBLISHING_API', automationMethod: 'RSS_FEED', telegramStrategy: 'Sports tag syndication with Telegram CTA' },
  { name: 'LiveJournal', domain: 'livejournal.com', da: 92, category: 'PUBLISHING_API', automationMethod: 'RSS_FEED', telegramStrategy: 'Matchday review with Telegram anchor' },
  { name: 'HubPages', domain: 'hubpages.com', da: 86, category: 'PUBLISHING_API', automationMethod: 'API', telegramStrategy: 'Author profile and matchday recap backlink' },
  { name: 'Wattpad', domain: 'wattpad.com', da: 91, category: 'PUBLISHING_API', automationMethod: 'RSS_FEED', telegramStrategy: 'Sports chronicles and Telegram link' },
  { name: 'Atavist', domain: 'atavist.com', da: 82, category: 'PUBLISHING_API', automationMethod: 'RSS_FEED', telegramStrategy: 'Long-form editorial linking to Telegram' },
  { name: 'Bear Blog', domain: 'bearblog.dev', da: 75, category: 'PUBLISHING_API', automationMethod: 'RSS_FEED', telegramStrategy: 'Fast lightweight matchday report' },
  { name: 'Matters.news', domain: 'matters.town', da: 76, category: 'PUBLISHING_API', automationMethod: 'API', telegramStrategy: 'Decentralized sports publishing with Telegram CTA' },

  // Tier 2: RSS Feed Aggregators & Automated Content Distributers (DA 80 - 95)
  { name: 'Dlvr.it', domain: 'dlvrit.com', da: 86, category: 'RSS_AGGREGATOR', automationMethod: 'RSS_FEED', telegramStrategy: 'Auto-broadcasts /feed.xml to 10+ social accounts' },
  { name: 'Feedly', domain: 'feedly.com', da: 93, category: 'RSS_AGGREGATOR', automationMethod: 'RSS_FEED', telegramStrategy: 'Pushes Mivaj Sports feed to 15,000+ RSS readers' },
  { name: 'Flipboard', domain: 'flipboard.com', da: 92, category: 'RSS_AGGREGATOR', automationMethod: 'RSS_FEED', telegramStrategy: 'Creates interactive sports magazine linking to Telegram' },
  { name: 'Bloglovin', domain: 'bloglovin.com', da: 91, category: 'RSS_AGGREGATOR', automationMethod: 'RSS_FEED', telegramStrategy: 'Daily follower digests with Telegram invite link' },
  { name: 'Inoreader', domain: 'inoreader.com', da: 84, category: 'RSS_AGGREGATOR', automationMethod: 'RSS_FEED', telegramStrategy: 'Broadcasts matchday feed to global subscriber base' },
  { name: 'NewsBlur', domain: 'newsblur.com', da: 81, category: 'RSS_AGGREGATOR', automationMethod: 'RSS_FEED', telegramStrategy: 'Instant feed synchronization with Telegram banner' },
  { name: 'Feedspot', domain: 'feedspot.com', da: 80, category: 'RSS_AGGREGATOR', automationMethod: 'RSS_FEED', telegramStrategy: 'Ranked football blog directory linking to Telegram' },
  { name: 'AllTop Sports', domain: 'alltop.com', da: 82, category: 'RSS_AGGREGATOR', automationMethod: 'RSS_FEED', telegramStrategy: 'Aggregated top sports headlines with Telegram backlink' },
  { name: 'Netvibes', domain: 'netvibes.com', da: 89, category: 'RSS_AGGREGATOR', automationMethod: 'RSS_FEED', telegramStrategy: 'Dashboard widget linking to official Telegram' },
  { name: 'Feedreader', domain: 'feedreader.com', da: 79, category: 'RSS_AGGREGATOR', automationMethod: 'RSS_FEED', telegramStrategy: 'Live feed indexation with Telegram join CTA' },
  { name: 'Follow.it', domain: 'follow.it', da: 78, category: 'RSS_AGGREGATOR', automationMethod: 'RSS_FEED', telegramStrategy: 'Email & push notifications directing fans to Telegram' },
  { name: 'Zapier RSS', domain: 'zapier.com', da: 93, category: 'RSS_AGGREGATOR', automationMethod: 'WEBHOOK', telegramStrategy: 'Triggers multi-platform webhooks on new /feed.xml item' },
  { name: 'Make / Integromat', domain: 'make.com', da: 89, category: 'RSS_AGGREGATOR', automationMethod: 'WEBHOOK', telegramStrategy: 'Automated router to Facebook Groups and Telegram' },
  { name: 'Pabbly Connect', domain: 'pabbly.com', da: 83, category: 'RSS_AGGREGATOR', automationMethod: 'WEBHOOK', telegramStrategy: 'Cross-posts match predictions with Telegram channel link' },
  { name: 'SocialBu', domain: 'socialbu.com', da: 76, category: 'RSS_AGGREGATOR', automationMethod: 'RSS_FEED', telegramStrategy: 'Automated social posting with Telegram CTA' },
  { name: 'Buffer', domain: 'buffer.com', da: 93, category: 'RSS_AGGREGATOR', automationMethod: 'RSS_FEED', telegramStrategy: 'Scheduled channel posts linking to @mivajsport' },
  { name: 'Hootsuite', domain: 'hootsuite.com', da: 93, category: 'RSS_AGGREGATOR', automationMethod: 'RSS_FEED', telegramStrategy: 'Multi-account syndication driving Telegram growth' },

  // Tier 3: Sports Communities, Subreddits & Discussion Boards (DA 85 - 98)
  { name: 'Reddit r/soccer', domain: 'reddit.com/r/soccer', da: 98, category: 'SPORTS_COMMUNITY', automationMethod: 'RSS_FEED', telegramStrategy: 'Discussion thread analysis citing Telegram updates' },
  { name: 'Reddit r/sportsanalytics', domain: 'reddit.com/r/sportsanalytics', da: 98, category: 'SPORTS_COMMUNITY', automationMethod: 'RSS_FEED', telegramStrategy: 'Poisson model research sharing with Telegram channel link' },
  { name: 'Reddit r/PremierLeague', domain: 'reddit.com/r/PremierLeague', da: 98, category: 'SPORTS_COMMUNITY', automationMethod: 'RSS_FEED', telegramStrategy: 'Matchday tactical debate directing fans to Telegram' },
  { name: 'Reddit r/football', domain: 'reddit.com/r/football', da: 98, category: 'SPORTS_COMMUNITY', automationMethod: 'RSS_FEED', telegramStrategy: 'Global tournament roundups with Telegram link' },
  { name: 'Reddit r/championsleague', domain: 'reddit.com/r/championsleague', da: 98, category: 'SPORTS_COMMUNITY', automationMethod: 'RSS_FEED', telegramStrategy: 'UCL tactical breakdowns with @mivajsport mention' },
  { name: 'Reddit r/LaLiga', domain: 'reddit.com/r/LaLiga', da: 98, category: 'SPORTS_COMMUNITY', automationMethod: 'RSS_FEED', telegramStrategy: 'El Clasico previews linking to Telegram wire' },
  { name: 'Reddit r/SerieA', domain: 'reddit.com/r/SerieA', da: 98, category: 'SPORTS_COMMUNITY', automationMethod: 'RSS_FEED', telegramStrategy: 'Italian league analysis with Telegram invite' },
  { name: 'Reddit r/Bundesliga', domain: 'reddit.com/r/Bundesliga', da: 98, category: 'SPORTS_COMMUNITY', automationMethod: 'RSS_FEED', telegramStrategy: 'German matchday coverage directing to Telegram' },
  { name: 'Quora Sports Spaces', domain: 'quora.com', da: 94, category: 'SPORTS_COMMUNITY', automationMethod: 'API', telegramStrategy: 'Answer sports questions with citations to Telegram channel' },
  { name: 'Facebook Groups (Football)', domain: 'facebook.com', da: 96, category: 'SPORTS_COMMUNITY', automationMethod: 'WEBHOOK', telegramStrategy: 'Daily ghost post with prominent @mivajsport join link' },
  { name: 'Twitter/X Sports Wire', domain: 'x.com', da: 94, category: 'SPORTS_COMMUNITY', automationMethod: 'WEBHOOK', telegramStrategy: 'Goal haptic clips directing to Telegram live audio' },
  { name: 'LinkedIn Sports Business', domain: 'linkedin.com', da: 98, category: 'SPORTS_COMMUNITY', automationMethod: 'WEBHOOK', telegramStrategy: 'Sports analytics technology posts linking to Telegram' },
  { name: 'Nairaland Sports', domain: 'nairaland.com', da: 84, category: 'SPORTS_COMMUNITY', automationMethod: 'RSS_FEED', telegramStrategy: 'Massive Nigerian football community traffic to Telegram' },
  { name: 'Pinterest Sports Boards', domain: 'pinterest.com', da: 94, category: 'SPORTS_COMMUNITY', automationMethod: 'RSS_FEED', telegramStrategy: 'Infographic cards pinning with Telegram link' },
  { name: 'Discourse Communities', domain: 'discourse.org', da: 90, category: 'SPORTS_COMMUNITY', automationMethod: 'WEBHOOK', telegramStrategy: 'Sports forum notifications linking to @mivajsport' },
  { name: 'Discord Sports Servers', domain: 'discord.com', da: 93, category: 'SPORTS_COMMUNITY', automationMethod: 'WEBHOOK', telegramStrategy: 'Live webhook bot posting alerts + Telegram join CTA' },
  { name: 'Telegram Discovery Channels', domain: 'tlgrm.eu', da: 82, category: 'SPORTS_COMMUNITY', automationMethod: 'API', telegramStrategy: 'Direct channel listing on international Telegram catalogs' },

  // Tier 4: Social Bookmarking & High-DA Curation Platforms (DA 75 - 93)
  { name: 'Digg', domain: 'digg.com', da: 92, category: 'BOOKMARKING', automationMethod: 'RSS_FEED', telegramStrategy: 'Trending sports stories linking to Telegram wire' },
  { name: 'Slashdot', domain: 'slashdot.org', da: 91, category: 'BOOKMARKING', automationMethod: 'RSS_FEED', telegramStrategy: 'Sports data modeling articles with Telegram backlink' },
  { name: 'Mix.com', domain: 'mix.com', da: 87, category: 'BOOKMARKING', automationMethod: 'RSS_FEED', telegramStrategy: 'Curated sports collections directing to Telegram' },
  { name: 'Scoop.it', domain: 'scoop.it', da: 88, category: 'BOOKMARKING', automationMethod: 'RSS_FEED', telegramStrategy: 'Curated sports topic boards with Telegram CTA' },
  { name: 'Fark Sports', domain: 'fark.com', da: 83, category: 'BOOKMARKING', automationMethod: 'RSS_FEED', telegramStrategy: 'Matchday news links directing to Telegram' },
  { name: 'Pearltrees', domain: 'pearltrees.com', da: 85, category: 'BOOKMARKING', automationMethod: 'RSS_FEED', telegramStrategy: 'Organized sports trees linking to @mivajsport' },
  { name: 'Diigo', domain: 'diigo.com', da: 88, category: 'BOOKMARKING', automationMethod: 'API', telegramStrategy: 'Public sports bookmarks with Telegram attribution' },
  { name: 'Folkd', domain: 'folkd.com', da: 79, category: 'BOOKMARKING', automationMethod: 'RSS_FEED', telegramStrategy: 'Social bookmarks with Telegram link' },
  { name: 'Raindrop.io', domain: 'raindrop.io', da: 82, category: 'BOOKMARKING', automationMethod: 'API', telegramStrategy: 'Shared sports collection with Telegram invite' },
  { name: 'Papaly', domain: 'papaly.com', da: 76, category: 'BOOKMARKING', automationMethod: 'RSS_FEED', telegramStrategy: 'Sports dashboard bookmarks linking to Telegram' },
  { name: 'Wakelet', domain: 'wakelet.com', da: 85, category: 'BOOKMARKING', automationMethod: 'RSS_FEED', telegramStrategy: 'Matchday curated storylines with Telegram button' },
  { name: 'Instapaper', domain: 'instapaper.com', da: 88, category: 'BOOKMARKING', automationMethod: 'RSS_FEED', telegramStrategy: 'Saved match previews linking to Telegram' },
  { name: 'Pocket / Read It Later', domain: 'getpocket.com', da: 92, category: 'BOOKMARKING', automationMethod: 'RSS_FEED', telegramStrategy: 'Pocket recommended sports reads with Telegram link' },

  // Tier 5: Tech, Startup & Tool Registries (DA 78 - 94)
  { name: 'Product Hunt', domain: 'producthunt.com', da: 91, category: 'DIRECTORY', automationMethod: 'API', telegramStrategy: 'Official product profile linking to @mivajsport community' },
  { name: 'AlternativeTo', domain: 'alternativeto.net', da: 83, category: 'DIRECTORY', automationMethod: 'API', telegramStrategy: 'Flashscore alternative profile with Telegram channel link' },
  { name: 'Trustpilot', domain: 'trustpilot.com', da: 94, category: 'DIRECTORY', automationMethod: 'API', telegramStrategy: 'Company profile with direct Telegram support link' },
  { name: 'SaaSHub', domain: 'saashub.com', da: 78, category: 'DIRECTORY', automationMethod: 'API', telegramStrategy: 'Sports analytics directory profile with Telegram URL' },
  { name: 'Slant.co', domain: 'slant.co', da: 82, category: 'DIRECTORY', automationMethod: 'API', telegramStrategy: 'Best sports analytics tools listing linking to Telegram' },
  { name: 'Crunchbase', domain: 'crunchbase.com', da: 91, category: 'DIRECTORY', automationMethod: 'API', telegramStrategy: 'Company social profiles linking to Telegram' },
  { name: 'SourceForge', domain: 'sourceforge.net', da: 93, category: 'DIRECTORY', automationMethod: 'API', telegramStrategy: 'Open source project page linking to Telegram' },
  { name: 'BetaList', domain: 'betalist.com', da: 79, category: 'DIRECTORY', automationMethod: 'API', telegramStrategy: 'Startup launch profile featuring Telegram community' },
  { name: 'F6S', domain: 'f6s.com', da: 81, category: 'DIRECTORY', automationMethod: 'API', telegramStrategy: 'Sports intelligence network profile linking to Telegram' },

  // Tier 6: Real-Time Indexing Protocols & Search Hubs (DA 90 - 99)
  { name: 'IndexNow Bing Hub', domain: 'bing.com', da: 96, category: 'SEARCH_PING', automationMethod: 'INDEXNOW_PING', telegramStrategy: 'Pushes all URLs directly into Bing crawler index' },
  { name: 'IndexNow Yandex Hub', domain: 'yandex.com', da: 95, category: 'SEARCH_PING', automationMethod: 'INDEXNOW_PING', telegramStrategy: 'Pushes all URLs directly into Yandex crawler index' },
  { name: 'IndexNow Seznam Hub', domain: 'seznam.cz', da: 90, category: 'SEARCH_PING', automationMethod: 'INDEXNOW_PING', telegramStrategy: 'European search indexation' },
  { name: 'IndexNow Naver Hub', domain: 'naver.com', da: 94, category: 'SEARCH_PING', automationMethod: 'INDEXNOW_PING', telegramStrategy: 'Asian market search indexation' },
  { name: 'Google PubSubHubbub Hub', domain: 'pubsubhubbub.appspot.com', da: 99, category: 'SEARCH_PING', automationMethod: 'WEBSUB', telegramStrategy: 'Instant Google crawler ping for /feed.xml updates' },
  { name: 'Cloudflare Edge IndexNow', domain: 'cloudflare.com', da: 97, category: 'SEARCH_PING', automationMethod: 'INDEXNOW_PING', telegramStrategy: 'Edge-level instant URL crawl broadcasting' },

  // Additional Tier 7: High-DA International Sports Portals (DA 75 - 90)
  { name: 'Sportskeeda Community', domain: 'sportskeeda.com', da: 84, category: 'SPORTS_COMMUNITY', automationMethod: 'RSS_FEED', telegramStrategy: 'Reader submissions linking to Telegram' },
  { name: 'GiveMeSport Fans', domain: 'givemesport.com', da: 82, category: 'SPORTS_COMMUNITY', automationMethod: 'RSS_FEED', telegramStrategy: 'Fan opinion articles citing Telegram stats' },
  { name: 'Bleacher Report Open', domain: 'bleacherreport.com', da: 90, category: 'SPORTS_COMMUNITY', automationMethod: 'RSS_FEED', telegramStrategy: 'Community sports blogging linking to @mivajsport' },
  { name: 'OneFootball Community', domain: 'onefootball.com', da: 83, category: 'SPORTS_COMMUNITY', automationMethod: 'RSS_FEED', telegramStrategy: 'Match analysis citing Mivaj Telegram wire' },
  { name: 'Goal.com Fan Forum', domain: 'goal.com', da: 91, category: 'SPORTS_COMMUNITY', automationMethod: 'RSS_FEED', telegramStrategy: 'Tactical discussion threads directing to Telegram' },
  { name: '90min Fan Network', domain: '90min.com', da: 85, category: 'SPORTS_COMMUNITY', automationMethod: 'RSS_FEED', telegramStrategy: 'Club reaction pieces linking to Telegram' },
  { name: 'Tribuna Fan Blogs', domain: 'tribuna.com', da: 81, category: 'SPORTS_COMMUNITY', automationMethod: 'RSS_FEED', telegramStrategy: 'Club community blogs directing to @mivajsport' },
  { name: 'BarcaBlaugranes', domain: 'barcablaugranes.com', da: 79, category: 'SPORTS_COMMUNITY', automationMethod: 'RSS_FEED', telegramStrategy: 'Barcelona match commentary linking to Telegram' },
  { name: 'This Is Anfield', domain: 'thisisanfield.com', da: 80, category: 'SPORTS_COMMUNITY', automationMethod: 'RSS_FEED', telegramStrategy: 'Liverpool tactical analysis linking to Telegram' },
  { name: 'Arseblog News', domain: 'arseblog.news', da: 78, category: 'SPORTS_COMMUNITY', automationMethod: 'RSS_FEED', telegramStrategy: 'Arsenal match previews linking to @mivajsport' },
  { name: 'CaughtOffside', domain: 'caughtoffside.com', da: 79, category: 'SPORTS_COMMUNITY', automationMethod: 'RSS_FEED', telegramStrategy: 'Transfer radar citations linking to Telegram' },
  { name: 'Football365', domain: 'football365.com', da: 81, category: 'SPORTS_COMMUNITY', automationMethod: 'RSS_FEED', telegramStrategy: 'Match commentary and stats referencing Telegram' },
  { name: 'TeamTalk', domain: 'teamtalk.com', da: 80, category: 'SPORTS_COMMUNITY', automationMethod: 'RSS_FEED', telegramStrategy: 'Tactical previews directing fans to Telegram' },
  { name: 'World Soccer Talk', domain: 'worldsoccertalk.com', da: 77, category: 'SPORTS_COMMUNITY', automationMethod: 'RSS_FEED', telegramStrategy: 'Broadcast intelligence linking to @mivajsport' },
  { name: 'Total Football Analysis', domain: 'totalfootballanalysis.com', da: 75, category: 'SPORTS_COMMUNITY', automationMethod: 'RSS_FEED', telegramStrategy: 'Tactical data deep-dives citing Telegram wire' },
];

export function getAuthoritySitesCount(): number {
  return AUTHORITY_SITES_REGISTRY.length;
}

export function getSitesByCategory(category: string): AuthoritySite[] {
  return AUTHORITY_SITES_REGISTRY.filter(s => s.category === category);
}
