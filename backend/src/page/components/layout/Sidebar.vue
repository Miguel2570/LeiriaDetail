<template>
  <div 
    class="w-64 h-full p-6 flex flex-col backdrop-blur-[30px]" 
    style="background: linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2)), #FFFFFF; box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.7); border-radius: 16px;"
  >
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-[#000000]">LeiriaDetail</h1>
      <p class="text-[#334155] font-medium mt-1">Super Admin</p>
    </div>

    <nav class="space-y-2 flex-1">
      <router-link
        v-for="(item, idx) in navItems"
        :key="idx"
        :to="item.path"
        class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-[#64748B] hover:text-[#000000] hover:bg-[#F1F5F9]"
        active-class="bg-[#E0F2FE] text-[#0284C7] shadow-sm"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span>{{ item.label }}</span>
      </router-link>
    </nav>
    
    <div class="pt-4 border-t border-gray-200 mt-auto">
      <button 
        @click="logout"
        class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
      >
        <LogOut class="w-5 h-5" />
        <span>Terminar Sessão</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Cache } from '@/services/cachemanager'
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Wrench, 
  Database, 
  Package, 
  DollarSign,
  LogOut
} from 'lucide-vue-next'

const router = useRouter()

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Calendar, label: 'Master Agenda', path: '/appointments' },
  { icon: Users, label: 'User Roles', path: '/staff' },
  { icon: Wrench, label: 'Service Manager', path: '/services' },
  { icon: Database, label: 'CRM & Histórico', path: '/crm' },
  { icon: Package, label: 'Inventário', path: '/inventory' },
  { icon: DollarSign, label: 'Finanças', path: '/financial' },
]

const logout = () => {
  // Limpar o Cache (sessão)
  Cache.clearAuth()
  // Redirecionar para o login
  router.push('/login')
}
</script>