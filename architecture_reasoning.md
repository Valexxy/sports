# MIVAJ.COM - ADVANCED REAL-TIME MEDIA & PWA ARCHITECTURE
## Staff-Level Technical Reasoning & Architectural Blueprint

---

## 📱 SECTION A: PWA & iOS Safari Push Notification Engineering (iOS 16.4+)

### 1. The Core iOS Safari Constraints & Realities
Prior to iOS 16.4, Web Push notifications were strictly unsupported on iOS devices. Since iOS 16.4+, Apple enabled the **Web Push API** and **Badging API**, but under stringent requirements:
1. **Mandatory Standalone PWA Installation**: Web Push on iOS **CANNOT** be triggered from inside standard Mobile Safari browser tabs. The web application **MUST** first be added to the iOS Home Screen (Standalone Display Mode: `display: "standalone"` or `"fullscreen"`).
2. **Explicit User-Gesture Activation**: `Notification.requestPermission()` and `PushManager.subscribe()` can **ONLY** be executed directly within an explicit user gesture event handler (e.g., direct `onClick` or `onTouchEnd` on an interactive button). Calling it on page load or inside a `setTimeout` will silently fail with `NotAllowedError`.
3. **HTTPS & VAPID Key Specifications**: iOS requires RFC 8292 compliant VAPID headers (`vapidPublicKey` in `applicationServerKey` converted to `Uint8Array`).

---

### 2. Complete Web App Manifest Blueprint (`public/manifest.json`)
```json
{
  "name": "Mivaj Sports Live | Real-Time Scores & Wiki",
  "short_name": "Mivaj Sports",
  "description": "Live match centers, real-time audio commentary, star player wiki dossiers, and instant goal alerts.",
  "start_url": "/?source=pwa",
  "display": "standalone",
  "background_color": "#070c18",
  "theme_color": "#00ff87",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["sports", "entertainment", "news"],
  "shortcuts": [
    {
      "name": "Live Match Center",
      "url": "/?tab=live",
      "icons": [{ "src": "/icons/live-icon.png", "sizes": "96x96" }]
    },
    {
      "name": "Star Birthdays",
      "url": "/birthdays",
      "icons": [{ "src": "/icons/birthday-icon.png", "sizes": "96x96" }]
    }
  ]
}
```

---

### 3. iOS User-Interaction Onboarding & Installation Detection Flow
```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER VISITS ON iOS SAFARI (Browser Tab)                  │
│    • Check: navigator.standalone === false                  │
│    • Display non-intrusive iOS banner:                      │
│      "Tap Share [↑] -> 'Add to Home Screen' to enable Live  │
│       Match Scoreboard & Instant Goal Push Alerts"          │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. USER LAUNCHES FROM HOME SCREEN (Standalone Mode)         │
│    • Check: window.matchMedia('(display-mode: standalone)') │
│    • Service Worker (`sw.js`) registers with scope: '/'     │
│    • User taps "🔔 Turn On Matchday Push Alerts"            │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. PERMISSION & VAPID SUBSCRIPTION HANDSHAKE                │
│    • Notification.requestPermission() -> 'granted'          │
│    • pushManager.subscribe({ userVisibleOnly: true,         │
│        applicationServerKey: urlB64ToUint8Array(VAPID_KEY)  │
│      })                                                     │
│    • Endpoint payload stored in Supabase `push_subscriptions│
└─────────────────────────────────────────────────────────────┘
```

---

### 4. Service Worker Push Interception (`public/sw.js`)
```javascript
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const payload = event.data.json();
  
  const title = payload.title || '⚡ Mivaj Sports Live Alert';
  const options = {
    body: payload.body,
    icon: payload.icon || '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    image: payload.image,
    vibrate: [200, 100, 200, 100, 400],
    data: { url: payload.url || '/' },
    actions: [
      { action: 'open_match', title: '🔴 Open Match Center' },
      { action: 'dismiss', title: 'Dismiss' }
    ],
    tag: payload.tag || 'mivaj-live-alert',
    renotify: true
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const targetUrl = event.notification.data.url;
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
```

---

## 🎧 SECTION B: Persistent Audio Commentary in Next.js App Router

### 1. The Next.js App Router Remounting Problem
In Next.js App Router (`app/`), page navigation triggers unmounting and re-rendering of the route segment tree (`page.tsx` within `app/(routes)/...`). If an `<audio>` tag or audio context is placed inside an individual page, navigating between `/`, `/players/[id]`, or `/birthdays` will immediately terminate audio playback.

### 2. The Architectural Solution: Root Layout Global Audio Shell
By placing the **Global Audio Context / Store** and the **HTML5 `<audio>` DOM Singleton** at the **Root Layout level (`app/layout.tsx`)**, the audio engine sits outside the route transition boundary.

```
┌─────────────────────────────────────────────────────────────┐
│ ROOT LAYOUT (`app/layout.tsx`) - NEVER REMOUNTS             │
│  ├── <GlobalAudioProvider> (Zustand Store / React Context)  │
│  │   ├── <audio ref={audioRef} id="mivaj-global-stream" />  │
│  │   ├── <PersistentDynamicIslandPlayer /> (Framer Motion)  │
│  │   └── <main>{children} (App Router Dynamic Pages)</main> │
└─────────────────────────────────────────────────────────────┘
```

### 3. MediaSession API (Lock Screen & Background Control)
To ensure continuous background audio when the user locks their screen or switches tabs:
```typescript
if ('mediaSession' in navigator) {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: `${match.homeTeam} vs ${match.awayTeam} (Live Commentary)`,
    artist: 'Mivaj Stadium Voice',
    album: 'Live Matchday Radio',
    artwork: [
      { src: match.homeLogo, sizes: '512x512', type: 'image/png' },
      { src: match.awayLogo, sizes: '512x512', type: 'image/png' }
    ]
  });

  navigator.mediaSession.setActionHandler('play', () => audioStore.play());
  navigator.mediaSession.setActionHandler('pause', () => audioStore.pause());
  navigator.mediaSession.setActionHandler('seekto', (details) => audioStore.seek(details.seekTime));
}
```

---

## ⚡ SECTION C: Real-Time Match Clock & Scoreboard via Supabase Realtime

### 1. Data Flow Architecture
```
┌──────────────────────────────────────┐
│ Third-Party Feeds (API-Football/ESPN)│
└──────────────────┬───────────────────┘
                   │
                   ▼ (10s Polling / Webhook)
