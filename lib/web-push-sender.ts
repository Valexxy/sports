/**
 * ZERO-DEPENDENCY WEB PUSH SENDER (RFC 8291 + RFC 8188 + VAPID)
 * Implements true server-initiated push notifications using only Node's built-in
 * crypto module. Encrypts a payload with aes128gcm and authenticates via VAPID
 * (ES256 JWT). This lets AuraScore's server wake any subscribed phone even when
 * the browser is closed — no third-party push SDK required.
 */

import crypto from 'crypto';

export interface PushSubscriptionPayload {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface VapidKeys {
  publicKey: string;
  privateKey: string;
}

export interface WebPushMessage {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  url?: string;
}

// ---------------------------------------------------------------------------
// Base64URL helpers
// ---------------------------------------------------------------------------
function toBase64Url(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(str: string): Buffer {
  const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4));
  return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/') + pad, 'base64');
}

// ---------------------------------------------------------------------------
// HKDF (RFC 5869)
// ---------------------------------------------------------------------------
function hmacSha256(key: Buffer, data: Buffer): Buffer {
  return crypto.createHmac('sha256', key).update(data).digest();
}

function hkdfExtract(salt: Buffer, ikm: Buffer): Buffer {
  return hmacSha256(salt, ikm);
}

function hkdfExpand(prk: Buffer, info: Buffer, length: number): Buffer {
  const blocks = Math.ceil(length / 32);
  const okm: Buffer[] = [];
  let prev: Buffer = Buffer.alloc(0);
  for (let i = 1; i <= blocks; i++) {
    prev = hmacSha256(prk, Buffer.concat([prev, info, Buffer.from([i])]));
    okm.push(prev);
  }
  return Buffer.concat(okm).subarray(0, length);
}

// ---------------------------------------------------------------------------
// VAPID JWT (ES256)
// ---------------------------------------------------------------------------
function base64UrlEncodeJson(obj: unknown): string {
  return toBase64Url(Buffer.from(JSON.stringify(obj)));
}

function generateVapidJwt(
  audience: string,
  subject: string,
  privateKey: crypto.KeyObject,
  expirySeconds = 12 * 60 * 60,
): string {
  const now = Math.floor(Date.now() / 1000);
  const header = { typ: 'JWT', alg: 'ES256' };
  const claims = {
    aud: audience,
    exp: now + expirySeconds,
    sub: subject,
  };

  const signingInput = `${base64UrlEncodeJson(header)}.${base64UrlEncodeJson(claims)}`;
  const signature = crypto.sign('sha256', Buffer.from(signingInput), {
    key: privateKey,
    dsaEncoding: 'ieee-p1363',
  });
  const sigR = signature.subarray(0, 32);
  const sigS = signature.subarray(32, 64);
  const jwtSignature = toBase64Url(Buffer.concat([sigR, sigS]));
  return `${signingInput}.${jwtSignature}`;
}

// ---------------------------------------------------------------------------
// aes128gcm content encryption (single record)
// ---------------------------------------------------------------------------
function aes128gcmEncrypt(plaintext: Buffer, key: Buffer, nonce: Buffer): Buffer {
  const cipher = crypto.createCipheriv('aes-128-gcm', key, nonce);
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([encrypted, tag]);
}

function encryptPayload(
  plaintext: Buffer,
  userPublicKeyRaw: Buffer,
  userAuthRaw: Buffer,
  serverPublicKeyRaw: Buffer,
  serverPrivateKeyRaw: Buffer,
): { body: Buffer; salt: Buffer } {
  // ECDH shared secret
  const ecdh = crypto.createECDH('prime256v1');
  ecdh.setPrivateKey(serverPrivateKeyRaw);
  const sharedSecret = ecdh.computeSecret(userPublicKeyRaw);

  // HKDF derive CEK + NONCE (RFC 8291 / 8188)
  const authSecret = userAuthRaw;

  // IKM
  const keyInfo = Buffer.concat([
    Buffer.from('WebPush: info\0', 'binary'),
    userPublicKeyRaw,
    serverPublicKeyRaw,
  ]);
  const prk = hkdfExtract(authSecret, sharedSecret);
  const ikm = hkdfExpand(prk, keyInfo, 32);

  const salt = crypto.randomBytes(16);
  const finalPrk = hkdfExtract(salt, ikm);

  const cek = hkdfExpand(finalPrk, Buffer.from('aes128gcm\0', 'binary'), 16);
  const nonce = hkdfExpand(finalPrk, Buffer.from('nonce\0', 'binary'), 12);

  const ciphertext = aes128gcmEncrypt(plaintext, cek, nonce);
  const recordSize = Buffer.alloc(4);
  recordSize.writeUInt32BE(4096, 0);

  // Web Push body wire format: salt (16) || recordSize (4, big-endian) || ciphertext.
  // A single record whose plaintext is <= recordSize (4096) is implicitly final,
  // so no trailing 0x00 delimiter byte is required.
  return { body: Buffer.concat([salt, recordSize, ciphertext]), salt };
}

// ---------------------------------------------------------------------------
// Core sender
// ---------------------------------------------------------------------------
async function sendWebPush(
  subscription: PushSubscriptionPayload,
  payload: string,
  vapid: VapidKeys,
): Promise<boolean> {
  const endpoint = subscription.endpoint;
  const audience = new URL(endpoint).origin;

  const userPublicKeyRaw = fromBase64Url(subscription.keys.p256dh);
  const userAuthRaw = fromBase64Url(subscription.keys.auth);
  const serverPublicKeyRaw = fromBase64Url(vapid.publicKey);
  const serverPrivateKeyRaw = fromBase64Url(vapid.privateKey);

  const { body } = encryptPayload(
    Buffer.from(payload),
    userPublicKeyRaw,
    userAuthRaw,
    serverPublicKeyRaw,
    serverPrivateKeyRaw,
  );

  const privatePem = crypto.createPrivateKey({
    key: Buffer.concat([
      Buffer.from('308141020100301306072a8648ce3d020106082a8648ce3d030107042730250201010420', 'hex'),
      serverPrivateKeyRaw,
    ]),
    format: 'der',
    type: 'sec1',
  });

  const jwt = generateVapidJwt(
    audience,
    process.env.VAPID_SUBJECT || 'mailto:support@aurascore.app',
    privatePem,
  );

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'aes128gcm',
      TTL: '86400',
      Authorization: `vapid t=${jwt}, k=${vapid.publicKey}`,
      'Urgency': 'high',
    },
    body: new Uint8Array(body),
  });

  if (res.ok || res.status === 201 || res.status === 202) return true;

  // 404 / 410 => subscription is no longer valid
  if (res.status === 404 || res.status === 410) {
    return false;
  }

  console.warn(`[web-push] endpoint ${res.status}:`, await res.text().catch(() => ''));
  return false;
}

export { sendWebPush };