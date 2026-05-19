<script setup lang="ts">
import { Calendar, ArrowRight } from 'lucide-vue-next'
</script>

<template>
  <section class="relative pt-32 pb-20 px-4 overflow-hidden">
    
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#2563EB]/10 to-[#00D8FF]/10 blur-[100px] -z-10 rounded-full pointer-events-none"></div>

    <div class="container mx-auto text-center max-w-4xl relative z-10">
      
      <div class="inline-block px-5 py-2 mb-8 rounded-full bg-gray-50 border border-gray-200 shadow-sm">
        <span class="text-sm font-bold tracking-widest uppercase text-leiria-gradient">
          Detalhe Profissional em Leiria
        </span>
      </div>

      <h1 class="text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase italic text-gray-900">
        Leiria<span class="text-leiria-gradient">Detail</span>
      </h1>

      <p class="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
        Todo o Detalhe faz a Diferença
      </p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <router-link to="/agenda" class="w-full sm:w-auto">
          <button class="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#2563EB] to-[#00D8FF] text-white font-bold h-14 px-10 rounded-2xl transition-all hover:-translate-y-1 shadow-[0_10px_25px_rgba(37,99,235,0.2)] hover:shadow-[0_15px_35px_rgba(37,99,235,0.4)]">
            <Calendar class="h-5 w-5" /> Agendar Agora
          </button>
        </router-link>
        
        <router-link to="/servicos" class="w-full sm:w-auto">
          <button class="w-full sm:w-auto flex items-center justify-center gap-2 h-14 px-10 rounded-2xl font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:text-[#2563EB] hover:border-[#2563EB]/30 shadow-sm transition-all">
            Ver Serviços <ArrowRight class="h-5 w-5" />
          </button>
        </router-link>
      </div>
    </div>
  </section>
</template>