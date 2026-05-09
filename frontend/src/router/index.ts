import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/page/Home.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  // Unificamos tudo para /agenda e adicionamos ALIASES para os outros nomes funcionarem
  { 
    path: '/agenda', 
    alias: ['/booking', '/marcacao'], 
    name: 'booking', 
    component: () => import('@/page/agenda/Booking.vue') 
  },
  { path: '/sobre', component: () => import('@/page/About.vue') },
  { path: '/contacto', component: () => import('@/page/Contact.vue') },
  { path: '/servicos', component: () => import('@/page/services/Services.vue') },
  { path: '/precos', component: () => import('@/page/Pricing.vue') },
  { path: '/portfolio', component: () => import('@/page/Portfolio.vue') },
  // Páginas Legais
  { path: '/privacidade', component: () => import('@/page/legal/Privacy.vue') },
  { path: '/termos', component: () => import('@/page/legal/Terms.vue') },
  { path: '/cookies', component: () => import('@/page/legal/Cookies.vue') },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

export default router