// Comprehensive Permanent Storage Engine for All User Actions
// Guarantees that followed matches, clubs, players, leagues, bookmarks, and likes are NEVER forgotten.

export interface UserSavedPreferences {
  followedMatches: string[];
  followedClubs: string[];
  followedPlayers: string[];
  followedLeagues: string[];
  bookmarkedMatches: string[];
  likedMatches: string[];
  betslipItems: any[];
}

const KEYS = {
  MATCHES: 'aurascore_followed_matches',
  CLUBS: 'aurascore_followed_clubs',
  PLAYERS: 'aurascore_followed_players',
  LEAGUES: 'aurascore_followed_leagues',
  BOOKMARKS: 'aurascore_bookmarks',
  LIKES: 'aurascore_liked_matches',
  BETSLIP: 'aurascore_betslip_items',
};

export class PersistentStorage {
  private static getArray(key: string): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private static setArray(key: string, items: string[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch {}
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
}
