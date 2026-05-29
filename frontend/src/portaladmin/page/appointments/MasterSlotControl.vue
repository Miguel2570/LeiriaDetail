<template>
  <div class="backdrop-blur-[30px] p-8 h-full flex flex-col relative overflow-hidden card-admin">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 shrink-0 gap-4">
      <div>
        <h3 class="text-3xl font-bold text-[#000000]">Live Agenda & Dispatch</h3>
        <p class="text-[#334155] font-medium mt-1">Viewing schedule for <span class="font-bold text-[#0284C7]">{{ format(selectedDate, 'EEEE, MMMM do, yyyy') }}</span></p>
      </div>
      
      <div class="flex gap-3 relative" ref="calendarRef">
        <button @click="isCalendarOpen = !isCalendarOpen" class="px-4 py-2 bg-white text-[#0F172A] font-bold rounded-xl shadow-sm hover:bg-black/5 transition-all border border-[#06B6D4]/30 flex items-center gap-2">
          <CalendarDays class="w-5 h-5 text-[#06B6D4]" />
          {{ format(selectedDate, 'MMM dd, yyyy') }}
          <ChevronDown class="w-4 h-4 text-[#64748B]" />
        </button>

        <div v-if="isCalendarOpen" class="absolute top-full right-0 mt-2 z-50 bg-white/95 backdrop-blur-xl border border-black/10 shadow-2xl rounded-2xl p-4">
          <DatePicker v-model="selectedDate" is-expanded @dayclick="handleDateSelect" />
        </div>

        <button @click="openNewBookingModal" class="px-4 py-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-bold rounded-xl shadow-[0_0_12px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all flex items-center gap-2">
          <Plus class="w-5 h-5" /> New Booking
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="flex-1 flex items-center justify-center text-[#64748B] font-medium">A carregar agenda...</div>

    <div v-else class="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden">
      <!-- Pending Bookings -->
      <div class="w-full lg:w-1/3 flex flex-col bg-white/40 border border-[#06B6D4]/30 rounded-2xl p-5 overflow-y-auto backdrop-blur-md">
        <div class="flex items-center justify-between mb-4 pb-4 border-b border-[#06B6D4]/20">
          <h4 class="font-bold text-[#000000] text-xl flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-[#F59E0B] animate-pulse" /> Requests</h4>
          <span class="bg-[#06B6D4] text-white text-xs font-bold px-2.5 py-1 rounded-full">{{ pending.length }}</span>
        </div>
        <p v-if="pending.length === 0" class="text-center text-[#64748B] font-medium py-8">No pending requests.</p>
        <div v-else class="space-y-4">
          <div v-for="booking in pending" :key="booking.id" 
            draggable="true" 
            @dragstart="handleDragStart($event, booking)" 
            class="p-4 bg-white rounded-xl border border-[#06B6D4]/20 shadow-sm cursor-move hover:shadow-md transition-all group">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#06B6D4] flex items-center justify-center text-white text-xs font-bold">
                  {{ getInitials(booking.clientName) }}
                </div>
                <span class="font-bold text-[#000000]">{{ booking.clientName }}</span>
              </div>
              <span class="text-xs bg-[#F59E0B]/20 text-[#F59E0B] px-2 py-1 rounded-full font-bold">PENDING</span>
            </div>
            <p class="text-sm text-[#334155] font-medium">{{ booking.service }}</p>
            <p class="text-xs text-[#64748B] mt-1">{{ booking.vehiclePlate }} - {{ booking.vehicle }}</p>
            <div class="flex items-center gap-2 mt-3 text-xs text-[#64748B]">
              <Clock class="w-3 h-3" /> {{ booking.time }}
            </div>
          </div>
        </div>
      </div>

      <!-- Bays Grid -->
      <div class="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto pr-2 pb-4">
        <div v-for="bay in bays" :key="bay.id" 
          @drop="handleDrop($event, bay.id)" 
          @dragover.prevent
          :class="['bg-white/60 border rounded-2xl p-4 min-h-[200px] transition-all',
            bay.id === dragOverBay ? 'border-[#06B6D4] bg-[#E0F2FE]/30 shadow-lg' : 'border-[#06B6D4]/20']"
          @dragenter.prevent="dragOverBay = bay.id"
          @dragleave.prevent="dragOverBay = null">
          <div class="flex items-center justify-between mb-3">
            <h5 class="font-bold text-[#000000]">{{ bay.name }}</h5>
            <span class="text-xs font-bold text-[#64748B] bg-white/80 px-2 py-1 rounded-full">{{ bay.bookings.length }}</span>
          </div>
          <div v-if="bay.bookings.length === 0" class="text-center text-[#94A3B8] text-sm py-8">
            Arraste para aqui
          </div>
          <div v-else class="space-y-2">
            <div v-for="booking in bay.bookings" :key="booking.id" 
              class="p-3 bg-white rounded-lg border border-black/5 text-sm hover:shadow-md transition-shadow cursor-pointer"
              @click="openBookingDetail(booking)">
              <div class="flex items-center justify-between mb-1">
                <p class="font-bold text-[#000000] text-xs">{{ booking.clientName }}</p>
                <span :class="['text-[10px] px-2 py-0.5 rounded-full font-bold',
                  booking.status === 'CONCLUIDO' ? 'bg-[#D1FAE5] text-[#059669]' : 
                  booking.status === 'EM_PROGRESSO' ? 'bg-[#FEF3C7] text-[#D97706]' : 
                  'bg-[#E0F2FE] text-[#0284C7]']">
                  {{ getStatusText(booking.status) }}
                </span>
              </div>
              <p class="text-[#334155] text-xs">{{ booking.service }}</p>
              <div class="flex items-center justify-between mt-2">
                <p class="text-xs text-[#64748B]">{{ booking.time }}</p>
                <button 
                  v-if="booking.status !== 'CONCLUIDO'"
                  @click.stop="handleRemoveFromBay(booking)"
                  class="text-[10px] text-red-500 hover:text-red-700 font-bold">
                  Remover
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Booking Modal -->
    <div v-if="isNewBookingOpen" class="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-[16px]">
      <div class="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border border-white/50 p-8 rounded-2xl shadow-2xl">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-[#000000]">New Booking</h3>
          <button @click="closeNewBookingModal" class="p-2 hover:bg-black/5 rounded-full"><X class="w-6 h-6 text-[#334155]" /></button>
        </div>
        <form @submit.prevent="handleAddBooking" class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-[#334155] mb-1">Cliente</label>
            <select v-model="newBooking.clientId" required class="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium">
              <option value="">Selecionar cliente</option>
              <option v-for="client in clients" :key="client.id" :value="client.id">{{ client.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-bold text-[#334155] mb-1">Veículo</label>
            <select v-model="newBooking.vehicleId" required class="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium">
              <option value="">Selecionar veículo</option>
              <option v-for="vehicle in availableVehicles" :key="vehicle.id" :value="vehicle.id">
                {{ vehicle.plate }} - {{ vehicle.brand }} {{ vehicle.model }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-bold text-[#334155] mb-1">Serviço</label>
            <select v-model="newBooking.serviceType" required class="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium">
              <option value="">Selecionar serviço</option>
              <option value="Lavagem Detalhada">Lavagem Detalhada</option>
              <option value="Polimento">Polimento</option>
              <option value="Limpeza de Interior">Limpeza de Interior</option>
              <option value="Proteção Cerâmica">Proteção Cerâmica</option>
              <option value="Higienização">Higienização</option>
              <option value="Manutenção Geral">Manutenção Geral</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-[#334155] mb-1">Data</label>
              <input required type="date" v-model="newBooking.bookingDate" class="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" />
            </div>
            <div>
              <label class="block text-sm font-bold text-[#334155] mb-1">Hora</label>
              <input required type="time" v-model="newBooking.bookingTime" class="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-bold text-[#334155] mb-1">Bay (opcional)</label>
            <select v-model="newBooking.bayId" class="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium">
              <option value="">Sem bay (pendente)</option>
              <option v-for="bay in bays" :key="bay.id" :value="bay.id">{{ bay.name }}</option>
            </select>
          </div>
          <button type="submit" :disabled="isSubmitting" class="w-full mt-6 py-4 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl font-bold shadow-[0_0_12px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all disabled:opacity-50">
            {{ isSubmitting ? 'A criar...' : 'Create Booking' }}
          </button>
        </form>
      </div>
    </div>

    <!-- Booking Detail Modal -->
    <div v-if="selectedBooking" class="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-[16px]">
      <div class="w-full max-w-md bg-white/95 backdrop-blur-xl border border-white/50 p-8 rounded-2xl shadow-2xl">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-[#000000]">Detalhes da Marcação</h3>
          <button @click="selectedBooking = null" class="p-2 hover:bg-black/5 rounded-full"><X class="w-6 h-6 text-[#334155]" /></button>
        </div>
        <div class="space-y-4">
          <div class="bg-[#F8FAFC] p-4 rounded-xl">
            <p class="text-xs font-bold text-[#64748B] uppercase mb-1">Cliente</p>
            <p class="font-bold text-[#0F172A]">{{ selectedBooking.clientName }}</p>
          </div>
          <div class="bg-[#F8FAFC] p-4 rounded-xl">
            <p class="text-xs font-bold text-[#64748B] uppercase mb-1">Serviço</p>
            <p class="font-bold text-[#0F172A]">{{ selectedBooking.service }}</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-[#F8FAFC] p-4 rounded-xl">
              <p class="text-xs font-bold text-[#64748B] uppercase mb-1">Data</p>
              <p class="font-bold text-[#0F172A]">{{ selectedBooking.date }}</p>
            </div>
            <div class="bg-[#F8FAFC] p-4 rounded-xl">
              <p class="text-xs font-bold text-[#64748B] uppercase mb-1">Hora</p>
              <p class="font-bold text-[#0F172A]">{{ selectedBooking.time }}</p>
            </div>
          </div>
          <div class="flex gap-3">
            <button 
              @click="convertToService(selectedBooking)"
              class="flex-1 py-3 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl font-bold">
              Criar Entrada de Serviço
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Clock, Plus, X, CalendarDays, ChevronDown } from 'lucide-vue-next'
import { DatePicker } from 'v-calendar'
import 'v-calendar/style.css'
import { format } from 'date-fns'
import { graphql } from '@/graphql'

interface Booking {
  id: number
  clientId: number
  clientName: string
  clientPhone: string
  service: string
  vehicle: string
  vehiclePlate: string
  date: string
  time: string
  duration: string
  status: string
  bay: string | null
}

interface Bay {
  id: string
  name: string
  bookings: Booking[]
}

interface Client {
  id: number
  name: string
  vehicles: Vehicle[]
}

interface Vehicle {
  id: number
  plate: string
  brand: string
  model: string
}

const bays = ref<Bay[]>([
  { id: 'bay-1', name: 'Bay 1 (Ceramics/Paint)', bookings: [] },
  { id: 'bay-2', name: 'Bay 2 (Interiors)', bookings: [] },
  { id: 'bay-3', name: 'Bay 3 (Express/Wash)', bookings: [] },
])
const pending = ref<Booking[]>([])
const clients = ref<Client[]>([])
const isLoading = ref(true)
const isSubmitting = ref(false)
const isNewBookingOpen = ref(false)
const isCalendarOpen = ref(false)
const selectedDate = ref(new Date())
const calendarRef = ref<HTMLElement | null>(null)
const dragOverBay = ref<string | null>(null)
const selectedBooking = ref<Booking | null>(null)

const newBooking = ref({
  clientId: '',
  vehicleId: '',
  serviceType: '',
  bookingDate: format(new Date(), 'yyyy-MM-dd'),
  bookingTime: '09:00',
  bayId: ''
})

const availableVehicles = computed(() => {
  if (!newBooking.value.clientId) return []
  const client = clients.value.find(c => c.id === Number(newBooking.value.clientId))
  return client?.vehicles || []
})

const fetchAppointments = async () => {
  try {
    const date = format(selectedDate.value, 'yyyy-MM-dd')
    
    // ✅ Query corrigida - $date passado para registosServices
    const query = `
      query($date: String!) {
        registosServices(date: $date) {
          services {
            id
            clientId
            vehicleId
            vehiclePlate
            serviceType
            status
            entryDate
          }
          errors { field message }
        }
      }
    `
    // ✅ Passar a variável date
    const data = await graphql<{ registosServices: any }>(query, { date })
    
    if (data.registosServices?.services) {
      const allBookings: Booking[] = data.registosServices.services
        .filter((s: any) => s.entryDate?.startsWith(date))
        .map((s: any) => ({
          id: s.id,
          clientId: s.clientId,
          clientName: getClientName(s.clientId),
          clientPhone: '',
          service: s.serviceType,
          vehicle: s.vehiclePlate,
          vehiclePlate: s.vehiclePlate,
          date: format(new Date(s.entryDate), 'yyyy-MM-dd'),
          time: format(new Date(s.entryDate), 'HH:mm'),
          duration: '60min',
          status: s.status,
          bay: null
        }))
      
      pending.value = allBookings.filter(b => b.status === 'EM_ABERTO')
      
      bays.value.forEach(bay => {
        bay.bookings = allBookings.filter(b => b.status !== 'EM_ABERTO').slice(0, 2)
      })
    }
  } catch (error) {
    console.error('Erro ao carregar marcações:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchClients = async () => {
  try {
    const query = `
      query {
        crmClients {
          clients {
            id
            name
            vehicles {
              id
              plate
              brand
              model
            }
          }
          errors { field message }
        }
      }
    `
    const data = await graphql<{ crmClients: { clients: Client[], errors: any[] } }>(query)
    if (data.crmClients?.clients) {
      clients.value = data.crmClients.clients
    }
  } catch (error) {
    console.error('Erro ao carregar clientes:', error)
  }
}

const fetchData = async () => {
  isLoading.value = true
  await Promise.all([fetchAppointments(), fetchClients()])
  isLoading.value = false
}

const getClientName = (clientId: number) => {
  return clients.value.find(c => c.id === clientId)?.name || `Cliente #${clientId}`
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    'EM_ABERTO': 'Pendente',
    'EM_PROGRESSO': 'Em Curso',
    'CONCLUIDO': 'Pronto'
  }
  return texts[status] || status
}

const handleDateSelect = (day: Date) => {
  selectedDate.value = day
  newBooking.value.bookingDate = format(day, 'yyyy-MM-dd')
  isCalendarOpen.value = false
  fetchAppointments()
}

const handleDragStart = (event: DragEvent, booking: Booking) => {
  event.dataTransfer?.setData('text/plain', String(booking.id))
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
  }
}

const handleDrop = async (event: DragEvent, bayId: string) => {
  dragOverBay.value = null
  const bookingId = event.dataTransfer?.getData('text/plain')
  if (!bookingId) return
  
  try {
    // Mutation para mover booking para um bay
    await graphql(`
      mutation MoveBooking($bookingId: Int!, $bayId: String!) {
        moveBooking(bookingId: $bookingId, bayId: $bayId) {
          hasError
          message
        }
      }
    `, { bookingId: Number(bookingId), bayId })
    
    await fetchAppointments()
  } catch (error) {
    console.error('Erro ao mover marcação:', error)
  }
}

const handleRemoveFromBay = async (booking: Booking) => {
  try {
    await graphql(`
      mutation RemoveFromBay($bookingId: Int!) {
        removeFromBay(bookingId: $bookingId) {
          hasError
          message
        }
      }
    `, { bookingId: booking.id })
    
    await fetchAppointments()
  } catch (error) {
    console.error('Erro ao remover do bay:', error)
  }
}

const handleAddBooking = async () => {
  isSubmitting.value = true
  try {
    // ✅ Nome corrigido: createWorkshopService
    const mutation = `
      mutation CreateWorkshopService($input: CreateServiceInput!) {
        createWorkshopService(input: $input) {
          service { id }
          errors { field message }
        }
      }
    `
    await graphql(mutation, {
      input: {
        clientId: Number(newBooking.value.clientId),
        vehicleId: Number(newBooking.value.vehicleId),
        serviceType: newBooking.value.serviceType,
        observations: '',
        entryChecks: [],
        estimatedValue: 0
      }
    })
    
    await fetchData()
    closeNewBookingModal()
  } catch (error) {
    console.error('Erro ao criar marcação:', error)
  } finally {
    isSubmitting.value = false
  }
}

const openNewBookingModal = () => {
  isNewBookingOpen.value = true
}

const closeNewBookingModal = () => {
  isNewBookingOpen.value = false
  newBooking.value = {
    clientId: '',
    vehicleId: '',
    serviceType: '',
    bookingDate: format(selectedDate.value, 'yyyy-MM-dd'),
    bookingTime: '09:00',
    bayId: ''
  }
}

const openBookingDetail = (booking: Booking) => {
  selectedBooking.value = booking
}

const convertToService = async (booking: Booking) => {
  // Redireciona para o ServiceManager ou cria entrada diretamente
  selectedBooking.value = null
  // router.push('/admin/registos')
}

const handleClickOutside = (event: MouseEvent) => {
  if (calendarRef.value && !calendarRef.value.contains(event.target as Node)) {
    isCalendarOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  fetchData()
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>