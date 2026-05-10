<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

const faqs = [
  { q: 'Quanto tempo demora um detalhe interior?', a: 'O detalhe Basic demora cerca de 1h, enquanto o Standard pode ir até às 2h, dependendo do estado da viatura.' },
  { q: 'Fazem serviço ao domicílio?', a: 'Atualmente trabalhamos apenas nas nossas instalações em Leiria para garantirmos o ambiente controlado e a iluminação ideal para o detalhe.' },
  { q: 'Que métodos de pagamento aceitam?', a: 'Aceitamos pagamentos por MB Way, Multibanco, numerário e cartões Visa/Mastercard no nosso estúdio.' },
  { q: 'É preciso fazer marcação prévia?', a: 'Sim, trabalhamos exclusivamente por marcação para garantir que cada viatura tem o tempo e a dedicação necessários.' }
]

const openIndex = ref<number | null>(null)

const toggleFaq = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <section class="py-24 relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0F]/80 to-transparent -z-10"></div>

    <div class="container mx-auto max-w-4xl px-4 relative z-10">
      
      <div class="text-center mb-20">
        <span class="text-[10px] font-bold text-[#3B82F6] tracking-[0.5em] uppercase mb-4 block italic">F A Q</span>
        <h3 class="text-5xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">
          QUESTÕES <span class="text-leiria-gradient">FREQUENTES</span>
        </h3>
        <p class="text-white/40 mt-4 text-[11px] uppercase tracking-[0.2em] font-medium italic">
          Esclareça todas as suas dúvidas
        </p>
      </div>

      <div class="border-t border-white/10">
        <div v-for="(faq, i) in faqs" :key="i" 
             class="border-b border-white/5 transition-all duration-500">
          
          <button 
            @click="toggleFaq(i)" 
            class="w-full py-8 flex items-center justify-between text-left focus:outline-none group"
          >
            <span :class="[
              'font-black text-lg md:text-xl uppercase italic tracking-tight transition-all duration-300 pr-8',
              openIndex === i ? 'text-[#3B82F6]' : 'text-white group-hover:text-white'
            ]">
              {{ faq.q }}
            </span>
            
            <div :class="[
              'h-9 w-9 rounded-full border flex items-center justify-center transition-all duration-500 shrink-0',
              openIndex === i 
                ? 'border-[#3B82F6] bg-[#3B82F6] text-white rotate-180 shadow-[0_0_20px_rgba(59,130,246,0.4)]' 
                : 'border-white/10 text-gray-500 group-hover:border-white/30 group-hover:text-white'
            ]">
              <ChevronDown class="h-4 w-4" />
            </div>
          </button>

          <div 
            class="grid transition-all duration-500 ease-in-out overflow-hidden"
            :style="{ gridTemplateRows: openIndex === i ? '1fr' : '0fr' }"
          >
            <div class="min-h-0">
              <div class="pb-9 pr-12 flex gap-6">
                <div class="w-1 bg-gradient-to-b from-[#3B82F6] to-transparent mb-2 rounded-full opacity-60"></div>
                <p class="text-white/60 text-base leading-relaxed antialiased">
                  {{ faq.a }}
                </p>
              </div>
            </div>
          </div>

        </div>
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
</style>