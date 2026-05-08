<script setup lang="ts">
import { User } from 'lucide-vue-next';
</script>

<template>
  <nav class="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
    <div class="container mx-auto px-4 h-16 flex items-center justify-between">
      <router-link to="/" class="text-2xl font-black bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
        LeiriaDetail
      </router-link>
      <div class="hidden md:flex items-center gap-8 text-sm font-medium">
        <router-link to="/servicos">Serviços</router-link>
        <router-link to="/precos">Preços</router-link>
        <router-link to="/portfolio">Portfólio</router-link>
      </div>
      <div class="flex items-center gap-4">
        <router-link to="/login" class="text-sm font-medium">Entrar</router-link>
        <router-link to="/marcacao" class="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white px-5 py-2 rounded-lg font-bold">
          Agendar
        </router-link>
      </div>
    </div>
  </nav>
</template>