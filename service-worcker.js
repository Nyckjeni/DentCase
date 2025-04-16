const CACHE_NAME = 'odonto-cache-v1';
const urlsToCache = [
  '/',
  'login.html',
  'login.css',
  'login.js',
  'manifest.json',
  'listarCaso.html',
  'listarCaso.css',
  'listarCaso.js',
  'novoCaso.html',
  'novoCaso.css',
  'novoCaso.js',
];


self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Arquivos em cache');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Ativado');
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removendo cache antigo:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() =>
          caches.match('/offline.html') // Crie essa página se quiser
        )
      );
    })
  );
});