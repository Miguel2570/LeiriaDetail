<!-- src/page/auth/ResetPassword.vue -->
<template>
  <div class="min-h-[85vh] flex items-center justify-center py-16 px-4 relative z-10">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-black mb-2 text-gray-900 uppercase italic tracking-tighter drop-shadow-sm">
          Nova <span class="bg-gradient-to-r from-[#2563EB] to-[#00D8FF] bg-clip-text text-transparent">Password</span>
        </h1>
      </div>

      <div class="bg-[#050508] backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        <div v-if="success" class="text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
            <ShieldCheck class="w-8 h-8 text-green-400" />
          </div>
          <p class="text-green-400 font-bold text-lg mb-2">Password alterada!</p>
          <router-link to="/login" class="inline-block mt-6 text-[#00D8FF] font-bold text-sm hover:underline">Fazer login</router-link>
        </div>

        <div v-else>
          <div v-if="errorMessage" class="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-500 text-sm font-bold text-center">{{ errorMessage }}</div>

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nova Password</label>
              <input v-model="password" type="password" placeholder="Mín. 8 caracteres" class="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3B82F6]" required />
              <p class="text-[10px] text-gray-500 mt-1">Mín. 8 caracteres, 1 maiúscula, 1 número, 1 símbolo</p>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Confirmar Password</label>
              <input v-model="confirmPassword" type="password" class="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3B82F6]" required />
            </div>

            <button type="submit" :disabled="isLoading" class="w-full py-4 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-black uppercase tracking-widest text-sm rounded-xl disabled:opacity-50">
              {{ isLoading ? 'A alterar...' : 'Alterar Password' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { ShieldCheck } from 'lucide-vue-next';

const route = useRoute();
const password = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const success = ref(false);

const handleSubmit = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'As passwords não coincidem.';
    return;
  }
  if (password.value.length < 8) {
    errorMessage.value = 'Mínimo 8 caracteres.';
    return;
  }

  isLoading.value = true;
  try {
    const token = route.query.token as string;
    const res = await fetch('/Authentication/Change-Password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ securityToken: token, password: password.value })
    });
    const data = await res.json();
    if (data.HasError) throw new Error(data.Error?.Message || 'Erro.');
    success.value = true;
  } catch (error: any) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};
</script>