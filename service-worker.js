const CACHE = 'keiei-v1';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['/keiei-manual/']).catch(() => {})));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE ? caches.delete(k) : null))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (!r || r.status !== 200) return r;
      const rc = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, rc));
      return r;
    }).catch(() => caches.match(e.request))
  );
});
