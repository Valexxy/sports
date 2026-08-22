// AuraScore Stadium 2.0 - Service Worker (PWA + Native Lock Screen Notifications + Offline)
const CACHE_NAME = 'aurascore-stadium-v4';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/logo.svg',
  '/favicon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/badge-96.png',
];

// Install: pre-cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
    })
  );
  self.clients.claim();
});

// Fetch: stale-while-revalidate for static, network-first for API
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Never cache API calls — always try network first
  if (url.pathname.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Static assets: cache-first then network fallback
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

// NATIVE LOCK SCREEN PUSH NOTIFICATIONS (Wakes phone when locked)
self.addEventListener('push', (event) => {
  let payload = {
    title: '⚽ AuraScore Live Match Alert',
    body: 'Live in-play event detected in your followed player/match.',
    icon: '/logo.svg',
    badge: '/favicon.svg',
    tag: 'live-match-lockscreen-alert',
    data: { url: '/' },
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      payload = { ...payload, ...parsed };
    } catch (e) {
      payload.body = event.data.text();
    }
  }

  const options = {
    body: payload.body,
    icon: payload.icon || '/logo.svg',
    badge: payload.badge || '/favicon.svg',
    vibrate: [300, 100, 300, 100, 500],
    data: payload.data || { url: '/' },
    tag: payload.tag || 'live-match-lockscreen-alert',
    renotify: true,
    requireInteraction: true, // REMAINS ON LOCK SCREEN UNTIL USER TAPS
    actions: [
      { action: 'open_match', title: '⚽ View Live Match' },
      { action: 'listen_commentary', title: '🎙️ Listen Audio' },
    ],
  };

  event.waitUntil(self.registration.showNotification(payload.title, options));
});

// Notification click handler with Lock Screen Auto Commentary Play
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const matchId = event.notification.data?.matchId || '';
  const action = event.action || 'open_match';
  const targetUrl = `/?openMatch=${encodeURIComponent(matchId)}&autoCommentary=1`;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.origin) && 'focus' in client) {
          client.postMessage({
            type: 'LOCKSCREEN_AUTO_PLAY_COMMENTARY',
            matchId: matchId,
            action: action,
          });
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
