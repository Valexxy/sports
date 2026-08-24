# Production Launch & Hosting Checklist for mivaj.com

This document provides exact deployment instructions, DNS records, and environment configurations to host **AuraScore / Mivaj** live at **https://mivaj.com**.

---

## 1. Domain & DNS Configuration (mivaj.com)

Configure the following records in your DNS management provider (e.g. Cloudflare, Namecheap, GoDaddy):

| Type | Name / Host | Target / Value | TTL | Proxy Status |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` (root) | `76.76.21.21` *(Vercel)* or `YOUR_SERVER_IP` | Auto | Proxied (Orange Cloud) |
| **CNAME** | `www` | `cname.vercel-dns.com` or `mivaj.com` | Auto | Proxied (Orange Cloud) |
| **TXT** | `@` | `v=spf1 include:... ~all` | Auto | DNS Only |

---

## 2. Production Environment Variables Inventory

Set the following variables in your hosting provider's dashboard (Vercel, AWS, or Railway):

```bash
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://mivaj.com
SESSION_SECRET=aurascore_enterprise_secret_key_2026_super_secure_sha256

# Supabase PostgreSQL (Port 6543 with PgBouncer Pooling)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
DATABASE_URL=postgres://postgres.your-project:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Paystack Live Keys
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_c3ac464a91290f7507e5e36f5b0bec3ac0da9f5a
PAYSTACK_SECRET_KEY=sk_live_...

# Monetag Zone
NEXT_PUBLIC_MONETAG_ZONE_ID=11643531
```

---

## 3. Affiliate Monetization Verification

Verify that all partner referral funnels resolve correctly:
- 🟢 **Stake.com VIP Affiliate Link**: `https://stake.com/?c=bPn8D0iA` (Code: `bPn8D0iA`)
- 🔵 **22Bet Nigeria Affiliate Tag**: `https://22bet.com.ng/?tag=972744` (Tag: `972744`)
- 💬 **WhatsApp Direct Chat Desk**: `https://wa.me/2348072015725`
- 📢 **Telegram Channel**: `https://t.me/mivajsport`

---

## 4. Build & Performance Validation
- **Build Status**: `next build` compiled with **0 errors across all routes**.
- **Edge Security**: Strict CSP, HSTS, XSS, and anti-bot rate limiters active.
- **SEO & Social Cards**: Dynamic `sitemap.xml`, `robots.txt`, and OpenGraph metadata targeting `https://mivaj.com`.
