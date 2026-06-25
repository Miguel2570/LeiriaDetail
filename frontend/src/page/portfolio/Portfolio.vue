<!-- src/page/portfolio/Portfolio.vue -->
<template>
  <section class="py-24 bg-[#050505] relative overflow-hidden min-h-screen">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#2563EB]/10 blur-[120px] rounded-full pointer-events-none"></div>

    <div class="container mx-auto px-4 relative z-10">
      
      <!-- Header -->
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
        
        <!-- ✅ Barra de filtros + botão abrir sidepanel -->
        <div class="flex items-center justify-between mb-10">
          <div class="flex flex-wrap items-center gap-3">
            <button 
              v-for="pack in packFilters" :key="pack.value" @click="activePackFilter = pack.value"
              :class="[
                'px-4 py-2 rounded-xl font-black uppercase text-[10px] tracking-[0.15em] italic transition-all duration-300 border',
                activePackFilter === pack.value 
                  ? 'bg-gradient-to-r from-[#2563EB] to-[#00D8FF] border-[#00D8FF] text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
                  : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20 hover:text-white'
              ]">
              {{ pack.label }}
            </button>
          </div>

          <div class="flex items-center gap-3">
            <span class="text-xs text-gray-500">{{ filtered.length }} trabalhos</span>
            
            <button 
              @click="showFilterPanel = !showFilterPanel"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border',
                showFilterPanel || hasActiveFilters
                  ? 'bg-[#2563EB] border-[#2563EB] text-white' 
                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
              ]"
            >
              <SlidersHorizontal class="w-4 h-4" />
              Filtros
              <span v-if="activeFiltersCount > 0" class="w-5 h-5 rounded-full bg-white text-black text-[10px] font-black flex items-center justify-center">
                {{ activeFiltersCount }}
              </span>
            </button>
          </div>
        </div>

        <!-- ✅ Grid + Sidepanel -->
        <div class="flex gap-8">
          
          <!-- Grid de Imagens -->
          <div class="flex-1">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <router-link 
                v-for="p in filtered" :key="p.id" :to="`/portfolio/${p.id}`"
                class="group relative overflow-hidden rounded-[2.5rem] bg-[#0A0A0F] aspect-[4/3] border border-white/5 cursor-pointer block">
                
                <img 
                  :src="getImageUrl(p.mainImageData, p.mainImageExtension)" 
                  :alt="p.title" 
                  class="w-full h-full object-cover group-hover:opacity-90 group-hover:scale-110 transition-all duration-700" 
                />
                
                <div class="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90"></div>
                <div class="absolute bottom-0 left-0 p-6 w-full">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="h-1 w-6 bg-[#2563EB]"></div>
                    <p class="text-[#00D8FF] text-[10px] font-black uppercase tracking-[0.3em] italic">{{ p.category }}</p>
                  </div>
                  <h3 class="text-white text-2xl font-black uppercase italic tracking-tight">{{ p.title }}</h3>
                  <span v-if="p.packType" :class="[
                    'inline-block mt-2 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase',
                    p.packType === 'Pack Showroom' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' : 
                    p.packType === 'Pack Premium' ? 'bg-[#00D8FF]/20 text-[#00D8FF]' : 
                    'bg-[#3B82F6]/20 text-[#3B82F6]'
                  ]">{{ p.packType }}</span>
                </div>
              </router-link>
            </div>

            <div v-if="filtered.length === 0 && !isLoading" class="text-center py-20">
              <Search class="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p class="text-gray-400 text-sm">Nenhum trabalho encontrado.</p>
              <button @click="clearFilters" class="mt-4 text-[#00D8FF] text-xs underline">Limpar filtros</button>
            </div>
          </div>

          <!-- ✅ Sidepanel de Filtros -->
          <Transition name="slide-panel">
            <div v-if="showFilterPanel" class="w-72 shrink-0 space-y-6">
              <div class="bg-[#0A0A0F] border border-[#22222A] rounded-2xl p-5 sticky top-28">
                
                <div class="flex items-center justify-between mb-6">
                  <h3 class="text-sm font-black text-white uppercase tracking-widest">Filtros</h3>
                  <button @click="clearFilters" class="text-[10px] text-gray-500 hover:text-[#00D8FF] uppercase tracking-wider">Limpar</button>
                </div>

                <div class="mb-6">
                  <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Ordenar por</h4>
                  <div class="space-y-1">
                    <button 
                      v-for="sort in sortOptions" :key="sort.value"
                      @click="sortBy = sort.value"
                      :class="[
                        'w-full text-left px-3 py-2 rounded-lg text-xs transition-all',
                        sortBy === sort.value ? 'bg-[#2563EB]/10 text-[#00D8FF]' : 'text-gray-400 hover:text-white hover:bg-white/5'
                      ]">
                      {{ sort.label }}
                    </button>
                  </div>
                </div>

                <div class="mb-6">
                  <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Categorias</h4>
                  <div class="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                    <button 
                      v-for="c in mainCategories" :key="c"
                      @click="activeCategory = c"
                      :class="[
                        'w-full text-left px-3 py-2 rounded-lg text-xs transition-all',
                        activeCategory === c 
                          ? 'bg-gradient-to-r from-[#2563EB]/20 to-[#00D8FF]/10 text-[#00D8FF] border border-[#00D8FF]/20' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      ]">
                      {{ c }}
                    </button>
                  </div>
                </div>

                <div>
                  <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Serviços Adicionais</h4>
                  <div class="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                    <button 
                      v-for="extra in extraFilters" :key="extra.value"
                      @click="toggleExtraFilter(extra.value)"
                      :class="[
                        'w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center gap-2',
                        activeExtraFilters.includes(extra.value) ? 'bg-[#10B981]/10 text-[#10B981]' : 'text-gray-400 hover:text-white hover:bg-white/5'
                      ]">
                      <span class="flex-1">{{ extra.label }}</span>
                      <Check v-if="activeExtraFilters.includes(extra.value)" class="w-3 h-3 text-[#10B981]" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </Transition>

        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Search, Camera, SlidersHorizontal, Check } from 'lucide-vue-next';
