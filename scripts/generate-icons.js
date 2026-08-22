/**
 * AURASCORE PWA ICON GENERATOR (zero dependencies, pure Node)
 * Produces genuine 8-bit RGBA PNG icons (installable on Android/Desktop Chrome)
 * plus an SVG favicon & maskable vector, writing into /public/icons.
 *
 * Run: node scripts/generate-icons.js
 */

const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'public', 'icons');

// ---------------- CRC32 ----------------
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePng(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA

  const stride = width * 4 + 1;
  const raw = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    raw[y * stride] = 0; // filter: none
    rgba.copy(raw, y * stride + 1, y * width * 4, (y + 1) * width * 4);
  }

  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, pngChunk('IHDR', ihdr), pngChunk('IDAT', idat), pngChunk('IEND', Buffer.alloc(0))]);
}

// ---------------- Color helpers ----------------
function hexToRgb(hex) {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

function lerp(a, b, t) {
  return Math.round(a + (b - a) * t);
}

// ---------------- Drawing ----------------
// AuraScore brand "Zap" glyph polygon, normalized to [0..1].
const ZAP_POLY = [
  [0.60, 0.06],
  [0.18, 0.57],
  [0.44, 0.57],
  [0.40, 0.94],
  [0.82, 0.42],
  [0.56, 0.42],
];

function pointInPolygon(px, py, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    const intersect = yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function drawIcon(size, opts = {}) {
  const { rounded = false, maskable = false, radius = 0.22 } = opts;
  const rgba = Buffer.alloc(size * size * 4);
  const top = hexToRgb('#00E07F');
  const mid = hexToRgb('#8B5CF6');
  const bottom = hexToRgb('#FFD700');
  const bg = hexToRgb('#05070B');

  const cx = size / 2;
  const cy = size / 2;
  const cornerR = size * radius;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      // Background gradient (diagonal-ish: top->mid->bottom)
      const t = y / (size - 1);
      let col;
      if (t < 0.5) {
        col = [lerp(top[0], mid[0], t * 2), lerp(top[1], mid[1], t * 2), lerp(top[2], mid[2], t * 2)];
      } else {
        col = [lerp(mid[0], bottom[0], (t - 0.5) * 2), lerp(mid[1], bottom[1], (t - 0.5) * 2), lerp(mid[2], bottom[2], (t - 0.5) * 2)];
      }

      // Rounded corners cut-out (transparent outside)
      let alpha = 255;
      if (rounded) {
        const nx = Math.min(x, size - 1 - x);
        const ny = Math.min(y, size - 1 - y);
        if (nx < cornerR && ny < cornerR) {
          const dx = cornerR - nx;
          const dy = cornerR - ny;
          if (dx * dx + dy * dy > cornerR * cornerR) alpha = 0;
        }
      }

      // content safe zone for maskable: keep glyph smaller & centered
      let scale = 0.62;
      let offsetX = 0;
      let offsetY = 0;
      if (maskable) {
        scale = 0.46; // within 80% safe zone (0.4 radius)
      }

      // Lightning bolt test (in centered normalized space)
      const nx2 = (x / size - 0.5) / scale + 0.5 + offsetX;
      const ny2 = (y / size - 0.5) / scale + 0.5 + offsetY;

      let r = col[0], g = col[1], b = col[2];

      // Glyph: white bolt with subtle dark outline
      const inBolt = pointInPolygon(nx2, ny2, ZAP_POLY);
      if (inBolt) {
        r = 255; g = 255; b = 255;
      } else {
        // Slight dark tint for contrast (gradient already colorful)
      }

      rgba[idx] = r;
      rgba[idx + 1] = g;
      rgba[idx + 2] = b;
      rgba[idx + 3] = alpha;
    }
  }

  return encodePng(size, size, rgba);
}

function drawBadge(size) {
  // Circular badge (green circle w/ white bolt) for notification badge.
  const rgba = Buffer.alloc(size * size * 4);
  const cx = size / 2, cy = size / 2, r = size / 2 - 1;
  const green = hexToRgb('#00FF87');

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const dx = x - cx, dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > r) {
        rgba[idx + 3] = 0;
        continue;
      }
      const scale = 0.62;
      const nx2 = (x / size - 0.5) / scale + 0.5;
      const ny2 = (y / size - 0.5) / scale + 0.5;
      const inBolt = pointInPolygon(nx2, ny2, ZAP_POLY);
      if (inBolt) {
        rgba[idx] = 255; rgba[idx + 1] = 255; rgba[idx + 2] = 255;
      } else {
        rgba[idx] = green[0]; rgba[idx + 1] = green[1]; rgba[idx + 2] = green[2];
      }
      rgba[idx + 3] = 255;
    }
  }
  return encodePng(size, size, rgba);
}

// ---------------- SVG favicon / vector ----------------
function writeSvg() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#00E07F"/>
      <stop offset="0.5" stop-color="#8B5CF6"/>
      <stop offset="1" stop-color="#FFD700"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#g)"/>
  <path d="M307 28 92 292h88l-10 172 215-264h-88l10-172z" fill="#ffffff"/>
</svg>`;
  fs.writeFileSync(path.join(OUT_DIR, 'icon.svg'), svg);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const targets = [
  { file: 'icon-192.png', size: 192, opts: { rounded: true } },
  { file: 'icon-512.png', size: 512, opts: { rounded: true } },
  { file: 'icon-maskable-192.png', size: 192, opts: { rounded: false, maskable: true } },
  { file: 'icon-maskable-512.png', size: 512, opts: { rounded: false, maskable: true } },
  { file: 'apple-touch-icon.png', size: 180, opts: { rounded: true } },
];

for (const t of targets) {
  const buf = drawIcon(t.size, t.opts);
  fs.writeFileSync(path.join(OUT_DIR, t.file), buf);
  console.log('wrote', t.file);
}

fs.writeFileSync(path.join(OUT_DIR, 'badge-96.png'), drawBadge(96));
console.log('wrote badge-96.png');

writeSvg();
console.log('wrote icon.svg');
console.log('DONE');