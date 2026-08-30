/**
 * TIPS BROS NG (facebook.com/tipsbrosNG) AUTOMATED DIRECT PUBLISHER
 * Directly posts daily matchday intelligence, banker predictions,
 * and Telegram growth hooks with dynamic 1200x675 photo cards to the TipsBros NG Facebook Page.
 */

export interface FacebookPostResult {
  success: boolean;
  postId?: string;
  page: string;
  error?: string;
  timestamp: string;
  dispatchedMessage: string;
}

export const TIPS_BROS_PAGE_URL = 'https://web.facebook.com/tipsbrosNG';
export const TIPS_BROS_PAGE_ID = '110234663683622';
export const DEFAULT_PAGE_TOKEN = 'EAAM9mKnsemUBSWJ8b29JIhaZC9ZAKTljDxcExqmU64IT09HR8QPNY8DZAOdWfVy8m4UKpAXvc13OhFZCYpwbO6kUM4i3q9AwkjAuBWB8dbKDyuG9I66ZAZCojBPe259sZCFbRu04Yt9A3KX8jTHD4XZCDrSOQLn4168soIuE2ltUuYqZCfKMSG47qqpHxQ4pQBle46X6ZAGnQb4qqxVkFqkc85ZAfjaj9ycGzjdME9U2FAZD';

export function formatTipsBrosFacebookPost(match: any): string {
  const homeTeam = match.homeTeam || 'Chelsea';
  const awayTeam = match.awayTeam || 'Brighton';
  const league = match.league || 'Premier League';
  const pick = match.prediction?.topPick?.selection || `${homeTeam} or Draw (1X)`;
  const odds = match.prediction?.topPick?.odds || 1.35;
  const probability = match.prediction?.topPick?.probability || 84;
  const tier = match.prediction?.topPick?.confidenceTier || 'ULTRA-BANKER 🔥';

  return `
🔥 TIPS BROS NG DAILY MATCHDAY RADAR 🔥
⚽ ${homeTeam.toUpperCase()} vs ${awayTeam.toUpperCase()} (${league})

📊 TACTICAL AI MODEL BREAKDOWN:
• Consensus Pick: ${pick}
• Calculated Confidence: ${probability}% Poisson Model
• Classification: ${tier}
• Projected Value Odds: @${typeof odds === 'number' ? odds.toFixed(2) : odds}

🏥 SQUAD & HOSPITAL WARD NEWS:
Full injury reports, transfer dynamics, and head-to-head records verified on the live match center.

📢 JOIN OUR OFFICIAL TELEGRAM WIRE:
Get instant sub-second goal heartbeat notifications and daily banker drops on your phone before kickoff!
👉 Tap to Join 50,000+ Fans Free: https://t.me/mivajsport

🌐 Track Live Scores & Referee Audits:
https://mivaj.com

#TipsBrosNG #${homeTeam.replace(/\s+/g, '')} #${awayTeam.replace(/\s+/g, '')} #${league.replace(/\s+/g, '')} #FootballPredictions #PremierLeague #FreeTips #TelegramBetting
`.trim();
}

export async function publishToTipsBrosFacebook(match: any): Promise<FacebookPostResult> {
  const message = formatTipsBrosFacebookPost(match);
  const homeTeam = match.homeTeam || 'Chelsea';
  const awayTeam = match.awayTeam || 'Brighton';
  const league = match.league || 'Premier League';
  const pick = match.prediction?.topPick?.selection || '1X';
  const odds = match.prediction?.topPick?.odds || 1.35;
  const prob = match.prediction?.topPick?.probability || 85;

  const pageId = process.env.FACEBOOK_PAGE_ID || TIPS_BROS_PAGE_ID;
  const pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN || DEFAULT_PAGE_TOKEN;
  const photoUrl = `https://mivaj.com/api/og/match?home=${encodeURIComponent(homeTeam)}&away=${encodeURIComponent(awayTeam)}&league=${encodeURIComponent(league)}&pick=${encodeURIComponent(pick)}&odds=${odds}&prob=${prob}`;

  // 1. Direct Meta Graph API Photo Post
  if (pageAccessToken) {
    try {
      const photoGraphUrl = `https://graph.facebook.com/v19.0/${pageId}/photos`;
      const res = await fetch(photoGraphUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: photoUrl,
          caption: message,
          access_token: pageAccessToken,
        }),
      });

      const data = await res.json();
      if (res.ok && (data.id || data.post_id)) {
        return {
          success: true,
          postId: data.post_id || data.id,
          page: TIPS_BROS_PAGE_URL,
          timestamp: new Date().toISOString(),
          dispatchedMessage: message,
        };
      }

      // Fallback to text feed post
      const feedGraphUrl = `https://graph.facebook.com/v19.0/${pageId}/feed`;
      const feedRes = await fetch(feedGraphUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          link: `https://mivaj.com/?match=${encodeURIComponent(match.id || 'today')}`,
          access_token: pageAccessToken,
        }),
      });

      const feedData = await feedRes.json();
      if (feedRes.ok && feedData.id) {
        return {
          success: true,
          postId: feedData.id,
          page: TIPS_BROS_PAGE_URL,
          timestamp: new Date().toISOString(),
          dispatchedMessage: message,
        };
      }

      return {
        success: false,
        page: TIPS_BROS_PAGE_URL,
        error: data.error?.message || feedData.error?.message || 'Meta Graph API error',
        timestamp: new Date().toISOString(),
        dispatchedMessage: message,
      };
    } catch (err: any) {
      return {
        success: false,
        page: TIPS_BROS_PAGE_URL,
        error: err.message,
        timestamp: new Date().toISOString(),
        dispatchedMessage: message,
      };
    }
  }

  return {
    success: false,
    page: TIPS_BROS_PAGE_URL,
    error: 'No Page Access Token configured',
    timestamp: new Date().toISOString(),
    dispatchedMessage: message,
  };
}
