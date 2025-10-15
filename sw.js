self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('coping-cards-v6').then(function(cache) {
      return cache.addAll([
        './',
        './index.html'
      ]);
    })
  );
});
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
