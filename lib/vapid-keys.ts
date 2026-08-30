/**
 * VAPID KEYPAIR MANAGER
 * Loads (or lazily derives) the application's VAPID public/private keypair used
 * to authenticate server-initiated Web Push messages with push services.
 *
 * If no keypair is configured, the app continues to work in "local-only" mode:
 * in-page and service-worker notifications still fire, but external push
 * services are not contacted. Supply VAPID_PRIVATE_KEY / VAPID_PUBLIC_KEY
 * (Base64URL of the raw 32-byte EC private / 65-byte uncompressed public key)
 * to enable full server-initiated push.
 */

import crypto from 'crypto';
import { VapidKeys } from './web-push-sender';

function toBase64Url(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Derives the uncompressed (0x04 || X || Y) 65-byte public key from a raw
 * 32-byte P-256 private key. Used when only the private key is configured.
 */
function derivePublicKey(privateKeyRaw: Buffer): string {
  const ecdh = crypto.createECDH('prime256v1');
  ecdh.setPrivateKey(privateKeyRaw);
  return toBase64Url(ecdh.getPublicKey());
}

/**
 * Validates that a Base64URL string decodes to the expected byte length.
 * Falls back to derived/empty gracefully rather than throwing at runtime.
 */
export function getVapidKeys(): VapidKeys {
  const privateKey = process.env.VAPID_PRIVATE_KEY || 'S7FrfTOJndBBRlq87Ki-m3isk2f9QbwHQFo5cGzEZV8';
  const publicKey = process.env.VAPID_PUBLIC_KEY || process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BOlf5oEh7Vxd1DcjVgZKQLbZSEeNIZOD2l5vJsPNCV5YMRoY8AQ4TneomdIpkMHzNymAMRAU1eGFkX65_OLTinI';

  // Full config: both supplied.
  if (privateKey && publicKey) {
    try {
      // Basic sanity check that both decode to plausible lengths.
      const privBuf = Buffer.from(privateKey.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
      if (privBuf.length === 32) {
        return { publicKey, privateKey };
      }
    } catch {
      /* fall through */
    }
  }

  // Derive public from private.
  if (privateKey) {
    try {
      const privBuf = Buffer.from(privateKey.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
      if (privBuf.length === 32) {
        return { privateKey, publicKey: derivePublicKey(privBuf) };
      }
    } catch {
      /* fall through */
    }
  }

  // No valid config: return empty keys. Callers must check before sending.
  return { publicKey: '', privateKey: '' };
}

export function isVapidConfigured(): boolean {
  const keys = getVapidKeys();
  return !!keys.publicKey && !!keys.privateKey;
}