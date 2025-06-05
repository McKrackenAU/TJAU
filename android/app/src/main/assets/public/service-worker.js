// Version number - increment this when making important changes
// that should force all clients to update
const VERSION = '5';
const CACHE_NAME = `tarot-journey-v${VERSION}`;
const STATIC_CACHE_NAME = `tarot-journey-static-v${VERSION}`;

// App information
const APP_NAME = 'Tarot Journey';
const OLD_APP_NAME = 'Tarot Learn';

// Expanded precache assets for better mobile performance
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/index.css'
];

// Install event - precache assets for better performance
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      // Cache HTML and navigation assets
      caches.open(CACHE_NAME)
        .then(cache => {
          console.log('Service worker main cache opened');
          return cache.addAll(PRECACHE_ASSETS);
        }),
      
      // Cache static assets separately for better performance
      caches.open(STATIC_CACHE_NAME)
        .then(cache => {
          console.log('Service worker static cache opened');
          // We'll let the fetch handler populate this cache
          // as resources are requested
          return Promise.resolve();
        })
    ])
    .then(() => self.skipWaiting())
    .catch(err => console.error('Service worker cache failed:', err))
  );
});

// Activate event - clean up old caches but keep current versions
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME, STATIC_CACHE_NAME];
  
  // Take control of all clients immediately
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // Delete any cache that isn't in our whitelist
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

// Optimized fetch event for better mobile performance
self.addEventListener('fetch', event => {
  // Skip non-GET and cross-origin requests
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip API requests
  if (event.request.url.includes('/api/')) {
    return;
  }

  const url = new URL(event.request.url);
  
  // Use cache-first strategy for static assets (CSS, JS, images)
  if (
    url.pathname.endsWith('.css') || 
    url.pathname.endsWith('.js') ||
    url.pathname.includes('/assets/') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.webp')
  ) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          // Return cached response immediately
          // And refresh the cache in the background (cache-first with refresh)
          const fetchPromise = fetch(event.request).then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(STATIC_CACHE_NAME).then(cache => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          }).catch(() => {
            // Silently fail background refresh
            return cachedResponse;
          });
          
          return cachedResponse;
        }
        
        // If not in cache, get from network and cache it
        return fetch(event.request).then(response => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(STATIC_CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // Use a network-first strategy for other requests (HTML, navigation, etc.)
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