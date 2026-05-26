<!-- App.vue -->
<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import Toaster from '@/components/ui/feedback/Toaster.vue'
import { computed } from 'vue'
import { Cache } from '@/services/cachemanager'

const route = useRoute()
const isAdmin = computed(() => route.path.startsWith('/admin'))
</script>

<template>
  <div v-if="isAdmin" class="min-h-screen bg-[#0A0A0F]">
    <RouterView />
  </div>
  <div v-else class="min-h-screen flex flex-col selection:bg-[#3B82F6]/30">
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