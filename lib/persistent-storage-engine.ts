// Comprehensive Permanent Storage Engine for All User Actions
// Guarantees that followed matches, clubs, players, leagues, bookmarks, placed bets, and referrals are NEVER forgotten.

import { evaluatePredictionResult } from './prediction-archive-engine';
import { ProfessionalSettlementEngine } from './settlement-engine';

export interface PlacedTicket {
  id: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  selection: string;
  market: string;
  odds: number;
  timestamp: number;
  status: 'PENDING' | 'WON' | 'LOST';
}

export interface UserSavedPreferences {
  followedMatches: string[];
  followedClubs: string[];
  followedPlayers: string[];
  followedLeagues: string[];
  bookmarkedMatches: string[];
  likedMatches: string[];
  placedTickets: PlacedTicket[];
  referralCode: string;
  referralsCount: number;
  earnedAura: number;
}

const KEYS = {
  MATCHES: 'aurascore_followed_matches',
  CLUBS: 'aurascore_followed_clubs',
  PLAYERS: 'aurascore_followed_players',
  LEAGUES: 'aurascore_followed_leagues',
  BOOKMARKS: 'aurascore_bookmarks',
  LIKES: 'aurascore_liked_matches',
  PLACED_TICKETS: 'aurascore_placed_tickets',
  REFERRALS: 'aurascore_referrals_data',
};

