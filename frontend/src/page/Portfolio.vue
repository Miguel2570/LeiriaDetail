<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, ExternalLink, Camera } from 'lucide-vue-next'

const categories = ['Todos', 'Exterior', 'Interior', 'Proteção Cerâmica', 'Polimento']
const activeCategory = ref('Todos')
const searchTerm = ref('')

const projects = [
  { title: 'Tesla Model 3', cat: 'Proteção Cerâmica', img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800' },
  { title: 'BMW Série 1', cat: 'Interior', img: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800' },
  { title: 'Porsche Macan', cat: 'Exterior', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800' },
  { title: 'Audi RS6', cat: 'Polimento', img: 'https://images.unsplash.com/photo-1603553323145-3ec9f4497b3e?w=800' }
]

const filtered = computed(() => projects.filter(p => 
  (activeCategory.value === 'Todos' || p.cat === activeCategory.value) &&
  p.title.toLowerCase().includes(searchTerm.value.toLowerCase())
))
</script>

<template>
  <section class="py-24 bg-[#050505] relative overflow-hidden min-h-screen">
    
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#3B82F6]/10 blur-[120px] rounded-full pointer-events-none"></div>

    <div class="container mx-auto px-4 relative z-10">
      
      <div class="text-center mb-16 border-b border-white/5 pb-12">
        <div class="inline-flex items-center gap-3 mb-6">
          <Camera class="h-4 w-4 text-[#3B82F6]" />
          <span class="text-[10px] font-black text-[#3B82F6] uppercase tracking-[0.5em] italic">Showcase</span>
        </div>
        
        <h1 class="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none mb-10">
          O NOSSO <span class="text-leiria-gradient">PORTFÓLIO</span>
        </h1>

        <div class="max-w-2xl mx-auto relative group">
          <Search class="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-[#3B82F6] transition-colors" />
          <input 
            v-model="searchTerm" 
            placeholder="PESQUISAR VIATURA OU TRABALHO..." 
            class="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/5 rounded-2xl text-white text-xs font-black uppercase italic outline-none focus:border-[#3B82F6] focus:bg-white/[0.05] transition-all tracking-widest" 
          />
        </div>
      </div>

      <div class="flex flex-wrap justify-center gap-3 mb-16">
        <button 
          v-for="c in categories" :key="c" 
          @click="activeCategory = c"
          :class="[
            'px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] italic transition-all duration-300 border',
            activeCategory === c 
              ? 'bg-[#3B82F6] border-[#3B82F6] text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
              : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20 hover:text-white'
          ]"
        >
          {{ c }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div 
          v-for="p in filtered" :key="p.title" 
          class="group relative overflow-hidden rounded-[2.5rem] bg-[#0A0A0F] aspect-[4/3] border border-white/5"
        >
          <img 
            :src="p.img" 
            :alt="p.title" 
            class="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700" 
          />
          
          <div class="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90"></div>
          
          <div class="absolute bottom-0 left-0 p-10 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            <div class="flex items-center gap-3 mb-3">
              <div class="h-1 w-8 bg-[#3B82F6]"></div>
              <p class="text-[#06B6D4] text-[10px] font-black uppercase tracking-[0.4em] italic">{{ p.cat }}</p>
            </div>
            
            <h3 class="text-white text-3xl font-black uppercase italic tracking-tight flex items-center justify-between">
              {{ p.title }}
              <div class="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-[#3B82F6]">
                <ExternalLink class="h-4 w-4 text-white" />
              </div>
            </h3>
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

input::placeholder {
  color: rgba(255, 255, 255, 0.1);
  font-weight: 900;
}
</style>