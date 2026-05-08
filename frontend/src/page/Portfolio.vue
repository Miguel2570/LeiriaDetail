<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search } from 'lucide-vue-next'

const searchTerm = ref('')
const selectedFilter = ref('Todos')

const filters = ['Todos', 'Interior', 'Exterior', 'Polimento', 'Proteção', 'Estofos']
const portfolioItems = [
  { id: 1, brand: 'BMW', model: 'Série 3', services: ['Interior', 'Estofos'], image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400' },
  { id: 2, brand: 'Audi', model: 'A4', services: ['Exterior', 'Polimento'], image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400' }
]

const filteredItems = computed(() => {
  return portfolioItems.filter(item => {
    const matchesSearch = item.model.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesFilter = selectedFilter.value === 'Todos' || item.services.includes(selectedFilter.value)
    return matchesSearch && matchesFilter
  })
})
</script>

<template>
  <div class="py-16 container mx-auto px-4">
    <h1 class="text-4xl font-bold text-center mb-12">Nosso <span class="text-[#3B82F6]">Portfólio</span></h1>

    <div class="relative max-w-2xl mx-auto mb-8">
      <Search class="absolute left-3 top-3 h-5 w-5 text-gray-400" />
      <input v-model="searchTerm" type="text" placeholder="Pesquisar modelo ou marca..." 
             class="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3B82F6] outline-none">
    </div>

    <div class="flex flex-wrap gap-2 justify-center mb-12">
      <button v-for="f in filters" :key="f" @click="selectedFilter = f"
              :class="['px-4 py-1 rounded-full text-sm border transition-colors', 
                      selectedFilter === f ? 'bg-[#3B82F6] text-white' : 'hover:border-[#3B82F6]']">
        {{ f }}
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="item in filteredItems" :key="item.id" class="border rounded-xl overflow-hidden group">
        <img :src="item.image" :alt="item.model" class="w-full h-48 object-cover group-hover:scale-105 transition-transform">
        <div class="p-4">
          <span class="text-xs text-gray-400 font-bold uppercase">{{ item.brand }}</span>
          <h3 class="text-lg font-bold">{{ item.model }}</h3>
          <div class="flex flex-wrap gap-1 mt-2">
            <span v-for="s in item.services" :key="s" class="text-[10px] bg-gray-100 px-2 py-0.5 rounded">{{ s }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>