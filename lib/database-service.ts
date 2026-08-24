export interface DbUser {
  id: string;
  username: string;
  email: string;
  phone?: string;
  avatar: string;
  club: string;
  aura_balance: number;
  naira_balance: number;
  vip_tier: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR' | 'PLATINUM PRODIGY 👑' | 'GOLD INFLUENCER ⚡' | 'STADIUM MEMBER';
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED' | 'PENDING_KYC';
  total_picks: number;
  win_rate: number;
  created_at: string;
  notes?: string;
}

export interface DbReferral {
  id: string;
  referrer: string;
  referred: string;
  clicks: number;
  aura_earned: number;
  naira_earned: number;
  status: string;
  created_at: string;
}

export interface DbTransaction {
  id: string;
  username: string;
  amount: number;
  tier_id: string;
  reference: string;
  status: string;
  created_at: string;
}

export interface SystemSettings {
  siteName: string;
  maintenanceMode: boolean;
  supportPhone: string;
  supportWhatsApp: string;
  telegramChannel: string;
  welcomeAuraBonus: number;
  referralNairaCommission: number;
  referralAuraBonus: number;
  tier200Price: number;
  tier300Price: number;
  tier500Price: number;
  poissonConfidenceBanker: number;
  poissonConfidenceUltra: number;
  autoSettlementEnabled: boolean;
  liveAffiliates: {
    stakeCode: string;
    stakeUrl: string;
    twoTwoBetTag: string;
    twoTwoBetUrl: string;
  };
}

export interface AuditLogEntry {
  id: string;
  adminUser: string;
  action: string;
  targetUser?: string;
  details: string;
  timestamp: string;
}

class PersistentDatabaseStore {
  private users: Map<string, DbUser> = new Map();
  private referrals: DbReferral[] = [];
  private transactions: DbTransaction[] = [];
  private auditLogs: AuditLogEntry[] = [];
  private settings: SystemSettings;

  constructor() {
    this.settings = {
      siteName: 'Mivaj Sports & Media',
      maintenanceMode: false,
      supportPhone: '+234 807 201 5725',
      supportWhatsApp: 'https://wa.me/2348072015725',
      telegramChannel: 'https://t.me/mivajsport',
      welcomeAuraBonus: 500,
      referralNairaCommission: 500,
      referralAuraBonus: 750,
      tier200Price: 200,
      tier300Price: 300,
      tier500Price: 500,
      poissonConfidenceBanker: 65,
      poissonConfidenceUltra: 80,
      autoSettlementEnabled: true,
      liveAffiliates: {
        stakeCode: 'bPn8D0iA',
        stakeUrl: 'https://stake.com/?c=bPn8D0iA',
        twoTwoBetTag: '972744',
        twoTwoBetUrl: 'https://22bet.com.ng/?tag=972744',
      },
    };

    // Seed Core Master Users
    const seedUsers: DbUser[] = [
      {
        id: 'usr-root',
        username: 'azunnaukah',
        email: 'azunnaukah@gmail.com',
        phone: '+234 807 201 5725',
        avatar: '⚡',
        club: 'Arsenal',
        aura_balance: 50000,
        naira_balance: 135000,
        vip_tier: 'PLATINUM PRODIGY 👑',
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        total_picks: 420,
        win_rate: 94.8,
        created_at: '2026-08-24T10:00:00Z',
        notes: 'Root Owner & Executive Director',
      },
      {
        id: 'usr-002',
        username: 'CyberStriker_99',
        email: 'striker99@mivaj.com',
        phone: '+234 803 111 2233',
        avatar: '🦁',
        club: 'Chelsea',
        aura_balance: 3450,
        naira_balance: 15000,
        vip_tier: 'GOLD INFLUENCER ⚡',
        role: 'VIP_MEMBER',
        status: 'ACTIVE',
        total_picks: 84,
        win_rate: 88.2,
        created_at: '2026-08-24T11:30:00Z',
        notes: 'Top performing grassroots influencer',
      },
      {
        id: 'usr-003',
        username: 'Tobi_BetMaster',
        email: 'tobi@gmail.com',
        phone: '+234 814 999 8888',
        avatar: '👑',
        club: 'Real Madrid',
        aura_balance: 1200,
        naira_balance: 5000,
        vip_tier: 'STADIUM MEMBER',
        role: 'MEMBER',
        status: 'ACTIVE',
        total_picks: 32,
        win_rate: 76.5,
        created_at: '2026-08-23T14:15:00Z',
      },
      {
        id: 'usr-004',
        username: 'Emeka_Sharp',
        email: 'emeka@gmail.com',
        phone: '+234 802 333 4444',
        avatar: '🦅',
        club: 'Super Eagles',
        aura_balance: 0,
        naira_balance: 0,
        vip_tier: 'STADIUM MEMBER',
        role: 'MEMBER',
        status: 'SUSPENDED',
        total_picks: 10,
        win_rate: 50.0,
        created_at: '2026-08-22T08:00:00Z',
        notes: 'Suspended for multi-accounting attempt',
      },
    ];

    seedUsers.forEach((u) => this.users.set(u.username, u));

    this.referrals = [
      { id: 'ref-101', referrer: 'azunnaukah', referred: 'CyberStriker_99', clicks: 42, aura_earned: 2250, naira_earned: 1500, status: 'ACTIVE_PUNTER', created_at: '2026-08-24T10:15:00Z' },
      { id: 'ref-102', referrer: 'azunnaukah', referred: 'Tobi_BetMaster', clicks: 18, aura_earned: 750, naira_earned: 500, status: 'VIP_PAID', created_at: '2026-08-23T16:30:00Z' },
      { id: 'ref-103', referrer: 'CyberStriker_99', referred: 'Emeka_Sharp', clicks: 12, aura_earned: 750, naira_earned: 500, status: 'SUSPENDED', created_at: '2026-08-22T09:45:00Z' },
    ];

    this.transactions = [
      { id: 'tx-1', username: 'azunnaukah', amount: 500, tier_id: 'TIER_500', reference: 'PAY-881924', status: 'SUCCESS', created_at: '2026-08-24T11:20:00Z' },
      { id: 'tx-2', username: 'CyberStriker_99', amount: 300, tier_id: 'TIER_300', reference: 'PAY-941824', status: 'SUCCESS', created_at: '2026-08-23T16:35:00Z' },
      { id: 'tx-3', username: 'Tobi_BetMaster', amount: 200, tier_id: 'TIER_200', reference: 'PAY-771822', status: 'SUCCESS', created_at: '2026-08-23T14:20:00Z' },
    ];

    this.auditLogs = [
      { id: 'log-1', adminUser: 'azunnaukah', action: 'SYSTEM_BOOT', details: 'Enterprise Admin Engine initialized with zero-error ledger', timestamp: '2026-08-24T10:00:00Z' },
    ];
  }

