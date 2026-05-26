<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Sparkles, Shield, Droplets, CarFront, ArrowRight, Check } from 'lucide-vue-next';
import { graphql } from '@/graphql';

// Apenas categorias principais para mostrar na landing
const mainCategories = [
  {
    id: 'exterior',
    title: 'Lavagem Exterior',
    subtitle: 'Brilho e Proteção',
    icon: CarFront,
    description: 'Lavagem manual segura com produtos pH neutro. Devolvemos o brilho original à pintura.',
    features: ['Pré-lavagem com espuma ativa', 'Método dos 2 baldes', 'Secagem com ar quente', 'Selagem de pintura'],
    image: '🧼'
  },
  {
    id: 'interior',
    title: 'Detalhe Interior',
    subtitle: 'Habitáculo Imaculado',
    icon: Shield,
    description: 'Limpeza profunda de todos os materiais. O seu carro com aspeto e cheiro a novo.',
    features: ['Aspiração profunda', 'Lavagem de estofos', 'Hidratação de peles', 'Higienização com Ozono'],
    image: '🧹'
  },
  {
    id: 'completo',
    title: 'Tratamento Completo',
    subtitle: 'A Experiência Premium',
    icon: Sparkles,
    description: 'O pacote completo para quem exige o melhor. Exterior, interior e proteção cerâmica.',
    features: ['Correção de pintura', 'Proteção cerâmica 9H', 'Detalhe interior completo', 'Garantia de satisfação'],
    image: '👑'
  },
  {
    id: 'jantes',
    title: 'Jantes e Pneus',
    subtitle: 'Detalhe Especializado',
    icon: Droplets,
    description: 'Limpeza e proteção das jantes, pneus e discos. O detalhe que faz a diferença.',
    features: ['Descontaminação química', 'Limpeza face e interior', 'Selagem protetora', 'Brilho espelhado'],
    image: '💎'
  }
];

// Buscar serviços para estatísticas
const totalServices = ref(0);
const packs = ref<string[]>([]);

const fetchStats = async () => {
  try {
    const query = `
      query {
        services {
          services {
            id
            packType
          }
        }
      }
    `;
    const data = await graphql<{ services: { services: { id: string; packType: string }[] } }>(query);
    totalServices.value = data.services.services.length;
    packs.value = [...new Set(data.services.services.map(s => s.packType))];
  } catch (error) {
    console.error("Erro ao carregar estatísticas:", error);
  }
};

onMounted(fetchStats);
</script>

<template>
  <section class="min-h-screen py-24 bg-[#020204] relative overflow-hidden">
    
    <!-- Background Effects -->
    <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-[#2563EB]/8 blur-[150px] rounded-full pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#00D8FF]/5 blur-[120px] rounded-full pointer-events-none"></div>

    <div class="container mx-auto px-4 max-w-6xl relative z-10">
      
      <!-- Header -->
      <div class="text-center mb-20">
        <div class="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-6">
          <Sparkles class="w-4 h-4 text-[#00D8FF]" />
          <span class="text-[10px] font-black text-[#00D8FF] uppercase tracking-[0.3em]">Serviços Premium</span>
        </div>
        
        <h1 class="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none mb-6">
          CUIDAMOS DO SEU <span class="bg-gradient-to-r from-[#2563EB] to-[#00D8FF] bg-clip-text text-transparent">CARRO</span>
        </h1>
        <p class="text-gray-400 text-base leading-relaxed max-w-xl mx-auto">
          {{ totalServices }} serviços disponíveis em {{ packs.length }} packs. Do básico ao premium, cada serviço é executado com paixão e precisão cirúrgica.
        </p>
      </div>

      <!-- Categorias Principais -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
        
        <div 
          v-for="cat in mainCategories" 
          :key="cat.id"
          class="group relative bg-[#050508] border border-white/5 rounded-3xl p-8 hover:border-[#2563EB]/20 transition-all duration-500 overflow-hidden"
        >
          <!-- Hover Effect -->
          <div class="absolute inset-0 bg-gradient-to-br from-[#2563EB]/0 to-[#00D8FF]/0 group-hover:from-[#2563EB]/3 group-hover:to-[#00D8FF]/3 transition-all duration-700"></div>

          <div class="relative z-10">
            <!-- Header -->
            <div class="flex items-start gap-4 mb-6">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2563EB]/20 to-[#00D8FF]/10 border border-[#2563EB]/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500 text-2xl">
                {{ cat.image }}
              </div>
              <div>
                <span class="text-[10px] font-black text-[#00D8FF] uppercase tracking-[0.2em]">{{ cat.subtitle }}</span>
                <h3 class="text-xl font-bold text-white mt-1">{{ cat.title }}</h3>
              </div>
            </div>

            <!-- Description -->
            <p class="text-gray-400 text-sm leading-relaxed mb-6">
              {{ cat.description }}
            </p>

            <!-- Features -->
            <div class="grid grid-cols-2 gap-2">
              <div 
                v-for="feat in cat.features" 
                :key="feat"
                class="flex items-center gap-2"
              >
                <Check class="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                <span class="text-[11px] text-gray-400">{{ feat }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- CTA Section -->
      <div class="relative bg-gradient-to-r from-[#2563EB]/10 to-[#00D8FF]/10 border border-[#2563EB]/20 rounded-3xl p-10 md:p-14 text-center overflow-hidden">
        <div class="absolute inset-0 bg-[#050508]/50 backdrop-blur-sm"></div>
        
        <div class="relative z-10">
          <h2 class="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter mb-4">
            Pronto para <span class="bg-gradient-to-r from-[#2563EB] to-[#00D8FF] bg-clip-text text-transparent">transformar</span> o seu carro?
          </h2>
          <p class="text-gray-400 text-sm mb-8 max-w-md mx-auto">
            Veja todos os nossos serviços e preços, ou agende já a sua visita.
          </p>
            <router-link 
              to="/agenda" 
              class="px-8 py-4 bg-gradient-to-r from-[#2563EB] to-[#00D8FF] text-white text-sm font-black uppercase tracking-widest rounded-xl hover:shadow-[0_10px_30px_rgba(37,99,235,0.4)] transition-all duration-300 flex items-center justify-center gap-2"
            >
              Agendar Agora <ArrowRight class="w-4 h-4" />
            </router-link>
          </div>
        </div>
      </div>
  </section>
</template>