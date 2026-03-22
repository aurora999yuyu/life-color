// 缓存名称
const CACHE_NAME = 'life-color-v1';

// 需要缓存的资源
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './admin.js',
  './data.js',
  './manifest.json'
];

// 安装 Service Worker，缓存资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('缓存已打开');
        return cache.addAll(urlsToCache);
      })
  );
});

// 拦截请求，从缓存返回
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果缓存中有，返回缓存
        if (response) {
          return response;
        }
        // 否则从网络请求
        return fetch(event.request);
      })
  );
});

// 更新缓存
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});