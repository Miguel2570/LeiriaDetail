<script setup lang="ts">
import { ref } from 'vue';
import { User, Mail, Lock, UserPlus, ArrowRight } from 'lucide-vue-next';

const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
});

const handleSubmit = () => {
  if (formData.value.password !== formData.value.confirmPassword) {
    alert('As passwords não coincidem!');
    return;
  }
  console.log('Registo:', formData.value);
  alert('Conta criada com sucesso!');
};

const loginWithGoogle = () => {
  console.log('A criar conta com Google...');
  // Lógica de registo via Google aqui
};
</script>

<template>
  <div class="min-h-[85vh] flex items-center justify-center py-16 px-4 relative z-10">
    <div class="max-w-md w-full">
      
      <div class="text-center mb-8">
        <h1 class="text-4xl font-black mb-2 text-gray-900 uppercase italic tracking-tighter drop-shadow-sm">
          Criar <span class="text-leiria-gradient">Conta</span>
        </h1>
        <p class="text-gray-600 font-medium">Junta-te aos clientes LeiriaDetail</p>
      </div>

      <div class="bg-[#050508] backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        
        <button @click="loginWithGoogle" type="button" class="w-full py-3.5 px-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 mb-6">
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Registar com o Google
        </button>

        <div class="flex items-center gap-4 mb-6">
          <div class="h-px bg-white/10 flex-1"></div>
          <span class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Ou com email</span>
          <div class="h-px bg-white/10 flex-1"></div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="relative">
            <User class="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
            <input v-model="formData.name" type="text" placeholder="Nome Completo" class="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3B82F6] focus:bg-white/10 transition-all placeholder:text-gray-600" required />
          </div>

          <div class="relative">
            <Mail class="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
            <input v-model="formData.email" type="email" placeholder="Email" class="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3B82F6] focus:bg-white/10 transition-all placeholder:text-gray-600" required />
          </div>

          <div class="relative">
            <Lock class="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
            <input v-model="formData.password" type="password" placeholder="Password" class="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3B82F6] focus:bg-white/10 transition-all placeholder:text-gray-600" required />
          </div>

          <div class="relative">
            <Lock class="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
            <input v-model="formData.confirmPassword" type="password" placeholder="Confirmar Password" class="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3B82F6] focus:bg-white/10 transition-all placeholder:text-gray-600" required />
          </div>
          
          <div class="flex items-center gap-3 pt-2">
            <input type="checkbox" v-model="formData.acceptTerms" class="h-4 w-4 rounded border-gray-300 text-[#3B82F6] focus:ring-[#3B82F6] bg-white/5" required />
            <span class="text-sm text-gray-400">Aceito os <a href="#" class="text-[#06B6D4] hover:underline">Termos e Condições</a></span>
          </div>

          <button type="submit" class="w-full py-4 mt-4 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-black uppercase tracking-widest text-sm rounded-xl shadow-[0_10px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_10px_25px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
            <UserPlus class="h-5 w-5" /> Criar Conta
          </button>
        </form>
        
        <div class="mt-8 text-center border-t border-white/10 pt-6">
          <p class="text-sm text-gray-400">
            Já tens conta? 
            <router-link to="/login" class="text-white font-bold hover:text-[#06B6D4] transition-colors inline-flex items-center gap-1">
              Inicia Sessão <ArrowRight class="h-3 w-3" />
            </router-link>
          </p>
        </div>
      </div>

    </div>
  </div>
</template>