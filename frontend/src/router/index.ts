// src/router/index.ts (UNIFICADO)
import { createRouter, createWebHistory } from 'vue-router'
import { Cache } from '@/services/cachemanager'

// ===== IMPORTS DE COMPONENTES =====
import Home from '@/page/Home.vue'
import Login from '@/page/auth/Login.vue'
import Register from '@/page/auth/Register.vue'
import ForgotPassword from '@/page/auth/ForgotPassword.vue'
import ResetPassword from '@/page/auth/ResetPassword.vue'
import VerifyCode from '@/page/auth/VerifyCode.vue'
import PaymentPage from '@/page/payment/PaymentPage.vue'
import Booking from '@/page/agenda/Booking.vue'
import ClientArea from '@/page/profile/ClientArea.vue'
import ErrorPage from '@/page/Error.vue'

// Admin
import DashboardLayout from '@/portaladmin/page/components/layout/DashboardLayout.vue'
import AuthPage from '@/portaladmin/page/auth/AuthPage.vue'
import DashboardOverview from '@/portaladmin/page/dashboard/DashboardOverview.vue'
import CRMManager from '@/portaladmin/page/crm/CRMManager.vue'
import Financial from '@/portaladmin/page/financial/Financial.vue'
import MasterSlotControl from '@/portaladmin/page/appointments/MasterSlotControl.vue'
import ServiceManager from '@/portaladmin/page/services/ServiceManager.vue'
import StaffManagement from '@/portaladmin/page/staff/StaffManagement.vue'
import InventoryDashboard from '@/portaladmin/page/inventory/InventoryDashboard.vue'
import ProfilePage from '@/portaladmin/page/profile/ProfilePage.vue'
import AuditLogs from '@/portaladmin/page/audit/AuditLogs.vue'
import HolidayManager from '@/portaladmin/page/holiday/HolidayManager.vue'
import PortfolioManager from '@/portaladmin/page/portfolio/PortfolioManager.vue'
import RegisterFlow from '@/portaladmin/page/Registos/RegisterFlow.vue'
import SettingsManager from '@/portaladmin/page/settings/SettingsManager.vue'

const ALLOWED_ROLES = ['superadmin', 'admin', 'manager', 'operator']

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    // ===== ROTAS PÚBLICAS (CLIENTES) =====
    { path: '/', name: 'home', component: Home },
    
    // Auth - Clientes
    { path: '/login', name: 'login', component: Login },
    { path: '/registar', name: 'register', component: Register },
    
    // Recuperação de password
    { path: '/recuperar-password', name: 'forgot-password', component: ForgotPassword },
    { path: '/reset-password', name: 'reset-password', component: ResetPassword },

    // Verificar conta
    { path: '/verify', name: 'VerifyCode', component: VerifyCode },

    // Pagamento
    { path: '/pagamento/:bookingId', name: 'payment', component: PaymentPage },

    // Agendamento
    { path: '/agenda', alias: ['/booking', '/marcacao'], name: 'booking', component: Booking },
    
    // Área Cliente
    { path: '/client-area', alias: ['/clientarea'], name: 'client-area', component: ClientArea },

    // Portfolio
    { path: '/portfolio/:id', name: 'portfolio-detail', component: () => import('@/page/portfolio/PortfolioDetail.vue') },
    
    // Páginas Públicas (menos críticas - lazy load)
    { path: '/servicos', component: () => import('@/page/services/Services.vue') },
    { path: '/portfolio', component: () => import('@/page/portfolio/Portfolio.vue') },
    { path: '/materiais', component: () => import('@/page/MaterialsList.vue') },
    
    // Legal
    { path: '/privacidade', component: () => import('@/page/legal/Privacy.vue') },
    { path: '/termos', component: () => import('@/page/legal/Terms.vue') },
    { path: '/cookies', component: () => import('@/page/legal/Cookies.vue') },

    // Erro
    { path: '/error', name: 'error', component: ErrorPage, props: true },
    { path: '/error-page', name: 'ErrorPage', component: ErrorPage, props: true },

    // ===== ROTAS ADMIN =====
    {
      path: '/admin',
      component: DashboardLayout,
      children: [
        { path: 'login', component: AuthPage },
        { path: '', redirect: '/admin/dashboard' },
        { path: 'dashboard', name: 'admin-dashboard', component: DashboardOverview, meta: { requiresRole: ALLOWED_ROLES, title: 'Dashboard' } },
        { path: 'crm', name: 'admin-crm', component: CRMManager, meta: { requiresRole: ALLOWED_ROLES, title: 'CRM' } },
        { path: 'financial', name: 'admin-financial', component: Financial, meta: { requiresRole: ALLOWED_ROLES, title: 'Financeiro' } },
        { path: 'appointments', name: 'admin-appointments', component: MasterSlotControl, meta: { requiresRole: ALLOWED_ROLES, title: 'Agendamentos' } },
        { path: 'services', name: 'admin-services', component: ServiceManager, meta: { requiresRole: ALLOWED_ROLES, title: 'Serviços' } },
        { path: 'staff', name: 'admin-staff', component: StaffManagement, meta: { requiresRole: ALLOWED_ROLES, title: 'Funcionários' } },
        { path: 'inventory', name: 'admin-inventory', component: InventoryDashboard, meta: { requiresRole: ALLOWED_ROLES, title: 'Inventário' } },
        { path: 'profile', name: 'admin-profile', component: ProfilePage, meta: { requiresRole: ALLOWED_ROLES, title: 'Perfil' } },
        { path: 'audit', name: 'admin-audit', component: AuditLogs, meta: { requiresRole: ['admin', 'superadmin'], title: 'Auditoria' } },
        { path: 'holidays', name: 'admin-holidays', component: HolidayManager, meta: { requiresRole: ['admin', 'superadmin'], title: 'Feriados' } },
        { path: 'portfolio', name: 'admin-portfolio', component: PortfolioManager, meta: { requiresRole: ALLOWED_ROLES, title: 'Portfolio' } },
        { path: 'registos', name: 'admin-registos', component: RegisterFlow, meta: { requiresRole: ALLOWED_ROLES, title: 'Registos' } },
        { path: 'settings', name: 'admin-settings', component: SettingsManager, meta: { requiresRole: ['superadmin'], title: 'Configurações' } },
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