import { graphql } from '@/graphql';
import { base64ToDataUrl } from '@/Helpers/FileHelper';
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
  mainImageData?: string;
  mainImageExtension?: string;
  isFeatured: boolean;
  packType?: string;
  createdAt?: string;
}

const items = ref<PortfolioItem[]>([]);
const categories = ref<string[]>([]);
const isLoading = ref(true);
const activeCategory = ref('Todos');
const activePackFilter = ref('Todos');
const searchTerm = ref('');
const showFilterPanel = ref(false);
const activeExtraFilters = ref<string[]>([]);
const sortBy = ref('recent');

const sortOptions = [
  { value: 'recent', label: 'Mais recentes' },
  { value: 'oldest', label: 'Mais antigos' },
  { value: 'name-asc', label: 'Nome A-Z' },
  { value: 'name-desc', label: 'Nome Z-A' },
];

const packFilters = [
  { value: 'Todos', label: 'Todos' },
  { value: 'Pack Essencial', label: 'Essencial' },
  { value: 'Pack Premium', label: 'Premium' },
  { value: 'Pack Showroom', label: 'Showroom' },
];

const extraFilters = [
  { value: 'Cera / Selante', label: 'Cera / Selante' },
  { value: 'Hidratação Plásticos Exterior', label: 'Hidratação Plásticos' },
  { value: 'Proteção UV Interior', label: 'Proteção UV Interior' },
  { value: 'Limpeza do Motor', label: 'Limpeza do Motor' },
  { value: 'Neutralização de Odores', label: 'Neutralização Odores' },
  { value: 'Restauro de Faróis', label: 'Restauro de Faróis' },
  { value: 'Remoção de Pêlos de Animal', label: 'Pêlos de Animal' },
  { value: 'Remoção de Calcário', label: 'Remoção de Calcário' },
];

