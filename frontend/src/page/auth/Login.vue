<script setup lang="ts">
import { ref } from 'vue';
import { Mail, Lock, LogIn } from 'lucide-vue-next';

const email = ref('');
const password = ref('');

const handleSubmit = () => {
  console.log('Login:', { email: email.value, password: password.value });
  alert('Login efetuado com sucesso!');
};
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center py-16 bg-white">
    <div class="max-w-md w-full px-4">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-2">
          Bem-vindo de <span class="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">volta</span>
        </h1>
        <p class="text-gray-500">Acede à tua conta LeiriaDetail</p>
      </div>

      <div class="bg-white border border-gray-200 p-8 rounded-xl shadow-[0_0_12px_rgba(0,0,0,0.1)]">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <div class="relative">
              <Mail class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input v-model="email" type="email" placeholder="teu@email.com" class="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#3B82F6]" required />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Password</label>
            <div class="relative">
              <Lock class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input v-model="password" type="password" placeholder="••••••••" class="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#3B82F6]" required />
            </div>
          </div>

          <button type="submit" class="w-full py-3 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <LogIn class="h-4 w-4" /> Entrar
          </button>
        </form>

        <div class="mt-6 text-center text-sm text-gray-500">
          Ainda não tens conta? 
          <router-link to="/registar" class="text-[#3B82F6] font-medium hover:underline">Regista-te</router-link>
        </div>
      </div>
    </div>
  </div>
</template>