<template>
  <section class="min-h-screen py-24 bg-[#0A0A0F] relative overflow-hidden">
    
    <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-[#3B82F6]/8 blur-[150px] rounded-full pointer-events-none parallax-bg"></div>
    <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#06B6D4]/5 blur-[120px] rounded-full pointer-events-none parallax-bg"></div>

    <div class="container mx-auto px-4 max-w-7xl relative z-10">
      
      <!-- Header -->
      <div class="text-center mb-16 services-header">
        <div class="inline-flex items-center gap-2 bg-[#111115] border border-[#22222A] rounded-full px-4 py-2 mb-6 header-badge">
          <Sparkles class="w-4 h-4 text-[#06B6D4]" />
          <span class="text-[10px] font-black text-[#06B6D4] uppercase tracking-[0.3em]">Serviços Premium</span>
        </div>
        
        <h1 class="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none mb-6 header-title">
          Nossos <span class="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">Serviços</span>
        </h1>
        <p class="text-gray-400 text-base leading-relaxed max-w-xl mx-auto header-subtitle">
          Escolha o tratamento ideal para o seu veículo. Todos os serviços são realizados no local à sua escolha.
        </p>
      </div>

      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00D8FF]"></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        
        <div 
          v-for="(pack, index) in packs" 
          :key="pack.id"
          class="pack-card relative group bg-[#111115] border border-[#22222A] rounded-3xl p-8 hover:border-[#3B82F6]/30 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
        >
          <div v-if="index === 1" class="absolute -top-3 left-1/2 -translate-x-1/2">
            <span class="px-4 py-1 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg shadow-blue-500/30">
              Mais Popular
            </span>
          </div>
          
          <div class="text-center mb-6">
            <h3 class="text-2xl font-black text-white">{{ pack.name }}</h3>
            <p class="text-gray-400 text-sm mt-2">{{ pack.description }}</p>
          </div>

          <div class="space-y-3 mb-6 flex-1">
            <div v-for="feature in pack.includes" :key="feature" class="flex items-center gap-2">
              <Check class="w-4 h-4 text-[#3B82F6] shrink-0" />
              <span class="text-sm text-gray-300">{{ feature }}</span>
            </div>
          </div>

          <router-link 
            :to="{ path: '/agenda', query: { serviceId: pack.id, pack: pack.pack_type?.toLowerCase() } }" 
            class="btn-3d block w-full text-center py-3 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 mt-auto"
          >
            Agendar Agora
          </router-link>
        </div>

      </div>

      <div v-if="addons.length > 0" class="addons-section bg-[#111115] border border-[#22222A] rounded-2xl p-8 mb-16">
        <h3 class="text-xl font-bold text-white mb-6 text-center">Serviços Adicionais</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
          <div v-for="addon in addons" :key="addon.id" class="addon-item flex items-center gap-3 group">
            <div class="w-5 h-5 rounded-md bg-gradient-to-br from-[#3B82F6]/20 to-[#06B6D4]/10 border border-[#3B82F6]/20 flex items-center justify-center shrink-0 group-hover:border-[#06B6D4]/40 transition-all duration-300">
              <Check class="w-3 h-3 text-[#06B6D4]" />
            </div>
            <div class="flex-1">
              <span class="text-sm text-gray-400 group-hover:text-gray-200 transition-colors duration-300">{{ addon.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="cta-section relative bg-gradient-to-r from-[#3B82F6]/10 to-[#06B6D4]/10 border border-[#3B82F6]/20 rounded-3xl p-10 md:p-14 text-center overflow-hidden">
        <div class="absolute inset-0 bg-[#0A0A0F]/50 backdrop-blur-sm"></div>
        
        <div class="relative z-10">
          <h2 class="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter mb-4">
            Pronto para <span class="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">transformar</span> o seu carro?
          </h2>
          <p class="text-gray-400 text-sm mb-8 max-w-md mx-auto">
            Escolha o seu pacote e agende já o serviço. Vamos até si!
          </p>
          <router-link 
            to="/agenda" 
            class="btn-3d inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white text-sm font-black uppercase tracking-widest rounded-xl hover:shadow-[0_10px_30px_rgba(59,130,246,0.4)] transition-all duration-300"
          >
            Agendar Agora <ArrowRight class="w-4 h-4" />
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Sparkles, ArrowRight, Check } from 'lucide-vue-next';
import { graphql } from '@/graphql';
import { heroAnimation, fadeInUp, parallax, button3DHover } from '@/assets/animations/gsap'

interface Service {
  id: string;
  name: string;
  description: string;
  price_ab: number;
  duration_details: string;
  pack_type: string;
  includes: string[];
  icon: string;
}

const packs = ref<Service[]>([]);
const addons = ref<Service[]>([]);
const isLoading = ref(true);

const fetchServices = async () => {
  try {
    const query = `
      query {
        services {
          services {
            id
            name
            description
            priceAB
            durationDetails
            packType
            includes
            icon
          }
        }
      }
    `;
    
    const data = await graphql<{ services: { services: any[] } }>(query);
    const allServices = data.services?.services || [];
    
    packs.value = allServices
      .filter((s: any) => s.packType === 'Pack')
      .map(mapService)
      .sort((a, b) => a.price_ab - b.price_ab);
    
    addons.value = allServices
      .filter((s: any) => s.packType === 'Extra')
      .map(mapService);
    
    // ✅ Animações depois de carregar os dados
    setTimeout(() => {
      animatePage()
    }, 100)
    
  } catch (error) {
    console.error('Erro ao carregar serviços:', error);
  } finally {
    isLoading.value = false;
  }
};

const mapService = (s: any): Service => ({
  id: s.id,
  name: s.name,
  description: s.description,
  price_ab: s.priceAB,
  duration_details: s.durationDetails,
  pack_type: s.packType,
  includes: s.includes || [],
  icon: ''
});

// ✅ Todas as animações da página
const animatePage = () => {
  // Header - timeline sequencial
  heroAnimation({
    badge: '.header-badge',
    title: '.header-title',
    subtitle: '.header-subtitle',
    cta: null // não tem CTA no header
  })

  // Cards dos packs - aparecem um de cada vez
  fadeInUp('.pack-card', 0.1)

  // Serviços adicionais
  fadeInUp('.addons-section', 0.3)

  // CTA final
  fadeInUp('.cta-section', 0.4)

  // Parallax nos backgrounds
  parallax('.parallax-bg', -100)

  // Efeito 3D nos botões
  button3DHover('.btn-3d')
}

onMounted(fetchServices);
</script>