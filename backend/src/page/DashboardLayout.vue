<template>
  <div class="size-full bg-[#0A0A0F] flex gap-6 p-6 overflow-auto font-[Inter]">
    <Sidebar />
    <div class="flex-1 flex flex-col overflow-auto bg-transparent rounded-2xl">
      <!-- Header com logout -->
      <div class="flex justify-end p-4">
        <button 
          @click="handleLogout"
          class="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all flex items-center gap-2"
        >
          <LogOut class="w-4 h-4" />
          Logout
        </button>
      </div>
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { LogOut } from 'lucide-vue-next'
import Sidebar from './Sidebar.vue'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { logout } = useAuth()

const handleLogout = () => {
  logout()
  router.push('/login')
}
</script>