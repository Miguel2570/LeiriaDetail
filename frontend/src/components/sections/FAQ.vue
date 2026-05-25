<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ChevronDown, HelpCircle, Mail } from 'lucide-vue-next';
import { graphql } from '@/graphql';

interface Faq {
  id: string;
  question: string;
  answer: string;
  orderIndex: number;
}

const faqs = ref<Faq[]>([]);
const isLoading = ref(true);
const openIndex = ref<number | null>(null);

const toggleFaq = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const fetchFaqs = async () => {
  try {
    const query = `
      query {
        faqs {
          faqs { id question answer orderIndex }
        }
      }
    `;
    const data = await graphql<{ faqs: { faqs: Faq[] } }>(query);
    faqs.value = data.faqs.faqs;
  } catch (error) {
    console.error("Erro ao carregar FAQs:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchFaqs);
</script>

<template>
  <section class="py-24 bg-[#020204] relative overflow-hidden">
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2563EB]/8 blur-[120px] rounded-full pointer-events-none"></div>

    <div class="container mx-auto max-w-3xl px-4 relative z-10">
      
      <!-- Header -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-6">
          <HelpCircle class="w-4 h-4 text-[#00D8FF]" />
          <span class="text-[10px] font-black text-[#00D8FF] uppercase tracking-[0.3em]">Perguntas Frequentes</span>
        </div>
        <h2 class="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
          Tudo o que <span class="text-leiria-gradient">precisas</span> de saber
        </h2>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-[#00D8FF] border-t-transparent"></div>
      </div>

      <!-- FAQ List -->
      <div v-else class="space-y-3">
        <div 
          v-for="(faq, i) in faqs" 
          :key="faq.id"
          class="bg-[#050508] border rounded-2xl overflow-hidden transition-all duration-300"
          :class="openIndex === i ? 'border-[#00D8FF]/30' : 'border-white/5'"
        >
          <button 
            @click="toggleFaq(i)" 
            class="w-full px-6 py-5 flex items-center justify-between text-left gap-4"
          >
            <span class="text-sm font-bold text-white pr-4">
              {{ faq.question }}
            </span>
            
            <ChevronDown 
              class="w-5 h-5 shrink-0 transition-transform duration-300"
              :class="openIndex === i ? 'text-[#00D8FF] rotate-180' : 'text-gray-500'"
            />
          </button>

          <div 
            class="grid transition-all duration-300"
            :style="{ gridTemplateRows: openIndex === i ? '1fr' : '0fr' }"
          >
            <div class="min-h-0 overflow-hidden">
              <p class="px-6 pb-5 text-sm text-gray-400 leading-relaxed">
                {{ faq.answer }}
              </p>
            </div>
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