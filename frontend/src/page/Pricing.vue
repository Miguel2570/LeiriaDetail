<script setup lang="ts">
import { Check, Minus, Star, ArrowRight } from 'lucide-vue-next'

const checkmarks = ['Orçamentos Exatos', 'Sem Surpresas', 'Garantia', 'Transparência']

const pricingPackages = [
  {
    name: 'Manutenção',
    price: '60€',
    prefix: 'Desde',
    desc: 'O cuidado mensal ideal para viaturas já detalhadas ou com proteção.',
    highlight: false,
    features: [
      { text: 'Lavagem exterior pH Neutro', included: true },
      { text: 'Limpeza de jantes face e interior', included: true },
      { text: 'Aspiração e limpeza interior', included: true },
      { text: 'Condicionamento de plásticos', included: true },
      { text: 'Descontaminação química', included: false },
      { text: 'Correção de pintura (Polimento)', included: false }
    ]
  },
  {
    name: 'Proteção Cerâmica',
    price: '450€',
    prefix: 'Desde',
    desc: 'A proteção definitiva. Brilho extremo e hidrofobia até 3 anos.',
    highlight: true, // Este cartão vai ter destaque visual
    features: [
      { text: 'Lavagem exterior ao detalhe', included: true },
      { text: 'Descontaminação total', included: true },
      { text: 'Correção de pintura (1 a 2 etapas)', included: true },
      { text: 'Revestimento Cerâmico (Pintura)', included: true },
      { text: 'Revestimento Cerâmico (Jantes)', included: true },
      { text: 'Selagem de vidros', included: true }
    ]
  },
  {
    name: 'Detalhe Interior',
    price: '120€',
    prefix: 'Desde',
    desc: 'Higienização profunda para um habitáculo com aspeto e cheiro a novo.',
    highlight: false,
    features: [
      { text: 'Aspiração profunda', included: true },
      { text: 'Lavagem de estofos (Tecido/Pele)', included: true },
      { text: 'Hidratação de peles', included: true },
      { text: 'Limpeza de teto e alcatifas', included: true },
      { text: 'Higienização com Ozono', included: true },
      { text: 'Lavagem exterior base', included: false }
    ]
  }
]
</script>

<template>
  <section class="min-h-screen py-24 bg-[#050505] relative overflow-hidden">
    
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#2563EB]/15 blur-[120px] rounded-full pointer-events-none z-0"></div>

    <div class="container mx-auto px-4 max-w-7xl relative z-10">
      
      <div class="text-center mb-20 border-b border-white/5 pb-12">
        <span class="text-[#00D8FF] font-black uppercase tracking-[0.4em] text-[10px] mb-4 block italic">Transparência Total</span>
        <h1 class="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none mb-8">
          TABELA DE <span class="text-leiria-gradient">PREÇOS</span>
        </h1>
        
        <p class="text-gray-400 text-sm leading-relaxed max-w-2xl mx-auto mb-8">
          Os nossos valores refletem a qualidade dos produtos utilizados e as dezenas de horas dedicadas a cada viatura. Cada carro é único, e o detalhe é feito à medida.
        </p>

        <div class="flex flex-wrap justify-center gap-6">
          <div v-for="t in checkmarks" :key="t" class="flex items-center gap-2">
            <div class="h-1.5 w-1.5 bg-[#00D8FF] rounded-full"></div>
            <span class="text-[10px] font-black text-white/50 uppercase tracking-widest">{{ t }}</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        
        <div v-for="(pkg, index) in pricingPackages" :key="pkg.name" 
             :class="[
               'relative rounded-[2.5rem] p-8 md:p-10 transition-all duration-500 flex flex-col h-full',
               pkg.highlight 
                 ? 'bg-gradient-to-b from-[#2563EB]/10 to-[#050505] border-2 border-[#2563EB]/50 shadow-[0_0_40px_rgba(37,99,235,0.15)] md:-translate-y-4' 
                 : 'bg-white/[0.01] border border-white/5 hover:bg-white/[0.02] hover:border-white/10'
             ]">
          
          <div v-if="pkg.highlight" class="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#2563EB] to-[#00D8FF] text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
            <Star class="h-3 w-3 fill-white" /> Recomendado
          </div>

          <div class="mb-8 flex-grow-0">
            <h3 class="text-2xl font-black text-white uppercase italic tracking-tight mb-2">{{ pkg.name }}</h3>
            <p class="text-xs text-gray-500 uppercase tracking-widest leading-relaxed min-h-[40px]">{{ pkg.desc }}</p>
          </div>

          <div class="mb-8 pb-8 border-b border-white/5 flex-grow-0">
            <span class="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-1">{{ pkg.prefix }}</span>
            <div class="flex items-baseline gap-1">
              <span class="text-5xl font-black text-white italic tracking-tighter">{{ pkg.price }}</span>
              <span v-if="pkg.highlight" class="text-sm font-bold text-[#00D8FF] italic">*</span>
            </div>
          </div>

          <ul class="space-y-4 mb-10 flex-grow">
            <li v-for="feat in pkg.features" :key="feat.text" class="flex items-start gap-3">
              <div :class="['mt-0.5 rounded-full p-0.5 flex-shrink-0', feat.included ? 'bg-[#2563EB]/20 text-[#00D8FF]' : 'bg-transparent text-white/10']">
                <Check v-if="feat.included" class="h-3 w-3 font-black" />
                <Minus v-else class="h-3 w-3" />
              </div>
              <span :class="['text-xs uppercase tracking-wider font-bold', feat.included ? 'text-gray-300' : 'text-gray-600 line-through decoration-white/10']">
                {{ feat.text }}
              </span>
            </li>
          </ul>

          <button :class="[
            'w-full py-4 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all mt-auto',
            pkg.highlight 
              ? 'bg-gradient-to-r from-[#2563EB] to-[#00D8FF] text-white hover:shadow-[0_10px_25px_rgba(37,99,235,0.4)] hover:scale-[1.02]' 
              : 'bg-white/5 text-white hover:bg-white/10'
          ]">
            Agendar Pacote <ArrowRight class="h-4 w-4" />
          </button>

        </div>

      </div>

    </div>

    <div class="absolute bottom-4 right-4 text-[4rem] font-black text-white/[0.03] italic pointer-events-none select-none uppercase tracking-tighter">
      Pricelist
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