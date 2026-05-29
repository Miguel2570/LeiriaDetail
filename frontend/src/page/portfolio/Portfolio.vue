<!-- src/page/portfolio/Portfolio.vue -->
<template>
  <section class="py-24 bg-[#050505] relative overflow-hidden min-h-screen">
    
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#2563EB]/10 blur-[120px] rounded-full pointer-events-none"></div>

    <div class="container mx-auto px-4 relative z-10">
      
      <div class="text-center mb-16 border-b border-white/5 pb-12">
        <div class="inline-flex items-center gap-3 mb-6">
          <Camera class="h-4 w-4 text-[#2563EB]" />
          <span class="text-[10px] font-black text-[#2563EB] uppercase tracking-[0.5em] italic">Showcase</span>
        </div>
        
        <h1 class="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none mb-10">
          O NOSSO <span class="text-leiria-gradient">PORTFÓLIO</span>
        </h1>

        <div class="max-w-2xl mx-auto relative group">
          <Search class="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20" />
          <input v-model="searchTerm" placeholder="PESQUISAR..." class="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/5 rounded-2xl text-white text-xs font-black uppercase italic outline-none focus:border-[#2563EB] transition-all tracking-widest" />
        </div>
      </div>

      <div v-if="isLoading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-2 border-[#00D8FF] border-t-transparent"></div>
      </div>

      <template v-else>
        <div class="flex flex-wrap justify-center gap-3 mb-16">
          <button 
            v-for="c in categories" 
            :key="c" 
            @click="activeCategory = c"
            :class="[
              'px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] italic transition-all duration-300 border',
              activeCategory === c 
                ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
                : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20 hover:text-white'
            ]"
          >
            {{ c }}
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <router-link 
            v-for="p in filtered" 
            :key="p.id" 
            :to="`/portfolio/${p.id}`"
            class="group relative overflow-hidden rounded-[2.5rem] bg-[#0A0A0F] aspect-[4/3] border border-white/5 cursor-pointer block"
          >
            <img :src="p.imageUrl" :alt="p.title" class="w-full h-full object-cover group-hover:opacity-90 group-hover:scale-110 transition-all duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90"></div>
            <div class="absolute bottom-0 left-0 p-10 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <div class="flex items-center gap-3 mb-3">
                <div class="h-1 w-8 bg-[#2563EB]"></div>
                <p class="text-[#00D8FF] text-[10px] font-black uppercase tracking-[0.4em] italic">{{ p.category }}</p>
              </div>
              <h3 class="text-white text-3xl font-black uppercase italic tracking-tight">{{ p.title }}</h3>
            </div>
          </router-link>
        </div>
      </template>

    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Search, ExternalLink, Camera } from 'lucide-vue-next';
import { graphql } from '@/graphql';
import { useHead } from '@vueuse/head'

useHead({
  title: 'Portfólio - Trabalhos de Detalhe Automóvel - LeiriaDetail',
  meta: [
    { name: 'description', content: 'Veja os nossos trabalhos de detalhe automóvel. Antes e depois de lavagens básicas e lavagens premium entre outros serviços.' },
  ]
})
interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  isFeatured: boolean;
}

const items = ref<PortfolioItem[]>([]);
const categories = ref<string[]>([]);
const isLoading = ref(true);
const activeCategory = ref('Todos');
const searchTerm = ref('');

const filtered = computed(() => items.value.filter(p => 
  (activeCategory.value === 'Todos' || p.category === activeCategory.value) &&
  p.title.toLowerCase().includes(searchTerm.value.toLowerCase())
));

const fetchPortfolio = async () => {
  try {
    const query = `
      query {
        portfolio {
          items { id title description category imageUrl isFeatured }
          categories
        }
        services {
          services { name packType }
        }
      }
    `;
    const data = await graphql<{ 
      portfolio: { items: PortfolioItem[]; categories: string[] };
      services: { services: { name: string; packType: string }[] };
    }>(query);
    
    items.value = data.portfolio.items;
    
    // Categorias únicas: "Todos" + categorias do portfólio + serviços
    const serviceNames = data.services.services.map(s => s.name);
    const allCategories = ['Todos', ...new Set([...data.portfolio.categories, ...serviceNames])];
    categories.value = allCategories;
    
  } catch (error) {
    console.error("Erro ao carregar portfólio:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchPortfolio);
</script>