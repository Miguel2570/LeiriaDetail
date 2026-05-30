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
    
    // Recuperação de password
    { path: '/recuperar-password', name: 'forgot-password', component: () => import('@/page/auth/ForgotPassword.vue') },
    { path: '/reset-password', name: 'reset-password', component: () => import('@/page/auth/ResetPassword.vue') },

    // Verificar conta
    { path: '/verify', name: 'VerifyCode', component: () => import('@/page/auth/VerifyCode.vue') },

    // Pagamento
    { path: '/pagamento/:bookingId', name: 'payment', component: () => import('@/page/payment/PaymentPage.vue') },

    // Agendamento
    { path: '/agenda', alias: ['/booking', '/marcacao'], name: 'booking', component: () => import('@/page/agenda/Booking.vue') },
    
    // Área Cliente
    { path: '/client-area', alias: ['/clientarea'], name: 'client-area', component: () => import('@/page/profile/ClientArea.vue') },

    // Portfolio
    { path: '/portfolio/:id', name: 'portfolio-detail', component: () => import('@/page/portfolio/PortfolioDetail.vue') },
    
    // Páginas Públicas
    { path: '/sobre', component: () => import('@/page/About.vue') },
    { path: '/contacto', component: () => import('@/page/Contact.vue') },
    { path: '/servicos', component: () => import('@/page/services/Services.vue') },
    { path: '/precos', component: () => import('@/page/services/Pricing.vue') },
    { path: '/portfolio', component: () => import('@/page/portfolio/Portfolio.vue') },
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
        { path: 'login', component: () => import('@/portaladmin/page/auth/AuthPage.vue') },
        { path: '', redirect: '/admin/dashboard' },
        { path: 'dashboard', name: 'admin-dashboard', component: () => import('@/portaladmin/page/dashboard/DashboardOverview.vue'), meta: { requiresRole: ALLOWED_ROLES, title: 'Dashboard' } },
        { path: 'crm', name: 'admin-crm', component: () => import('@/portaladmin/page/crm/CRMManager.vue'), meta: { requiresRole: ALLOWED_ROLES, title: 'CRM' } },
        { path: 'financial', name: 'admin-financial', component: () => import('@/portaladmin/page/financial/Financial.vue'), meta: { requiresRole: ALLOWED_ROLES, title: 'Financeiro' } },
        { path: 'appointments', name: 'admin-appointments', component: () => import('@/portaladmin/page/appointments/MasterSlotControl.vue'), meta: { requiresRole: ALLOWED_ROLES, title: 'Agendamentos' } },
        { path: 'services', name: 'admin-services', component: () => import('@/portaladmin/page/services/ServiceManager.vue'), meta: { requiresRole: ALLOWED_ROLES, title: 'Serviços' } },
        { path: 'staff', name: 'admin-staff', component: () => import('@/portaladmin/page/staff/StaffManagement.vue'), meta: { requiresRole: ALLOWED_ROLES, title: 'Funcionários' } },
        { path: 'inventory', name: 'admin-inventory', component: () => import('@/portaladmin/page/inventory/InventoryDashboard.vue'), meta: { requiresRole: ALLOWED_ROLES, title: 'Inventário' } },
        { path: 'profile', name: 'admin-profile', component: () => import('@/portaladmin/page/profile/ProfilePage.vue'), meta: { requiresRole: ALLOWED_ROLES, title: 'Perfil' } },
        { path: 'audit', name: 'admin-audit', component: () => import('@/portaladmin/page/audit/AuditLogs.vue'), meta: { requiresRole: ['admin', 'superadmin'], title: 'Auditoria' } },
        { path: 'holidays', name: 'admin-holidays', component: () => import('@/portaladmin/page/holiday/HolidayManager.vue'), meta: { requiresRole: ['admin', 'superadmin'], title: 'Feriados' } },
        { path: 'portfolio', name: 'admin-portfolio', component: () => import('@/portaladmin/page/portfolio/PortfolioManager.vue'), meta: { requiresRole: ALLOWED_ROLES, title: 'Portfolio' } },
        { path: 'registos', name: 'admin-registos', component: () => import('@/portaladmin/page/Registos/RegisterFlow.vue'), meta: { requiresRole: ALLOWED_ROLES, title: 'Registos' } },
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

  if (!to.meta.requiresRole) {
    next()
    return
  }

  const cachedRole = Cache.UserRole?.value
  const allowedRoles = to.meta.requiresRole as string[]
  
  if (cachedRole && allowedRoles.includes(cachedRole)) {
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
    Cache.UserRole.value = data.role
    
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