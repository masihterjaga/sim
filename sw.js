const CACHE_NAME = 'rox-calc-v1.0.6';
const urlsToCache = [
  '/sim/',
  '/sim/index.html',
  '/sim/style/v1.1.3.css',
  '/sim/script/v1.1.3.js',
  '/sim/manifest.json',
  '/sim/changelog.json',
  '/sim/img/Calc_vs_Ingame-0.jpg',
  '/sim/img/Calc_vs_Ingame-1.jpg',
  '/sim/img/Calc_vs_Ingame-2.jpg',
  '/sim/img/Calc_vs_Ingame-3.jpg',
  '/sim/img/Calc_vs_Ingame-4.jpg',
  '/sim/icons/apple-touch-icon.png',
  '/sim/icons/favicon-96x96.png',
  '/sim/icons/favicon.ico',
  '/sim/icons/favicon.svg',
  '/sim/icons/web-app-manifest-192x192.png',
  '/sim/icons/web-app-manifest-512x512.png',
  '/sim/icons/any-192x192.png',
  '/sim/icons/any-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => {
      return cache.addAll(urlsToCache);
    })
    .catch(err => console.error('[SW] Failed to cache:', err))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
    .then(response => response || fetch(event.request).then(fetchResponse => {
      if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
        return fetchResponse;
      }
      
      const responseToCache = fetchResponse.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
      
      return fetchResponse;
    }))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
    .then(names => {
      return Promise.all(
        names.filter(name => name !== CACHE_NAME)
        .map(name => {
          return caches.delete(name);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('message', event => {
  if (event.data?.action === 'skipWaiting') {
    self.skipWaiting();
  }
});