┌──────────────────────────────────────┐
│ FastAPI Ingestion Worker / Postgres  │
│  • UPDATE matches SET home_score=2,  │
│    away_score=1, minute='68'         │
└──────────────────┬───────────────────┘
                   │
                   ▼ (Postgres Change Event / WAL)
┌──────────────────────────────────────┐
│ Supabase Realtime Engine (WebSockets)│
│  • Channel: `realtime:public:matches`│
└──────────────────┬───────────────────┘
                   │
                   ▼ (Broadcast via WebSockets)
┌──────────────────────────────────────┐
│ Next.js Frontend (useMatchRealtime)  │
│  • Instant UI mutation (<50ms)       │
│  • Local high-precision tick clock   │
└──────────────────────────────────────┘
```

### 2. High-Precision Client-Side Interpolated Clock
Because live match clocks tick every second, streaming network updates every 1 second across thousands of concurrent users creates unnecessary bandwidth overhead.
* **Network Cadence**: Supabase Realtime emits score changes, period shifts (HT, FT, Extra Time), and synchronization stamps (`minute: 68`, `syncedAt: 1724748000`).
* **Client Clock Engine**: A local `requestAnimationFrame` / `setInterval` micro-clock runs continuously between synchronization frames, smoothly incrementing seconds and locking to official sync timestamps upon packet delivery.

---

## 🛸 SECTION D: Viral "Floating Dynamic Island" UI/UX (Framer Motion)

### 1. Morphing State Machine
The Dynamic Island persistent player features **3 responsive states**:

```
State 1: MINIMIZED PILL (Floating Top Center / Bottom)
┌───────────────────────────────────────────────┐
│ 🔴 LIV 2 - 1 MCI • 68'  [▶] Female Warri Voice│
└───────────────────────────────────────────────┘
                       │ (Tap to Expand)
                       ▼
State 2: EXPANDED HUD DOCK
┌─────────────────────────────────────────────────────────────┐
│ ⚡ PREMIER LEAGUE • ANFIELD                                  │
│ 🔴 Liverpool  2 - 1  Man City 🔵                 [⏸ Pause] │
│ ⏱️ 68:42 (2nd Half) • Live Female Warri Audio Commentary    │
│ ═══════════════════════════════════════════════════════════ │
│ [ 🇳🇬 Warri Voice ]   [ 🇬🇧 English ]   [ 🎟️ View Slip ]     │
└─────────────────────────────────────────────────────────────┘
                       │ (Swipe Down)
                       ▼
State 3: MINI AUDIO PILL (Persistent Non-Intrusive Bottom Bar)
```

### 2. Framer Motion Physics & Micro-Interactions
* **Spring Transition**: `type: "spring", stiffness: 400, damping: 30, mass: 0.8` for authentic iOS Dynamic Island fluid morphing.
* **Audio Visualizer Equalizer**: 4 animated emerald bars with dynamic height pulses (`[8, 24, 14, 20]px`) dancing in sync with audio output.
* **Goal Alert Explosion**: Dynamic pulse animation with confetti bursts and gold glow when the score updates via Supabase Realtime.

---

## 🎯 Implementation Phasing Summary

- **Step 1: Deep Reasoning & Architectural Documentation (`architecture_reasoning.md`)** *(Current)*
- **Step 2: PWA Configuration (`manifest.json`, `sw.js`, iOS Onboarding UI)**
- **Step 3: Global Audio Store & Persistent Dynamic Island Player**
- **Step 4: Supabase Realtime Score & Clock Integration**
