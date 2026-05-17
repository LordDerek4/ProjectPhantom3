const CACHE = 'nexuschat-v4';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/nexuschat-logo.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network-first for API calls; cache-first for static assets
  const url = new URL(e.request.url);
  if (url.hostname !== self.location.hostname) {
    return; // Let external requests (Supabase, fonts, etc.) pass through
  }
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Cache a fresh copy of navigations
        if (e.request.mode === 'navigate') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('/index.html')))
  );
});

// Push notification support
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  const title = data.title || 'NexusChat';
  const options = {
    body: data.body || 'New message',
    icon: '/nexuschat-logo.svg',
    badge: '/nexuschat-logo.svg',
    data: data,
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if ('focus' in client) return client.focus();
      }
      return clients.openWindow('/');
    })
  );
});
