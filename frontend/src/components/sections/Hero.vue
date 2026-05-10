<script setup lang="ts">
import Button from '@/components/ui/forms/Button.vue'
import { Calendar, ArrowRight } from 'lucide-vue-next'
</script>

<template>
  <section class="relative pt-32 pb-20 px-4 bg-gradient-to-b from-[#0A0A0F] via-[#0A0A0F]/80 to-transparent overflow-hidden">
    
    <div class="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#3B82F6]/20 to-[#06B6D4]/20 blur-[100px] -z-10 rounded-full"></div>

    <div class="container mx-auto text-center max-w-4xl relative z-10">
      
      <div class="inline-block px-5 py-2 mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)]">
        <span class="text-sm font-bold tracking-widest uppercase text-leiria-gradient">
          Detalhe Profissional em Leiria
        </span>
      </div>

      <h1 class="text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase italic text-white drop-shadow-2xl">
        Leiria<span class="text-leiria-gradient">Detail</span>
      </h1>

      <p class="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
        Todo o Detalhe faz a Diferença
      </p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <router-link to="/agenda" class="w-full sm:w-auto">
          <button class="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-bold h-14 px-10 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <Calendar class="h-5 w-5" /> Agendar Agora
          </button>
        </router-link>
        
        <router-link to="/servicos" class="w-full sm:w-auto">
          <button class="w-full sm:w-auto flex items-center justify-center gap-2 h-14 px-10 rounded-2xl font-bold text-white border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all">
            Ver Serviços <ArrowRight class="h-5 w-5" />
          </button>
        </router-link>
      </div>
    </div>
  </section>
</template>