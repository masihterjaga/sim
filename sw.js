const CACHE_NAME = 'rox-calc-v1.1.6';
const urlsToCache = [
  '/sim/',
  '/sim/index.html',
  '/sim/style/v1.1.5.css',
  '/sim/script/v1.1.5.js',
  '/sim/manifest.json',
  '/sim/changelog.json',
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
});