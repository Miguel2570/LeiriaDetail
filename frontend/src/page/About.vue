<script setup lang="ts">
import { Sparkles, Shield, Heart, Award, CheckCircle2 } from 'lucide-vue-next'

const values = [
  { icon: Sparkles, title: 'Qualidade', desc: 'Resultados de excelência.' },
  { icon: Shield, title: 'Confiança', desc: 'Transparência total.' },
  { icon: Heart, title: 'Paixão', desc: 'Obsessão pela perfeição.' },
  { icon: Award, title: 'Precisão', desc: 'Técnica certificada.' }
]

const checkmarks = ['Lavagem Manual', 'Correção de Pintura', 'Cerâmicos', 'Interiores']
</script>

<template>
  <section class="py-20 bg-[#050505] relative overflow-hidden">
    
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#3B82F6]/10 blur-[100px] rounded-full pointer-events-none"></div>

    <div class="container mx-auto px-4 max-w-6xl relative z-10">
      
      <div class="mb-16 border-b border-white/5 pb-10">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span class="text-[#3B82F6] font-black uppercase tracking-[0.4em] text-[10px] mb-3 block italic">Estúdio Independente</span>
            <h1 class="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none">
              SOBRE A <span class="text-leiria-gradient">LEIRIADETAIL</span>
            </h1>
          </div>
          <div class="flex gap-4">
            <div v-for="t in checkmarks" :key="t" class="hidden lg:flex items-center gap-2">
              <div class="h-1 w-1 bg-[#3B82F6] rounded-full"></div>
              <span class="text-[9px] font-black text-white/40 uppercase tracking-widest">{{ t }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        <div class="lg:col-span-5">
          <h2 class="text-2xl font-black text-white uppercase italic mb-6">A Nossa <span class="text-[#3B82F6]">Essência</span></h2>
          <p class="text-gray-400 text-base leading-relaxed mb-8">
            Não somos apenas um centro de lavagem. Somos um estúdio focado na preservação e restauro da estética automóvel. Combinamos a melhor química do mercado com processos manuais meticulosos para garantir que cada detalhe conte.
          </p>
          <div class="flex flex-wrap gap-x-6 gap-y-3">
             <div v-for="t in checkmarks" :key="t" class="flex lg:hidden items-center gap-2">
                <CheckCircle2 class="h-3 w-3 text-[#3B82F6]" />
                <span class="text-[10px] font-bold text-white/80 uppercase italic">{{ t }}</span>
             </div>
          </div>
        </div>

        <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="v in values" :key="v.title" 
               class="p-6 border border-white/5 bg-white/[0.02] rounded-2xl group hover:border-[#3B82F6]/30 transition-all duration-500">
            <div class="flex items-center gap-4 mb-3">
              <component :is="v.icon" class="h-5 w-5 text-[#3B82F6]" />
              <h3 class="text-sm font-black text-white uppercase italic tracking-wider">{{ v.title }}</h3>
            </div>
            <p class="text-[11px] text-gray-500 uppercase tracking-wide leading-snug">
              {{ v.desc }}
            </p>
          </div>
        </div>

      </div>

    </div>

    <div class="absolute bottom-4 right-4 text-[4rem] font-black text-white/[0.03] italic pointer-events-none select-none uppercase tracking-tighter">
      Est. 2024
    </div>
  </section>
</template>

<style scoped>
.text-leiria-gradient {
  background: linear-gradient(to right, #3B82F6, #06B6D4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>