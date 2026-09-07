// Service Worker for JanSethu - Offline Support

// Service Worker - Minimal Version (No Caching)
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  self.clients.claim();
});

// Don't cache anything - just fetch from network
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('JanSethu: Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => {
            console.log('JanSethu: Removing old cache', key);
            return caches.delete(key);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache if offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return new Response('Offline - Please check your connection', {
            status: 503,
            statusText: 'Service Unavailable',
          });
        });
    })
  );
});

// Background Sync for offline reports
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-reports') {
    event.waitUntil(syncReports());
  }
});

async function syncReports() {
  try {
    // Your sync logic here
    console.log('Syncing offline reports...');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}