<template>
  <div class="min-h-[85vh] flex items-center justify-center py-16 px-4 relative z-10">
    
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

    <div class="max-w-2xl w-full relative z-10 text-center">
      
      <div class="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(239,68,68,0.15)]">
        <AlertTriangle class="w-12 h-12 text-red-500" />
      </div>

      <h2 class="text-red-500 font-black tracking-[0.4em] uppercase text-xs mb-4 italic">
        Erro {{ errorData.layer }} • {{ errorData.statusCode }}
      </h2>
      
      <h1 class="text-4xl md:text-5xl font-black italic tracking-tighter text-white uppercase leading-none mb-6">
        {{ errorData.title }}
      </h1>
      
      <p class="text-xl text-gray-300 font-medium mb-4">
        {{ errorData.subTitle }}
      </p>

      <p class="text-gray-500 text-sm leading-relaxed mb-10 max-w-lg mx-auto">
        {{ errorData.message }}
      </p>

      <div v-if="errorData.details && errorData.details !== errorData.message" class="mb-10 text-left">
        <details class="group bg-[#050508] border border-white/5 rounded-xl overflow-hidden">
          <summary class="cursor-pointer p-4 text-xs font-bold text-gray-400 uppercase tracking-widest hover:bg-white/5 transition-colors list-none flex items-center justify-between">
            Ver Detalhes Técnicos
            <ChevronDown class="w-4 h-4 transition-transform group-open:rotate-180" />
          </summary>
          <div class="p-4 border-t border-white/5 bg-black/50">
            <pre class="text-xs text-red-400/80 font-mono whitespace-pre-wrap break-words">{{ errorData.details }}</pre>
          </div>
        </details>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button @click="goBack" class="w-full sm:w-auto h-14 px-8 rounded-xl border border-white/10 bg-white/5 text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 hover:bg-white/10">
          <RotateCcw class="w-4 h-4" /> Tentar Novamente
        </button>
        
        <button @click="goHome" class="w-full sm:w-auto h-14 px-8 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#00D8FF] text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] shadow-lg">
          <Home class="w-4 h-4" /> Voltar ao Início
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { AlertTriangle, Home, RotateCcw, ChevronDown } from 'lucide-vue-next';

const router = useRouter();

// Valores por defeito caso o cliente aceda a /error diretamente sem os dados do router
const errorData = ref({
  layer: 'SISTEMA',
  title: 'Página Indisponível',
  subTitle: 'Ocorreu um erro inesperado',
  message: 'Não foi possível completar o seu pedido. Por favor, tente novamente mais tarde.',
  details: '',
  statusCode: '500'
});

onMounted(() => {
  // Lê o histórico de estado injetado pelo router.push({ state: {...} })
  if (history.state && history.state.title) {
    errorData.value = {
      layer: history.state.layer || errorData.value.layer,
      title: history.state.title || errorData.value.title,
      subTitle: history.state.subTitle || errorData.value.subTitle,
      message: history.state.message || errorData.value.message,
      details: history.state.details || '',
      statusCode: history.state.statusCode || errorData.value.statusCode
    };
  }
});

const goBack = () => {
  // Volta à página anterior no histórico do browser
  router.back();
};

const goHome = () => {
  router.push('/');
};
</script>