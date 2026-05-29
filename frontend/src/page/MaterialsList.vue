<template>
  <section class="min-h-screen py-24 bg-[#020204] relative overflow-hidden">
    
    <div class="absolute top-0 right-0 w-[700px] h-[700px] bg-[#2563EB]/8 blur-[150px] rounded-full pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00D8FF]/5 blur-[120px] rounded-full pointer-events-none"></div>

    <div class="container mx-auto px-4 max-w-5xl relative z-10">
      
      <!-- Header -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-6">
          <Package class="w-4 h-4 text-[#00D8FF]" />
          <span class="text-[10px] font-black text-[#00D8FF] uppercase tracking-[0.3em]">Qualidade Profissional</span>
        </div>
        <h1 class="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none mb-6">
          OS NOSSOS <span class="text-leiria-gradient">PRODUTOS</span>
        </h1>
        <p class="text-gray-400 text-sm max-w-xl mx-auto">
          Utilizamos apenas equipamentos e produtos de qualidade profissional para garantir os melhores resultados.
        </p>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-2 border-[#00D8FF] border-t-transparent"></div>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="material in materials" 
          :key="material.id"
          class="group bg-[#050508] border border-white/5 rounded-2xl overflow-hidden hover:border-[#00D8FF]/20 transition-all duration-500"
        >
          <!-- Imagem (sem perda de qualidade) -->
          <div class="aspect-square bg-gradient-to-br from-[#050508] to-[#0a0a0f] overflow-hidden flex items-center justify-center relative">
            <img 
              v-if="material.imageData"
              :src="getImageUrl(material.imageData, material.imageExtension)"
              :alt="material.name"
              class="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-700"
            />
            <!-- Fallback se não tiver imagem -->
            <div v-else class="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-700">
              <Package class="w-12 h-12" />
            </div>
          </div>

          <!-- Info -->
          <div class="p-5">
            <span class="text-[10px] text-[#00D8FF] uppercase tracking-widest font-bold">{{ material.category }}</span>
            <h3 class="text-white font-bold text-sm mt-1 mb-2">{{ material.name }}</h3>
            <p class="text-xs text-gray-500 leading-relaxed line-clamp-2">{{ material.description }}</p>
          </div>
        </div>
      </div>

      <!-- Marcas -->
      <div class="mt-20 pt-12 border-t border-white/5 text-center">
        <p class="text-[10px] text-gray-600 uppercase tracking-widest mb-6">Produtos de confiança</p>
        <div class="flex flex-wrap justify-center items-center gap-8">
          <span class="text-xl font-black text-white/10 italic">AllSpeed Drive</span>
          <span class="text-xl font-black text-white/10 italic">Maxshine</span>
          <span class="text-xl font-black text-white/10 italic">Vacmaster</span>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.text-leiria-gradient {
  background: linear-gradient(to right, #2563EB, #00D8FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Package } from 'lucide-vue-next';
import { graphql } from '@/graphql';
import { base64ToDataUrl } from '@/Helpers/FileHelper';

interface Material {
  id: string;
  name: string;
  description: string;
  category: string;
  imageData?: string;        // base64
  imageExtension?: string;   // extensão
}

const materials = ref<Material[]>([]);
const isLoading = ref(true);

// ✅ Converte base64 para Data URL
const getImageUrl = (base64?: string, extension?: string) => {
  if (!base64) return '';
  return base64ToDataUrl(base64, extension || 'jpg');
};

const fetchMaterials = async () => {
  try {
    const query = `
      query {
        materials {
          materials { 
            id 
            name 
            description 
            category 
            imageData 
            imageExtension 
          }
        }
      }
    `;
    const data = await graphql<{ materials: { materials: Material[] } }>(query);
    materials.value = data.materials.materials;
  } catch (error) {
    console.error("Erro ao carregar materiais:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchMaterials);
</script>