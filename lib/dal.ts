import { cookies } from 'next/headers';
import { DatabaseService, DbUser, SystemSettings } from './database-service';
import { SessionService, SESSION_COOKIE_NAME, SessionPayload } from './session-service';

export class DataAccessLayer {
  /**
   * Get the verified user session from httpOnly cookie
   */
  public static async getCurrentSession(): Promise<SessionPayload | null> {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    return SessionService.verifyToken(token);
  }

  /**
   * Enforce that the requester is a verified SUPER_ADMIN
   */
  public static async requireSuperAdmin(): Promise<DbUser> {
    const session = await this.getCurrentSession();
    if (!session) {
      throw new Error('401: Unauthorized - Authentication required');
    }
    const user = await DatabaseService.getUser(session.username);
    if (!user || user.role !== 'SUPER_ADMIN') {
      throw new Error('403: Forbidden - Super Admin privileges required');
    }
    return user;
  }

  /**
   * Safely get user profile (only self or admin can access sensitive fields)
   */
  public static async safeGetUser(targetUsername: string): Promise<DbUser | null> {
    const session = await this.getCurrentSession();
    const user = await DatabaseService.getUser(targetUsername);
    if (!user) return null;

    // If requester is not self and not admin, sanitize sensitive records
    if (!session || (session.username !== targetUsername && session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
      return {
        ...user,
        email: '***@***.***',
        phone: undefined,
        naira_balance: 0,
        notes: undefined,
      };
    }
    return user;
  }

  /**
   * Safely adjust Aura balance (Admin only)
   */
  public static async safeAdjustUserAura(username: string, delta: number, reason: string): Promise<DbUser | null> {
    await this.requireSuperAdmin();
    return DatabaseService.adjustUserAura(username, delta, reason);
  }

  /**
   * Safely update platform settings (Super Admin only)
   */
  public static async safeUpdateSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    await this.requireSuperAdmin();
    return DatabaseService.updateSettings(settings);
  }
}
