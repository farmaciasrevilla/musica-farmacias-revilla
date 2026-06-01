const CACHE_NAME = 'revilla-musica-web-v2';
const APP_SHELL = [
  './', './index.html', './manifest.webmanifest', './assets/player.js', './assets/icon.svg',
  './lista-farmacias-revilla-original-1.html', './lista-farmacias-revilla-original-2.html', './lista-farmacias-revilla-original-3.html',
  './guia-reproduccion-web-android.html', './alternativa-pc-windows.html'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).catch(()=>{}));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(res => {
      const copy = res.clone(); caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(()=>{}); return res;
    })).catch(() => caches.match('./index.html')));
  }
});