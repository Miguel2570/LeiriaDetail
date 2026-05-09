<script setup lang="ts">
import { ref } from 'vue';
import { User, Menu, X, LogOut } from 'lucide-vue-next'; // Mudado de lucide-react
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
  <nav class="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
    <div class="container mx-auto px-4 h-16 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2">
        <div class="h-10 w-10 rounded-lg bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] flex items-center justify-center text-white font-bold text-xl">
          LD
        </div>
        <span class="font-bold text-xl bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
          LeiriaDetail
        </span>
      </router-link>

      <div class="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
        <router-link v-for="link in navLinks" :key="link.path" :to="link.path" class="hover:text-[#3B82F6] transition-colors">
          {{ link.name }}
        </router-link>
      </div>

      <div class="flex items-center gap-4">
        <template v-if="isLoggedIn">
          <router-link to="/clientarea">
            <Button variant="ghost" size="sm" class="gap-2">
              <User class="h-4 w-4" /> Área Cliente
            </Button>
          </router-link>
        </template>
        <template v-else>
          <router-link to="/login" class="hidden md:block text-sm font-medium hover:text-[#3B82F6]">
            Entrar
          </router-link>
          <router-link to="/booking">
            <Button class="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white border-none font-bold hover:opacity-90 transition-opacity">
              Agendar
            </Button>
          </router-link>
        </template>

        <button @click="isMenuOpen = !isMenuOpen" class="md:hidden">
          <Menu v-if="!isMenuOpen" class="h-6 w-6" />
          <X v-else class="h-6 w-6" />
        </button>
      </div>
    </div>

    <div v-if="isMenuOpen" class="md:hidden bg-white border-b p-4 space-y-4">
      <router-link v-for="link in navLinks" :key="link.path" :to="link.path" @click="isMenuOpen = false" class="block text-gray-600">
        {{ link.name }}
      </router-link>
    </div>
  </nav>
</template>