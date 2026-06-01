<!-- src/page/services/ServiceDetail.vue -->
<template>
  <div class="min-h-screen bg-[#050505] text-white pt-28 pb-20">
    
    <div v-if="isLoading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-2 border-[#00D8FF] border-t-transparent"></div>
    </div>

    <template v-else-if="service">
      <div class="max-w-4xl mx-auto px-4">
        
        <!-- Breadcrumb -->
        <router-link to="/servicos" class="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
          ← Voltar aos Serviços
        </router-link>

        <!-- Header -->
        <div class="text-center mb-12">
          <span class="text-5xl mb-4 block">{{ service.icon || '🔧' }}</span>
          <span class="text-[10px] font-black text-[#00D8FF] uppercase tracking-[0.3em] bg-[#00D8FF]/10 px-3 py-1 rounded-full">
            {{ service.packType }}
          </span>
          <h1 class="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mt-4 mb-4">
            {{ service.name }}
          </h1>
          <p class="text-gray-400 text-sm max-w-2xl mx-auto">{{ service.longDescription || service.description }}</p>
          
          <!-- Preços -->
          <div class="flex justify-center gap-4 mt-6">
            <div class="bg-[#050508] border border-white/10 rounded-xl px-5 py-3">
              <p class="text-[10px] text-gray-500">Pequeno</p>
              <p class="text-xl font-black text-[#00D8FF]">{{ service.priceAB }}€</p>
            </div>
            <div class="bg-[#050508] border border-white/10 rounded-xl px-5 py-3">
              <p class="text-[10px] text-gray-500">Médio</p>
              <p class="text-xl font-black text-[#00D8FF]">{{ service.priceC }}€</p>
            </div>
            <div class="bg-[#050508] border border-white/10 rounded-xl px-5 py-3">
              <p class="text-[10px] text-gray-500">Grande</p>
              <p class="text-xl font-black text-[#00D8FF]">{{ service.priceDE }}€</p>
            </div>
          </div>
        </div>

        <!-- Grid: O que inclui + Duração -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div class="bg-[#050508] border border-white/10 rounded-2xl p-6">
            <h3 class="text-sm font-bold text-white uppercase tracking-wider mb-4">📋 O que inclui</h3>
            <ul v-if="service.includes && service.includes.length > 0" class="space-y-2">
              <li v-for="item in service.includes" :key="item" class="flex items-start gap-2 text-sm text-gray-400">
                <span class="text-[#10B981] mt-0.5">✓</span>
                {{ item }}
              </li>
            </ul>
            <p v-else class="text-gray-400 text-sm">{{ service.description }}</p>
          </div>

          <div class="bg-[#050508] border border-white/10 rounded-2xl p-6">
            <h3 class="text-sm font-bold text-white uppercase tracking-wider mb-4">⏱ Duração</h3>
            <p class="text-3xl font-black text-[#00D8FF]">{{ service.durationMinutes }}<span class="text-lg text-gray-400"> min</span></p>
            <p class="text-gray-400 text-sm mt-2">{{ service.durationDetails || 'Tempo estimado de serviço' }}</p>
          </div>
        </div>

        <!-- Processo -->
        <div v-if="service.processSteps && service.processSteps.length > 0" class="mb-12">
          <h3 class="text-sm font-bold text-white uppercase tracking-wider mb-6 text-center">🔧 Como Fazemos</h3>
          
          <div class="space-y-4">
            <div 
              v-for="(step, index) in service.processSteps" 
              :key="index"
              class="bg-[#050508] border border-white/10 rounded-2xl p-5 flex items-start gap-4"
            >
              <div class="w-10 h-10 rounded-full bg-[#00D8FF]/10 border border-[#00D8FF]/30 flex items-center justify-center flex-shrink-0">
                <span class="text-[#00D8FF] font-black">{{ step.step || Number(index) + 1 }}</span>
              </div>
              <div>
                <h4 class="text-white font-bold text-sm mb-1">{{ step.title }}</h4>
                <p class="text-gray-400 text-xs">{{ step.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="text-center">
          <router-link 
            to="/agenda"
            class="inline-flex px-8 py-4 bg-gradient-to-r from-[#2563EB] to-[#00D8FF] text-white font-black uppercase tracking-widest text-sm rounded-xl hover:shadow-[0_10px_30px_rgba(37,99,235,0.4)] transition-all hover:-translate-y-1"
          >
            Agendar Este Serviço
          </router-link>
        </div>

      </div>
    </template>

    <div v-else class="text-center py-20">
      <p class="text-gray-500">Serviço não encontrado.</p>
      <router-link to="/servicos" class="text-[#00D8FF] text-sm font-bold hover:underline mt-2 block">Ver todos os serviços</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { graphql } from '@/graphql';

const route = useRoute();
const service = ref<any>(null);
const isLoading = ref(true);

const fetchService = async () => {
  try {
    const query = `
  query {
    services {
      services {
        id
        name
        description
        longDescription
        priceAB
        priceC
        priceDE
        durationMinutes
        durationDetails
        packType
        icon
        includes
        processSteps {
          step
          title
          description
        }
      }
    }
  }
`;
    const data = await graphql<{ services: { services: any[] } }>(query);
    const found = data.services?.services?.find((s: any) => s.id === route.params.id);
    
    if (found) {
      // Parse processSteps se for string
      if (typeof found.processSteps === 'string') {
        try { found.processSteps = JSON.parse(found.processSteps); } catch { found.processSteps = []; }
      }
      // Garante arrays
      if (!Array.isArray(found.includes)) found.includes = [];
      if (!Array.isArray(found.processSteps)) found.processSteps = [];
      
      service.value = found;
    }
  } catch (error) {
    console.error('Erro ao carregar serviço:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchService);
</script>