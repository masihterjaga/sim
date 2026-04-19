const CACHE_NAME = 'rox-calc-v1.16.9988';
const urlsToCache = [
  '/sim/',
  '/sim/index.html',
  '/sim/physical-suno-mammonite-se.html',
  '/sim/style/v1.1.5.css',
  '/sim/scripts/v1.1.8.js',
  '/sim/scripts/card-data.js',
  '/sim/scripts/card-optimizer.js',
  '/sim/scripts/mvp-mini.js',
  '/sim/scripts/element-counter.js',
  '/sim/scripts/weapon-modifier.js',
  '/sim/scripts/calculation-core.js',
  '/sim/scripts/calculation-helpers.js',
  '/sim/scripts/eq-set.js',
  '/sim/manifest.json',
  '/sim/changelog.json',
  '/sim/img/dogekek.png',
  '/sim/img/pepekekcry.png',
  '/sim/img/Calc_vs_Ingame-0.jpg',
  '/sim/img/Calc_vs_Ingame-1.jpg',
  '/sim/img/Calc_vs_Ingame-2.jpg',
  '/sim/img/Calc_vs_Ingame-3.jpg',
  '/sim/img/Calc_vs_Ingame-4.jpg',
  '/sim/img/Calc_Tips_Atk.jpg',
  '/sim/img/Test_New-V_ArcAngel.jpg',
  '/sim/img/Calc_x_Ingame_1.1.6_0.jpg',
  '/sim/img/Calc_x_Ingame_1.1.6_1.jpg',
  '/sim/img/Calc_x_Ingame_1.1.6_2.jpg',
  '/sim/icons/apple-touch-icon.png',
  '/sim/icons/favicon-96x96.png',
  '/sim/icons/favicon.ico',
  '/sim/icons/favicon.svg',
  '/sim/icons/web-app-manifest-192x192.png',
  '/sim/icons/web-app-manifest-512x512.png'
];

let isPWAMode = false;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
    .then(names => Promise.all(
      names.filter(name => name !== CACHE_NAME)
      .map(name => caches.delete(name))
    ))
    .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (!isPWAMode) return;

  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
    .then(response => {
      if (response) return response;

      return fetch(event.request)
        .then(fetchResponse => {
          if (!fetchResponse || fetchResponse.status !== 200) {
            return fetchResponse;
          }

          if (fetchResponse.type === 'basic' || fetchResponse.type === 'cors') {
            const responseToCache = fetchResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseToCache));
          }

          return fetchResponse;
        })
        .catch(() => caches.match(event.request));
    })
  );
});

self.addEventListener('message', event => {
  if (event.data?.action === 'skipWaiting') {
    self.skipWaiting();
  }
  if (event.data?.type === 'SET_MODE') {
    isPWAMode = event.data.isPWA;
  }
});
