import { createRouter, createWebHistory } from 'vue-router';

import Home from '@/page/Home.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },

  // Auth
  {
    path: '/login',
    name: 'login',
    component: () => import('@/page/auth/Login.vue'),
  },
  {
    path: '/registar',
    name: 'register',
    component: () => import('@/page/auth/Register.vue'),
  },

  // Agendamento
  {
    path: '/agenda',
    alias: ['/booking', '/marcacao'],
    name: 'booking',
    component: () => import('@/page/agenda/Booking.vue'),
  },

  // Área Cliente (apenas uma rota)
  {
    path: '/client-area',
    alias: ['/clientarea'],
    name: 'client-area',
    component: () => import('@/page/profile/ClientArea.vue'),
  },

  // Páginas Públicas
  { path: '/sobre', component: () => import('@/page/About.vue') },
  { path: '/contacto', component: () => import('@/page/Contact.vue') },
  { path: '/servicos', component: () => import('@/page/services/Services.vue') },
  { path: '/precos', component: () => import('@/page/services/Pricing.vue') },
  { path: '/portfolio', component: () => import('@/page/Portfolio.vue') },
  { path: '/materiais', component: () => import('@/page/MaterialsList.vue') },
  { path: '/faq', component: () => import('@/components/sections/FAQ.vue') },

  // Legal
  { path: '/privacidade', component: () => import('@/page/legal/Privacy.vue') },
  { path: '/termos', component: () => import('@/page/legal/Terms.vue') },
  { path: '/cookies', component: () => import('@/page/legal/Cookies.vue') },

  // Erro
  {
    path: '/error',
    name: 'error',
    component: () => import('@/page/Error.vue'),
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

export default router;