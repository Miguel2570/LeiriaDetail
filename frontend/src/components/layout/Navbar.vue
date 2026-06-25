<template>
  <nav 
    class="fixed top-0 z-50 w-full transition-all duration-500"
    :class="[
      isScrolled 
        ? 'bg-[#0A0A0F]/95 backdrop-blur-xl border-b border-[#22222A] shadow-2xl' 
        : 'bg-transparent'
    ]"
  >
    <div class="container mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
      
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-2 sm:gap-3 group shrink-0">
        <div class="relative">
          <img 
            src="../../assets/img/Logo.png" 
            alt="LeiriaDetail" 
            class="relative h-8 sm:h-12 w-auto object-contain transition-all duration-500" 
          />
        </div>
        <span class="font-black text-lg sm:text-xl tracking-tighter">
          <span class="text-white">Leiria</span>
          <span class="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">Detail</span>
        </span>
      </router-link>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center gap-6 lg:gap-8 ml-120">
        <router-link 
          v-for="link in navLinks" 
          :key="link.path" 
          :to="link.path" 
          class="relative text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all duration-300 py-2 group"
          active-class="text-[#3B82F6]"
        >
          {{ link.name }}
          <span class="absolute -bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] transition-all duration-300 group-hover:w-full"></span>
        </router-link>
      </div>

      <!-- Right Side -->
      <div class="flex items-center gap-2 sm:gap-4">
        
        <!-- Language Switcher - ONLY PT and EN (no ID) -->
        <div class="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#111115] border border-[#22222A]">
          <button 
            @click="changeLanguage('pt')" 
            :class="locale === 'pt' ? 'text-[#06B6D4] font-bold' : 'text-gray-500'"
            class="text-[11px] font-bold uppercase tracking-wider hover:text-[#3B82F6] transition-all duration-300 px-1.5"
          >
            PT
          </button>
          <span class="text-gray-600 text-[10px]">|</span>
          <button 
            @click="changeLanguage('en')" 
            :class="locale === 'en' ? 'text-[#06B6D4] font-bold' : 'text-gray-500'"
            class="text-[11px] font-bold uppercase tracking-wider hover:text-[#3B82F6] transition-all duration-300 px-1.5"
          >
            EN
          </button>
        </div>

        <!-- Auth Button (Entrar) -->
        <template v-if="!isLoggedIn">
          <router-link 
            to="/login" 
            class="hidden md:block text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-all duration-300"
          >
            {{ t('nav.login') }}
          </router-link>
        </template>

        <!-- User Menu (when logged in) -->
        <template v-else>
          <router-link 
            to="/client-area" 
            class="hidden md:flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300 group"
          >
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
              <User class="w-4 h-4 text-white" />
            </div>
            <span class="text-[11px] font-bold uppercase tracking-wider">{{ t('nav.profile') }}</span>
          </router-link>
          
          <button 
            @click="handleLogout"
            class="hidden md:block text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-red-400 transition-all duration-300"
          >
            {{ t('nav.logout') }}
          </button>
        </template>

        <!-- Mobile Menu Button -->
        <button 
          @click="isMenuOpen = !isMenuOpen" 
          class="md:hidden relative w-10 h-10 rounded-xl bg-[#111115] border border-[#22222A] flex items-center justify-center text-gray-400 hover:text-[#3B82F6] hover:border-[#3B82F6]/30 transition-all duration-300"
        >
          <Menu v-if="!isMenuOpen" class="h-5 w-5" />
          <X v-else class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition 
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="isMenuOpen" class="md:hidden bg-[#0A0A0F]/95 backdrop-blur-xl border-b border-[#22222A] shadow-2xl">
        <div class="p-5 space-y-2">
          <!-- Mobile Language Switcher -->
          <div class="flex items-center justify-center gap-3 pb-4 mb-2 border-b border-[#22222A]">
            <button 
              @click="changeLanguage('pt'); closeMenu()" 
              :class="locale === 'pt' ? 'text-[#06B6D4] font-bold' : 'text-gray-500'"
              class="text-sm font-bold uppercase tracking-wider hover:text-[#3B82F6] transition-colors px-3 py-1.5 rounded-lg"
            >
              🇵🇹 Português
            </button>
            <button 
              @click="changeLanguage('en'); closeMenu()" 
              :class="locale === 'en' ? 'text-[#06B6D4] font-bold' : 'text-gray-500'"
              class="text-sm font-bold uppercase tracking-wider hover:text-[#3B82F6] transition-colors px-3 py-1.5 rounded-lg"
            >
              🇬🇧 English
            </button>
          </div>

          <!-- Mobile Navigation Links -->
          <router-link 
            v-for="link in navLinks" 
            :key="link.path" 
            :to="link.path" 
            @click="closeMenu" 
            class="flex items-center justify-between py-4 text-sm font-bold uppercase tracking-wider text-gray-300 hover:text-white hover:pl-4 transition-all duration-300 border-b border-[#22222A]"
            active-class="text-[#3B82F6]"
          >
            {{ link.name }}
            <span class="text-[#3B82F6] text-xs">→</span>
          </router-link>
          
          <!-- Mobile Auth Links -->
          <template v-if="isLoggedIn">
            <router-link 
              to="/client-area" 
              @click="closeMenu"
              class="flex items-center justify-between py-4 text-sm font-bold uppercase tracking-wider text-gray-300 hover:text-white hover:pl-4 transition-all duration-300 border-b border-[#22222A]"
            >
              <span class="flex items-center gap-2">
                <User class="w-4 h-4" />
                {{ t('nav.profile') }}
              </span>
              <span class="text-[#3B82F6] text-xs">→</span>
            </router-link>
            <button 
              @click="handleLogout"
              class="flex items-center justify-between w-full py-4 text-sm font-bold uppercase tracking-wider text-red-400 hover:text-red-300 hover:pl-4 transition-all duration-300"
            >
              {{ t('nav.logout') }}
              <span class="text-red-400 text-xs">→</span>
            </button>
          </template>
          
          <template v-else>
            <router-link 
              to="/login" 
              @click="closeMenu"
              class="flex items-center justify-between py-4 text-sm font-bold uppercase tracking-wider text-gray-300 hover:text-white hover:pl-4 transition-all duration-300 border-b border-[#22222A]"
            >
              {{ t('nav.login') }}
              <span class="text-[#3B82F6] text-xs">→</span>
            </router-link>
          </template>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { User, Menu, X } from 'lucide-vue-next';
import { Cache } from '@/services/cachemanager';

const { t, locale } = useI18n();

const isMenuOpen = ref(false);
const isScrolled = ref(false);
const router = useRouter();

const isLoggedIn = computed(() => !!Cache.Session.value);

const navLinks = computed(() => [
  { name: t('nav.home'), path: '/' },
  { name: t('nav.services'), path: '/servicos' },
  { name: t('nav.portfolio'), path: '/portfolio' },
]);

const changeLanguage = (lang: string) => {
  locale.value = lang;
  localStorage.setItem('language', lang);
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

onMounted(() => {
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage && (savedLanguage === 'pt' || savedLanguage === 'en')) {
    locale.value = savedLanguage;
  } else {
    locale.value = 'pt'; // Default to Portuguese
  }
  
  window.addEventListener('scroll', handleScroll);
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const handleLogout = async () => {
  Cache.clearAuth();
  closeMenu();
  router.push('/');
};
</script>

<style scoped>
.router-link-active {
  @apply text-[#3B82F6];
}
</style>