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
        <!-- Language Switcher -->
        <div class="flex items-center gap-1 mr-2">
          <button 
            @click="changeLanguage('pt')" 
            :class="locale === 'pt' ? 'text-[#3B82F6] font-bold' : 'text-slate-400'"
            class="text-[10px] uppercase tracking-wider hover:text-[#3B82F6] transition-colors duration-300"
          >
            PT
          </button>
          <span class="text-slate-300 text-xs">|</span>
          <button 
            @click="changeLanguage('en')" 
            :class="locale === 'en' ? 'text-[#3B82F6] font-bold' : 'text-slate-400'"
            class="text-[10px] uppercase tracking-wider hover:text-[#3B82F6] transition-colors duration-300"
          >
            EN
          </button>
        </div>

        <template v-if="isLoggedIn">
          <!-- Perfil -->
          <router-link 
            to="/client-area" 
            class="relative text-[11px] font-bold uppercase tracking-widest text-slate-700 hover:text-[#3B82F6] transition-all duration-300 group flex items-center gap-1.5"
            active-class="text-[#3B82F6]"
          >
            <User class="h-4 w-4" /> 
            {{ t('nav.profile') }}
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] transition-all duration-300 group-hover:w-full"></span>
          </router-link>
          
          <!-- Sair -->
          <button 
            @click="handleLogout"
            class="relative text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 transition-all duration-300 group"
          >
            {{ t('nav.logout') }}
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-400 transition-all duration-300 group-hover:w-full"></span>
          </button>
        </template>
        <template v-else>
          <router-link 
            to="/login" 
            class="relative text-[11px] font-bold uppercase tracking-widest text-slate-600 hover:text-[#3B82F6] transition-all duration-300 group"
          >
            {{ t('nav.login') }}
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] transition-all duration-300 group-hover:w-full"></span>
          </router-link>
          <router-link to="/agenda">
            <Button class="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white border-none font-bold text-[11px] uppercase tracking-widest px-4 sm:px-6 py-2 sm:py-5 shadow-md hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105">
              {{ t('nav.schedule') }}
            </Button>
          </router-link>
        </template>

        <!-- Mobile Menu Button -->
        <button 
          @click="isMenuOpen = !isMenuOpen" 
          class="md:hidden p-2 text-slate-600 hover:text-[#3B82F6] transition-colors duration-300"
          :aria-label="isMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')"
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
          <!-- Mobile Language Switcher -->
          <div class="flex items-center justify-center gap-2 pb-3 border-b border-slate-100">
            <button 
              @click="changeLanguage('pt')" 
              :class="locale === 'pt' ? 'text-[#3B82F6] font-bold' : 'text-slate-400'"
              class="text-sm uppercase tracking-wider hover:text-[#3B82F6] transition-colors"
            >
              🇵🇹 PT
            </button>
            <span class="text-slate-300">|</span>
            <button 
              @click="changeLanguage('en')" 
              :class="locale === 'en' ? 'text-[#3B82F6] font-bold' : 'text-slate-400'"
              class="text-sm uppercase tracking-wider hover:text-[#3B82F6] transition-colors"
            >
              🇬🇧 EN
            </button>
          </div>

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
              👤 {{ t('nav.profile') }}
            </router-link>
            <button 
              @click="handleLogout"
              class="block w-full text-left py-3 text-sm font-bold uppercase tracking-widest text-red-400 hover:text-red-500 hover:pl-2 transition-all duration-300"
            >
              🚪 {{ t('nav.logout') }}
            </button>
          </template>
          
          <router-link 
            v-if="!isLoggedIn" 
            to="/login" 
            @click="closeMenu"
            class="block py-3 text-sm font-bold uppercase tracking-widest text-slate-600 hover:text-[#3B82F6] hover:pl-2 transition-all duration-300"
          >
            {{ t('nav.login') }}
          </router-link>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { User, Menu, X } from 'lucide-vue-next';
import Button from '@/components/ui/forms/Button.vue'
import { Cache } from '@/services/cachemanager';

const { t, locale } = useI18n();

const isMenuOpen = ref(false);
const router = useRouter();
const isLoggedIn = computed(() => !!Cache.Session.value);

const navLinks = computed(() => [
  { name: t('nav.home'), path: '/' },
  { name: t('nav.services'), path: '/servicos' },
  { name: t('nav.prices'), path: '/precos' },
  { name: t('nav.portfolio'), path: '/portfolio' },
  { name: t('nav.materials'), path: '/materiais' },
  { name: t('nav.faq'), path: '/faq' },
  { name: t('nav.about'), path: '/sobre' },
  { name: t('nav.contact'), path: '/contacto' },
]);

const changeLanguage = (lang: string) => {
  locale.value = lang;
  localStorage.setItem('language', lang);
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

onMounted(() => {
  // Restaura idioma guardado
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage) {
    locale.value = savedLanguage;
  }
  
  console.log('🔍 Navbar montada - Logged in?', isLoggedIn.value);
  console.log('🔑 Session:', Cache.Session.value);
  console.log('👤 User:', Cache.UserName.value);
  console.log('🌐 Language:', locale.value);
});

const handleLogout = async () => {
  Cache.clearAuth();
  router.push('/');
};
</script>