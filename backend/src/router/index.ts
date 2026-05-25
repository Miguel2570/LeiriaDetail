import { createRouter, createWebHistory } from 'vue-router'
import { Cache } from '@/services/cachemanager'

// Layout
import DashboardLayout from '../page/components/layout/DashboardLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../page/auth/AuthPage.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/dashboard'
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../page/dashboard/DashboardOverview.vue'),
          meta: { title: 'Dashboard' }
        },
        {
          path: 'crm',
          name: 'crm',
          component: () => import('../page/dashboard/CrmDashboard.vue'),
          meta: { title: 'CRM' }
        },
        {
          path: 'financial',
          name: 'financial',
          component: () => import('../page/dashboard/FinancialOverview.vue'),
          meta: { title: 'Financeiro' }
        },
        {
          path: 'appointments',
          name: 'appointments',
          component: () => import('../page/appointments/MasterSlotControl.vue'),
          meta: { title: 'Agendamentos' }
        },
        {
          path: 'services',
          name: 'services',
          component: () => import('../page/services/ServiceManager.vue'),
          meta: { title: 'Serviços' }
        },
        {
          path: 'staff',
          name: 'staff',
          component: () => import('../page/staff/StaffManagement.vue'),
          meta: { title: 'Funcionários' }
        },
        {
          path: 'inventory',
          name: 'inventory',
          component: () => import('../page/inventory/InventoryDashboard.vue'),
          meta: { title: 'Inventário' }
        }
      ]
    },
    {
      path: '/error',
      name: 'ErrorPage',
      component: () => import('../../../frontend/src/page/Error.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard'
    }
  ]
})

// Função para verificar autenticação usando o Cache
const isAuthenticated = (): boolean => {
  // Verifica se existe sessão no Cache
  return !!(Cache.Session.value && Cache.Session.value !== '')
}

// Guard de navegação
router.beforeEach((to, from) => {
  const authenticated = isAuthenticated()
  
  // Atualizar título da página
  if (to.meta?.title) {
    document.title = `LeiriaDetail | ${to.meta.title}`
  } else {
    document.title = 'LeiriaDetail'
  }
  
  // Verificar autenticação
  if (to.meta.requiresAuth && !authenticated) {
    return '/login'
  }
  
  if (to.path === '/login' && authenticated) {
    return '/dashboard'
  }
  
  return true
})

export default router