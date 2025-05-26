// Simple service worker - no caching to prevent runtime errors
const VERSION = '7';
const CACHE_NAME = `tarot-journey-v${VERSION}`;

// Install event
self.addEventListener('install', event => {
  console.log('Service worker installing');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', event => {
  console.log('Service worker activating');
  event.waitUntil(self.clients.claim());
});

// Fetch event - pass through all requests without caching
self.addEventListener('fetch', event => {
  // No caching - just pass through to prevent runtime errors
  return;
});