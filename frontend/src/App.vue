<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import Toaster from '@/components/ui/Toaster.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white selection:bg-[#3B82F6]/30">
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
/* Definição das variáveis globais do LeiriaDetail */
:root {
  --primary: #3B82F6;
  --secondary: #06B6D4;
  --radius: 1rem; /* 16px para arredondamento XL */
  --font-sans: 'Inter', system-ui, sans-serif;
}

/* Aplica o arredondamento global configurado */
.rounded-xl {
  border-radius: var(--radius);
}

/* Estilo para os botões principais (Gradient) */
.btn-primary {
  @apply bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-bold py-2 px-6 rounded-lg 
         transition-all hover:opacity-90 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95;
}

/* Gradiente de texto LeiriaDetail */
.text-leiria-gradient {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-[#3B82F6] to-[#06B6D4];
}

/* Efeito de Glassmorphism para a Navbar */
.navbar-glass {
  @apply bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100;
}

/* Animação de troca de página */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>