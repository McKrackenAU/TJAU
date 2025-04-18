// Version number - increment this when making important changes
// that should force all clients to update
const VERSION = '2';
const CACHE_NAME = `tarot-journey-v${VERSION}`;

// Simplified precache assets
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install event - precache basic assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service worker cache opened');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch(err => console.error('Service worker cache failed:', err))
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service worker activated');
        return self.clients.claim();
      })
      .catch(err => console.error('Service worker activation failed:', err))
  );
});

// Simplified fetch event for better reliability
self.addEventListener('fetch', event => {
  // Skip non-GET and cross-origin requests
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip API requests
  if (event.request.url.includes('/api/')) {
    return;
  }

  // Use a network-first strategy for most requests
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache the response for future offline use if valid
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            })
            .catch(err => console.error('Error caching response:', err));
        }
        return response;
      })
      .catch(err => {
        console.log('Fetch failed, trying cache:', err);
        // If network request fails, try to serve from cache
        return caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If not in cache, try to get the index.html 
            // (for SPA client-side routing)
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            // Otherwise, just fail
            return new Response('Network error, and no cached version available', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Handle service worker updates
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});