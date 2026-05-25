<template>
  <div class="backdrop-blur-[30px] p-8 flex flex-col h-full overflow-y-auto" :style="cardStyle">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h3 class="text-3xl font-[Poppins] font-bold text-[#000000] flex items-center gap-3">
          <Package class="w-8 h-8 text-[#06B6D4]" />
          Inventory Management
        </h3>
        <p class="text-[#334155] font-medium mt-1">Track detailing supplies and receive low-stock alerts</p>
      </div>
      
      <div class="flex items-center gap-3">
        <div class="relative">
          <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input 
            type="text" 
            placeholder="Search products..." 
            class="pl-9 pr-4 py-2 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] text-sm font-medium w-64 text-[#000000] placeholder-[#94A3B8]"
          />
        </div>
        <button class="p-2.5 bg-white/60 border border-[#06B6D4]/30 rounded-xl hover:bg-white/80 transition-colors">
          <Filter class="w-4 h-4 text-[#334155]" />
        </button>
        <button class="px-4 py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm">
          <Plus class="w-4 h-4" />
          Add Item
        </button>
      </div>
    </div>

    <!-- Alerts Section -->
    <div class="mb-8 p-4 rounded-2xl bg-gradient-to-r from-[#FEF2F2] to-[#FFF1F2] border-l-4 border-[#EF4444] shadow-sm flex items-start gap-4">
      <div class="w-10 h-10 rounded-full bg-[#FEE2E2] flex items-center justify-center shrink-0">
        <AlertTriangle class="w-5 h-5 text-[#EF4444]" />
      </div>
      <div>
        <h4 class="font-[Poppins] font-bold text-[#991B1B]">Low Stock Alert</h4>
        <p class="text-[#B91C1C] text-sm font-medium mt-1">You have 3 items running critically low. Please reorder soon to avoid service interruptions.</p>
      </div>
    </div>

    <!-- Inventory Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="(product, idx) in products" :key="idx" class="p-6 border border-black/10 rounded-2xl bg-white/50 backdrop-blur-sm relative overflow-hidden group hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all" :style="{ background: 'linear-gradient(to bottom right, rgba(255,255,255,0.9), rgba(255,255,255,0.5))' }">
        <div v-if="product.isAlert" class="absolute top-0 right-0 w-16 h-16 overflow-hidden">
          <div class="absolute transform rotate-45 bg-[#EF4444] text-white text-[10px] font-bold py-1 right-[-35px] top-[15px] w-[120px] text-center shadow-sm">
            LOW
          </div>
        </div>
        
        <div class="flex justify-between items-start mb-4">
          <div>
            <p class="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-1">{{ product.category }}</p>
            <h4 class="font-[Poppins] font-bold text-[#000000] text-lg leading-tight pr-4">{{ product.name }}</h4>
          </div>
        </div>
        
        <div class="flex items-center justify-between mt-6">
          <CircularProgress :percentage="product.stock" :color="product.color" :isAlert="product.isAlert || false" />
          
          <div class="text-right">
            <p class="text-[#475569] text-xs font-semibold mb-2">Status</p>
            <span :class="`px-3 py-1.5 rounded-lg text-xs font-bold ${
              product.stock <= 15 ? 'bg-[#FEE2E2] text-[#EF4444]' : 
              product.stock <= 30 ? 'bg-[#FEF3C7] text-[#D97706]' : 
              'bg-[#E0F2FE] text-[#0284C7]'
            }`">
              {{ product.stock <= 15 ? 'Reorder Now' : product.stock <= 30 ? 'Running Low' : 'Optimal' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Package, AlertTriangle, Search, Plus, Filter } from 'lucide-vue-next'
import CircularProgress from '../components/common/CircularProgress.vue'

interface Product {
  name: string
  category: string
  stock: number
  color: string
  isAlert?: boolean
}

const products: Product[] = [
  { name: "Gyeon Quartz Q2 Matte", category: "Ceramic Coatings", stock: 85, color: "#06B6D4" },
  { name: "CarPro IronX", category: "Decontamination", stock: 42, color: "#3B82F6" },
  { name: "Koch Chemie P6.01", category: "Polishes & Compounds", stock: 65, color: "#3B82F6" },
  { name: "Colourlock Leather Shield", category: "Interior", stock: 15, color: "#EF4444", isAlert: true },
  { name: "Gtechniq C5 Wheel Armour", category: "Ceramic Coatings", stock: 8, color: "#EF4444", isAlert: true },
  { name: "Meguiar's APC", category: "Cleaners", stock: 92, color: "#06B6D4" },
  { name: "Rupes Yellow Foam Pads", category: "Accessories", stock: 25, color: "#F59E0B", isAlert: true },
  { name: "Sonax Perfect Finish", category: "Polishes & Compounds", stock: 55, color: "#3B82F6" },
]

const cardStyle = {
  background: 'linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2)), #FFFFFF',
  boxShadow: '0 0 12px 0 rgba(0, 0, 0, 0.7)',
  borderRadius: '16px',
}
</script>