  // --- User PAM Methods ---
  public async getAllUsers(): Promise<DbUser[]> {
    return Array.from(this.users.values());
  }

  public async getUser(username: string): Promise<DbUser | null> {
    return this.users.get(username) || null;
  }

  public async createOrUpdateUser(user: DbUser): Promise<DbUser> {
    this.users.set(user.username, user);
    this.addAuditLog('USER_UPDATED', 'azunnaukah', user.username, `User ${user.username} saved.`);
    return user;
  }

  public async adjustUserAura(username: string, delta: number, reason: string): Promise<DbUser | null> {
    const user = this.users.get(username);
    if (!user) return null;
    user.aura_balance = Math.max(0, user.aura_balance + delta);
    this.users.set(username, user);
    this.addAuditLog('ADJUST_AURA', 'azunnaukah', username, `Adjusted Aura by ${delta > 0 ? '+' : ''}${delta} (${reason})`);
    return user;
  }

  public async updateUserRoleAndTier(username: string, role: DbUser['role'], tier: string): Promise<DbUser | null> {
    const user = this.users.get(username);
    if (!user) return null;
    user.role = role;
    user.vip_tier = tier;
    this.users.set(username, user);
    this.addAuditLog('ROLE_CHANGE', 'azunnaukah', username, `Changed role to ${role}, tier to ${tier}`);
    return user;
  }

  public async updateUserStatus(username: string, status: DbUser['status'], reason?: string): Promise<DbUser | null> {
    const user = this.users.get(username);
    if (!user) return null;
    user.status = status;
    this.users.set(username, user);
    this.addAuditLog('STATUS_CHANGE', 'azunnaukah', username, `Status changed to ${status} (${reason || 'Admin Action'})`);
    return user;
  }

  public async deleteUser(username: string): Promise<boolean> {
    const exists = this.users.has(username);
    if (exists) {
      this.users.delete(username);
      this.addAuditLog('DELETE_USER', 'azunnaukah', username, `Permanently deleted user ${username}`);
      return true;
    }
    return false;
  }

  // --- Referrals & Transactions ---
  public async getReferrals(referrer: string): Promise<DbReferral[]> {
    return this.referrals.filter((r) => r.referrer === referrer);
  }

  public async getAllReferrals(): Promise<DbReferral[]> {
    return this.referrals;
  }

  public async getAllTransactions(): Promise<DbTransaction[]> {
    return this.transactions;
  }

  // --- Settings & Audit ---
  public async getSettings(): Promise<SystemSettings> {
    return this.settings;
  }

  public async updateSettings(newSettings: Partial<SystemSettings>): Promise<SystemSettings> {
    this.settings = { ...this.settings, ...newSettings };
    this.addAuditLog('SETTINGS_UPDATE', 'azunnaukah', 'SYSTEM', 'Platform settings updated');
    return this.settings;
  }

  public async getAuditLogs(): Promise<AuditLogEntry[]> {
    return this.auditLogs;
  }

  public addAuditLog(action: string, adminUser: string, targetUser?: string, details: string = '') {
    this.auditLogs.unshift({
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      adminUser,
      action,
      targetUser,
      details,
      timestamp: new Date().toISOString(),
    });
  }
}

export const DatabaseService = new PersistentDatabaseStore();
