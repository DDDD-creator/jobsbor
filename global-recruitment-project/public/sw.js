/**
 * Jobsbor PWA Service Worker
 * 提供离线访问、缓存策略和后台同步功能
 */

const CACHE_NAME = 'jobsbor-v1'
const STATIC_ASSETS = [
  '/',
  '/jobs',
  '/favorites',
  '/applications',
  '/alerts',
  '/companies',
  '/about',
  '/guide',
  '/tools',
]

// 安装阶段：缓存静态资源
self.addEventListener('install', (event) => {
  console.log('[SW] Install event')
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets')
      return cache.addAll(STATIC_ASSETS)
    })
  )
  
  // 立即激活新的 Service Worker
  self.skipWaiting()
})

// 激活阶段：清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  
  // 立即接管所有客户端
  self.clients.claim()
})

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // 跳过非 GET 请求和第三方请求
  if (request.method !== 'GET' || !url.pathname.startsWith('/')) {
    return
  }
  
  // API 请求：网络优先，失败时返回缓存
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request))
    return
  }
  
  // 页面请求：缓存优先，失败时回退网络
  if (request.mode === 'navigate') {
    event.respondWith(cacheFirst(request))
    return
  }
  
  // 静态资源：缓存优先
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/) ||
    url.pathname.startsWith('/_next/')
  ) {
    event.respondWith(cacheFirst(request))
    return
  }
  
  // 其他请求：网络优先
  event.respondWith(networkFirst(request))
})

// 缓存优先策略
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request)
  
  if (cachedResponse) {
    // 在后台更新缓存
    fetch(request).then((response) => {
      if (response.ok) {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, response)
        })
      }
    }).catch(() => {
      // 网络请求失败，使用缓存
    })
    
    return cachedResponse
  }
  
  // 缓存未命中，从网络获取
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    // 网络失败，返回离线页面
    if (request.mode === 'navigate') {
      return caches.match('/offline')
    }
    throw error
  }
}

// 网络优先策略
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // 更新缓存
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    // 网络失败，尝试缓存
    const cachedResponse = await caches.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // 没有缓存，抛出错误
    throw error
  }
}

// 后台同步（用于离线时的数据提交）
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('[SW] Background sync event')
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  // 处理离线时存储的数据
  // 例如：表单提交、收藏操作等
  console.log('[SW] Processing background sync')
}

// 推送通知
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    
    const options = {
      body: data.body || '您有新的职位推荐',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      data: data.data || {},
      actions: data.actions || [],
      requireInteraction: true,
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Jobsbor', options)
    )
  }
})

// 通知点击
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  const url = event.notification.data?.url || '/'
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // 如果已经有打开的窗口，聚焦它
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus()
        }
      }
      
      // 否则打开新窗口
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})

// 消息处理（来自主线程）
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
