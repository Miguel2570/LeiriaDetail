<template>
  <div class="min-h-screen bg-[#020204] flex items-center justify-center p-4 relative overflow-hidden">
    <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2563EB]/5 rounded-full blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#00D8FF]/5 rounded-full blur-[120px] pointer-events-none"></div>

    <div class="text-center max-w-md relative z-10">
      <!-- Ícone varia conforme o tipo de erro -->
      <div class="text-6xl mb-6">
        <span v-if="isSessionExpired">⏰</span>
        <span v-else-if="statusCode === '403'">🚫</span>
        <span v-else-if="statusCode === '500'">🔥</span>
        <span v-else-if="statusCode === '503'">🔌</span>
        <span v-else>🔧</span>
      </div>

      <h1 class="text-2xl font-black text-white uppercase tracking-tighter mb-2">
        {{ displayTitle }}
      </h1>
      <p class="text-gray-400 text-sm mb-2">{{ displaySubTitle }}</p>
      <p class="text-gray-500 text-xs mb-8">{{ message }}</p>
      
      <div class="flex gap-4 justify-center">
        <!-- 🔥 Se for sessão expirada, mostra "Iniciar Sessão" -->
        <router-link 
          v-if="isSessionExpired"
          to="/login"
          class="px-6 py-3 bg-gradient-to-r from-[#2563EB] to-[#00D8FF] text-white text-xs font-bold uppercase tracking-wider rounded-xl"
        >
          Iniciar Sessão
        </router-link>
        
        <button 
          v-if="!isSessionExpired"
          @click="router.back()"
          class="px-6 py-3 bg-gradient-to-r from-[#2563EB] to-[#00D8FF] text-white text-xs font-bold uppercase tracking-wider rounded-xl"
        >
          Tentar Novamente
        </button>

        <router-link 
          to="/"
          class="px-6 py-3 bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-white/10 transition-all"
        >
          Voltar ao Início
        </router-link>
      </div>

      <p v-if="isSessionExpired" class="text-[10px] text-gray-600 mt-8">
        Por razões de segurança, as sessões expiram após 24 horas de inatividade.
      </p>
      
      <details v-if="stacktrace" class="mt-8 text-left">
        <summary class="text-xs text-gray-600 cursor-pointer hover:text-gray-400">Detalhes técnicos</summary>
        <pre class="text-[10px] text-gray-600 mt-2 bg-black/50 p-4 rounded-xl overflow-auto max-h-40">{{ stacktrace }}</pre>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
  title?: string;
  subTitle?: string;
  message?: string;
  stacktrace?: string;
  statusCode?: string;
  layer?: string;
}>();

const isSessionExpired = computed(() => {
  return props.statusCode === '401' || 
         props.message?.toLowerCase().includes('session') ||
         props.message?.toLowerCase().includes('expired') ||
         props.message?.toLowerCase().includes('token inválido') ||
         props.message?.toLowerCase().includes('sessão expirada');
});

const displayTitle = computed(() => {
  if (isSessionExpired.value) return 'Sessão Expirada';
  return props.title || 'Erro';
});

const displaySubTitle = computed(() => {
  if (isSessionExpired.value) return 'A sua sessão expirou por inatividade ou foi terminada.';
  return props.subTitle || 'Ocorreu um erro inesperado.';
});
</script>