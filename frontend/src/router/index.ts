import { createRouter, createWebHistory } from 'vue-router'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

// 1. Importação dos Layouts/Templates (Se usares um shell global)
// Se não tiveres um Template.vue, a maioria das páginas irá direto para o App.vue
import Home from '@/page/Home.vue'

// 2. Definição dos Grupos de Rotas
const routes_general = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { title: 'LeiriaDetail | Home' }
  },
  {
    path: '/servicos',
    name: 'services',
    component: () => import('@/page/services/Services.vue'),
    meta: { title: 'Nossos Serviços' }
  },
  {
    path: '/precos',
    name: 'pricing',
    component: () => import('@/page/Pricing.vue'),
    meta: { title: 'Tabela de Preços' }
  },
  {
    path: '/portfolio',
    name: 'portfolio',
    component: () => import('@/page/Portfolio.vue'),
    meta: { title: 'Portfólio de Trabalhos' }
  }
];

const routes_booking = [
  {
    path: '/agenda',
    name: 'booking',
    // Onde criámos a tua página de agendamento premium
    component: () => import('@/page/agenda/Booking.vue'),
    meta: { 
      title: 'Agendamento Online',
      requiresDarkTheme: true // Flag para sabermos que esta página é Dark Mode
    }
  }
];

const routes_authentication = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/page/auth/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/registo',
    name: 'register',
    component: () => import('@/page/auth/Register.vue'),
    meta: { requiresAuth: false }
  }
];
/*
const routes_errors = [
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/page/errors/NotFound.vue'),
    meta: { title: 'Página não encontrada' }
  }
];
*/
// 3. Junção de todas as rotas
const routes = [
  ...routes_general,
  ...routes_booking,
  ...routes_authentication,
  //...routes_errors
];

// 4. Criação da instância do Router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // Garante que ao mudar de página, o scroll volta ao topo
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// 5. Guardas de Navegação (Middleware)
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  // Atualizar o Título da Aba do Navegador
  const title = to.meta.title as string;
  if (title) {
    document.title = title;
  }

  // Exemplo de verificação de autenticação (simplificado)
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = localStorage.getItem('user_token'); // Exemplo de check

  if (requiresAuth && !isAuthenticated) {
    console.warn('🔒 Acesso negado: Redirecionando para Login');
    return next('/login');
  }

  next();
});

export default router;