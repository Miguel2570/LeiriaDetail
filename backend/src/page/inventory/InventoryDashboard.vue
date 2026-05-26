<template>
  <div class="backdrop-blur-[30px] p-8 flex flex-col h-full overflow-y-auto card-admin">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h3 class="text-3xl font-bold text-[#000000] flex items-center gap-3">
          <Package class="w-8 h-8 text-[#06B6D4]" />
          Inventory Management
        </h3>
        <p class="text-[#334155] font-medium mt-1">Track detailing supplies and receive low-stock alerts</p>
      </div>
      
      <div class="flex items-center gap-3">
        <div class="relative">
          <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search products..." 
            class="pl-9 pr-4 py-2 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] text-sm font-medium w-64 text-[#000000] placeholder-[#94A3B8]"
          />
        </div>
        <button @click="openModal()" class="px-4 py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm">
          <Plus class="w-4 h-4" /> Add Item
        </button>
      </div>
    </div>

    <!-- Alerts -->
    <div v-if="alerts.length > 0" class="mb-8 p-4 rounded-2xl bg-gradient-to-r from-[#FEF2F2] to-[#FFF1F2] border-l-4 border-[#EF4444] shadow-sm flex items-start gap-4">
      <div class="w-10 h-10 rounded-full bg-[#FEE2E2] flex items-center justify-center shrink-0">
        <AlertTriangle class="w-5 h-5 text-[#EF4444]" />
      </div>
      <div>
        <h4 class="font-bold text-[#991B1B]">Low Stock Alert</h4>
        <p class="text-[#B91C1C] text-sm font-medium mt-1">You have {{ alerts.length }} item(s) running critically low.</p>
      </div>
    </div>

    <div v-if="isLoading" class="flex-1 flex items-center justify-center text-[#64748B] font-medium">A carregar inventário...</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="product in filteredProducts" :key="product.id"
        class="p-6 border border-black/10 rounded-2xl bg-white/50 backdrop-blur-sm relative overflow-hidden group hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all"
        style="background: linear-gradient(to bottom right, rgba(255,255,255,0.9), rgba(255,255,255,0.5))">
        
        <div v-if="product.stock_quantity <= product.min_stock" class="absolute top-0 right-0 w-16 h-16 overflow-hidden">
          <div class="absolute transform rotate-45 bg-[#EF4444] text-white text-[10px] font-bold py-1 right-[-35px] top-[15px] w-[120px] text-center shadow-sm">LOW</div>
        </div>
        
        <div class="flex justify-between items-start mb-4">
          <div>
            <p class="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-1">{{ product.category }}</p>
            <h4 class="font-bold text-[#000000] text-lg leading-tight pr-4">{{ product.name }}</h4>
          </div>
          <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button @click="openModal(product)" class="p-1.5 hover:bg-[#E0F2FE] rounded-lg"><Pencil class="w-4 h-4 text-[#0284C7]" /></button>
            <button @click="handleDelete(product.id)" class="p-1.5 hover:bg-[#FEE2E2] rounded-lg"><Trash2 class="w-4 h-4 text-[#DC2626]" /></button>
          </div>
        </div>
        
        <div class="flex items-center justify-between mt-6">
          <CircularProgress 
            :percentage="getStockPercentage(product.stock_quantity, product.min_stock)" 
            :color="getStockColor(product.stock_quantity, product.min_stock)" 
            :isAlert="product.stock_quantity <= product.min_stock" 
          />
          
          <div class="text-right">
            <p class="text-[#475569] text-xs font-semibold mb-2">Status</p>
            <span :class="`px-3 py-1.5 rounded-lg text-xs font-bold ${
              product.stock_quantity <= product.min_stock ? 'bg-[#FEE2E2] text-[#EF4444]' : 
              product.stock_quantity <= product.min_stock * 2 ? 'bg-[#FEF3C7] text-[#D97706]' : 
              'bg-[#E0F2FE] text-[#0284C7]'
            }`">
              {{ product.stock_quantity <= product.min_stock ? 'Reorder Now' : product.stock_quantity <= product.min_stock * 2 ? 'Running Low' : 'Optimal' }}
            </span>
            <p class="text-[10px] text-[#64748B] mt-1">{{ product.stock_quantity }} {{ product.unit }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-[16px]">
      <div class="w-full max-w-sm bg-white/90 backdrop-blur-xl border border-white/50 p-8 rounded-2xl shadow-2xl">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-[#000000]">{{ editingProduct ? 'Edit Product' : 'New Product' }}</h3>
          <button @click="closeModal" class="p-2 hover:bg-black/5 rounded-full"><X class="w-6 h-6 text-[#334155]" /></button>
        </div>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-[#334155] mb-1">Name</label>
            <input required v-model="form.name" class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" />
          </div>
          <div>
            <label class="block text-sm font-bold text-[#334155] mb-1">Category</label>
            <input required v-model="form.category" class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-[#334155] mb-1">Stock</label>
              <input required type="number" v-model="form.stockQuantity" class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" />
            </div>
            <div>
              <label class="block text-sm font-bold text-[#334155] mb-1">Min Stock</label>
              <input required type="number" v-model="form.minStock" class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-[#334155] mb-1">Unit</label>
              <input v-model="form.unit" placeholder="un" class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" />
            </div>
            <div>
              <label class="block text-sm font-bold text-[#334155] mb-1">Supplier</label>
              <input v-model="form.supplier" class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" />
            </div>
          </div>
          <button type="submit" :disabled="isSubmitting" class="w-full mt-6 py-4 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl font-bold shadow-[0_0_12px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all disabled:opacity-50">
            {{ isSubmitting ? 'A guardar...' : (editingProduct ? 'Update Product' : 'Save Product') }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Package, AlertTriangle, Search, Plus, Pencil, Trash2, X } from 'lucide-vue-next'
import CircularProgress from '../components/common/CircularProgress.vue'

interface Product {
  id: number
  name: string
  category: string
  stock_quantity: number
  min_stock: number
  unit: string
  supplier: string
  is_active: boolean
}

const products = ref<Product[]>([])
const alerts = ref<Product[]>([])
const isLoading = ref(true)
const isSubmitting = ref(false)
const isModalOpen = ref(false)
const editingProduct = ref<Product | null>(null)
const searchQuery = ref('')

const form = ref({
  name: '',
  category: '',
  stockQuantity: 0,
  minStock: 10,
  unit: 'un',
  supplier: ''
})

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  const q = searchQuery.value.toLowerCase()
  return products.value.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  )
})

const fetchProducts = async () => {
  try {
    const [productsRes, alertsRes] = await Promise.all([
      fetch('/Inventory'),
      fetch('/Inventory/alerts')
    ])
    const productsData = await productsRes.json()
    const alertsData = await alertsRes.json()
    
    if (!productsData.HasError) products.value = productsData.Products || []
    if (!alertsData.HasError) alerts.value = alertsData.Products || []
  } catch (error) {
    console.error('Erro ao carregar inventário:', error)
  } finally {
    isLoading.value = false
  }
}

const openModal = (product?: Product) => {
  if (product) {
    editingProduct.value = product
    form.value = {
      name: product.name,
      category: product.category,
      stockQuantity: product.stock_quantity,
      minStock: product.min_stock,
      unit: product.unit,
      supplier: product.supplier || ''
    }
  } else {
    editingProduct.value = null
    form.value = { name: '', category: '', stockQuantity: 0, minStock: 10, unit: 'un', supplier: '' }
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingProduct.value = null
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const url = editingProduct.value ? `/Inventory/${editingProduct.value.id}` : '/Inventory'
    const method = editingProduct.value ? 'PUT' : 'POST'
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    await fetchProducts()
    closeModal()
  } catch (error) {
    console.error('Erro ao guardar produto:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async (id: number) => {
  if (!confirm('Remover este produto?')) return
  try {
    await fetch(`/Inventory/${id}`, { method: 'DELETE' })
    products.value = products.value.filter(p => p.id !== id)
  } catch (error) {
    console.error('Erro ao remover produto:', error)
  }
}

const getStockPercentage = (current: number, min: number): number => {
  const max = min * 3
  return Math.min(Math.round((current / max) * 100), 100)
}

const getStockColor = (current: number, min: number): string => {
  if (current <= min) return '#EF4444'
  if (current <= min * 2) return '#F59E0B'
  return '#06B6D4'
}

onMounted(() => {
  fetchProducts()
})
</script>