import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/video/:id',
    name: 'video',
    component: () => import('@/views/VideoPage.vue'),
  },
  {
    path: '/farm',
    name: 'farm',
    component: () => import('@/views/FarmPage.vue'),
  },
  {
    path: '/coin',
    name: 'coin',
    component: () => import('@/views/CoinPage.vue'),
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/SettingsPage.vue'),
  },
  {
    path: '/t/:tag',
    name: 'tag',
    component: () => import('@/views/TagFeed.vue'),
  },
  {
    path: '/c/:author',
    name: 'channel',
    component: () => import('@/views/ChannelPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
