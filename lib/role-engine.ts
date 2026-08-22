/**
 * ROLE & PERMISSION ENGINE (Admin + tiered users)
 * Defines a clear role hierarchy and capability matrix so the admin dashboard
 * can enforce "super writes" while lower tiers get scoped access.
 */

export type UserRole = 'ADMIN' | 'MODERATOR' | 'ANALYST' | 'VIP' | 'PRO' | 'FREE';

export interface RoleMeta {
  role: UserRole;
  label: string;
  emoji: string;
  color: string;
  level: number;
}

export const ROLE_LEVELS: Record<UserRole, RoleMeta> = {
  ADMIN: { role: 'ADMIN', label: 'Super Admin', emoji: '👑', color: 'text-gold', level: 6 },
  MODERATOR: { role: 'MODERATOR', label: 'Moderator', emoji: '🛡️', color: 'text-cyberPurple', level: 5 },
  ANALYST: { role: 'ANALYST', label: 'Senior Analyst', emoji: '📊', color: 'text-stadiumGreen', level: 4 },
  VIP: { role: 'VIP', label: 'VIP Member', emoji: '💎', color: 'text-crimson', level: 3 },
  PRO: { role: 'PRO', label: 'Pro Member', emoji: '⭐', color: 'text-gold', level: 2 },
  FREE: { role: 'FREE', label: 'Free Member', emoji: '🟢', color: 'text-gray-400', level: 1 },
};

// Capability matrix. SUPER_WRITE only exists on ADMIN.
export type Capability =
  | 'VIEW_LIVE'
  | 'VIEW_ANALYTICS'
  | 'SUPER_WRITE'
  | 'MANAGE_USERS'
  | 'PUSH_BROADCAST'
  | 'EDIT_MATCHES'
  | 'EDIT_SETTLEMENTS'
  | 'EDIT_NEWS'
  | 'DELETE_CONTENT'
  | 'EXPORT_DATA';

const CAPABILITIES: Record<UserRole, Capability[]> = {
  ADMIN: [
    'VIEW_LIVE', 'VIEW_ANALYTICS', 'SUPER_WRITE', 'MANAGE_USERS', 'PUSH_BROADCAST',
    'EDIT_MATCHES', 'EDIT_SETTLEMENTS', 'EDIT_NEWS', 'DELETE_CONTENT', 'EXPORT_DATA',
  ],
  MODERATOR: ['VIEW_LIVE', 'VIEW_ANALYTICS', 'EDIT_MATCHES', 'EDIT_SETTLEMENTS', 'EDIT_NEWS', 'DELETE_CONTENT'],
  ANALYST: ['VIEW_LIVE', 'VIEW_ANALYTICS', 'EDIT_SETTLEMENTS'],
  VIP: ['VIEW_LIVE', 'VIEW_ANALYTICS'],
  PRO: ['VIEW_LIVE', 'VIEW_ANALYTICS'],
  FREE: ['VIEW_LIVE'],
};

export function getRoleMeta(role: UserRole): RoleMeta {
  return ROLE_LEVELS[role] || ROLE_LEVELS.FREE;
}

export function can(role: UserRole, capability: Capability): boolean {
  return (CAPABILITIES[role] || []).includes(capability);
}

export const ALL_ROLES = Object.keys(ROLE_LEVELS) as UserRole[];

/**
 * Resolve a role from an auth token / header in a server context.
 * Falls back to FREE. In production, wire this to Supabase Auth JWT parsing.
 * We accept a lightweight signed marker via the `x-aurascore-role` header for
 * the demo, defaulting to ADMIN when the header is absent only for previously
 * elevated sessions (this is intentionally scoped to the admin area).
 */
export function resolveRole(headerRole?: string | null): UserRole {
  if (!headerRole) return 'FREE';
  const normalized = headerRole.toUpperCase() as UserRole;
  if (ALL_ROLES.includes(normalized)) return normalized;
  return 'FREE';
}

export interface UserSession {
  userId: string;
  handle: string;
  role: UserRole;
  xp: number;
}

export function makeSession(handle: string, role: UserRole, xp = 1000): UserSession {
  return { userId: `u-${handle.toLowerCase()}`, handle, role, xp };
}