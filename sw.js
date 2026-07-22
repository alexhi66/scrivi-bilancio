/* Service worker minimale: cache offline dell'app (nessun dato utente qui). */
const CACHE = "bilancio-v11";
const ASSETS = ["./", "./index.html", "./manifest.json", "./icon.svg"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  // Solo i file dell'app (stesso dominio) passano dalla cache.
  // Le chiamate esterne (GitHub API) vanno SEMPRE in rete, mai in cache.
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request).then((resp) => {
      if (resp && resp.ok) { const copy = resp.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {}); }
      return resp;
    }).catch(() => caches.match("./index.html")))
  );
});
