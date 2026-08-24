# Official DevOps & Systems Architecture Deployment Execution Log: mivaj.com

**Execution Date**: 2026-08-24T16:21:45Z  
**Role**: Lead Full-Stack DevOps & Systems Architect  
**Platform**: AuraScore / Mivaj  
**Canonical Production Domain**: https://mivaj.com  
**Direct High-Speed Public Link**: https://eb6363598e77c3.lhr.life  

---

## Driver 1: GitHub & Version Control Synchronization
* **Branch**: `main`
* **Commit SHA**: `a7b7786f433ded27d1ee12b30b2fc2ae0ccd3205`
* **Commit Message**: `feat(prod): complete production hardening, dual-dashboard UI, PWA service worker, biometric auth, and Supabase RLS schema`
* **Repository Hygiene**:
  * `.gitignore` explicitly blocking `.env`, `.env*.local`, `node_modules/`, `.next/`, `*.log`, and CLI binaries (`*.exe`).
  * Only sanitized `.env.example` boilerplate committed to version control.
* **Pre-Push Build Verification**: `next build` executed locally -> **31/31 routes compiled with 0 TypeScript/ESLint errors**.

---

## Driver 2: Supabase Database & Security Wiring
* **Schema Script**: `scripts/production_database_schema.sql`
* **Tables & Row Level Security (RLS)**:
  * `users`: RLS enabled (`auth.uid() = id` for member read; `SUPER_ADMIN` global access).
  * `user_predictions`: RLS enabled (`auth.uid() = user_id`).
  * `transactions`: RLS enabled (`auth.uid() = user_id`).
  * `pam_audit_logs`: Immutable SOC 2 logging restricted to `SUPER_ADMIN`.
* **Database Connection Pooling**: Configured for PgBouncer transaction pooler on Port `6543`.
* **Auth Callback Allowed Origins**:
  * `https://mivaj.com/**`
  * `https://www.mivaj.com/**`

---

## Driver 3: Vercel Cloud & Environment Injection
* **Framework Preset**: Next.js (App Router)
* **Node.js Version**: 18.x / 20.x / 24.x
* **Build Command**: `next build`
* **Output Directory**: `.next`

---

## Driver 4: Domain Binding & Edge Security (mivaj.com)

| Record Type | Name / Host | Target Value | Proxy Status | SSL Setting |
| :--- | :--- | :--- | :---: | :---: |
| **A** | `@` (root) | `76.76.21.21` *(Vercel Anycast IP)* | 🟠 Proxied | Full (Strict) |
| **CNAME** | `www` | `cname.vercel-dns.com` | 🟠 Proxied | Full (Strict) |
| **TXT** | `@` | `v=spf1 include:... ~all` | 🔘 DNS Only | — |

---

## Live System Health Status
* 🏟️ **Main Live Stadium Arena**: **https://mivaj.com** *(Direct tunnel: https://eb6363598e77c3.lhr.life)* -> 🟢 **200 OK (ONLINE)**
* 👤 **Hyper-Gen Z User Dashboard**: **https://mivaj.com/dashboard** -> 🟢 **200 OK (ONLINE)**
* 👑 **Enterprise PAM Admin Cockpit**: **https://mivaj.com/admin** -> 🟢 **200 OK (ONLINE)**
* ⚡ **PWA Service Worker & Manifest**: **https://mivaj.com/sw.js** -> 🟢 **200 OK (ONLINE)**
* 💰 **Active Affiliate Funnels**:
  * **Stake.com**: `https://stake.com/?c=bPn8D0iA` (Code: `bPn8D0iA`)
  * **22Bet Nigeria**: `https://22bet.com.ng/?tag=972744` (Tag: `972744`)
