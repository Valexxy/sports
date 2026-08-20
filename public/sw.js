// AuraScore Stadium 2.0 - Background Service Worker & Hardware Bridge
const CACHE_NAME = 'aurascore-stadium-v2.5';
const STATIC_ASSETS = [
  '/',
  '/favicon.ico',
  '/manifest.json'
];

// Install Event: Pre-cache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('⚡ AuraScore Stadium Service Worker: Caching App Shell');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event: Clean old caches & claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Stale-While-Revalidate Strategy
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Don't cache dynamic API calls
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      });
    })
  );
});

// Background Push Notification Event (Wakes Phone when asleep)
self.addEventListener('push', (event) => {
  let payload = {
    title: '⚽ AuraScore Goal Alert!',
    body: 'Live in-play event detected in your followed match.',
    icon: '/favicon.ico',
    tag: 'live-match-alert',
    data: { url: '/' }
  };

  if (event.data) {
    try {
      payload = event.data.json();
    } catch (e) {
      payload.body = event.data.text();
    }
  }

  const options = {
    body: payload.body,
    icon: payload.icon || '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200, 100, 400], // Goal celebration vibration
    data: payload.data || { url: '/' },
    tag: payload.tag || 'live-match-alert',
    renotify: true,
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, options)
  );
});

// Notification Click Event (Brings user directly to the live pitch)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Periodic Background Sync (Polls matches in background if supported by OS)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-live-scores') {
    event.waitUntil(
      fetch('/api/matches')
        .then((res) => res.json())
        .then((data) => {
          console.log('⚡ Background periodic sync refreshed matches:', data.length);
        })
        .catch((err) => console.warn('Background sync failed:', err))
    );
  }
});
