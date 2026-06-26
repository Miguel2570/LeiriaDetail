<template>
  <div class="backdrop-blur-[30px] p-8 h-full flex flex-col relative card-admin">
    <div class="flex items-center justify-between mb-8">
      <h3 class="text-3xl font-bold text-[#000000]">Service & Price Manager</h3>
      <button @click="openCreateModal" class="px-4 py-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-bold rounded-xl shadow-[0_0_12px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all flex items-center gap-2">
        <Plus class="w-5 h-5" /> Create Service
      </button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="text-center py-20 text-[#64748B] font-medium">A carregar serviços...</div>

    <div v-else class="flex-1 overflow-y-auto pr-2 pb-4 space-y-8">
      
      <!-- ✅ PACKS -->
      <div>
        <h4 class="text-lg font-bold text-[#000000] mb-4 flex items-center gap-2">
          <Package class="w-5 h-5 text-[#F59E0B]" /> Packs
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="service in packServices" :key="service.id"
            class="p-5 border border-black/10 hover:border-[#F59E0B] transition-all group shadow-sm hover:shadow-md card-inner rounded-2xl">
            <div class="flex items-start justify-between mb-3">
              <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-[#FEF3C7] text-[#D97706]">{{ service.pack_type }}</span>
              <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="openEditModal(service)" class="p-1.5 hover:bg-[#E0F2FE] rounded-lg"><Edit class="w-4 h-4 text-[#0284C7]" /></button>
                <button @click="deleteService(service.id)" class="p-1.5 hover:bg-[#FEE2E2] rounded-lg"><Trash2 class="w-4 h-4 text-[#DC2626]" /></button>
              </div>
            </div>
            <h4 class="font-bold text-[#000000] text-lg mb-2">{{ service.name }}</h4>
            <p class="text-xs text-[#64748B] mb-4 line-clamp-2">{{ service.description }}</p>
            <div class="flex items-center justify-between pt-4 border-t border-black/5">
              <div class="text-[#0284C7] font-bold text-xl">€{{ service.price_c }}</div>
              <div class="text-[#475569] font-semibold text-sm bg-black/5 px-2 py-1 rounded">{{ service.duration_minutes }}min</div>
            </div>
            <div v-if="service.loyalty_points > 0" class="mt-3 pt-3 border-t border-[#10B981]/20">
              <span class="text-[#10B981] text-xs font-bold">🪙 +{{ service.loyalty_points }} LeiriaPoints</span>
            </div>
          </div>
          <div v-if="packServices.length === 0" class="col-span-full text-center py-8 text-[#64748B] text-sm">Nenhum pack encontrado.</div>
        </div>
      </div>

      <!-- ✅ EXTRAS -->
      <div>
        <h4 class="text-lg font-bold text-[#000000] mb-4 flex items-center gap-2">
          <Puzzle class="w-5 h-5 text-[#8B5CF6]" /> Extras
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="service in extraServices" :key="service.id"
            class="p-5 border border-black/10 hover:border-[#8B5CF6] transition-all group shadow-sm hover:shadow-md card-inner rounded-2xl">
            <div class="flex items-start justify-between mb-3">
              <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-[#EDE9FE] text-[#7C3AED]">{{ service.pack_type }}</span>
              <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="openEditModal(service)" class="p-1.5 hover:bg-[#E0F2FE] rounded-lg"><Edit class="w-4 h-4 text-[#0284C7]" /></button>
                <button @click="deleteService(service.id)" class="p-1.5 hover:bg-[#FEE2E2] rounded-lg"><Trash2 class="w-4 h-4 text-[#DC2626]" /></button>
              </div>
            </div>
            <h4 class="font-bold text-[#000000] text-lg mb-2">{{ service.name }}</h4>
            <p class="text-xs text-[#64748B] mb-4 line-clamp-2">{{ service.description }}</p>
            <div class="flex items-center justify-between pt-4 border-t border-black/5">
              <div class="text-[#0284C7] font-bold text-xl">€{{ service.price_c }}</div>
              <div class="text-[#475569] font-semibold text-sm bg-black/5 px-2 py-1 rounded">{{ service.duration_minutes }}min</div>
            </div>
            <div v-if="service.loyalty_points > 0" class="mt-3 pt-3 border-t border-[#10B981]/20">
              <span class="text-[#10B981] text-xs font-bold">🪙 +{{ service.loyalty_points }} LeiriaPoints</span>
            </div>
          </div>
          <div v-if="extraServices.length === 0" class="col-span-full text-center py-8 text-[#64748B] text-sm">Nenhum extra encontrado.</div>
        </div>
      </div>

      <!-- ✅ LIMPEZA DE BANCOS -->
      <div v-if="bancosServices.length > 0">
        <h4 class="text-lg font-bold text-[#000000] mb-4 flex items-center gap-2">
          <Armchair class="w-5 h-5 text-[#10B981]" /> Limpeza de Bancos
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="service in bancosServices" :key="service.id"
            class="p-5 border border-black/10 hover:border-[#10B981] transition-all group shadow-sm hover:shadow-md card-inner rounded-2xl">
            <div class="flex items-start justify-between mb-3">
              <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-[#D1FAE5] text-[#059669]">Bancos</span>
              <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="openEditModal(service)" class="p-1.5 hover:bg-[#E0F2FE] rounded-lg"><Edit class="w-4 h-4 text-[#0284C7]" /></button>
                <button @click="deleteService(service.id)" class="p-1.5 hover:bg-[#FEE2E2] rounded-lg"><Trash2 class="w-4 h-4 text-[#DC2626]" /></button>
              </div>
            </div>
            <h4 class="font-bold text-[#000000] text-lg mb-2">{{ service.name }}</h4>
            <p class="text-xs text-[#64748B] mb-4 line-clamp-2">{{ service.description }}</p>
            <div class="flex items-center justify-between pt-4 border-t border-black/5">
              <div class="text-[#0284C7] font-bold text-xl">€{{ service.price_c }}</div>
              <div class="text-[#475569] font-semibold text-sm bg-black/5 px-2 py-1 rounded">{{ service.duration_minutes }}min</div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-[16px]">
      <div class="w-full max-w-sm bg-white/90 backdrop-blur-xl border border-white/50 p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-[#000000]">{{ editingService ? 'Edit Service' : 'New Service' }}</h3>
          <button @click="closeModal" class="p-2 hover:bg-black/5 rounded-full"><X class="w-6 h-6 text-[#334155]" /></button>
        </div>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-[#334155] mb-1">Name</label>
            <input required v-model="form.name" class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" />
          </div>
          <div>
            <label class="block text-sm font-bold text-[#334155] mb-1">Description</label>
            <input v-model="form.description" class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" />
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-bold text-[#334155] mb-1">Price S</label>
              <input required type="number" v-model="form.priceAB" class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" />
            </div>
            <div>
              <label class="block text-sm font-bold text-[#334155] mb-1">Price M</label>
              <input required type="number" v-model="form.priceC" class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" />
            </div>
            <div>
              <label class="block text-sm font-bold text-[#334155] mb-1">Price L</label>
              <input required type="number" v-model="form.priceDE" class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-[#334155] mb-1">Duration (min)</label>
              <input required type="number" v-model="form.durationMinutes" class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" />
            </div>
            <div>
              <label class="block text-sm font-bold text-[#334155] mb-1">Pack</label>
              <select v-model="form.packType" class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium">
                <option value="Pack">Pack</option>
                <option value="Extra">Extra</option>
                <option value="Bancos">Bancos</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-bold text-[#334155] mb-1">🪙 LeiriaPoints</label>
            <input type="number" v-model="form.loyaltyPoints" min="0" class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" />
            <p class="text-[10px] text-[#64748B] mt-1">Pontos que o cliente ganha ao adquirir este serviço</p>
          </div>
          <button type="submit" :disabled="isSubmitting" class="w-full mt-6 py-4 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl font-bold shadow-[0_0_12px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all disabled:opacity-50">
            {{ isSubmitting ? 'A guardar...' : (editingService ? 'Update Service' : 'Save Service') }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Edit, Trash2, Plus, X, Package, Puzzle, Armchair } from 'lucide-vue-next'
import { graphql } from '@/graphql'

interface Service {
  id: number; name: string; description: string; price_ab: number; price_c: number; price_de: number
  duration_minutes: number; pack_type: string; loyalty_points: number
}

const services = ref<Service[]>([])
const isLoading = ref(true)
const isSubmitting = ref(false)
const isModalOpen = ref(false)
const editingService = ref<Service | null>(null)
const form = ref({ name: '', description: '', priceAB: 0, priceC: 0, priceDE: 0, durationMinutes: 60, packType: 'Pack', loyaltyPoints: 0 })

const packServices = computed(() => services.value.filter(s => s.pack_type === 'Pack'))
const extraServices = computed(() => services.value.filter(s => s.pack_type === 'Extra'))
const bancosServices = computed(() => services.value.filter(s => s.pack_type === 'Bancos'))

const fetchServices = async () => {
  try {
    const query = `query { services { services { id name description priceAB priceC priceDE durationMinutes packType loyaltyPoints } } }`
    const data = await graphql<{ services: { services: any[] } }>(query)
    if (data.services?.services) {
      services.value = data.services.services.map((s: any) => ({
        id: s.id, name: s.name, description: s.description,
        price_ab: s.priceAB, price_c: s.priceC, price_de: s.priceDE,
        duration_minutes: s.durationMinutes, pack_type: s.packType, loyalty_points: s.loyaltyPoints || 0
      }))
    }
  } catch (error) { console.error('Erro ao carregar serviços:', error) }
  finally { isLoading.value = false }
}

const openCreateModal = () => {
  editingService.value = null
  form.value = { name: '', description: '', priceAB: 0, priceC: 0, priceDE: 0, durationMinutes: 60, packType: 'Pack', loyaltyPoints: 0 }
  isModalOpen.value = true
}

const openEditModal = (service: Service) => {
  editingService.value = service
  form.value = { name: service.name, description: service.description || '', priceAB: service.price_ab, priceC: service.price_c, priceDE: service.price_de, durationMinutes: service.duration_minutes, packType: service.pack_type, loyaltyPoints: service.loyalty_points || 0 }
  isModalOpen.value = true
}

const closeModal = () => { isModalOpen.value = false; editingService.value = null }

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    if (editingService.value) {
      await graphql(`mutation { updateService(id: "${editingService.value.id}", input: { name: "${form.value.name}", description: "${form.value.description}", priceAB: ${form.value.priceAB}, priceC: ${form.value.priceC}, priceDE: ${form.value.priceDE}, durationMinutes: ${form.value.durationMinutes}, packType: "${form.value.packType}", loyaltyPoints: ${form.value.loyaltyPoints} }) { hasError } }`)
    } else {
      await graphql(`mutation { createService(input: { name: "${form.value.name}", description: "${form.value.description}", priceAB: ${form.value.priceAB}, priceC: ${form.value.priceC}, priceDE: ${form.value.priceDE}, durationMinutes: ${form.value.durationMinutes}, packType: "${form.value.packType}", loyaltyPoints: ${form.value.loyaltyPoints} }) { hasError } }`)
    }
    await fetchServices()
    closeModal()
  } catch (error) { console.error('Erro ao guardar serviço:', error) }
  finally { isSubmitting.value = false }
}

const deleteService = async (id: number) => {
  if (!confirm('Eliminar este serviço?')) return
  try {
    await graphql(`mutation { deleteService(id: "${id}") { hasError } }`)
    services.value = services.value.filter(s => s.id !== id)
  } catch (error) { console.error('Erro ao eliminar serviço:', error) }
}

onMounted(() => { fetchServices() })
</script>