const CACHE_NAME = 'rox-calc-v1.1.3';
const urlsToCache = [
  '/sim/',
  '/sim/index.html',
  '/sim/style/v1.1.3.css',
  '/sim/script/v1.1.3.js',
  '/sim/manifest.json',
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
  '/sim/icons/web-app-manifest-512x512.png'
];

// Install service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Failed to cache resources:', err);
      })
  );
  self.skipWaiting();
});

// Fetch dari cache atau network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        return fetch(event.request).then(
          response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Update service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});