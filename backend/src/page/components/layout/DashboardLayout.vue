<!-- src/components/layout/DashboardLayout.vue -->
<script setup lang="ts">
import Sidebar from './Sidebar.vue'
</script>

<template>
  <div class="h-screen w-full bg-[#0A0A0F] flex gap-6 p-6 overflow-hidden font-[Inter]">
    <Sidebar />
    
    <div class="flex-1 flex flex-col overflow-auto bg-transparent rounded-2xl relative">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>