// تطبيق بوابة التدريب: يعمل كتطبيق على الجوال، ويحفظ الواجهة للفتح السريع
const V = 'bt-v1';
const CORE = ['./', './manifest.webmanifest', './icon-192.png', '../logo.png', '../fonts/UthmanTN1.woff2', '../fonts/UthmanTN1B.woff2', '../geo/world.json'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(CORE).catch(() => {})).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;          // طلبات النظام لا تُخزَّن
  if (r.mode === 'navigate') {                                              // الصفحة: الشبكة أولاً
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(V).then(x => x.put('./', c)); return res; }).catch(() => caches.match('./')));
    return;
  }
  e.respondWith(caches.match(r).then(hit => {                               // الملفات: المخزَّن ثم التحديث
    const net = fetch(r).then(res => { if (res.ok) { const c = res.clone(); caches.open(V).then(x => x.put(r, c)); } return res; }).catch(() => hit);
    return hit || net;
  }));
});
