const TEMPO_CACHE = 'temponest-mobile-v6';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-192.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png',
  './screenshots/screenshot-wide.png',
  './screenshots/screenshot-narrow.png',
  './icon-192.png',
  './icon-512.png',
  './maskable-192.png',
  './maskable-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(TEMPO_CACHE)
      .then((cache) => Promise.allSettled(APP_SHELL.map((url) => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== TEMPO_CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if(request.method !== 'GET') return;

  const url = new URL(request.url);
  if(url.origin !== self.location.origin){
    event.respondWith(fetch(request).catch(() => new Response('', {status: 504, statusText: 'Offline'})));
    return;
  }

  if(request.mode === 'navigate'){
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(TEMPO_CACHE).then((cache) => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request).then((response) => {
        if(response && response.ok){
          const copy = response.clone();
          caches.open(TEMPO_CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      }).catch(() => cached);
      return cached || networkFetch;
    })
  );
});


self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil((async () => {
    const allClients = await clients.matchAll({type: 'window', includeUncontrolled: true});
    if(allClients.length){
      const client = allClients[0];
      if('focus' in client) return client.focus();
    }
    if(clients.openWindow) return clients.openWindow('./');
  })());
});


self.addEventListener('message', (event) => {
  const data = event.data || {};
  if(data.type === 'SHOW_NOTIFICATION'){
    const title = data.title || 'TempoNest';
    const options = data.options || { body: '알림이 도착했습니다.' };
    event.waitUntil(self.registration.showNotification(title, options));
  }
});
