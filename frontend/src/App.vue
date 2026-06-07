<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import Toaster from '@/components/ui/feedback/Toaster.vue'
import { computed } from 'vue'

const route = useRoute()
const isAdmin = computed(() => route.path.startsWith('/admin'))
</script>

<template>
  <div v-if="isAdmin" class="min-h-screen bg-[#0A0A0F]">
    <RouterView />
  </div>
  
  <div v-else class="min-h-screen flex flex-col bg-[#0A0A0F] selection:bg-[#3B82F6]/30">
    <Navbar />
    <main class="flex-grow">
      <RouterView v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
    <Footer />
    <Toaster />
  </div>
</template>

<style>
/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Base body styles */
body {
  background-color: #0A0A0F;
  color: #FFFFFF;
}

/* Section spacing defaults */
section {
  position: relative;
  z-index: 1;
}

/* Container max-width consistency */
.container {
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
}
</style>