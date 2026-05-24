<template>
  <div class="min-h-screen bg-[#020204] flex items-center justify-center p-4">
    <div class="text-center max-w-md">
      <div class="text-6xl mb-6">🔧</div>
      <h1 class="text-2xl font-black text-white uppercase tracking-tighter mb-2">
        {{ title || 'Erro' }}
      </h1>
      <p class="text-gray-400 text-sm mb-2">{{ subTitle || 'Ocorreu um erro inesperado.' }}</p>
      <p class="text-gray-500 text-xs mb-8">{{ message }}</p>
      
      <div class="flex gap-4 justify-center">
        <button 
          @click="router.push('/')"
          class="px-6 py-3 bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-white/10 transition-all"
        >
          Voltar ao Início
        </button>
        <button 
          @click="router.back()"
          class="px-6 py-3 bg-gradient-to-r from-[#2563EB] to-[#00D8FF] text-white text-xs font-bold uppercase tracking-wider rounded-xl"
        >
          Tentar Novamente
        </button>
      </div>
      
      <details v-if="stacktrace" class="mt-8 text-left">
        <summary class="text-xs text-gray-600 cursor-pointer hover:text-gray-400">Detalhes técnicos</summary>
        <pre class="text-[10px] text-gray-600 mt-2 bg-black/50 p-4 rounded-xl overflow-auto max-h-40">{{ stacktrace }}</pre>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
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
</script>