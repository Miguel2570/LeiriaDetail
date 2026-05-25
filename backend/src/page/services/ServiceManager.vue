<template>
  <motion.div 
    :initial="{ opacity: 0, y: 10 }"
    :animate="{ opacity: 1, y: 0 }"
    class="backdrop-blur-[30px] p-8 h-full flex flex-col relative" 
    :style="containerStyle"
  >
    <div class="flex items-center justify-between mb-8">
      <h3 class="text-3xl font-[Poppins] font-bold text-[#000000]">Service & Price Manager</h3>
      <button 
        @click="setIsModalOpen(true)"
        class="px-4 py-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-bold rounded-xl shadow-[0_0_12px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all flex items-center gap-2"
      >
        <Plus class="w-5 h-5" />
        Create Service
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-2 pb-4">
      <AnimatePresence>
        <motion.div
          v-for="service in services"
          :key="service.id"
          :initial="{ opacity: 0, scale: 0.95 }"
          :animate="{ opacity: 1, scale: 1 }"
          :exit="{ opacity: 0, scale: 0.95 }"
          class="p-5 border border-black/10 hover:border-[#06B6D4] transition-all group shadow-sm hover:shadow-md"
          :style="containerStyle"
        >
          <div class="flex items-start justify-between mb-3">
            <span :class="`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
              service.category === 'Premium'
                ? 'bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                : service.category === 'Standard'
                ? 'bg-[#E0F2FE] text-[#0284C7]'
                : 'bg-[#F1F5F9] text-[#475569]'
            }`">
              {{ service.category }}
            </span>
            <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button class="p-1.5 hover:bg-[#E0F2FE] rounded-lg transition-colors">
                <Edit class="w-4 h-4 text-[#0284C7]" />
              </button>
              <button 
                @click="removeService(service.id)"
                class="p-1.5 hover:bg-[#FEE2E2] rounded-lg transition-colors"
              >
                <Trash2 class="w-4 h-4 text-[#DC2626]" />
              </button>
            </div>
          </div>

          <h4 class="font-bold text-[#000000] text-lg mb-4">{{ service.name }}</h4>

          <div class="flex items-center justify-between pt-4 border-t border-black/5">
            <div class="text-[#0284C7] font-bold text-xl">
              {{ service.price }}
            </div>
            <div class="text-[#475569] font-semibold text-sm bg-black/5 px-2 py-1 rounded">
              {{ service.duration }}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>

    <AnimatePresence>
      <motion.div 
        v-if="isModalOpen"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        class="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-[16px]"
      >
        <motion.div 
          :initial="{ scale: 0.9, opacity: 0, y: 20 }"
          :animate="{ scale: 1, opacity: 1, y: 0 }"
          :exit="{ scale: 0.9, opacity: 0, y: 20 }"
          class="w-full max-w-sm bg-white/90 backdrop-blur-xl border border-white/50 p-8 rounded-2xl shadow-2xl"
        >
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-[Poppins] font-bold text-[#000000]">New Service</h3>
            <button @click="setIsModalOpen(false)" class="p-2 hover:bg-black/5 rounded-full transition-colors">
              <X class="w-6 h-6 text-[#334155]" />
            </button>
          </div>

          <form @submit="handleAddService" class="space-y-4">
            <div>
              <label class="block text-sm font-bold text-[#334155] mb-1">Service Name</label>
              <input 
                required
                type="text" 
                v-model="newService.name"
                class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium"
                placeholder="e.g. Headlight Restoration"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-[#334155] mb-1">Price</label>
                <input 
                  required
                  type="text" 
                  v-model="newService.price"
                  class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium"
                  placeholder="e.g. 50"
                />
              </div>
              <div>
                <label class="block text-sm font-bold text-[#334155] mb-1">Duration</label>
                <input 
                  required
                  type="text" 
                  v-model="newService.duration"
                  class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium"
                  placeholder="e.g. 1h 30m"
                />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-bold text-[#334155] mb-1">Category</label>
              <select 
                v-model="newService.category"
                class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium"
              >
                <option value="Basic">Basic</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
              </select>
            </div>

            <button type="submit" class="w-full mt-6 py-4 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl font-bold shadow-[0_0_12px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all">
              Save Service
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  </motion.div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { motion, AnimatePresence } from 'motion-v'
import { Edit, Trash2, Plus, X } from 'lucide-vue-next'

interface Service {
  id: number
  name: string
  price: string
  duration: string
  category: string
}

const initialServices: Service[] = [
  { id: 1, name: 'Express Detail', price: '€89', duration: '2h', category: 'Basic' },
  { id: 2, name: 'Full Detail', price: '€249', duration: '4h', category: 'Premium' },
  { id: 3, name: 'Interior Clean', price: '€129', duration: '2h', category: 'Basic' },
  { id: 4, name: 'Polish & Wax', price: '€179', duration: '2h', category: 'Standard' },
  { id: 5, name: 'Ceramic Coating', price: '€599', duration: '1 day', category: 'Premium' },
  { id: 6, name: 'Paint Correction', price: '€399', duration: '6h', category: 'Premium' },
]

const services = ref<Service[]>(initialServices)
const isModalOpen = ref(false)
const newService = ref({
  name: '',
  price: '',
  duration: '',
  category: 'Basic'
})

const setIsModalOpen = (value: boolean) => {
  isModalOpen.value = value
}

const removeService = (id: number) => {
  services.value = services.value.filter(s => s.id !== id)
}

const handleAddService = (e: Event) => {
  e.preventDefault()
  if (!newService.value.name || !newService.value.price) return
  
  services.value = [{
    id: Date.now(),
    name: newService.value.name,
    price: newService.value.price.startsWith('€') ? newService.value.price : `€${newService.value.price}`,
    duration: newService.value.duration || '1h',
    category: newService.value.category
  }, ...services.value]
  
  isModalOpen.value = false
  newService.value = { name: '', price: '', duration: '', category: 'Basic' }
}

const containerStyle = {
  background: 'linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2)), #FFFFFF',
  boxShadow: '0 0 12px 0 rgba(0, 0, 0, 0.7)',
  borderRadius: '16px',
}
</script>