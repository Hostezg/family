// Minimal service worker: caches the app shell so the page opens instantly.
// Messages themselves always go to the network.
const CACHE = "family-pwa-v2";
const SHELL = ["./", "index.html", "config.js", "icon-192.png", "icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  // network first, fall back to cache, so updates show up right away
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
