<script setup lang="ts">
import { Droplets, Sparkles, CarFront, CircleDashed, ArrowRight } from 'lucide-vue-next'

const services = [
  {
    icon: Droplets,
    title: 'Lavagem Exterior',
    desc: 'Pré-lavagem com Snow Foam, método de 2 baldes e secagem segura anti-riscos.',
    link: '/servicos'
  },
  {
    icon: CarFront,
    title: 'Detalhe Interior',
    desc: 'Limpeza profunda de estofos, plásticos e ecrãs com proteção UV e pH neutro.',
    link: '/servicos'
  },
  {
    icon: Sparkles,
    title: 'Pack Completo',
    desc: 'A combinação perfeita do detalhe exterior e interior para um carro como novo.',
    highlight: true,
    link: '/servicos'
  },
  {
    icon: CircleDashed,
    title: 'Jantes & Pneus',
    desc: 'Descontaminação férrea profunda e condicionamento acetinado de longa duração.',
    link: '/servicos'
  }
]
</script>

<template>
  <section class="py-24 px-4 relative z-10">
    <div class="container mx-auto max-w-6xl">
      
      <div class="text-center mb-16">
        <h2 class="text-sm font-bold text-[#06B6D4] tracking-[0.3em] uppercase mb-3">O Nosso Catálogo</h2>
        <h3 class="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-xl">
          Os Nossos <span class="text-leiria-gradient">Serviços_</span>
        </h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="(service, i) in services" :key="i"
             :class="[
               'bg-[#050508] backdrop-blur-xl p-8 rounded-3xl transition-all duration-300 group shadow-lg hover:-translate-y-2 relative overflow-hidden flex flex-col',
               service.highlight ? 'border-2 border-[#3B82F6]' : 'border border-white/10 hover:border-[#3B82F6]/50'
             ]">

          <div v-if="service.highlight" class="absolute -right-12 top-6 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white text-[10px] font-bold px-12 py-1.5 rotate-45 shadow-md">
            RECOMENDADO
          </div>

          <div :class="[
            'h-14 w-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-sm',
            service.highlight ? 'bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white' : 'bg-gradient-to-br from-[#3B82F6]/20 to-[#06B6D4]/20 text-[#06B6D4] border border-white/5'
          ]">
            <component :is="service.icon" class="h-7 w-7" />
          </div>

          <h4 class="text-xl font-bold text-white mb-3 uppercase">{{ service.title }}</h4>
          <p class="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">{{ service.desc }}</p>

          <router-link :to="service.link" class="inline-flex items-center text-sm font-bold text-[#3B82F6] group-hover:text-[#06B6D4] transition-colors mt-auto">
            Saber mais <ArrowRight class="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </router-link>
        </div>
      </div>

      <div class="mt-16 text-center">
         <router-link to="/precos">
            <button class="bg-transparent border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white font-bold py-3.5 px-8 rounded-2xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] hover:-translate-y-1">
              Ver Preçário Completo
            </button>
         </router-link>
      </div>

    </div>
  </section>
</template>