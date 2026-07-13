const CACHE_NAME = "planner-v1.1";

self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./style.css",
        "./script.js",
        "./cloud.js",
        "./icon-192.png",
        "./icon-512.png"
      ]);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      clients.claim(),
      caches.keys().then(keys =>
        Promise.all(
          keys.map(key => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        )
      )
    ])
  );
});

self.addEventListener("fetch", (event) => {

  const url = event.request.url;

  // Always get latest JS/CSS
  if (
    url.includes(".js") ||
    url.includes(".css")
  ) {

    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();

          caches.open(CACHE_NAME)
            .then(cache =>
              cache.put(event.request, copy)
            );

          return response;
        })
        .catch(() =>
          caches.match(event.request)
        )
    );

    return;
  }

  // Everything else cache first
  event.respondWith(
    caches.match(event.request)
      .then(res => res || fetch(event.request))
  );

});