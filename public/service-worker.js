self.addEventListener("install", (event) => {
    console.log("Service Worker installing...");
    event.waitUntil(
        caches.open("travel-journal-cache").then((cache) => {
            return cache.addAll([
                "/",
                "/offline.html",
            ]);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match("/offline.html");
        })
    );
});

self.addEventListener("activate", (event) => {
    console.log("Service Worker activated");
});
