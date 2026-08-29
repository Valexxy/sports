'use client';
/**
 * SUPABASE CLOUD SYNC ENGINE
 * Cross-device profile sync for bookmarks, followed matches, and betslip history.
 * Battery-safe: fire-and-forget only. No realtime subscriptions.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export interface UserProfile {
  id: string;
  nickname: string;
  email?: string;
  followed_matches: string[];
  bookmarked_matches: string[];
  placed_tickets: string[];
  referral_code: string;
  location_city: string;
  created_at: string;
}

export class SupabaseSyncEngine {
  static isConfigured(): boolean {
    return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
  }

  /** Upsert user profile to Supabase (fire-and-forget) */
  static async upsertUserProfile(profile: Partial<UserProfile>): Promise<boolean> {
    if (!this.isConfigured() || typeof window === 'undefined') return false;
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify(profile),
      });
      return res.ok;
    } catch { return false; }
  }

  /** Fetch user profile from Supabase */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (!this.isConfigured()) return null;
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/user_profiles?id=eq.${userId}&select=*`,
        {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
        }
      );
      if (!res.ok) return null;
      const data = await res.json();
      return data[0] || null;
    } catch { return null; }
  }

  /** Get or create a persistent local user ID */
  static getLocalUserId(): string {
    if (typeof window === 'undefined') return 'anon';
    let uid = localStorage.getItem('mivaj_uid');
    if (!uid) {
      uid = 'u_' + Math.random().toString(36).slice(2, 11);
      localStorage.setItem('mivaj_uid', uid);
    }
    return uid;
  }

  /**
   * Sync all localStorage data to Supabase.
   * Call this sparingly — on app mount + on page hide, not on every state change.
   */
  static async syncLocalToCloud(): Promise<void> {
    if (!this.isConfigured() || typeof window === 'undefined') return;
    try {
      const uid = this.getLocalUserId();
      const bookmarks = JSON.parse(localStorage.getItem('aurascore_bookmarks') || '[]');
      const follows = JSON.parse(localStorage.getItem('aurascore_followed_matches') || '[]');
      const nickname = localStorage.getItem('mivaj_user_nickname') || 'Champion';
      const city = localStorage.getItem('mivaj_custom_city') || '';

      await this.upsertUserProfile({
        id: uid,
        nickname,
        bookmarked_matches: bookmarks,
        followed_matches: follows,
        location_city: city,
        created_at: new Date().toISOString(),
      });
    } catch {
      // Silent fail — offline or quota exhausted, data stays local
    }
  }

  /** Restore user data from cloud on a new device */
  static async restoreFromCloud(userId: string): Promise<boolean> {
    const profile = await this.getUserProfile(userId);
    if (!profile || typeof window === 'undefined') return false;
    try {
      if (profile.bookmarked_matches?.length) {
        localStorage.setItem('aurascore_bookmarks', JSON.stringify(profile.bookmarked_matches));
      }
      if (profile.followed_matches?.length) {
        localStorage.setItem('aurascore_followed_matches', JSON.stringify(profile.followed_matches));
      }
      if (profile.nickname) {
        localStorage.setItem('mivaj_user_nickname', profile.nickname);
      }
      if (profile.location_city) {
        localStorage.setItem('mivaj_custom_city', profile.location_city);
      }
      return true;
    } catch { return false; }
  }
}
