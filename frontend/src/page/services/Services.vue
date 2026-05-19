<script setup lang="ts">
import { Sparkles, Shield, Droplets, CarFront, Check, ArrowRight } from 'lucide-vue-next'

const services = [
  { 
    id: '01',
    icon: Sparkles, 
    title: 'Correção de Pintura', 
    subtitle: 'Restauro e Brilho',
    desc: 'Eliminação definitiva de riscos, hologramas e oxidação através de polimento de alta precisão. Devolvemos a profundidade de cor original da sua viatura.',
    features: ['Polimento Multi-Etapa', 'Remoção de Swirls', 'Medição de Espessura']
  },
  { 
    id: '02',
    icon: Shield, 
    title: 'Proteção Cerâmica', 
    subtitle: 'Defesa Extrema',
    desc: 'Selagem da pintura com nanotecnologia. Cria uma barreira de vidro invisível que oferece resistência química, proteção UV e um efeito hidrofóbico brutal.',
    features: ['Dureza 9H/10H', 'Durabilidade Multianual', 'Efeito Auto-Limpeza']
  },
  { 
    id: '03',
    icon: Droplets, 
    title: 'Lavagem de Detalhe', 
    subtitle: 'Manutenção Segura',
    desc: 'O cuidado que a sua viatura merece. Processo manual seguro, com química de pH neutro e descontaminação profunda de jantes, pintura e cavas das rodas.',
    features: ['Método dos 2 Baldes', 'Zero Risco de Risco', 'Secagem a Ar Quente']
  },
  { 
    id: '04',
    icon: CarFront, 
    title: 'Detalhe Interior', 
    subtitle: 'Habitáculo Imaculado',
    desc: 'Limpeza cirúrgica de todos os materiais do interior. Extração de sujidade em tecidos, hidratação de peles e proteção anti-estática de plásticos.',
    features: ['Tratamento a Ozono', 'Condicionamento UV', 'Limpeza de Estofos']
  }
]
</script>

<template>
  <section class="min-h-screen py-24 bg-[#050505] relative overflow-hidden">
    
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#2563EB]/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

    <div class="container mx-auto px-4 max-w-5xl relative z-10">
      
      <div class="text-center mb-20">
        <span class="text-[#00D8FF] font-black uppercase tracking-[0.4em] text-[10px] mb-4 block italic">Tratamentos de Assinatura</span>
        <h1 class="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none mb-6">
          ESTÉTICA <span class="text-leiria-gradient">AUTOMÓVEL</span>
        </h1>
        <p class="text-gray-400 text-sm leading-relaxed max-w-2xl mx-auto">
          Cada viatura é um projeto único. Selecione um dos nossos tratamentos técnicos para elevar o padrão e proteger o seu investimento.
        </p>
      </div>

      <div class="space-y-6">
        
        <div v-for="s in services" :key="s.id" 
             class="group relative bg-white/[0.01] border border-white/5 rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-center overflow-hidden hover:bg-white/[0.02] hover:border-[#2563EB]/40 transition-all duration-500">
          
          <div class="absolute inset-0 bg-gradient-to-r from-[#2563EB]/0 via-[#2563EB]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

          <div class="flex items-center gap-6 md:w-1/3 shrink-0 relative z-10">
            <div class="h-16 w-16 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#2563EB]/20 transition-all duration-500">
              <component :is="s.icon" class="h-7 w-7 text-[#00D8FF]" />
            </div>
            <div>
              <span class="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-1 block">{{ s.subtitle }}</span>
              <h2 class="text-2xl font-black text-white uppercase italic tracking-tight">{{ s.title }}</h2>
            </div>
          </div>

          <div class="md:w-1/2 relative z-10">
            <p class="text-gray-400 text-sm leading-relaxed mb-6">
              {{ s.desc }}
            </p>
            <div class="flex flex-wrap gap-x-6 gap-y-3">
              <div v-for="feat in s.features" :key="feat" class="flex items-center gap-2">
                <Check class="h-3.5 w-3.5 text-[#2563EB]" />
                <span class="text-[10px] font-bold text-white/70 uppercase tracking-widest">{{ feat }}</span>
              </div>
            </div>
          </div>

          <div class="md:w-auto ml-auto shrink-0 w-full md:w-max mt-4 md:mt-0 relative z-10">
            <router-link to="/precos">
              <button class="w-full md:w-auto h-14 px-8 rounded-xl border border-white/10 bg-white/5 text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#2563EB] hover:border-[#2563EB] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300">
                Ver Preços <ArrowRight class="h-4 w-4" />
              </button>
            </router-link>
          </div>

        </div>

      </div>

    </div>
  </section>
</template>

<style scoped>
.text-leiria-gradient {
  background: linear-gradient(to right, #2563EB, #00D8FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>