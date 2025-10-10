const CACHE_NAME = 'rox-calc-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/style/v1.1.3.css',
  '/script/v1.1.3.js',
  '/manifest.json',
  '/img/Calc_vs_Ingame-0.jpg',
  '/img/Calc_vs_Ingame-1.jpg',
  '/img/Calc_vs_Ingame-2.jpg',
  '/img/Calc_vs_Ingame-3.jpg',
  '/img/Calc_vs_Ingame-4.jpg',
  '/icons/apple-touch-icon.png',
  '/icons/favicon-96x96.png',
  '/icons/favicon.ico',
  '/icons/favicon.svg',
  '/icons/web-app-manifest-192x192.png',
  '/icons/web-app-manifest-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => cache.addAll(urlsToCache))
    .catch(err => console.error('Failed to cache:', err))
  );
  self.skipWaiting();
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
    .then(names => Promise.all(
      names.filter(name => name !== CACHE_NAME)
      .map(name => caches.delete(name))
    ))
  );
  self.clients.claim();
});

self.addEventListener('message', event => {
  if (event.data?.action === 'skipWaiting') {
    self.skipWaiting();
  }
});