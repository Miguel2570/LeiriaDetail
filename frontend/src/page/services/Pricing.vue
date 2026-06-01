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
          Os nossos valores refletem a qualidade dos produtos utilizados. Cada carro é único, e o detalhe é feito à medida.
        </p>

        <div class="flex flex-wrap justify-center gap-6">
          <div v-for="t in checkmarks" :key="t" class="flex items-center gap-2">
            <div class="h-1.5 w-1.5 bg-[#00D8FF] rounded-full"></div>
            <span class="text-[10px] font-black text-white/50 uppercase tracking-widest">{{ t }}</span>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00D8FF]"></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        <div v-for="pkg in pricingPackages" :key="pkg.name" 
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
            <h3 class="text-2xl font-black text-white uppercase italic tracking-tight mb-2">Pack {{ pkg.name }}</h3>
            <p class="text-xs text-gray-500 uppercase tracking-widest leading-relaxed min-h-[40px]">{{ pkg.desc }}</p>
          </div>

          <div class="mb-8 pb-8 border-b border-white/5 flex-grow-0">
            <span class="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-1">{{ pkg.prefix }}</span>
            <div class="flex items-baseline gap-1">
              <span class="text-5xl font-black text-white italic tracking-tighter">{{ pkg.price }}</span>
            </div>
          </div>

          <div class="mb-6 p-4 bg-white/[0.02] rounded-xl">
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Preço por Categoria</p>
            <div class="space-y-2">
              <div class="flex justify-between text-xs">
                <span class="text-gray-500">Citadino</span>
                <span class="text-white font-bold">{{ pkg.firstService?.priceAB || 0 }}€</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-gray-500">Luxo</span>
                <span class="text-white font-bold">{{ pkg.firstService?.priceC || 0 }}€</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-gray-500">Premium</span>
                <span class="text-white font-bold">{{ pkg.firstService?.priceDE || 0 }}€</span>
              </div>
            </div>
          </div>

          <ul class="space-y-3 mb-6 flex-grow">
            <li v-for="svc in pkg.services" :key="svc.id" class="flex items-start gap-3">
              <div class="mt-0.5 rounded-full p-0.5 flex-shrink-0 bg-[#2563EB]/20 text-[#00D8FF]">
                <Check class="h-3 w-3" />
              </div>
              <div>
                <span class="text-xs uppercase tracking-wider font-bold text-gray-300">{{ svc.name }}</span>
                <!-- ✅ Link para detalhes -->
                <router-link 
                  :to="`/servicos/${svc.id}`" 
                  class="text-[10px] text-[#00D8FF] hover:underline block mt-0.5"
                >
                  Saber mais →
                </router-link>
              </div>
            </li>
          </ul>

          <button 
            @click="router.push('/agenda')"
            :class="[
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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Check, Star, ArrowRight } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { graphql } from '@/graphql';

const router = useRouter();

interface Service {
  id: string;
  name: string;
  description: string;
  priceAB: number;
  priceC: number;
  priceDE: number;
  durationMinutes: number;
  packType: string;
}

const services = ref<Service[]>([]);
const isLoading = ref(true);

const checkmarks = ['Orçamentos Exatos', 'Sem Surpresas', 'Garantia', 'Transparência'];

const pricingPackages = computed(() => {
  const basicoServices = services.value.filter(s => s.packType === 'Básico');
  const premiumServices = services.value.filter(s => s.packType === 'Premium');

  const basicoPrices = basicoServices.map(s => s.priceAB).filter(p => p > 0);
  const premiumPrices = premiumServices.map(s => s.priceAB).filter(p => p > 0);
  
  const basicoMinPrice = basicoPrices.length > 0 ? Math.min(...basicoPrices) : 15;
  const premiumMinPrice = premiumPrices.length > 0 ? Math.min(...premiumPrices) : 20;

  return [
    {
      name: 'Básico',
      price: `${basicoMinPrice}€`,
      prefix: 'Desde',
      desc: 'Cuidados essenciais para manter a sua viatura impecável.',
      highlight: false,
      firstService: basicoServices[0] || null,
      services: basicoServices
    },
    {
      name: 'Premium',
      price: `${premiumMinPrice}€`,
      prefix: 'Desde',
      desc: 'Tratamentos de excelência com produtos de alta gama.',
      highlight: true,
      firstService: premiumServices[0] || null,
      services: premiumServices
    }
  ];
});

const fetchServices = async () => {
  try {
    const query = `
      query {
        services {
          services {
            id
            name
            description
            priceAB
            priceC
            priceDE
            durationMinutes
            packType
          }
        }
      }
    `;
    const data = await graphql<{ services: { services: Service[] } }>(query);
    services.value = data.services.services;
  } catch (error) {
    console.error("Erro ao carregar serviços:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchServices);
</script>