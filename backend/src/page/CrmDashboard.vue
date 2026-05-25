<template>
  <div class="backdrop-blur-[30px] p-8 flex flex-col h-full overflow-hidden relative" :style="cardStyle">
    <div class="flex items-center justify-between mb-8 shrink-0">
      <div>
        <h3 class="text-3xl font-[Poppins] font-bold text-[#000000]">CRM & Fleet Management</h3>
        <p class="text-[#334155] font-medium mt-1">Unified view of your clients, their vehicles, and service history.</p>
      </div>
      <button class="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white px-5 py-3 rounded-xl font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all flex items-center gap-2">
        <Plus class="w-5 h-5" />
        New Client Profile
      </button>
    </div>

    <div class="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden">
      <!-- Left Side: Master List -->
      <div class="w-full lg:w-1/3 flex flex-col h-full bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 p-4">
        <div class="relative mb-6">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="h-5 w-5 text-[#06B6D4]" />
          </div>
          <input
            type="text"
            v-model="searchQuery"
            class="w-full pl-10 pr-4 py-3 font-medium bg-white/80 border border-[#06B6D4]/30 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/40 transition-all placeholder-[#94A3B8] text-[#0F172A]"
            placeholder="Search client, plate, car..."
          />
        </div>

        <div class="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
          <motion.button
            v-for="client in filteredClients"
            :key="client.id"
            :while-hover="{ scale: 1.02 }"
            @click="setSelectedClientId(client.id)"
            :class="['w-full text-left p-4 rounded-xl border transition-all', 
              selectedClientId === client.id 
              ? 'bg-gradient-to-r from-white to-[#E0F2FE] border-[#06B6D4] shadow-md' 
              : 'bg-white/50 border-white/20 hover:border-[#06B6D4]/50 hover:bg-white']"
          >
            <div class="flex items-center gap-4">
              <div :class="['w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-inner',
                selectedClientId === client.id ? 'bg-[#06B6D4] text-white' : 'bg-[#F1F5F9] text-[#64748B]']">
                {{ client.avatar }}
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-[Poppins] font-bold text-[#0F172A] truncate">{{ client.name }}</h4>
                <p class="text-sm font-medium text-[#64748B] flex items-center gap-1 mt-0.5">
                  <Car class="w-3.5 h-3.5" /> 
                  {{ client.vehicles.length }} Vehicle{{ client.vehicles.length !== 1 ? 's' : '' }}
                </p>
              </div>
              <ChevronRight :class="['w-5 h-5', selectedClientId === client.id ? 'text-[#06B6D4]' : 'text-[#CBD5E1]']" />
            </div>
          </motion.button>
          <div v-if="filteredClients.length === 0" class="text-center py-10 text-[#64748B] font-medium">
            No clients or vehicles found.
          </div>
        </div>
      </div>

      <!-- Right Side: Detail View -->
      <div class="w-full lg:w-2/3 flex flex-col overflow-y-auto space-y-6 pr-2">
        <AnimatePresence :mode="'wait' as const">
          <motion.div 
            :key="selectedClientId"
            :initial="{ opacity: 0, x: 20 }"
            :animate="{ opacity: 1, x: 0 }"
            :exit="{ opacity: 0, x: -20 }"
            class="space-y-6"
          >
            <!-- Profile Card -->
            <div class="p-6 border border-black/10 rounded-2xl backdrop-blur-sm" :style="innerCardStyle">
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                <div class="flex items-center gap-5">
                  <div class="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#3B82F6] to-[#06B6D4] flex items-center justify-center shadow-lg text-white text-3xl font-[Poppins] font-bold">
                    {{ selectedClient.avatar }}
                  </div>
                  <div>
                    <h2 class="text-3xl font-[Poppins] font-black text-[#000000] tracking-tight">{{ selectedClient.name }}</h2>
                    <div class="flex items-center gap-3 mt-2 text-[#475569] font-medium text-sm">
                      <span class="flex items-center gap-1.5 bg-black/5 px-2 py-1 rounded-md"><Phone class="w-4 h-4 text-[#06B6D4]"/> {{ selectedClient.phone }}</span>
                      <span class="flex items-center gap-1.5 bg-black/5 px-2 py-1 rounded-md"><Mail class="w-4 h-4 text-[#06B6D4]"/> {{ selectedClient.email }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="bg-white/60 p-4 rounded-xl border border-[#06B6D4]/20 shadow-sm text-center min-w-[120px]">
                  <p class="text-[#64748B] text-xs font-bold uppercase mb-1">Lifetime Value</p>
                  <p class="text-2xl font-[Poppins] font-black text-[#000000]">{{ selectedClient.ltv }}</p>
                </div>
              </div>
            </div>

            <!-- Fleet Section -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-[Poppins] font-bold text-[#000000] flex items-center gap-2">
                  <Shield class="w-6 h-6 text-[#3B82F6]" />
                  Client Fleet
                </h3>
                <button class="text-sm font-bold text-[#06B6D4] hover:text-[#0284C7] flex items-center gap-1 transition-colors">
                  <Plus class="w-4 h-4" /> Add Vehicle
                </button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="vehicle in selectedClient.vehicles" :key="vehicle.id" class="bg-white/70 border border-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-[#06B6D4]/10 rounded-bl-full pointer-events-none group-hover:to-[#06B6D4]/20 transition-colors" />
                  <div class="flex justify-between items-start mb-3">
                    <h4 class="font-[Poppins] font-bold text-lg text-[#0F172A]">{{ vehicle.plate }}</h4>
                    <span class="bg-[#E0F2FE] text-[#0284C7] text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">{{ vehicle.year }}</span>
                  </div>
                  <p class="text-[#475569] font-bold mb-1">{{ vehicle.model }}</p>
                  <p class="text-[#94A3B8] text-sm font-medium">{{ vehicle.color }}</p>
                </div>
              </div>
            </div>

            <!-- Unified Service History -->
            <div class="p-8 border border-black/10 rounded-2xl backdrop-blur-sm" :style="innerCardStyle">
              <h4 class="font-[Poppins] font-bold text-[#000000] text-xl mb-6 flex items-center gap-3">
                <History class="w-6 h-6 text-[#06B6D4]" />
                Unified Service History
              </h4>
              
              <div class="relative border-l-2 border-[#06B6D4]/30 ml-4 space-y-8 pb-4">
                <div v-for="record in selectedClient.history" :key="record.id" class="relative pl-8">
                  <div :class="['absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm', record.date === 'Today' ? 'bg-[#06B6D4] shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'bg-[#94A3B8]']" />
                  <div class="bg-white/60 p-4 rounded-xl border border-black/5 hover:bg-white/80 transition-colors">
                    <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2">
                      <div>
                        <h5 class="font-[Poppins] font-bold text-[#0F172A]">{{ record.service }}</h5>
                        <p class="text-[#06B6D4] text-sm font-bold mt-0.5">{{ getVehiclePlate(record.vehicleId) }} - {{ getVehicleModel(record.vehicleId) }}</p>
                      </div>
                      <span :class="['px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wide whitespace-nowrap', record.date === 'Today' ? 'bg-[#E0F2FE] text-[#0284C7]' : 'bg-[#F1F5F9] text-[#64748B]']">
                        {{ record.date }}
                      </span>
                    </div>
                    <div class="flex items-center gap-4 text-xs font-bold text-[#64748B] mt-4">
                      <span class="flex items-center gap-1.5"><Wrench class="w-3.5 h-3.5"/> {{ record.detailer }}</span>
                      <span class="flex items-center gap-1.5"><MapPin class="w-3.5 h-3.5"/> {{ record.bay }}</span>
                      <span :class="{'text-[#F59E0B]': record.date === 'Today'}" class="flex items-center gap-1.5">
                        {{ record.status }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { motion, AnimatePresence } from 'motion-v'
import { Search, Car, History, Phone, Mail, Plus, MapPin, Wrench, Shield, ChevronRight } from 'lucide-vue-next'

interface Vehicle {
  id: string
  plate: string
  model: string
  year: number
  color: string
}

interface HistoryRecord {
  id: string
  vehicleId: string
  date: string
  service: string
  status: string
  bay: string
  detailer: string
}

interface Client {
  id: string
  name: string
  phone: string
  email: string
  address: string
  ltv: string
  avatar: string
  vehicles: Vehicle[]
  history: HistoryRecord[]
}

const clients: Client[] = [
  {
    id: 'c1',
    name: 'João Silva',
    phone: '+351 912 345 678',
    email: 'joao.silva@example.com',
    address: 'Leiria, PT',
    ltv: '€3.2k',
    avatar: 'JS',
    vehicles: [
      { id: 'v1', plate: '99-XT-42', model: 'Porsche 911 GT3 RS', year: 2022, color: 'Guards Red' },
      { id: 'v2', plate: 'AB-12-CD', model: 'BMW X5 M50d', year: 2020, color: 'Alpine White' },
    ],
    history: [
      { id: 'h1', vehicleId: 'v1', date: 'Today', service: 'Ceramic Coating Maintenance', status: 'In Progress', bay: 'Bay 1', detailer: 'Carlos' },
      { id: 'h2', vehicleId: 'v2', date: 'Oct 12, 2023', service: 'Interior Deep Clean & Leather Treatment', status: 'Completed', bay: 'Bay 3', detailer: 'Miguel' },
      { id: 'h3', vehicleId: 'v1', date: 'May 05, 2023', service: 'Stage 2 Paint Correction & Ceramic', status: 'Completed', bay: 'Bay 1', detailer: 'Carlos' },
    ]
  },
  {
    id: 'c2',
    name: 'Ana Rodrigues',
    phone: '+351 965 432 109',
    email: 'ana.rodrigues@example.com',
    address: 'Marinha Grande, PT',
    ltv: '€850',
    avatar: 'AR',
    vehicles: [
      { id: 'v3', plate: '11-XY-22', model: 'Tesla Model Y', year: 2023, color: 'Pearl White' },
    ],
    history: [
      { id: 'h4', vehicleId: 'v3', date: 'Sep 20, 2023', service: 'Full Wash & Decontamination', status: 'Completed', bay: 'Bay 2', detailer: 'André' },
    ]
  },
  {
    id: 'c3',
    name: 'Ricardo Neves',
    phone: '+351 933 111 222',
    email: 'ricardo.neves@example.com',
    address: 'Batalha, PT',
    ltv: '€1.1k',
    avatar: 'RN',
    vehicles: [
      { id: 'v4', plate: '88-ZZ-99', model: 'Audi RS6 Avant', year: 2021, color: 'Nardo Grey' },
    ],
    history: [
      { id: 'h5', vehicleId: 'v4', date: 'Aug 15, 2023', service: 'PPF Front End Application', status: 'Completed', bay: 'Bay 1', detailer: 'Carlos' },
    ]
  }
]

const searchQuery = ref('')
const selectedClientId = ref(clients[0]!.id)

const filteredClients = computed(() => 
  clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    c.vehicles.some(v => v.plate.toLowerCase().includes(searchQuery.value.toLowerCase()) || v.model.toLowerCase().includes(searchQuery.value.toLowerCase()))
  )
)

const selectedClient = computed(() => clients.find(c => c.id === selectedClientId.value) ?? clients[0]!)

const getVehiclePlate = (vehicleId: string) => {
  const vehicle = selectedClient.value.vehicles.find(v => v.id === vehicleId)
  return vehicle?.plate ?? ''
}

const getVehicleModel = (vehicleId: string) => {
  const vehicle = selectedClient.value.vehicles.find(v => v.id === vehicleId)
  return vehicle?.model ?? ''
}

const setSelectedClientId = (id: string) => {
  selectedClientId.value = id
}

const cardStyle = {
  background: 'linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2)), #FFFFFF',
  boxShadow: '0 0 12px 0 rgba(0, 0, 0, 0.7)',
  borderRadius: '16px',
}

const innerCardStyle = {
  background: 'linear-gradient(to bottom right, rgba(255,255,255,0.8), rgba(255,255,255,0.4))'
}
</script>