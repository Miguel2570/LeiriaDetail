<!-- src/page/auth/ForgotPassword.vue -->
<template>
  <div class="min-h-[85vh] flex items-center justify-center py-16 px-4 relative z-10">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-black mb-2 text-gray-900 uppercase italic tracking-tighter drop-shadow-sm">
          Recuperar <span class="bg-gradient-to-r from-[#2563EB] to-[#00D8FF] bg-clip-text text-transparent">Password</span>
        </h1>
        <p class="text-gray-600 font-medium">Enviamos um link para o teu email</p>
      </div>

      <div class="bg-[#050508] backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        <div v-if="success" class="text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
            <Mail class="w-8 h-8 text-green-400" />
          </div>
          <p class="text-green-400 font-bold text-lg mb-2">Email enviado!</p>
          <p class="text-gray-400 text-sm">Verifica a tua caixa de entrada e segue o link para redefinir a password.</p>
          <router-link to="/login" class="inline-block mt-6 text-[#00D8FF] font-bold text-sm hover:underline">Voltar ao login</router-link>
        </div>

        <div v-else>
          <div v-if="errorMessage" class="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-500 text-sm font-bold text-center">
            {{ errorMessage }}
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email</label>
              <div class="relative">
                <Mail class="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                <input v-model="email" type="email" placeholder="teu@email.com" class="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3B82F6] focus:bg-white/10 transition-all placeholder:text-gray-600" required />
              </div>
            </div>

            <button type="submit" :disabled="isLoading" class="w-full py-4 mt-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-black uppercase tracking-widest text-sm rounded-xl disabled:opacity-50">
              {{ isLoading ? 'A enviar...' : 'Enviar Email de Recuperação' }}
            </button>
          </form>

          <div class="mt-6 text-center">
            <router-link to="/login" class="text-sm text-gray-400 hover:text-white transition-colors">← Voltar ao login</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Mail } from 'lucide-vue-next';

const email = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const success = ref(false);

const handleSubmit = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const res = await fetch('/Authentication/Reset-Password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value })
    });
    const data = await res.json();
    if (data.HasError) throw new Error(data.Error?.Message || 'Erro ao enviar email.');
    success.value = true;
  } catch (error: any) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};
</script>