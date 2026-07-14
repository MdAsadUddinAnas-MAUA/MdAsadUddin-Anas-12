/*
  Network-first service worker.
  Always tries the network first so visitors get the latest version of the
  site when online. Only falls back to a cached copy if the network request
  fails (i.e. the visitor is actually offline). This deliberately avoids the
  "stale cache after redeploy" problem that cache-first service workers cause.

  Bump CACHE_NAME (e.g. to "asad-portfolio-v2") whenever you want to force a
  clean slate for returning offline users — not required for normal updates,
  since network-first always overwrites the cache with the newest response
  whenever a visitor is online.
*/

const CACHE_NAME = "asad-portfolio-v1";
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/icons/favicon.svg",
  "/404.html"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .catch(() => { /* fine if a core asset is missing on first install */ })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        }).catch(() => {});
        return networkResponse;
      })
      .catch(() =>
        caches.match(event.request).then((cached) => cached || caches.match("/index.html"))
      )
  );
});