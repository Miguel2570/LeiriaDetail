<template>
  <div 
    class="w-64 h-full p-6 flex flex-col backdrop-blur-[30px] overflow-y-auto" 
    style="background: linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2)), #FFFFFF; box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.7); border-radius: 16px;"
  >
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-[#000000]">LeiriaDetail</h1>
      <p class="text-[#334155] font-medium mt-1">Super Admin</p>
    </div>

    <nav class="space-y-4 flex-1">
      
      <!-- ====== PRINCIPAL ====== -->
      <div>
        <p class="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2 px-2">Principal</p>
        <router-link to="/admin/dashboard" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-semibold text-[#64748B] hover:text-[#000000] hover:bg-[#F1F5F9]" active-class="bg-[#E0F2FE] text-[#0284C7] shadow-sm">
          <LayoutDashboard class="w-4 h-4" /> Dashboard
        </router-link>
      </div>

      <!-- ====== OPERAÇÕES ====== -->
      <div>
        <p class="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2 px-2">Operações</p>
        <router-link to="/admin/appointments" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-semibold text-[#64748B] hover:text-[#000000] hover:bg-[#F1F5F9]" active-class="bg-[#E0F2FE] text-[#0284C7] shadow-sm">
          <Calendar class="w-4 h-4" /> Agenda
        </router-link>
        <router-link to="/admin/crm" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-semibold text-[#64748B] hover:text-[#000000] hover:bg-[#F1F5F9]" active-class="bg-[#E0F2FE] text-[#0284C7] shadow-sm">
          <Database class="w-4 h-4" /> CRM
        </router-link>
        <router-link to="/admin/services" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-semibold text-[#64748B] hover:text-[#000000] hover:bg-[#F1F5F9]" active-class="bg-[#E0F2FE] text-[#0284C7] shadow-sm">
          <Wrench class="w-4 h-4" /> Serviços
        </router-link>
        <router-link to="/admin/registos" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-semibold text-[#64748B] hover:text-[#000000] hover:bg-[#F1F5F9]" active-class="bg-[#E0F2FE] text-[#0284C7] shadow-sm">
          <ClipboardList class="w-4 h-4" /> Registos
        </router-link>
      </div>

      <!-- ====== MARKETING ====== -->
      <div>
        <p class="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2 px-2">Marketing</p>
        <router-link to="/admin/portfolio" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-semibold text-[#64748B] hover:text-[#000000] hover:bg-[#F1F5F9]" active-class="bg-[#E0F2FE] text-[#0284C7] shadow-sm">
          <Camera class="w-4 h-4" /> Portfolio
        </router-link>
      </div>

      <!-- ====== FINANCEIRO ====== -->
      <div>
        <p class="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2 px-2">Financeiro</p>
        <router-link to="/admin/financial" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-semibold text-[#64748B] hover:text-[#000000] hover:bg-[#F1F5F9]" active-class="bg-[#E0F2FE] text-[#0284C7] shadow-sm">
          <DollarSign class="w-4 h-4" /> Finanças
        </router-link>
        <router-link to="/admin/inventory" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-semibold text-[#64748B] hover:text-[#000000] hover:bg-[#F1F5F9]" active-class="bg-[#E0F2FE] text-[#0284C7] shadow-sm">
          <Package class="w-4 h-4" /> Inventário
        </router-link>
      </div>

      <!-- ====== ADMINISTRAÇÃO ====== -->
      <div>
        <p class="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2 px-2">Administração</p>
        <router-link to="/admin/staff" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-semibold text-[#64748B] hover:text-[#000000] hover:bg-[#F1F5F9]" active-class="bg-[#E0F2FE] text-[#0284C7] shadow-sm">
          <Users class="w-4 h-4" /> Staff
        </router-link>
        <router-link to="/admin/audit" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-semibold text-[#64748B] hover:text-[#000000] hover:bg-[#F1F5F9]" active-class="bg-[#E0F2FE] text-[#0284C7] shadow-sm">
          <ShieldAlert class="w-4 h-4" /> Auditoria
        </router-link>
        <router-link to="/admin/holidays" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-semibold text-[#64748B] hover:text-[#000000] hover:bg-[#F1F5F9]" active-class="bg-[#E0F2FE] text-[#0284C7] shadow-sm">
          <CalendarOff class="w-4 h-4" /> Feriados
        </router-link>
      </div>

      <!-- ====== CONTA ====== -->
      <div>
        <p class="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2 px-2">Conta</p>
        <router-link to="/admin/profile" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-semibold text-[#64748B] hover:text-[#000000] hover:bg-[#F1F5F9]" active-class="bg-[#E0F2FE] text-[#0284C7] shadow-sm">
          <User class="w-4 h-4" /> Perfil
        </router-link>
      </div>
    </nav>
    
    <div class="pt-4 border-t border-gray-200 mt-4">
      <button @click="logout" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">
        <LogOut class="w-4 h-4" /> Terminar Sessão
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Cache } from '@/services/cachemanager'
import { 
  LayoutDashboard, Calendar, Users, Wrench, Database, 
  Package, DollarSign, LogOut, User, ShieldAlert, CalendarOff, Camera, ClipboardList 
} from 'lucide-vue-next'


const router = useRouter()

const logout = () => {
  Cache.clearAuth()
  router.push('/login')
}
</script>