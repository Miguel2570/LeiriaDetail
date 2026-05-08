import { createRouter, createWebHistory } from 'vue-router';
import Home from '../page/Home.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/sobre', component: () => import('../page/About.vue') }, 
  { path: '/servicos', component: () => import('../page/services/Services.vue') }, 
  { path: '/precos', component: () => import('../page/Pricing.vue') },
  { path: '/portfolio', component: () => import('../page/Portfolio.vue') },
  { path: '/marcacao', component: () => import('../page/agenda/Booking.vue') },
  { path: '/login', component: () => import('../page/auth/Login.vue') },
  { path: '/registar', component: () => import('../page/auth/Register.vue') },
  { path: '/clientarea', component: () => import('../page/ClientArea.vue') },
  { path: '/contacto', component: () => import('../page/Contact.vue') },
  
  { path: '/privacidade', component: () => import('../page/legal/Privacy.vue') },
  { path: '/termos', component: () => import('../page/legal/Terms.vue') },
  { path: '/cookies', component: () => import('../page/legal/Cookies.vue') }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;