<!-- src/page/auth/VerifyCode.vue -->
<template>
  <div class="min-h-[85vh] flex items-center justify-center py-16 px-4 relative z-10">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-black mb-2 text-gray-900 uppercase italic tracking-tighter drop-shadow-sm">
          Verificar <span class="bg-gradient-to-r from-[#2563EB] to-[#00D8FF] bg-clip-text text-transparent">Conta</span>
        </h1>
        <p class="text-gray-600 font-medium">Insere o código enviado para o teu email</p>
      </div>

      <div class="bg-[#050508] backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        
        <!-- Sucesso -->
        <div v-if="success" class="text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
            <ShieldCheck class="w-8 h-8 text-green-400" />
          </div>
          <p class="text-green-400 font-bold text-lg mb-2">Conta verificada!</p>
          <p class="text-gray-400 text-sm mb-6">A tua conta foi verificada com sucesso.</p>
          <router-link to="/login" class="inline-block px-8 py-3 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-bold rounded-xl">
            Fazer Login
          </router-link>
        </div>

        <!-- Formulário -->
        <div v-else>
          <div v-if="errorMessage" class="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-500 text-sm font-bold text-center">
            {{ errorMessage }}
          </div>

          <div class="text-center mb-6">
            <p class="text-gray-400 text-sm">
              Código enviado para <span class="text-white font-bold">{{ email }}</span>
            </p>
          </div>

          <form @submit.prevent="handleVerify" class="space-y-5">
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Código de 6 dígitos</label>
              <div class="flex justify-center gap-3">
                <input 
                  v-for="(digit, index) in 6" 
                  :key="index"
                  :ref="el => { if (el) inputs[index] = el as HTMLInputElement }"
                  v-model="codeDigits[index]"
                  @input="handleDigitInput(index, $event)"
                  @keydown.backspace="handleBackspace(index, $event)"
                  @paste="handlePaste"
                  maxlength="1"
                  type="text"
                  inputmode="numeric"
                  pattern="[0-9]"
                  class="w-12 h-14 text-center text-xl font-bold bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3B82F6] focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            <button type="submit" :disabled="isLoading || !isCodeComplete" class="w-full py-4 mt-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-black uppercase tracking-widest text-sm rounded-xl disabled:opacity-50">
              {{ isLoading ? 'A verificar...' : 'Verificar Conta' }}
            </button>
          </form>

          <div class="mt-6 text-center space-y-3">
            <p class="text-gray-500 text-sm">
              Não recebeste o código? 
              <button @click="resendCode" :disabled="resendCooldown > 0" class="text-[#00D8FF] font-bold hover:underline disabled:opacity-50">
                {{ resendCooldown > 0 ? `Reenviar em ${resendCooldown}s` : 'Reenviar código' }}
              </button>
            </p>
            <router-link to="/login" class="block text-sm text-gray-400 hover:text-white transition-colors">← Voltar ao login</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ShieldCheck } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();

const email = ref((route.query.email as string) || '');
const codeDigits = ref<string[]>(Array(6).fill(''));
const inputs = ref<HTMLInputElement[]>([]);
const isLoading = ref(false);
const errorMessage = ref('');
const success = ref(false);
const resendCooldown = ref(0);

const isCodeComplete = computed(() => codeDigits.value.every(d => d !== ''));

let cooldownTimer: any = null;

// Navegação entre inputs
const handleDigitInput = (index: number, event: Event) => {
  const input = event.target as HTMLInputElement;
  const value = input.value.replace(/[^0-9]/g, '');
  codeDigits.value[index] = value;
  
  if (value && index < 5) {
    inputs.value[index + 1]?.focus();
  }
};

const handleBackspace = (index: number, event: KeyboardEvent) => {
  if (!codeDigits.value[index] && index > 0) {
    codeDigits.value[index - 1] = '';
    inputs.value[index - 1]?.focus();
  }
};

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault();
  const paste = event.clipboardData?.getData('text') || '';
  const digits = paste.replace(/[^0-9]/g, '').slice(0, 6).split('');
  digits.forEach((d, i) => {
    codeDigits.value[i] = d;
  });
  if (digits.length === 6) {
    inputs.value[5]?.focus();
  }
};

// Verificar código
const handleVerify = async () => {
  if (!isCodeComplete.value) return;
  
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    const code = codeDigits.value.join('');
    const res = await fetch('/Authentication/Verify-Code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, code })
    });
    const data = await res.json();
    
    if (data.HasError) throw new Error(data.Error?.Message || 'Código inválido.');
    
    success.value = true;
    
    // Redireciona para login após 2 segundos
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (error: any) {
    errorMessage.value = error.message;
    codeDigits.value = Array(6).fill('');
    inputs.value[0]?.focus();
  } finally {
    isLoading.value = false;
  }
};

// Reenviar código
const resendCode = async () => {
  if (resendCooldown.value > 0) return;
  
  try {
    await fetch('/Authentication/Resend-Verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value })
    });
    
    resendCooldown.value = 60;
    cooldownTimer = setInterval(() => {
      resendCooldown.value--;
      if (resendCooldown.value <= 0) {
        clearInterval(cooldownTimer);
      }
    }, 1000);
  } catch (error: any) {
    errorMessage.value = 'Erro ao reenviar código.';
  }
};

onMounted(() => {
  if (!email.value) {
    router.push('/login');
  }
  inputs.value[0]?.focus();
});

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer);
});
</script>