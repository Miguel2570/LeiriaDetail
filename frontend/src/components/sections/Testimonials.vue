<script setup lang="ts">
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Autoplay } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'

const modules = [Navigation, Autoplay]

const reviews = [
  {
    name: 'João Francisco',
    car: 'Tesla Model 3',
    text: 'Entreguei o meu carro cheio de marcas de lavagens antigas e recebi-o com um brilho de espelho. O Pack Completo vale cada cêntimo. Trabalho de excelência em Leiria!'
  },
  {
    name: 'Marta Silva',
    car: 'BMW Série 1',
    text: 'Os estofos estavam manchados e os plásticos baços. Parecia magia, o detalhe interior deixou o carro a cheirar a novo. O cuidado e a simpatia foram incríveis.'
  },
  {
    name: 'Carlos Mendes',
    car: 'Porsche Macan',
    text: 'Como dono de um carro premium, tenho muito receio onde o deixo. O profissionalismo e os produtos usados (CarPro) deixaram-me totalmente descansado. Recomendo a 100%.'
  },
  {
    name: 'Ricardo Pereira',
    car: 'Audi A4',
    text: 'Serviço de detalhe impecável. A atenção aos pormenores é de outro nível. O carro ficou melhor do que quando saiu do stand.'
  }
]
</script>

<template>
  <section class="py-24 px-4 relative z-10">
    <div class="container mx-auto max-w-7xl relative">
      
      <div class="text-center mb-16">
        <h2 class="text-sm font-bold text-[#3B82F6] tracking-[0.3em] uppercase mb-3">O que dizem de nós</h2>
        <h3 class="text-4xl md:text-6xl font-black text-gray-900 uppercase italic tracking-tighter drop-shadow-sm">
          Clientes <span class="text-leiria-gradient">Satisfeitos</span>
        </h3>
      </div>

      <div class="relative px-4 md:px-12">
        
        <swiper
          :modules="modules"
          :slides-per-view="1"
          :space-between="30"
          :loop="true"
          :autoplay="{ delay: 5000, disableOnInteraction: false }"
          :navigation="{
            prevEl: '.prev-rev',
            nextEl: '.next-rev',
          }"
          :breakpoints="{
            '768': { slidesPerView: 2 },
            '1024': { slidesPerView: 3 }
          }"
          class="!pb-12"
        >
          <swiper-slide v-for="(review, i) in reviews" :key="i" class="h-auto">
            <div class="bg-[#0A0A0F]/95 backdrop-blur-xl border border-white/10 p-8 rounded-3xl relative shadow-xl h-full flex flex-col hover:border-[#3B82F6]/30 transition-colors duration-300">
              
              <Quote class="absolute top-6 right-6 h-10 w-10 text-white/5" />

              <div class="flex gap-1 mb-6">
                <Star v-for="n in 5" :key="n" class="h-5 w-5 fill-[#06B6D4] text-[#06B6D4]" />
              </div>

              <p class="text-gray-300 text-sm leading-relaxed mb-8 italic flex-grow">"{{ review.text }}"</p>

              <div class="mt-auto border-t border-white/10 pt-4 flex items-center gap-3">
                <div class="h-10 w-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center font-bold text-white shrink-0">
                  {{ review.name.charAt(0) }}
                </div>
                <div>
                  <h4 class="text-white font-bold text-sm">{{ review.name }}</h4>
                  <p class="text-gray-400 text-xs">{{ review.car }}</p>
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper>

        <button class="prev-rev absolute left-0 top-1/2 -translate-y-1/2 z-30 p-2 text-gray-400 hover:text-[#3B82F6] transition-colors hidden md:block">
          <ChevronLeft :size="48" stroke-width="1" />
        </button>
        <button class="next-rev absolute right-0 top-1/2 -translate-y-1/2 z-30 p-2 text-gray-400 hover:text-[#3B82F6] transition-colors hidden md:block">
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

@media (max-width: 768px) {
  .prev-rev, .next-rev {
    display: none;
  }
}
</style>