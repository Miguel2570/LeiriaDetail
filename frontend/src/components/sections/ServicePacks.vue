<script setup lang="ts">
import { ref } from 'vue'
import { Droplets, Sparkles, CarFront, Zap, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-vue-next'
// Importação do Swiper
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'

// Estilos do Swiper
import 'swiper/css'
import 'swiper/css/navigation'

const modules = [Navigation, Pagination]

const packs = [
  {
    icon: Droplets,
    title: 'Exterior Detalhado',
    price: 'Desde 20€',
    desc: 'Limpeza profunda exterior com selagem rápida CarPro.',
    features: ['Snow Foam (CarPro Lift)', 'Lavagem 2 Baldes', 'Secagem Segura', 'Limpeza de Jantes (Face)']
  },
  {
    icon: CarFront,
    title: 'Interior Detalhado',
    price: 'Desde 25€',
    desc: 'Cuidado minucioso do habitáculo com proteção UV.',
    features: ['Aspiração Profunda', 'Limpeza P&S Xpress', 'Vidros Sem Manchas', 'Condicionamento Perl']
  },
  {
    icon: Sparkles,
    title: 'Pack Completo',
    price: 'Desde 40€',
    desc: 'O tratamento total para quem quer o carro como novo.',
    highlight: true,
    features: ['Tudo do Pack Exterior', 'Tudo do Pack Interior', 'Pincelamento de Grelhas', 'Oferta de Cheirinho']
  },
  {
    icon: Zap,
    title: 'Jantes & Pneus',
    price: 'Desde 15€',
    desc: 'Foco total nas rodas com descontaminação férrea.',
    features: ['CarPro IronX', 'Limpeza Profunda MWC', 'Condicionador Pneus', 'Proteção de Jantes']
  }
]
</script>

<template>
  <section class="py-24 px-4 relative z-10">
    <div class="container mx-auto max-w-7xl relative">
      
      <div class="text-center mb-16">
        <h2 class="text-sm font-bold text-[#3B82F6] tracking-[0.3em] uppercase mb-3">Escolha o seu nível</h2>
        <h3 class="text-4xl md:text-6xl font-black text-gray-900 uppercase italic tracking-tighter drop-shadow-sm">
          Os Nossos <span class="text-leiria-gradient">Packs</span>
        </h3>
      </div>

      <div class="relative px-12"> 
        <swiper
          :modules="modules"
          :slides-per-view="1"
          :space-between="24"
          :loop="true"
          :navigation="{
            prevEl: '.prev-arrow',
            nextEl: '.next-arrow',
          }"
          :breakpoints="{
            '768': { slidesPerView: 2 },
            '1024': { slidesPerView: 3 }
          }"
          class="pb-12"
        >
          <swiper-slide v-for="(pack, i) in packs" :key="i" class="h-auto">
            <div
              :class="[
                'h-full bg-[#050508] backdrop-blur-xl border rounded-3xl transition-all duration-300 relative flex flex-col overflow-hidden',
                pack.highlight 
                   ? 'border-[#3B82F6] shadow-[0_10px_40px_rgba(59,130,246,0.3)] z-20' 
                   : 'border-white/10 shadow-lg hover:border-[#3B82F6]/50'
              ]"
            >
              <div class="h-2 w-full bg-gradient-to-r from-[#3B82F6] to-[#06B6D4]"></div>

              <div class="p-8 flex flex-col flex-grow">
                <div :class="[
                   'h-14 w-14 rounded-2xl flex items-center justify-center mb-6 mt-2',
                   pack.highlight ? 'bg-gradient-to-br from-[#3B82F6]/20 to-[#06B6D4]/20' : 'bg-white/5 border border-white/10'
                ]">
                  <component :is="pack.icon" :class="['h-7 w-7', pack.highlight ? 'text-[#3B82F6]' : 'text-gray-400']" />
                </div>

                <h4 class="text-xl font-black text-white mb-1 uppercase tracking-tight italic">{{ pack.title }}</h4>
                <div class="text-3xl font-black text-leiria-gradient mb-4">{{ pack.price }}</div>
                
                <p class="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">{{ pack.desc }}</p>

                <ul class="space-y-3 mb-8 border-t border-white/10 pt-6">
                  <li v-for="feat in pack.features" :key="feat" class="flex items-start gap-2 text-[13px] text-gray-300 font-medium">
                    <div class="h-1.5 w-1.5 bg-[#06B6D4] rounded-full mt-1.5 shrink-0 shadow-[0_0_5px_#06B6D4]"></div>
                    {{ feat }}
                  </li>
                </ul>

                <div class="space-y-3 mt-auto">
                  <router-link to="/agenda" class="block">
                    <button :class="[
                      'w-full py-3.5 rounded-xl font-bold text-sm transition-all',
                      'bg-white text-[#0A0A0F] hover:bg-[#3B82F6] hover:text-white transition-colors'
                    ]">
                      Reservar Agora
                    </button>
                  </router-link>
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper>

        <button class="prev-arrow absolute left-0 top-1/2 -translate-y-1/2 z-30 p-2 text-gray-400 hover:text-[#3B82F6] transition-colors">
          <ChevronLeft :size="48" stroke-width="1" />
        </button>
        <button class="next-arrow absolute right-0 top-1/2 -translate-y-1/2 z-30 p-2 text-gray-400 hover:text-[#3B82F6] transition-colors">
          <ChevronRight :size="48" stroke-width="1" />
        </button>

      </div>
    </div>
  </section>
</template>

<style scoped>
.text-leiria-gradient {
  background: linear-gradient(to right, #3B82F6, #06B6D4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.swiper-slide {
  height: auto !important;
}
.swiper {
  padding-top: 20px;
  padding-bottom: 40px;
}
</style>