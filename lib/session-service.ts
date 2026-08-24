import crypto from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'aurascore_enterprise_secret_key_2026_super_secure';
export const SESSION_COOKIE_NAME = 'aurascore_session_token';

export interface SessionPayload {
  userId: string;
  username: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR' | 'PLATINUM PRODIGY 👑' | 'GOLD INFLUENCER ⚡' | 'STADIUM MEMBER';
  vipTier: string;
  exp: number;
}

export class SessionService {
  /**
   * Create an HMAC SHA256 signed session token
   */
  public static createToken(payload: Omit<SessionPayload, 'exp'>, expiresInHours: number = 72): string {
    const fullPayload: SessionPayload = {
      ...payload,
      exp: Date.now() + expiresInHours * 60 * 60 * 1000,
    };
    const jsonStr = JSON.stringify(fullPayload);
    const base64Data = Buffer.from(jsonStr).toString('base64url');
    const signature = crypto.createHmac('sha256', SESSION_SECRET).update(base64Data).digest('base64url');
    return `${base64Data}.${signature}`;
  }

  /**
   * Verify and parse an HMAC SHA256 signed session token
   */
  public static verifyToken(token: string | undefined | null): SessionPayload | null {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [base64Data, signature] = parts;
    const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(base64Data).digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    try {
      const jsonStr = Buffer.from(base64Data, 'base64url').toString('utf8');
      const payload: SessionPayload = JSON.parse(jsonStr);
      if (Date.now() > payload.exp) {
        return null; // Expired
      }
      return payload;
    } catch {
      return null;
    }
  }
}
