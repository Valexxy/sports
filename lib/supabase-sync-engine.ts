'use client';
/**
 * SUPABASE CLOUD ENTERPRISE SYNC ENGINE
 * Scalable cloud data synchronizer for user dossiers, tickets, settlement records,
 * followed entities, and live visitor telemetry.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export interface UserProfile {
  id: string;
  username: string;
  nickname?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  telegram?: string;
  club?: string;
  supporter_streak_days?: number;
  country?: string;
  city?: string;
  birth_date?: string;
  bio?: string;
  aura_balance: number;
  vip_tier: string;
  role: string;
  status: string;
  settings?: Record<string, any>;
  followed_matches: string[];
  bookmarked_matches: string[];
  placed_tickets: any[];
  referral_code: string;
  created_at: string;
  last_active?: string;
}

export interface CloudPlacedTicket {
  id: string;
  user_id: string;
  selections: any[];
  total_odds: number;
  stake_aura: number;
  potential_aura_return: number;
  status: 'PENDING' | 'WON' | 'LOST' | 'CASHED_OUT';
  created_at: string;
}

export interface CloudVisitorTelemetry {
  timestamp: string;
  active_count: number;
  peak_today: number;
  top_fixtures: string[];
  region: string;
}

export class SupabaseSyncEngine {
  static isConfigured(): boolean {
    return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
  }

  /** Upsert user profile to Supabase (merge on duplicate ID) */
  static async upsertUserProfile(profile: Partial<UserProfile>): Promise<boolean> {
    if (!this.isConfigured() || typeof window === 'undefined') return false;
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify(profile),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  /** Fetch user profile from Supabase */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (!this.isConfigured()) return null;
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles?id=eq.${userId}&select=*`, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data[0] || null;
    } catch {
      return null;
    }
  }

  /** Record placed prediction ticket in cloud */
  static async recordPlacedTicket(ticket: CloudPlacedTicket): Promise<boolean> {
    if (!this.isConfigured() || typeof window === 'undefined') return false;
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/prediction_tickets`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify(ticket),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  /** Record live visitor telemetry packet */
  static async recordVisitorTelemetry(telemetry: CloudVisitorTelemetry): Promise<boolean> {
    if (!this.isConfigured() || typeof window === 'undefined') return false;
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/visitor_telemetry`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(telemetry),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  /** Get or create persistent local user ID */
  static getLocalUserId(): string {
    if (typeof window === 'undefined') return 'anon';
    let uid = localStorage.getItem('mivaj_uid');
    if (!uid) {
      uid = 'u_' + Math.random().toString(36).slice(2, 11);
      localStorage.setItem('mivaj_uid', uid);
    }
    return uid;
  }

  /** Sync all localStorage telemetry and profile data to Supabase */
  static async syncLocalToCloud(): Promise<void> {
    if (!this.isConfigured() || typeof window === 'undefined') return;
    try {
      const uid = this.getLocalUserId();
      const bookmarks = JSON.parse(localStorage.getItem('aurascore_bookmarks') || '[]');
      const follows = JSON.parse(localStorage.getItem('aurascore_followed_matches') || '[]');
      const tickets = JSON.parse(localStorage.getItem('aurascore_placed_tickets') || '[]');
      const nickname = localStorage.getItem('mivaj_user_nickname') || 'Champion';
      const city = localStorage.getItem('mivaj_custom_city') || '';
      const auraBalance = parseInt(localStorage.getItem('mivaj_aura_balance') || '2500', 10);
      const club = localStorage.getItem('mivaj_selected_club') || 'Arsenal';

      await this.upsertUserProfile({
        id: uid,
        username: nickname.toLowerCase().replace(/\s+/g, '_'),
        nickname,
        club,
        aura_balance: auraBalance,
        vip_tier: 'PLATINUM_PRODIGY',
        role: 'STADIUM_MEMBER',
        status: 'ACTIVE',
        bookmarked_matches: bookmarks,
        followed_matches: follows,
        placed_tickets: tickets,
        city,
        created_at: new Date().toISOString(),
        last_active: new Date().toISOString(),
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
      if (profile.city) {
        localStorage.setItem('mivaj_custom_city', profile.city);
      }
      if (profile.club) {
        localStorage.setItem('mivaj_selected_club', profile.club);
      }
      if (profile.aura_balance) {
        localStorage.setItem('mivaj_aura_balance', profile.aura_balance.toString());
      }
      return true;
    } catch {
      return false;
    }
  }
}
