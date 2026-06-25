<template>
  <section class="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-[#0A0A0F]">
    
    <div class="glow-blue -top-40 -left-40 parallax-bg"></div>
    <div class="glow-cyan -bottom-40 -right-40 parallax-bg"></div>
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#3B82F6]/5 to-[#06B6D4]/5 blur-[100px] -z-10 rounded-full pointer-events-none parallax-bg"></div>

    <div class="container mx-auto text-center max-w-4xl relative z-10">
      
      <!-- Badge -->
      <div ref="badgeRef" class="inline-block px-5 py-2 mb-8 rounded-full bg-[#111115] border border-[#22222A] shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-[#3B82F6]/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]">
        <span class="text-sm font-bold tracking-widest uppercase text-leiria-gradient">
          Detalhe Profissional em Leiria
        </span>
      </div>

      <!-- Título -->
      <h1 ref="titleRef" class="text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase italic">
        <span class="text-white">Leiria</span>
        <span class="text-leiria-gradient">Detail</span>
      </h1>

      <!-- Subtítulo -->
      <p ref="subtitleRef" class="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed font-bold">
        Todo o Detalhe faz a Diferença
      </p>

      <!-- CTAs -->
      <div ref="ctaRef" class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        
        <router-link to="/servicos" class="w-full sm:w-auto">
          <button class="btn-3d group w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-bold h-14 px-10 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 shadow-[0_10px_25px_rgba(59,130,246,0.3)] hover:shadow-[0_15px_35px_rgba(59,130,246,0.5)]">
            <Calendar class="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" /> 
            Agendar Agora
          </button>
        </router-link>
        
        <router-link to="/servicos" class="w-full sm:w-auto">
          <button class="btn-3d group w-full sm:w-auto flex items-center justify-center gap-2 h-14 px-10 rounded-2xl font-bold text-black bg-white border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-gray-50 hover:border-[#3B82F6]/30 hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)]">
            Ver Serviços 
            <ArrowRight class="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </router-link>
        
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Calendar, ArrowRight } from 'lucide-vue-next'
import { heroAnimation, parallax, button3DHover } from '@/assets/animations/gsap'

const badgeRef = ref(null)
const titleRef = ref(null)
const subtitleRef = ref(null)
const ctaRef = ref(null)

onMounted(() => {
  // ✅ Animação do Hero (timeline)
  heroAnimation({
    badge: badgeRef.value,
    title: titleRef.value,
    subtitle: subtitleRef.value,
    cta: ctaRef.value
  })

  // ✅ Parallax nos backgrounds
  parallax('.parallax-bg')

  // ✅ Efeito 3D nos botões
  button3DHover('.btn-3d')
})
</script>