const mainCategories = computed(() => {
  return categories.value.filter(c => 
    c !== 'Todos' && !extraFilters.some(e => e.value === c)
  );
});

const hasActiveFilters = computed(() => {
  return activeExtraFilters.value.length > 0 || activeCategory.value !== 'Todos' || sortBy.value !== 'recent';
});

const activeFiltersCount = computed(() => {
  let count = 0;
  if (activeCategory.value !== 'Todos') count++;
  count += activeExtraFilters.value.length;
  if (sortBy.value !== 'recent') count++;
  return count;
});

const getImageUrl = (base64?: string, extension?: string) => {
  if (!base64) return '';
  return base64ToDataUrl(base64, extension || 'jpg');
};

const toggleExtraFilter = (value: string) => {
  const index = activeExtraFilters.value.indexOf(value);
  if (index >= 0) {
    activeExtraFilters.value.splice(index, 1);
  } else {
    activeExtraFilters.value.push(value);
  }
};

const clearFilters = () => {
  activeCategory.value = 'Todos';
  activePackFilter.value = 'Todos';
  searchTerm.value = '';
  activeExtraFilters.value = [];
  sortBy.value = 'recent';
};

const filtered = computed(() => {
  let result = items.value.filter(p => {
    const matchesPack = activePackFilter.value === 'Todos' || p.packType === activePackFilter.value;
    const matchesCategory = activeCategory.value === 'Todos' || p.category === activeCategory.value;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.value.toLowerCase());
    const matchesExtra = activeExtraFilters.value.length === 0 || 
      activeExtraFilters.value.some(extra => p.category?.includes(extra));
    return matchesPack && matchesCategory && matchesSearch && matchesExtra;
  });

  switch (sortBy.value) {
    case 'oldest':
      result.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
      break;
    case 'name-asc':
      result.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'name-desc':
      result.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case 'recent':
    default:
      result.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      break;
  }

  return result;
});

const fetchPortfolio = async () => {
  try {
    const query = `
      query {
        portfolio {
          items { 
            id title description category 
            mainImageData mainImageExtension 
            isFeatured createdAt
          }
          categories
        }
      }
    `;
    const data = await graphql<{ 
      portfolio: { items: any[]; categories: string[] };
    }>(query);
    
    items.value = data.portfolio.items.map(item => ({
      ...item,
      packType: item.packType || inferPackType(item.category, [])
    }));
    
    categories.value = ['Todos', ...new Set(data.portfolio.categories)];
    
  } catch (error) {
    console.error("Erro ao carregar portfólio:", error);
  } finally {
    isLoading.value = false;
  }
};

const inferPackType = (category: string, services: { name: string; packType: string }[]): string | undefined => {
  const service = services.find(s => 
    s.name.toLowerCase().includes(category.toLowerCase()) ||
    category.toLowerCase().includes(s.name.toLowerCase())
  );
  if (service) {
    if (service.name.includes('Essencial')) return 'Pack Essencial';
    if (service.name.includes('Premium')) return 'Pack Premium';
    if (service.name.includes('Showroom')) return 'Pack Showroom';
  }
  return undefined;
};

onMounted(fetchPortfolio);
</script>

<style scoped>
.text-leiria-gradient {
  background: linear-gradient(to right, #2563EB, #00D8FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.slide-panel-enter-active {
  transition: all 0.3s ease-out;
}
.slide-panel-leave-active {
  transition: all 0.2s ease-in;
}
.slide-panel-enter-from {
  opacity: 0;
  transform: translateX(20px);
  width: 0;
}
.slide-panel-leave-to {
  opacity: 0;
  transform: translateX(20px);
  width: 0;
}

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
</style>