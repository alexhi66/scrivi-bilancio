/* Service worker: offline dell'app (nessun dato utente qui).
   La PAGINA usa network-first → online vedi SEMPRE l'ultima versione; offline la cache. */
const CACHE = "bilancio-v24";
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
  // Le chiamate esterne (GitHub API) vanno SEMPRE in rete, mai in cache.
  if (url.origin !== self.location.origin) return;
  const isPage = e.request.mode === "navigate" || url.pathname.endsWith("/") || url.pathname.endsWith("index.html");
  if (isPage) {
    // network-first: prendi l'ultima versione se online, cache come fallback offline
    e.respondWith(
      fetch(e.request).then((resp) => {
        if (resp && resp.ok) { const copy = resp.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {}); }
        return resp;
      }).catch(() => caches.match(e.request).then((r) => r || caches.match("./index.html")))
    );
    return;
  }
  // altri asset (icona, manifest): cache-first
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request).then((resp) => {
      if (resp && resp.ok) { const copy = resp.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {}); }
      return resp;
    }).catch(() => caches.match("./index.html")))
  );
});
