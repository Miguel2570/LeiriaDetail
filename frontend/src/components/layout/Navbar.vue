<template>
  <nav class="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-white/30 shadow-lg transition-all duration-300">
    <div class="container mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
      
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-2 sm:gap-3 group">
        <img 
          src="../../assets/img/Logo.png" 
          alt="LeiriaDetail" 
          class="h-8 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
        />
        <span class="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
          LeiriaDetail
        </span>
      </router-link>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center gap-6 lg:gap-10">
        <router-link 
          v-for="link in navLinks" 
          :key="link.path" 
          :to="link.path" 
          class="relative text-[11px] font-bold uppercase tracking-widest text-slate-700 hover:text-[#3B82F6] transition-all duration-300 group"
          active-class="text-[#3B82F6]"
        >
          {{ link.name }}
          <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] transition-all duration-300 group-hover:w-full"></span>
        </router-link>
      </div>

      <!-- Right Side Buttons -->
      <div class="flex items-center gap-2 sm:gap-4">
        <template v-if="isLoggedIn">
          <!-- Perfil - mesmo estilo hover dos outros links -->
          <router-link 
            to="/client-area" 
            class="relative text-[11px] font-bold uppercase tracking-widest text-slate-700 hover:text-[#3B82F6] transition-all duration-300 group flex items-center gap-1.5"
            active-class="text-[#3B82F6]"
          >
            <User class="h-4 w-4" /> 
            Perfil
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] transition-all duration-300 group-hover:w-full"></span>
          </router-link>
          
          <!-- Sair -->
          <button 
            @click="handleLogout"
            class="relative text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 transition-all duration-300 group"
          >
            Sair
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-400 transition-all duration-300 group-hover:w-full"></span>
          </button>
        </template>
        <template v-else>
          <router-link 
            to="/login" 
            class="relative text-[11px] font-bold uppercase tracking-widest text-slate-600 hover:text-[#3B82F6] transition-all duration-300 group"
          >
            Entrar
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] transition-all duration-300 group-hover:w-full"></span>
          </router-link>
          <router-link to="/agenda">
            <Button class="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white border-none font-bold text-[11px] uppercase tracking-widest px-4 sm:px-6 py-2 sm:py-5 shadow-md hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105">
              Agendar
            </Button>
          </router-link>
        </template>

        <!-- Mobile Menu Button -->
        <button 
          @click="isMenuOpen = !isMenuOpen" 
          class="md:hidden p-2 text-slate-600 hover:text-[#3B82F6] transition-colors duration-300"
          :aria-label="isMenuOpen ? 'Fechar menu' : 'Abrir menu'"
        >
          <Menu v-if="!isMenuOpen" class="h-5 w-5 sm:h-6 sm:w-6" />
          <X v-else class="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition 
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="isMenuOpen" class="md:hidden bg-white/95 backdrop-blur-lg border-t border-white/30 shadow-xl">
        <div class="p-4 space-y-3">
          <router-link 
            v-for="link in navLinks" 
            :key="link.path" 
            :to="link.path" 
            @click="closeMenu" 
            class="block py-3 text-sm font-bold uppercase tracking-widest text-slate-700 hover:text-[#3B82F6] hover:pl-2 transition-all duration-300 border-b border-slate-100"
          >
            {{ link.name }}
          </router-link>
          
          <template v-if="isLoggedIn">
            <router-link 
              to="/client-area" 
              @click="closeMenu"
              class="block py-3 text-sm font-bold uppercase tracking-widest text-slate-700 hover:text-[#3B82F6] hover:pl-2 transition-all duration-300 border-b border-slate-100"
            >
              👤 Perfil
            </router-link>
            <button 
              @click="handleLogout"
              class="block w-full text-left py-3 text-sm font-bold uppercase tracking-widest text-red-400 hover:text-red-500 hover:pl-2 transition-all duration-300"
            >
              🚪 Sair
            </button>
          </template>
          
          <router-link 
            v-if="!isLoggedIn" 
            to="/login" 
            @click="closeMenu"
            class="block py-3 text-sm font-bold uppercase tracking-widest text-slate-600 hover:text-[#3B82F6] hover:pl-2 transition-all duration-300"
          >
            Entrar
          </router-link>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { User, Menu, X } from 'lucide-vue-next';
import Button from '@/components/ui/forms/Button.vue'
import { Cache } from '@/services/cachemanager';

const isMenuOpen = ref(false);
const router = useRouter();
const isLoggedIn = computed(() => !!Cache.Session.value);

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Serviços', path: '/servicos' },
  { name: 'Preços', path: '/precos' },
  //{ name: 'Portfólio', path: '/portfolio' },
  { name: 'Sobre', path: '/sobre' },
  { name: 'Contactos', path: '/contacto' },
];

const closeMenu = () => {
  isMenuOpen.value = false;
};

onMounted(() => {
  console.log('🔍 Navbar montada - Logged in?', isLoggedIn.value);
  console.log('🔑 Session:', Cache.Session.value);
  console.log('👤 User:', Cache.UserName.value);
});

const handleLogout = async () => {
  Cache.clearAuth();
  router.push('/');
};
</script>