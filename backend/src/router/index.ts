// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Importação dos componentes
import DashboardLayout from '../page/DashboardLayout.vue'
import AuthPage from '../page/AuthPage.vue'
import DashboardOverview from '../page/DashboardOverview.vue'
import MasterSlotControl from '../page/MasterSlotControl.vue'
import StaffManagement from '../page/StaffManagement.vue'
import ServiceManager from '../page/ServiceManager.vue'
import CrmDashboard from '../page/CrmDashboard.vue'
import InventoryDashboard from '../page/InventoryDashboard.vue'
import FinancialOverview from '../page/FinancialOverview.vue'

// Import do composable de autenticação
import { useAuth } from '../composables/useAuth'

// Função de proteção de rotas
const requireAuth = (to: any, from: any, next: any) => {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated.value) {
    next('/login')
  } else {
    next()
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: AuthPage,
    // Se já estiver logado, redireciona para dashboard
    beforeEnter: (to, from, next) => {
      const { isAuthenticated } = useAuth()
      if (isAuthenticated.value) {
        next('/')
      } else {
        next()
      }
    }
  },
  {
    path: '/',
    component: DashboardLayout,
    beforeEnter: requireAuth,
    children: [
      { path: '', name: 'Dashboard', component: DashboardOverview },
      { path: 'agenda', name: 'Agenda', component: MasterSlotControl },
      { path: 'roles', name: 'Roles', component: StaffManagement },
      { path: 'services', name: 'Services', component: ServiceManager },
      { path: 'crm', name: 'CRM', component: CrmDashboard },
      { path: 'inventory', name: 'Inventory', component: InventoryDashboard },
      { path: 'finances', name: 'Finances', component: FinancialOverview }
    ]
  },
  // Rota para redirecionar rotas não encontradas
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard global de navegação (opcional, alternativa ao beforeEnter)
router.beforeEach((to, from, next) => {
  const { isAuthenticated, checkAuth } = useAuth()
  
  // Verificar autenticação no localStorage ao iniciar
  checkAuth()
  
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated.value) {
    next('/')
  } else {
    next()
  }
})

export default router