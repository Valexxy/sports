/**
 * VAPID KEYPAIR GENERATOR (zero dependencies)
 * Outputs a Base64URL public (65-byte uncompressed) and private (32-byte)
 * keypair for server-initiated Web Push. Add the output to your .env.local.
 *
 * Run: node scripts/generate-vapid.js
 */

const crypto = require('crypto');

function toBase64Url(buf) {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const ecdh = crypto.createECDH('prime256v1');
ecdh.generateKeys();

const privateKeyRaw = ecdh.getPrivateKey(); // 32 bytes
const publicKeyRaw = ecdh.getPublicKey(); // 65 bytes (uncompressed 0x04)

console.log('\n✅ VAPID KEYS GENERATED — copy these into your .env.local\n');
console.log('VAPID_PUBLIC_KEY=' + toBase64Url(publicKeyRaw));
console.log('VAPID_PRIVATE_KEY=' + toBase64Url(privateKeyRaw));
console.log('VAPID_SUBJECT=mailto:support@aurascore.app');
console.log('');