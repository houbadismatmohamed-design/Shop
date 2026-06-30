/*==================================================
OK MOBILE
Service Worker
Version 1.0.0
==================================================*/

const CACHE_NAME = "ok-mobile-v1";

/* Files to cache */
const urlsToCache = [
    "./",
    "./index.html",
    "./admin.html",
    "./manifest.json",

    "./css/style.css",
    "./css/admin.css",
    "./css/responsive.css",

    "./js/firebase.js",
    "./js/app.js",
    "./js/auth.js",
    "./js/admin.js",
    "./js/products.js",
    "./js/gallery.js",
    "./js/theme.js",
    "./js/utils.js",

    "./assets/logo.svg",
    "./assets/favicon.png"
];

/*=========================================
INSTALL
=========================================*/

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)

        .then(cache => {

            return cache.addAll(urlsToCache);

        })

    );

    self.skipWaiting();

});

/*=========================================
ACTIVATE
=========================================*/

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(

                keys.map(key => {

                    if (key !== CACHE_NAME) {

                        return caches.delete(key);

                    }

                })

            );

        })

    );

    self.clients.claim();

});

/*=========================================
FETCH
=========================================*/

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") return;

    event.respondWith(

        caches.match(event.request)

        .then(response => {

            if (response) {

                return response;

            }

            return fetch(event.request)

                .then(networkResponse => {

                    if (!networkResponse || networkResponse.status !== 200) {

                        return networkResponse;

                    }

                    const responseClone = networkResponse.clone();

                    caches.open(CACHE_NAME)

                        .then(cache => {

                            cache.put(event.request, responseClone);

                        });

                    return networkResponse;

                })

                .catch(() => {

                    return caches.match("./index.html");

                });

        })

    );

});