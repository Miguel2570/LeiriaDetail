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

        <button @click="isModalOpen = true" class="px-4 py-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-bold rounded-xl shadow-[0_0_12px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all flex items-center gap-2">
          <Plus class="w-5 h-5" /> New Booking
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="flex-1 flex items-center justify-center text-[#64748B] font-medium">A carregar agenda...</div>

    <div v-else class="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden">
      <div class="w-full lg:w-1/3 flex flex-col bg-white/40 border border-[#06B6D4]/30 rounded-2xl p-5 overflow-y-auto backdrop-blur-md">
        <div class="flex items-center justify-between mb-4 pb-4 border-b border-[#06B6D4]/20">
          <h4 class="font-bold text-[#000000] text-xl flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-[#F59E0B] animate-pulse" /> Requests</h4>
          <span class="bg-[#06B6D4] text-white text-xs font-bold px-2.5 py-1 rounded-full">{{ pending.length }}</span>
        </div>
        <p v-if="pending.length === 0" class="text-center text-[#64748B] font-medium py-8">No pending requests.</p>
        <div v-else class="space-y-4">
          <div v-for="booking in pending" :key="booking.id" draggable="true" @dragstart="handleDragStart($event, booking)" class="p-4 bg-white rounded-xl border border-[#06B6D4]/20 shadow-sm cursor-move hover:shadow-md transition-all">
            <div class="flex items-center justify-between mb-2">
              <span class="font-bold text-[#000000]">{{ booking.clientName }}</span>
              <span class="text-xs bg-[#F59E0B]/20 text-[#F59E0B] px-2 py-1 rounded-full font-bold">PENDING</span>
            </div>
            <p class="text-sm text-[#334155]">{{ booking.service }}</p>
            <div class="flex items-center gap-2 mt-2 text-xs text-[#64748B]"><Clock class="w-3 h-3" /> {{ booking.time }}</div>
          </div>
        </div>
      </div>

      <div class="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto pr-2 pb-4">
        <div v-for="bay in bays" :key="bay.id" @drop="handleDrop($event, bay.id)" @dragover.prevent class="bg-white/60 border border-[#06B6D4]/20 rounded-2xl p-4 min-h-[200px]">
          <h5 class="font-bold text-[#000000] mb-3">{{ bay.name }}</h5>
          <div v-if="bay.bookings.length === 0" class="text-center text-[#94A3B8] text-sm py-8">Vazio</div>
          <div v-else class="space-y-2">
            <div v-for="booking in bay.bookings" :key="booking.id" class="p-3 bg-white rounded-lg border border-black/5 text-sm">
              <p class="font-bold text-[#000000]">{{ booking.clientName }}</p>
              <p class="text-[#334155]">{{ booking.service }}</p>
              <p class="text-xs text-[#64748B] mt-1">{{ booking.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-[16px]">
      <div class="w-full max-w-lg bg-white/90 backdrop-blur-xl border border-white/50 p-8 rounded-2xl shadow-2xl">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-[#000000]">New Booking</h3>
          <button @click="isModalOpen = false" class="p-2 hover:bg-black/5 rounded-full"><X class="w-6 h-6 text-[#334155]" /></button>
        </div>
        <form @submit.prevent="handleAddBooking" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm font-bold text-[#334155] mb-1">User ID</label><input required type="number" v-model="form.userId" class="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" /></div>
            <div><label class="block text-sm font-bold text-[#334155] mb-1">Vehicle ID</label><input required type="number" v-model="form.vehicleId" class="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" /></div>
          </div>
          <div><label class="block text-sm font-bold text-[#334155] mb-1">Service ID</label><input required type="number" v-model="form.serviceId" class="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" /></div>
          <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm font-bold text-[#334155] mb-1">Date</label><input required type="date" v-model="form.bookingDate" class="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" /></div>
            <div><label class="block text-sm font-bold text-[#334155] mb-1">Time</label><input required type="time" v-model="form.bookingTime" class="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" /></div>
          </div>
          <button type="submit" :disabled="isSubmitting" class="w-full mt-6 py-4 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl font-bold shadow-[0_0_12px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all disabled:opacity-50">{{ isSubmitting ? 'A criar...' : 'Create Booking' }}</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Clock, Plus, X, CalendarDays, ChevronDown } from 'lucide-vue-next'
import { DatePicker } from 'v-calendar'
import 'v-calendar/style.css'
import { format } from 'date-fns'
import { apiFetch } from '@/services/api'

interface Booking {
  id: number
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

const bays = ref<Bay[]>([
  { id: 'bay-1', name: 'Bay 1 (Ceramics/Paint)', bookings: [] },
  { id: 'bay-2', name: 'Bay 2 (Interiors)', bookings: [] },
  { id: 'bay-3', name: 'Bay 3 (Express/Wash)', bookings: [] },
])
const pending = ref<Booking[]>([])
const isLoading = ref(true)
const isSubmitting = ref(false)
const isModalOpen = ref(false)
const isCalendarOpen = ref(false)
const selectedDate = ref(new Date())
const calendarRef = ref<HTMLElement | null>(null)

const form = ref({
  userId: 0,
  vehicleId: 0,
  serviceId: 0,
  bookingDate: format(new Date(), 'yyyy-MM-dd'),
  bookingTime: '09:00'
})

const fetchAppointments = async () => {
  try {
    const date = format(selectedDate.value, 'yyyy-MM-dd')
    const data = await apiFetch(`/Appointments?date=${date}`)
    
    if (!data.HasError && data.Data) {
      pending.value = data.Data.pending || []
      if (data.Data.bays) {
        bays.value = data.Data.bays.map((b: any) => ({ ...b, bookings: b.bookings || [] }))
      }
    }
  } catch (error) {
    console.error('Erro ao carregar marcações:', error)
  } finally {
    isLoading.value = false
  }
}

const handleDateSelect = (day: Date) => {
  selectedDate.value = day
  form.value.bookingDate = format(day, 'yyyy-MM-dd')
  isCalendarOpen.value = false
  fetchAppointments()
}

const handleDragStart = (event: DragEvent, booking: Booking) => {
  event.dataTransfer?.setData('text/plain', String(booking.id))
}

const handleDrop = async (event: DragEvent, bayId: string) => {
  const bookingId = event.dataTransfer?.getData('text/plain')
  if (!bookingId) return
  try {
    await apiFetch('/Appointments/Move', {
      method: 'POST',
      body: JSON.stringify({ bookingId: parseInt(bookingId), toBayId: bayId })
    })
    await fetchAppointments()
  } catch (error) {
    console.error('Erro ao mover marcação:', error)
  }
}

const handleAddBooking = async () => {
  isSubmitting.value = true
  try {
    const data = await apiFetch('/Appointments', { method: 'POST', body: JSON.stringify(form.value) })
    if (!data.HasError) {
      await fetchAppointments()
      isModalOpen.value = false
      form.value = { userId: 0, vehicleId: 0, serviceId: 0, bookingDate: format(selectedDate.value, 'yyyy-MM-dd'), bookingTime: '09:00' }
    }
  } catch (error) {
    console.error('Erro ao criar marcação:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (calendarRef.value && !calendarRef.value.contains(event.target as Node)) {
    isCalendarOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  fetchAppointments()
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>