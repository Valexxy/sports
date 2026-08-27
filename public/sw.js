// Mivaj Sports High-Performance Service Worker & Web Push Engine
const CACHE_NAME = 'mivaj-sports-v2';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Intercept Web Push Notifications (iOS 16.4+, Android, Desktop)
self.addEventListener('push', (event) => {
  if (!event.data) return;

  let payload = {};
  try {
    payload = event.data.json();
  } catch (e) {
    payload = { title: '⚡ Mivaj Sports Alert', body: event.data.text() };
  }

  const title = payload.title || '⚡ Mivaj Sports Live Alert';
  const options = {
    body: payload.body || 'Live match updates, kickoff alerts and real-time score notifications.',
    icon: payload.icon || '/icon-192x192.png',
    badge: '/icon-192x192.png',
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

// Notification Click Routing
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
