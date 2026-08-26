/**
 * AURA SCORE FEATURE BUNDLE CONTROLLER
 * Toggle any phase/feature on or off with a single boolean switch.
 * All disabled features consume 0 network requests, 0 CPU cycles, and 0 background data.
 */

export const FEATURE_BUNDLES = {
  // Core Essentials (Active)
  CORE_MATCH_STREAM: true,
  TODAYS_SPORTS_FILTER: true,
  SETTLEMENT_LEDGER: true,
  LEAGUE_STANDINGS_MODAL: true,
  CLUB_EXPLORER_MODAL: true,
  STAR_PLAYERS_RADAR: true,
  BIRTHDAY_CALENDAR_MODAL: true,

  // Heavy Background & Experimental Features (DISABLED TO SAVE MOBILE DATA)
  AUTO_BACKGROUND_POLLING: false, // Disables 3-min periodic background data polling
  ANALYTICS_BEACONING: false,     // Disables continuous background analytics pings
  PUSH_SERVER_SYNC: false,        // Disables continuous push token syncing
  LIVE_STREAM_SSE_POLLING: false, // Disables background SSE stream listener
};
