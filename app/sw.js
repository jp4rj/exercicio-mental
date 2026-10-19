const CACHE = "treino-mental-v1";
const ASSETS = ["/", "/index.html", "/css/style.css", "/js/app.js",
  "/utils/calcGenerator.js", "/utils/wordsBank.js", "/utils/stroopGenerator.js"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
