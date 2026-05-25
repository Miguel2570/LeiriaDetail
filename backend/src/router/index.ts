import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/page/Dashboard.vue'

const routes = [
  { path: '/', name: 'dashboard', component: Dashboard },
  { path: '/bookings', component: () => import('@/page/Bookings.vue') },
  { path: '/services', component: () => import('@/page/Services.vue') },
  { path: '/materials', component: () => import('@/page/Materials.vue') },
  { path: '/portfolio', component: () => import('@/page/Portfolio.vue') },
  { path: '/faqs', component: () => import('@/page/Faqs.vue') },
  { path: '/contacts', component: () => import('@/page/Contacts.vue') },
  { path: '/reviews', component: () => import('@/page/Reviews.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router