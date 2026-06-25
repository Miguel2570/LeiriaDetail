<template>
  <section class="min-h-screen py-24 bg-[#0A0A0F]">
    <div class="container mx-auto px-4 max-w-7xl">
      
      <div class="text-center mb-16">
        <h1 class="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter mb-6">
          Nossos <span class="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">Serviços</span>
        </h1>
      </div>

      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00D8FF]"></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          v-for="pack in packs" 
          :key="pack.id"
          class="bg-[#111115] border border-[#22222A] rounded-3xl p-8 flex flex-col h-full"
        >
          <div class="text-center mb-6">
            <h3 class="text-2xl font-black text-white">{{ pack.name }}</h3>
            <p class="text-gray-400 text-sm mt-2">{{ pack.description }}</p>
          </div>

          <div class="space-y-2 mb-6 flex-1">
            <p class="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Processo:</p>
            <div v-for="step in pack.steps" :key="step.stepOrder" class="text-xs text-gray-300">
              • {{ step.title }} ({{ step.durationMinutes }}min)
            </div>
          </div>

          <div v-if="pack.extras?.length > 0" class="mb-6">
            <p class="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mb-2">Extras Disponíveis:</p>
            <div v-for="extra in pack.extras" :key="extra.id" class="text-xs text-gray-400">
              + {{ extra.name }}
            </div>
          </div>

          <router-link 
            :to="{ path: '/agenda', query: { serviceId: pack.id } }" 
            class="w-full text-center py-3 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-bold rounded-xl mt-auto"
          >
            Agendar Agora
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { graphql } from '@/graphql';

const packs = ref<any[]>([]);
const isLoading = ref(true);

const fetchPacks = async () => {
  try {
    // 1. Primeiro, listamos os IDs de todos os serviços que são 'Pack'
    const listQuery = `
      query {
        servicesByPack(pack: "Pack") {
          services { id }
        }
      }
    `;
    const listData = await graphql<any>(listQuery);
    const packIds = listData.servicesByPack.services.map((s: any) => s.id);

    // 2. Depois, para cada ID, buscamos o detalhe completo (steps + extras)
    packs.value = await Promise.all(
      packIds.map(async (id: string) => {
        const detailQuery = `
          query {
            fullPackDetails(id: "${id}") {
              id name description priceAB
              steps { stepOrder title durationMinutes }
              extras { id name }
            }
          }
        `;
        const res = await graphql<any>(detailQuery);
        return res.fullPackDetails;
      })
    );
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchPacks);
</script>