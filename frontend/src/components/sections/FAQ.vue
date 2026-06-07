<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

const faqs = [
  {
    question: 'Quanto tempo demora o serviço?',
    answer: 'O tempo varia consoante o serviço escolhido. A lavagem exterior demora cerca de 1h30, o detalhe interior 2h, e o tratamento premium pode demorar 4-6 horas, dependendo do estado do veículo.'
  },
  {
    question: 'Onde fazem o serviço?',
    answer: 'Somos totalmente móveis! Fazemos o serviço na sua casa, local de trabalho, ou qualquer lugar com acesso ao veículo dentro da região de Leiria e arredores.'
  },
  {
    question: 'Que produtos utilizam?',
    answer: 'Utilizamos apenas produtos certificados e de alta qualidade, incluindo marcas como Gyeon, Koch Chemie, CarPro e Menzerna. Todos os produtos são testados e seguros para todo o tipo de pinturas e materiais.'
  },
  {
    question: 'É necessário marcar com antecedência?',
    answer: 'Sim, recomendamos marcação com pelo menos 48h de antecedência para garantir a melhor disponibilidade. Pode agendar diretamente através do nosso site.'
  },
  {
    question: 'Têm garantia?',
    answer: 'Sim, oferecemos garantia de satisfação em todos os serviços. O tratamento premium tem garantia de 12 meses na proteção cerâmica aplicada.'
  },
  {
    question: 'Qual é a área de cobertura?',
    answer: 'Atendemos todo o distrito de Leiria, incluindo Leiria cidade, Marinha Grande, Batalha, Porto de Mós, Ourém e Fátima. Para outras localizações, contacte-nos para verificar disponibilidade.'
  },
  {
    question: 'Como posso pagar?',
    answer: 'Aceitamos pagamentos por MB Way, transferência bancária, numerário e cartão de crédito/débito (via terminal móvel).'
  },
  {
    question: 'O serviço inclui limpeza interior completa?',
    answer: 'Depende do pack escolhido. O pack de Lavagem Exterior inclui apenas exterior. O pack Detalhe Interior inclui limpeza profunda do habitáculo. O pack Completo inclui ambos.'
  }
]

const openIndex = ref<number | null>(null)

const toggleFaq = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <section class="py-24 px-4 relative z-10 bg-white/50">
    <div class="container mx-auto max-w-4xl">
      
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-6">
          <span class="text-[10px] font-black text-[#00D8FF] uppercase tracking-[0.3em]">Dúvidas Frequentes</span>
        </div>
        <h2 class="text-4xl md:text-6xl font-black text-gray-900 uppercase italic tracking-tighter drop-shadow-sm">
          Perguntas <span class="bg-gradient-to-r from-[#2563EB] to-[#00D8FF] bg-clip-text text-transparent">Frequentes</span>
        </h2>
        <p class="text-gray-500 mt-4 max-w-xl mx-auto">
          Tire todas as suas dúvidas sobre os nossos serviços
        </p>
      </div>

      <div class="space-y-4">
        <div 
          v-for="(faq, index) in faqs" 
          :key="index"
          class="bg-[#0A0A0F]/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-[#3B82F6]/30 transition-all duration-300"
        >
          <button 
            @click="toggleFaq(index)"
            class="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <span class="text-white font-bold text-base">{{ faq.question }}</span>
            <ChevronDown 
              class="w-5 h-5 text-[#00D8FF] transition-transform duration-300" 
              :class="{ 'rotate-180': openIndex === index }" 
            />
          </button>
          
          <div 
            v-show="openIndex === index"
            class="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/10 pt-4"
          >
            {{ faq.answer }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>