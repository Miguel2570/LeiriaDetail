<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white">
    <Navbar class="navbar-glass" />

    <main class="flex-grow">
      <RouterView />
    </main>

    <Footer />
  </div>
</template>

<style>
/* Aplica o arredondamento global definido no teu ficheiro [cite: 429, 441] */
.rounded-xl {
  border-radius: var(--radius);
}

/* Estilo para os botões principais baseado no teu design [cite: 27, 275] */
.btn-primary {
  @apply bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-bold py-2 px-6 rounded-lg transition-opacity hover:opacity-90;
}

/* Efeito de Glassmorphism para a Navbar [cite: 308] */
.navbar-glass {
  @apply bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100;
}
</style>