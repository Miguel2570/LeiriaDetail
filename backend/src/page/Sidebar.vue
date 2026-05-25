<template>
  <div class="w-64 h-full p-6 flex flex-col backdrop-blur-[30px]" :style="sidebarStyle">
    <div class="mb-8">
      <h1 class="text-2xl font-[Poppins] font-bold text-[#000000]">LeiriaDetail</h1>
      <p class="text-[#334155] font-medium mt-1">Super Admin</p>
    </div>

    <nav class="space-y-2 flex-1">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold"
        active-class="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white shadow-[0_0_12px_rgba(59,130,246,0.5)]"
        inactive-class="text-[#334155] hover:text-[#000000] hover:bg-black/5"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { LayoutDashboard, Calendar, Users, Wrench, Database, Package, DollarSign } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Calendar, label: 'Master Agenda', path: '/agenda' },
  { icon: Users, label: 'User Roles', path: '/roles' },
  { icon: Wrench, label: 'Service Manager', path: '/services' },
  { icon: Database, label: 'CRM & Vehicle History', path: '/crm' },
  { icon: Package, label: 'Inventory', path: '/inventory' },
  { icon: DollarSign, label: 'Finances', path: '/finances' },
]

const sidebarStyle = {
  background: 'linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2)), #FFFFFF',
  boxShadow: '0 0 12px 0 rgba(0, 0, 0, 0.7)',
  borderRadius: '16px',
}
</script>