<script setup lang="ts">
import { ref } from 'vue';
import { User, Menu, X } from 'lucide-vue-next';
import Button from '@/components/ui/forms/Button.vue'

const isMenuOpen = ref(false);
const isLoggedIn = ref(false);

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Serviços', path: '/servicos' },
  { name: 'Preços', path: '/precos' },
  { name: 'Portfólio', path: '/portfolio' },
  { name: 'Sobre', path: '/sobre' },
  { name: 'Contactos', path: '/contacto' },
];
</script>

<template>
  <nav class="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
    <div class="container mx-auto px-6 h-20 flex items-center justify-between">
      
      <router-link to="/" class="flex items-center gap-3 group">
        <img src="../../assets/img/Logo.png" alt="LeiriaDetail" class="h-12 w-auto object-contain transition-transform group-hover:scale-105" />
        <span class="font-bold text-lg tracking-tight bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
          LeiriaDetail
        </span>
      </router-link>

      <div class="hidden md:flex items-center gap-10">
        <router-link 
          v-for="link in navLinks" 
          :key="link.path" 
          :to="link.path" 
          class="text-[11px] font-bold uppercase tracking-widest text-slate-600 hover:text-[#3B82F6] transition-all"
        >
          {{ link.name }}
        </router-link>
      </div>

      <div class="flex items-center gap-4">
        <template v-if="isLoggedIn">
          <router-link to="/clientarea">
            <Button variant="ghost" size="sm" class="gap-2 text-[11px] font-bold uppercase tracking-widest">
              <User class="h-4 w-4" /> Área Cliente
            </Button>
          </router-link>
        </template>
        <template v-else>
          <router-link to="/login" class="hidden md:block text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-[#3B82F6] transition-colors">
            Entrar
          </router-link>
          <router-link to="/agenda">
            <Button class="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white border-none font-bold text-[11px] uppercase tracking-widest px-6 py-5">
              Agendar
            </Button>
          </router-link>
        </template>

        <button @click="isMenuOpen = !isMenuOpen" class="md:hidden p-2 text-slate-600">
          <Menu v-if="!isMenuOpen" class="h-6 w-6" />
          <X v-else class="h-6 w-6" />
        </button>
      </div>
    </div>

    <div v-if="isMenuOpen" class="md:hidden bg-white border-t border-slate-100 p-6 space-y-4 shadow-xl">
      <router-link 
        v-for="link in navLinks" :key="link.path" :to="link.path" 
        @click="isMenuOpen = false" 
        class="block text-sm font-bold uppercase tracking-widest text-slate-600"
      >
        {{ link.name }}
      </router-link>
    </div>
  </nav>
</template>