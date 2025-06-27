/// <reference types="@types/serviceworker" />

const CACHE_NAME = 'wsh-2024-v1';
const FONT_URLS = [
  '/assets/NotoSansJP-Regular.woff',
  '/assets/NotoSansJP-Bold.woff'
];

self.addEventListener('install', (ev: ExtendableEvent) => {
  ev.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FONT_URLS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (ev: ExtendableEvent) => {
  ev.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (ev: FetchEvent) => {
  ev.respondWith(onFetch(ev.request));
});

async function onFetch(request: Request): Promise<Response> {
  // 静的アセットと画像を処理
  if (request.url.includes('/assets/') || request.url.includes('/images/')) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  }
  
  return fetch(request);
}
