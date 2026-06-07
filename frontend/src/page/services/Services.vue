<template>
  <section class="min-h-screen py-24 bg-[#0A0A0F] relative overflow-hidden">
    
    <!-- Background glow effects -->
    <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-[#3B82F6]/8 blur-[150px] rounded-full pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#06B6D4]/5 blur-[120px] rounded-full pointer-events-none"></div>

    <div class="container mx-auto px-4 max-w-7xl relative z-10">
      
      <!-- Header -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 bg-[#111115] border border-[#22222A] rounded-full px-4 py-2 mb-6">
          <Sparkles class="w-4 h-4 text-[#06B6D4]" />
          <span class="text-[10px] font-black text-[#06B6D4] uppercase tracking-[0.3em]">Serviços Premium</span>
        </div>
        
        <h1 class="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none mb-6">
          Nossos <span class="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">Serviços</span>
        </h1>
        <p class="text-gray-400 text-base leading-relaxed max-w-xl mx-auto">
          Escolha o tratamento ideal para o seu veículo. Todos os serviços são realizados no local à sua escolha.
        </p>
      </div>

      <!-- Tiered Packages Grid (3 columns like Detail Express) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        
        <!-- Premium Detail Package (Most Popular) -->
        <div class="relative group bg-[#111115] border border-[#22222A] rounded-3xl p-8 hover:border-[#3B82F6]/30 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
          <div class="absolute -top-3 left-1/2 -translate-x-1/2">
            <span class="px-4 py-1 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg shadow-blue-500/30">
              Mais Popular
            </span>
          </div>
          
          <div class="text-center mb-6">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3B82F6]/20 to-[#06B6D4]/10 border border-[#3B82F6]/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles class="w-8 h-8 text-[#06B6D4]" />
            </div>
            <h3 class="text-2xl font-black text-white">Premium Detail</h3>
            <p class="text-gray-400 text-sm mt-2">Detalhe completo interior e exterior</p>
          </div>

          <div class="space-y-3 mb-6 flex-1">
            <div v-for="feature in premiumFeatures" :key="feature" class="flex items-center gap-2">
              <Check class="w-4 h-4 text-[#3B82F6] shrink-0" />
              <span class="text-sm text-gray-300">{{ feature }}</span>
            </div>
          </div>

          <router-link to="/agenda" class="block w-full text-center py-3 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 mt-auto">
            Agendar Agora
          </router-link>
        </div>

        <!-- Showroom Package (Most Efficient) -->
        <div class="relative group bg-[#111115] border border-[#22222A] rounded-3xl p-8 hover:border-[#3B82F6]/30 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
          <div class="text-center mb-6">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3B82F6]/20 to-[#06B6D4]/10 border border-[#3B82F6]/20 flex items-center justify-center mx-auto mb-4">
              <CarFront class="w-8 h-8 text-[#06B6D4]" />
            </div>
            <h3 class="text-2xl font-black text-white">Showroom</h3>
            <p class="text-gray-400 text-sm mt-2">Acabamento próximo de showroom</p>
          </div>

          <div class="space-y-3 mb-6 flex-1">
            <div v-for="feature in showroomFeatures" :key="feature" class="flex items-center gap-2">
              <Check class="w-4 h-4 text-[#3B82F6] shrink-0" />
              <span class="text-sm text-gray-300">{{ feature }}</span>
            </div>
          </div>

          <router-link to="/agenda" class="block w-full text-center py-3 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 mt-auto">
            Agendar Agora
          </router-link>
        </div>

        <!-- Standard Package -->
        <div class="relative group bg-[#111115] border border-[#22222A] rounded-3xl p-8 hover:border-[#3B82F6]/30 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
          <div class="text-center mb-6">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3B82F6]/20 to-[#06B6D4]/10 border border-[#3B82F6]/20 flex items-center justify-center mx-auto mb-4">
              <Shield class="w-8 h-8 text-[#06B6D4]" />
            </div>
            <h3 class="text-2xl font-black text-white">Standard Detail</h3>
            <p class="text-gray-400 text-sm mt-2">O essencial para o dia a dia</p>
          </div>

          <div class="space-y-3 mb-6 flex-1">
            <div v-for="feature in standardFeatures" :key="feature" class="flex items-center gap-2">
              <Check class="w-4 h-4 text-[#3B82F6] shrink-0" />
              <span class="text-sm text-gray-300">{{ feature }}</span>
            </div>
          </div>

          <router-link to="/agenda" class="block w-full text-center py-3 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 mt-auto">
            Agendar Agora
          </router-link>
        </div>

      </div>

      <!-- Specialized Services Section (Seat Cleaning, Polishing, Add-ons)
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        
        <div class="bg-[#111115] border border-[#22222A] rounded-2xl p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3B82F6]/20 to-[#06B6D4]/10 flex items-center justify-center">
              <span class="text-2xl">🪑</span>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Limpeza de Bancos</h3>
              <p class="text-gray-400 text-xs">Limpeza profunda com remoção de bactérias</p>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <span v-for="material in seatMaterials" :key="material" class="px-3 py-1 bg-[#0A0A0F] border border-[#22222A] rounded-full text-xs text-gray-300">{{ material }}</span>
          </div>
        </div>

        <div class="bg-[#111115] border border-[#22222A] rounded-2xl p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3B82F6]/20 to-[#06B6D4]/10 flex items-center justify-center">
              <span class="text-2xl">✨</span>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Polimento</h3>
              <p class="text-gray-400 text-xs">Correção de pintura e brilho intenso</p>
            </div>
          </div>
          <div class="space-y-2">
            <div v-for="feature in polishingFeatures" :key="feature" class="flex items-center gap-2">
              <Check class="w-3.5 h-3.5 text-[#3B82F6]" />
              <span class="text-xs text-gray-400">{{ feature }}</span>
            </div>
          </div>
        </div>
        

      </div>
      -->
      <!-- Add-on Services Section -->
      <div class="bg-[#111115] border border-[#22222A] rounded-2xl p-8 mb-16">
        <h3 class="text-xl font-bold text-white mb-6 text-center">Serviços Adicionais</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
          <div v-for="addon in addons" :key="addon" class="flex items-center gap-3 group">
            <div class="w-5 h-5 rounded-md bg-gradient-to-br from-[#3B82F6]/20 to-[#06B6D4]/10 border border-[#3B82F6]/20 flex items-center justify-center shrink-0 group-hover:border-[#06B6D4]/40 transition-all duration-300">
              <Check class="w-3 h-3 text-[#06B6D4]" />
            </div>
            <span class="text-sm text-gray-400 group-hover:text-gray-200 transition-colors duration-300">{{ addon }}</span>
          </div>
        </div>
      </div>

      <!-- Final CTA -->
      <div class="relative bg-gradient-to-r from-[#3B82F6]/10 to-[#06B6D4]/10 border border-[#3B82F6]/20 rounded-3xl p-10 md:p-14 text-center overflow-hidden">
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
            class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white text-sm font-black uppercase tracking-widest rounded-xl hover:shadow-[0_10px_30px_rgba(59,130,246,0.4)] transition-all duration-300"
          >
            Agendar Agora <ArrowRight class="w-4 h-4" />
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Sparkles, Shield, CarFront, ArrowRight, Check } from 'lucide-vue-next';
import { useHead } from '@vueuse/head'

useHead({
  title: 'Serviços de Detalhe Automóvel - LeiriaDetail',
  meta: [
    { name: 'description', content: 'Conheça os nossos packs de lavagem, polimento e proteção cerâmica. Preços competitivos em Leiria.' },
  ]
})

// Package features
const premiumFeatures = [
  'Limpeza de jantes e pneus',
  'Pré-lavagem com espuma',
  'Lavagem manual',
  'Secagem com toalhas',
  'Limpeza de vidros',
  'Brilho nos pneus',
  'Aplicação de cera/selante (opcional)',
  'Aspiração detalhada',
  'Limpeza de plásticos',
  'Lavagem de tapetes',
  'Ambientador'
]

const showroomFeatures = [
  'Limpeza de jantes e pneus',
  'Pré-lavagem com espuma',
  'Lavagem manual',
  'Secagem com toalhas',
  'Limpeza de vidros',
  'Brilho nos pneus',
  'Aplicação de cera/selante (opcional)',
  'Hidratação de plásticos (exterior)',
  'Limpeza e hidratação do motor',
  'Aspiração detalhada',
  'Limpeza de plásticos interiores',
  'Lavagem de tapetes',
  'Ambientador',
  'Proteção UV de plásticos (interior)'
]

const standardFeatures = [
  'Limpeza de jantes e pneus',
  'Pré-lavagem com espuma',
  'Lavagem manual',
  'Secagem com toalhas',
  'Limpeza de vidros',
  'Brilho nos pneus',
  'Aspiração básica',
  'Limpeza de plásticos',
  'Aspiração de tapetes',
  'Ambientador'
]

const seatMaterials = ['Couro', 'Sintético', 'Alcantara', 'Tecido']

const polishingFeatures = [
  'Descontaminação da pintura',
  'Medição de espessura',
  'Isolamento completo',
  'Polimento de correção',
  'Aplicação de proteção (recomendado)'
]

const addons = [
  'Aplicação de Cera/Selante',
  'Hidratação de Couro',
  'Hidratação de Plásticos (exterior)',
  'Proteção UV de Plásticos',
  'Limpeza e Hidratação do Motor',
  'Neutralização de Odores (Ozono)',
  'Restauro de Faróis',
  'Remoção de Pêlos de Animal',
  'Remoção de Calcário'
]
</script>