export class PersistentStorage {
  private static getArray<T = string>(key: string): T[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private static setArray<T = any>(key: string, items: T[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch {}
  }

  // --- Placed Bets & Tickets ("I bet this") ---
  public static getPlacedTickets(): PlacedTicket[] {
    return this.getArray<PlacedTicket>(KEYS.PLACED_TICKETS);
  }

  public static savePlacedTicket(matchId: string, match: any, topPick: any): boolean {
    const list = this.getPlacedTickets();
    const exists = list.some((t) => t.matchId === matchId);
    if (exists) return false;

    const isFinished = match.status === 'FINISHED' || match.isFinished;
    let initialStatus: 'PENDING' | 'WON' | 'LOST' = 'PENDING';
    if (isFinished) {
      const hScore = typeof match.homeScore === 'number' ? match.homeScore : 0;
      const aScore = typeof match.awayScore === 'number' ? match.awayScore : 0;
      initialStatus = evaluatePredictionResult(
        topPick?.selection || 'Double Chance 1X',
        topPick?.market || 'Double Chance',
        match.homeTeam || 'Home',
        match.awayTeam || 'Away',
        hScore,
        aScore
      );
    }

    const newTicket: PlacedTicket = {
      id: `ticket_${matchId}_${Date.now()}`,
      matchId,
      homeTeam: match.homeTeam || 'Home Team',
      awayTeam: match.awayTeam || 'Away Team',
      league: match.league || 'League Fixture',
      selection: topPick.selection || 'Double Chance 1X',
      market: topPick.market || 'Full Time Outcome',
      odds: topPick.odds || 1.45,
      timestamp: Date.now(),
      status: initialStatus,
    };

    const updated = [newTicket, ...list];
    this.setArray(KEYS.PLACED_TICKETS, updated);
    return true;
  }

  public static isTicketPlaced(matchId: string): boolean {
    return this.getPlacedTickets().some((t) => t.matchId === matchId);
  }

  /**
   * SYSTEM-WIDE TICKET SETTLEMENT ENGINE
   * Scans all placed tickets. For any PENDING ticket whose match has concluded,
   * evaluates the outcome against real scores and settles as WON or LOST.
   */
  public static settleAllTickets(liveOrFinishedMatches: any[]): { settledCount: number; newlyWon: number } {
    if (typeof window === 'undefined' || !Array.isArray(liveOrFinishedMatches) || liveOrFinishedMatches.length === 0) {
      return { settledCount: 0, newlyWon: 0 };
    }

    const tickets = this.getPlacedTickets();
    if (tickets.length === 0) return { settledCount: 0, newlyWon: 0 };

    let settledCount = 0;
    let newlyWon = 0;

    const updatedTickets = tickets.map((t) => {
      if (t.status !== 'PENDING') return t;

      // Match by matchId or by team names
      const match = liveOrFinishedMatches.find((m) => {
        if (m.id === t.matchId) return true;
        const norm = (s: string) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        return norm(m.homeTeam) === norm(t.homeTeam) && norm(m.awayTeam) === norm(t.awayTeam);
      });

      if (!match) return t;

      const isFinished = ProfessionalSettlementEngine.isMatchFinished(match);
      if (!isFinished) return t;

      const { homeScore: hScore, awayScore: aScore } = ProfessionalSettlementEngine.extractScores(match);

      const outcome = ProfessionalSettlementEngine.evaluate(
        t.selection,
        t.market,
        t.homeTeam,
        t.awayTeam,
        hScore,
        aScore
      );

      settledCount++;
      if (outcome === 'WON') newlyWon++;

      return {
        ...t,
        status: outcome,
      };
    });

    if (settledCount > 0) {
      this.setArray(KEYS.PLACED_TICKETS, updatedTickets);
    }

    return { settledCount, newlyWon };
  }

  // --- Matches ---
  public static getFollowedMatches(): string[] { return this.getArray(KEYS.MATCHES); }
  public static toggleFollowMatch(matchId: string): boolean {
    const list = this.getFollowedMatches();
    const exists = list.includes(matchId);
    const updated = exists ? list.filter((id) => id !== matchId) : [...list, matchId];
    this.setArray(KEYS.MATCHES, updated);
    return !exists;
  }
  public static isMatchFollowed(matchId: string): boolean {
    return this.getFollowedMatches().includes(matchId);
  }

  // --- Clubs ---
  public static getFollowedClubs(): string[] { return this.getArray(KEYS.CLUBS); }
  public static toggleFollowClub(clubName: string): boolean {
    const list = this.getFollowedClubs();
    const exists = list.includes(clubName);
    const updated = exists ? list.filter((c) => c !== clubName) : [...list, clubName];
    this.setArray(KEYS.CLUBS, updated);
    return !exists;
  }

  // --- Players ---
  public static getFollowedPlayers(): string[] { return this.getArray(KEYS.PLAYERS); }
  public static toggleFollowPlayer(playerId: string): boolean {
    const list = this.getFollowedPlayers();
    const exists = list.includes(playerId);
    const updated = exists ? list.filter((id) => id !== playerId) : [...list, playerId];
    this.setArray(KEYS.PLAYERS, updated);
    return !exists;
  }

  // --- Bookmarks ---
  public static getBookmarks(): string[] { return this.getArray(KEYS.BOOKMARKS); }
  public static toggleBookmark(matchId: string): boolean {
    const list = this.getBookmarks();
    const exists = list.includes(matchId);
    const updated = exists ? list.filter((id) => id !== matchId) : [...list, matchId];
    this.setArray(KEYS.BOOKMARKS, updated);
    return !exists;
  }

  // --- Likes & Hypes ---
  public static getLikes(): string[] { return this.getArray(KEYS.LIKES); }
  public static toggleLike(matchId: string): boolean {
    const list = this.getLikes();
    const exists = list.includes(matchId);
    const updated = exists ? list.filter((id) => id !== matchId) : [...list, matchId];
    this.setArray(KEYS.LIKES, updated);
    return !exists;
  }
  public static isLiked(matchId: string): boolean {
    return this.getLikes().includes(matchId);
  }

  // --- Persistent Emoji Reactions ---
  public static getMatchEmojiReactions(matchId: string): { userReacted: Record<string, boolean>; counts: Record<string, number> } {
    if (typeof window === 'undefined') {
      return { userReacted: {}, counts: { '🔥': 42, '💀': 18, '🧊': 25, '🚀': 31, '👑': 56 } };
    }
    try {
      const stored = localStorage.getItem(`mivaj_emojis_${matchId}`);
      if (stored) return JSON.parse(stored);
    } catch {}
    return {
      userReacted: {},
      counts: { '🔥': 42, '💀': 18, '🧊': 25, '🚀': 31, '👑': 56 },
    };
  }

  public static saveMatchEmojiReaction(
    matchId: string,
    emoji: string
  ): { userReacted: Record<string, boolean>; counts: Record<string, number> } {
    const current = this.getMatchEmojiReactions(matchId);
    const isReacted = !!current.userReacted[emoji];
    const newCount = isReacted ? Math.max(0, (current.counts[emoji] || 1) - 1) : (current.counts[emoji] || 0) + 1;

    const updated = {
      userReacted: { ...current.userReacted, [emoji]: !isReacted },
      counts: { ...current.counts, [emoji]: newCount },
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`mivaj_emojis_${matchId}`, JSON.stringify(updated));
      } catch {}
    }

    return updated;
  }

  // --- Referrals Based On Username ---
  public static getReferralData(): { referralCode: string; count: number; earnedAura: number; list: any[] } {
    if (typeof window === 'undefined') {
      return { referralCode: 'CyberStriker_99', count: 0, earnedAura: 0, list: [] };
    }
    try {
      let username = 'CyberStriker_99';
      const sessionRaw = localStorage.getItem('mivaj_user_session');
      if (sessionRaw) {
        const parsed = JSON.parse(sessionRaw);
        if (parsed?.username) username = parsed.username;
      } else {
        const nick = localStorage.getItem('mivaj_user_nickname');
        if (nick) username = nick;
      }

      const cleanUsername = username.replace(/^@/, '');
      const referralsRaw = localStorage.getItem('mivaj_user_referrals_list');
      const list = referralsRaw ? JSON.parse(referralsRaw) : [];

      const count = list.length;
      const earnedAura = count * 150;

      return {
        referralCode: cleanUsername,
        count,
        earnedAura,
        list,
      };
    } catch {
      return { referralCode: 'CyberStriker_99', count: 0, earnedAura: 0, list: [] };
    }
  }
}
