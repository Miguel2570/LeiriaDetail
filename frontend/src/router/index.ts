// src/router/index.ts (UNIFICADO)
import { createRouter, createWebHistory } from 'vue-router'
import { Cache } from '@/services/cachemanager'

const ALLOWED_ROLES = ['superadmin', 'admin', 'manager', 'operator']

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    // ===== ROTAS PÚBLICAS (CLIENTES) =====
    { path: '/', name: 'home', component: () => import('@/page/Home.vue') },
    
    // Auth - Clientes
    { path: '/login', name: 'login', component: () => import('@/page/auth/Login.vue') },
    { path: '/registar', name: 'register', component: () => import('@/page/auth/Register.vue') },

    // Pagamento
    { path: '/pagamento/:bookingId', name: 'payment', component: () => import('@/page/payment/PaymentPage.vue') },

    // Agendamento
    { path: '/agenda', alias: ['/booking', '/marcacao'], name: 'booking', component: () => import('@/page/agenda/Booking.vue') },
    
    // Área Cliente
    { path: '/client-area', alias: ['/clientarea'], name: 'client-area', component: () => import('@/page/profile/ClientArea.vue') },
    
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
    { path: '/error', name: 'error', component: () => import('@/page/Error.vue'), props: true },
    { path: '/error-page', name: 'ErrorPage', component: () => import('@/page/Error.vue'), props: true },

    // ===== ROTAS ADMIN =====
    {
      path: '/admin',
      component: () => import('@/portaladmin/page/components/layout/DashboardLayout.vue'),
      children: [
        // Login admin - SEM requiresRole (qualquer um pode ver)
        { path: 'login', component: () => import('@/portaladmin/page/auth/AuthPage.vue') },
        // Dashboard - COM requiresRole
        { path: '', redirect: '/admin/dashboard' },
        { path: 'dashboard', name: 'admin-dashboard', component: () => import('@/portaladmin/page/dashboard/DashboardOverview.vue'), meta: { requiresRole: ALLOWED_ROLES, title: 'Dashboard' } },
        { path: 'crm', name: 'admin-crm', component: () => import('@/portaladmin/page/crm/CRMManager.vue'), meta: { requiresRole: ALLOWED_ROLES, title: 'CRM' } },
        { path: 'financial', name: 'admin-financial', component: () => import('@/portaladmin/page/financial/Financial.vue'), meta: { requiresRole: ALLOWED_ROLES, title: 'Financeiro' } },
        { path: 'appointments', name: 'admin-appointments', component: () => import('@/portaladmin/page/appointments/MasterSlotControl.vue'), meta: { requiresRole: ALLOWED_ROLES, title: 'Agendamentos' } },
        { path: 'services', name: 'admin-services', component: () => import('@/portaladmin/page/services/ServiceManager.vue'), meta: { requiresRole: ALLOWED_ROLES, title: 'Serviços' } },
        { path: 'staff', name: 'admin-staff', component: () => import('@/portaladmin/page/staff/StaffManagement.vue'), meta: { requiresRole: ALLOWED_ROLES, title: 'Funcionários' } },
        { path: 'inventory', name: 'admin-inventory', component: () => import('@/portaladmin/page/inventory/InventoryDashboard.vue'), meta: { requiresRole: ALLOWED_ROLES, title: 'Inventário' } },
        { path: 'profile', name: 'admin-profile', component: () => import('@/portaladmin/page/profile/ProfilePage.vue'), meta: { requiresRole: ALLOWED_ROLES, title: 'Perfil' } },
      ]
    },

    // 404
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

// Router Guard
router.beforeEach(async (to, from, next) => {
  if (to.meta?.title) {
    document.title = `LeiriaDetail | ${to.meta.title}`
  } else {
    document.title = 'LeiriaDetail'
  }

  // Sem requiresRole → deixar passar
  if (!to.meta.requiresRole) {
    next()
    return
  }

  const sessionKey = Cache.Session?.value
  if (!sessionKey) {
    next('/admin/login')
    return
  }

  try {
    const response = await fetch('/Authentication/Role', {
      headers: { 'Session-Key': sessionKey }
    })
    const data = await response.json()
    const allowedRoles = to.meta.requiresRole as string[]
    
    // Customer → bloqueado
    if (data.role === 'customer' || !allowedRoles.includes(data.role)) {
      next('/')
      return
    }
    next()
  } catch {
    next('/admin/login')
  }
})

export default router