<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import Toaster from '@/components/ui/feedback/Toaster.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col selection:bg-[#3B82F6]/30">
    
    <Navbar class="navbar-glass" />

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
@reference "@/style.css";

.rounded-xl {
  border-radius: var(--radius);
}

.page-enter-active, .page-leave-active {
  transition: opacity 0.2s ease;
}
.page-enter-from, .page-leave-to {
  opacity: 0;
}
</style>