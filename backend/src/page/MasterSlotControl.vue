<template>
  <motion.div 
    :initial="{ opacity: 0, x: -10 }"
    :animate="{ opacity: 1, x: 0 }"
    class="backdrop-blur-[30px] p-8 h-full flex flex-col relative overflow-hidden" 
    :style="containerStyle"
  >
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 shrink-0 gap-4">
      <div>
        <h3 class="text-3xl font-[Poppins] font-bold text-[#000000]">Live Agenda & Dispatch</h3>
        <p class="text-[#334155] font-medium mt-1">Viewing schedule for <span class="font-bold text-[#0284C7]">{{ format(selectedDate, 'EEEE, MMMM do, yyyy') }}</span></p>
      </div>
      
      <div class="flex gap-3 relative" ref="calendarRef">
        <button 
          @click="setIsCalendarOpen(!isCalendarOpen)"
          class="px-4 py-2 bg-white text-[#0F172A] font-bold rounded-xl shadow-sm hover:bg-black/5 transition-all border border-[#06B6D4]/30 flex items-center gap-2"
        >
          <CalendarDays class="w-5 h-5 text-[#06B6D4]" />
          {{ format(selectedDate, 'MMM dd, yyyy') }}
          <ChevronDown class="w-4 h-4 text-[#64748B]" />
        </button>

        <!-- Calendar Popover -->
        <AnimatePresence>
          <motion.div 
            v-if="isCalendarOpen"
            :initial="{ opacity: 0, y: 10 }"
            :animate="{ opacity: 1, y: 0 }"
            :exit="{ opacity: 0, y: 10 }"
            class="absolute top-full right-0 mt-2 z-50 bg-white/95 backdrop-blur-xl border border-black/10 shadow-2xl rounded-2xl p-4"
          >
            <DatePicker 
              v-model="selectedDate"
              is-expanded
              @dayclick="handleDateSelect"
            />
          </motion.div>
        </AnimatePresence>

        <button 
          @click="setIsModalOpen(true)"
          class="px-4 py-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-bold rounded-xl shadow-[0_0_12px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all flex items-center gap-2"
        >
          <Plus class="w-5 h-5" />
          Simulate Request
        </button>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden">
      <!-- PENDING SIDEBAR -->
      <div class="w-full lg:w-1/3 flex flex-col bg-white/40 border border-[#06B6D4]/30 rounded-2xl p-5 overflow-y-auto backdrop-blur-md">
        <div class="flex items-center justify-between mb-4 pb-4 border-b border-[#06B6D4]/20">
          <h4 class="font-[Poppins] font-bold text-[#000000] text-xl flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-[#F59E0B] animate-pulse" />
            Requests for Today
          </h4>
          <span class="bg-[#06B6D4] text-white text-xs font-bold px-2.5 py-1 rounded-full">{{ displayedPending.length }}</span>
        </div>
        
        <div class="space-y-4">
          <p v-if="displayedPending.length === 0" class="text-center text-[#64748B] font-medium py-8">No pending requests for this date.</p>
          <div 
            v-for="booking in displayedPending" 
            :key="booking.id"
            draggable="true"
            @dragstart="handleDragStart($event, booking)"
            class="p-4 bg-white rounded-xl border border-[#06B6D4]/20 shadow-sm cursor-move hover:shadow-md transition-all"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="font-bold text-[#000000]">{{ booking.clientName }}</span>
              <span class="text-xs bg-[#F59E0B]/20 text-[#F59E0B] px-2 py-1 rounded-full font-bold">PENDING</span>
            </div>
            <p class="text-sm text-[#334155]">{{ booking.service }}</p>
            <div class="flex items-center gap-2 mt-2 text-xs text-[#64748B]">
              <Clock class="w-3 h-3" />
              <span>{{ booking.time }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- BAYS GRID -->
      <div class="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto pr-2 pb-4">
        <div 
          v-for="bay in bays" 
          :key="bay.id"
          @drop="handleDrop($event, bay.id)"
          @dragover.prevent
          class="bg-white/60 border border-[#06B6D4]/20 rounded-2xl p-4 min-h-[200px]"
        >
          <h5 class="font-bold text-[#000000] mb-3">{{ bay.name }}</h5>
          <div class="space-y-2">
            <div 
              v-for="booking in bay.bookings.filter(b => b.date === selectedDateStr)" 
              :key="booking.id"
              class="p-3 bg-white rounded-lg border border-black/5 text-sm"
            >
              <p class="font-bold text-[#000000]">{{ booking.clientName }}</p>
              <p class="text-[#334155]">{{ booking.service }}</p>
              <p class="text-xs text-[#64748B] mt-1">{{ booking.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL -->
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
          class="w-full max-w-lg bg-white/90 backdrop-blur-xl border border-white/50 p-8 rounded-2xl shadow-2xl"
        >
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-[Poppins] font-bold text-[#000000]">Simulate Frontend Request</h3>
            <button @click="setIsModalOpen(false)" class="p-2 hover:bg-black/5 rounded-full transition-colors">
              <X class="w-6 h-6 text-[#334155]" />
            </button>
          </div>

          <form @submit="handleAddBooking" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-[#334155] mb-1">Client Name</label>
                <input required type="text" v-model="newBooking.clientName" class="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" placeholder="e.g. Nuno Pereira"/>
              </div>
              <div>
                <label class="block text-sm font-bold text-[#334155] mb-1">Client Phone</label>
                <input required type="text" v-model="newBooking.clientPhone" class="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" placeholder="e.g. +351 911 222 333"/>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-[#334155] mb-1">Service Requested</label>
                <input required type="text" v-model="newBooking.service" class="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" placeholder="e.g. Headlight Restoration"/>
              </div>
              <div>
                <label class="block text-sm font-bold text-[#334155] mb-1">Vehicle</label>
                <input required type="text" v-model="newBooking.vehicle" class="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" placeholder="e.g. VW Golf"/>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-[#334155] mb-1">Requested Date</label>
                <input required type="date" v-model="newBooking.requestedDate" class="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium"/>
              </div>
              <div>
                <label class="block text-sm font-bold text-[#334155] mb-1">Requested Time</label>
                <input required type="time" v-model="newBooking.time" class="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium"/>
              </div>
            </div>

            <button type="submit" class="w-full mt-6 py-4 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl font-bold shadow-[0_0_12px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all">
              Add to Pending Requests
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  </motion.div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { motion, AnimatePresence } from 'motion-v'
import { Clock, Plus, X, CalendarDays, ChevronDown } from 'lucide-vue-next'
import { DatePicker } from 'v-calendar'
import 'v-calendar/style.css'
import { format, addDays } from 'date-fns'

// Types
interface Booking {
  id: string
  clientName: string
  clientPhone: string
  service: string
  vehicle: string
  requestedDate?: string
  date?: string
  time: string
  duration: string
  status: string
}

interface Bay {
  id: string
  name: string
  bookings: Booking[]
}

// Data
const todayDate = new Date()
const tomorrowDate = addDays(new Date(), 1)
const todayStr = format(todayDate, 'yyyy-MM-dd')
const tomorrowStr = format(tomorrowDate, 'yyyy-MM-dd')

const initialPending: Booking[] = [
  { id: 'p1', clientName: 'Ricardo Neves', clientPhone: '+351 912 345 678', service: 'Full Paint Correction', vehicle: 'Porsche 911', requestedDate: todayStr, time: '09:00', duration: '1 day', status: 'pending' },
  { id: 'p2', clientName: 'Ana Silva', clientPhone: '+351 965 432 109', service: 'Interior Deep Clean', vehicle: 'BMW X5', requestedDate: tomorrowStr, time: '14:30', duration: '3h', status: 'pending' },
]

const initialBays: Bay[] = [
  {
    id: 'bay-1',
    name: 'Bay 1 (Ceramics/Paint)',
    bookings: [
      { id: 'b1', clientName: 'João Costa', clientPhone: '+351 933 111 222', service: 'Ceramic Coating', vehicle: 'Audi RS6', date: todayStr, time: '09:00', duration: '6h', status: 'in-progress' },
    ],
  },
  {
    id: 'bay-2',
    name: 'Bay 2 (Interiors)',
    bookings: [
      { id: 'b3', clientName: 'Miguel Santos', clientPhone: '+351 922 333 444', service: 'Leather Treatment', vehicle: 'Mercedes S-Class', date: todayStr, time: '10:00', duration: '2h', status: 'scheduled' },
      { id: 'b4', clientName: 'Sofia Lima', clientPhone: '+351 911 000 000', service: 'Interior Detailing', vehicle: 'Tesla Model Y', date: tomorrowStr, time: '09:00', duration: '4h', status: 'scheduled' },
    ],
  },
  {
    id: 'bay-3',
    name: 'Bay 3 (Express/Wash)',
    bookings: [],
  },
]

// State
const bays = ref<Bay[]>(initialBays)
const pending = ref<Booking[]>(initialPending)
const isModalOpen = ref(false)
const selectedDate = ref<Date>(new Date())
const isCalendarOpen = ref(false)
const calendarRef = ref<HTMLElement | null>(null)
const draggedBooking = ref<Booking | null>(null)

const selectedDateStr = computed(() => format(selectedDate.value, 'yyyy-MM-dd'))

const newBooking = ref({
  clientName: '',
  clientPhone: '',
  time: '09:00',
  requestedDate: selectedDateStr.value,
  service: '',
  vehicle: '',
  duration: '2h'
})

const displayedPending = computed(() => 
  pending.value.filter(b => b.requestedDate === selectedDateStr.value)
)

// Methods
const setIsCalendarOpen = (value: boolean) => { isCalendarOpen.value = value }
const setIsModalOpen = (value: boolean) => { isModalOpen.value = value }

const handleDateSelect = (day: Date) => {
  selectedDate.value = day
  newBooking.value.requestedDate = format(day, 'yyyy-MM-dd')
  isCalendarOpen.value = false
}

// Drag and Drop handlers
const handleDragStart = (event: DragEvent, booking: Booking) => {
  draggedBooking.value = booking
  event.dataTransfer?.setData('text/plain', booking.id)
}

const handleDrop = (event: DragEvent, bayId: string) => {
  const bookingId = event.dataTransfer?.getData('text/plain')
  if (bookingId) {
    moveBooking(bookingId, bayId)
  }
}

const moveBooking = (bookingId: string, toBayId: string) => {
  let bookingToMove: Booking | null = null
  let fromPending = false

  const pendingBooking = pending.value.find(b => b.id === bookingId)
  if (pendingBooking) {
    bookingToMove = { ...pendingBooking, status: 'scheduled', date: selectedDateStr.value }
    fromPending = true
  } else {
    for (const bay of bays.value) {
      const found = bay.bookings.find(b => b.id === bookingId)
      if (found) {
        bookingToMove = found
        break
      }
    }
  }

  if (!bookingToMove) return

  if (fromPending) {
    pending.value = pending.value.filter(b => b.id !== bookingId)
  }

  const newBays = bays.value.map(bay => ({
    ...bay,
    bookings: bay.bookings.filter(b => b.id !== bookingId)
  }))

  bays.value = newBays.map(bay => {
    if (bay.id === toBayId) {
      return {
        ...bay,
        bookings: [...bay.bookings, bookingToMove!].sort((a, b) => a.time.localeCompare(b.time))
      }
    }
    return bay
  })
}

const handleAddBooking = (e: Event) => {
  e.preventDefault()
  if (!newBooking.value.service || !newBooking.value.vehicle || !newBooking.value.clientName) return
  
  pending.value = [{ ...newBooking.value, id: `p${Date.now()}`, status: 'pending' }, ...pending.value]
  
  isModalOpen.value = false
  newBooking.value = { clientName: '', clientPhone: '', time: '09:00', requestedDate: selectedDateStr.value, service: '', vehicle: '', duration: '2h' }
}

// Close calendar on outside click
const handleClickOutside = (event: MouseEvent) => {
  if (calendarRef.value && !calendarRef.value.contains(event.target as Node)) {
    isCalendarOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside)
})

const containerStyle = {
  background: 'linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2)), #FFFFFF',
  boxShadow: '0 0 12px 0 rgba(0, 0, 0, 0.7)',
  borderRadius: '16px',
}
</script>