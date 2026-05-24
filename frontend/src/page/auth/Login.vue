<template>
  <div class="min-h-[85vh] flex items-center justify-center py-16 px-4 relative z-10">
    <div class="max-w-md w-full">
      
      <div class="text-center mb-8">
        <h1 class="text-4xl font-black mb-2 text-gray-900 uppercase italic tracking-tighter drop-shadow-sm">
          Bem-vindo de <span class="bg-gradient-to-r from-[#2563EB] to-[#00D8FF] bg-clip-text text-transparent">volta</span>
        </h1>
        <p class="text-gray-600 font-medium">Acede à tua área de cliente LeiriaDetail</p>
      </div>

      <div class="bg-[#050508] backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        
        <div class="flex flex-col gap-3 mb-6">
          <button @click="loginWithGoogle" type="button" class="w-full py-3.5 px-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuar com o Google
          </button>

          <button @click="loginWithApple" type="button" class="w-full py-3.5 px-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.15 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.85 2.05-1.74 3.45-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.02 4.5-3.74 4.25z"/>
            </svg>
            Continuar com a Apple
          </button>
        </div>

        <div class="flex items-center gap-4 mb-6">
          <div class="h-px bg-white/10 flex-1"></div>
          <span class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Ou com email</span>
          <div class="h-px bg-white/10 flex-1"></div>
        </div>

        <div v-if="errorMessage" class="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/50 flex items-center text-red-500 text-sm font-bold">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email</label>
            <div class="relative">
              <Mail class="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
              <input v-model="email" type="email" placeholder="teu@email.com" class="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3B82F6] focus:bg-white/10 transition-all placeholder:text-gray-600" required />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider">Password</label>
              <a href="#" class="text-xs font-bold text-[#06B6D4] hover:text-white transition-colors">Esqueceu?</a>
            </div>
            <div class="relative">
              <Lock class="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
              <input v-model="password" type="password" placeholder="••••••••" class="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3B82F6] focus:bg-white/10 transition-all placeholder:text-gray-600" required />
            </div>
          </div>

          <button type="submit" :disabled="isLoading" class="w-full py-4 mt-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-black uppercase tracking-widest text-sm rounded-xl shadow-[0_10px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_10px_25px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <LogIn v-if="!isLoading" class="h-5 w-5" /> 
            {{ isLoading ? 'A entrar...' : 'Entrar na Conta' }}
          </button>
        </form>

        <div class="mt-8 text-center border-t border-white/10 pt-6">
          <p class="text-sm text-gray-400">
            Ainda não tens conta? 
            <router-link to="/registar" class="text-white font-bold hover:text-[#06B6D4] transition-colors inline-flex items-center gap-1">
              Criar Conta <ArrowRight class="h-3 w-3" />
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-vue-next';
import { Cache } from '@/CacheManagement/cachemanager';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
    isLoading.value = true;
    errorMessage.value = '';

    try {
        const response = await fetch('http://localhost:3001/Authentication/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Credenciais inválidas.');
        }

        // Login com sucesso! Guardar dados na Cache
        Cache.setAuth(
            data.user.id.toString(), // Token de sessão fictício (usando o ID)
            data.user.id.toString(),
            data.user.name || data.user.email
        );

        // Redireciona o utilizador para a Marcação
        router.push('/agenda');
        
    } catch (error: any) {
        errorMessage.value = error.message;
    } finally {
        isLoading.value = false;
    }
};

const loginWithGoogle = () => console.log('A implementar Google...');
const loginWithApple = () => console.log('A implementar Apple...');
</script>