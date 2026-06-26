<template>
  <div class="backdrop-blur-[30px] p-8 h-full flex flex-col relative overflow-hidden card-admin">
    
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 shrink-0 gap-4">
      <div>
        <h3 class="text-3xl font-bold text-[#000000]">Gestão de Marcações</h3>
        <p class="text-[#334155] font-medium mt-1">
          <span class="font-bold text-[#0284C7]">
            {{ selectedDate ? format(selectedDate, 'EEEE, dd MMMM yyyy') : 'Selecione uma data' }}
          </span>
        </p>
      </div>
      
      <div class="flex gap-3 items-center">
        <!-- Calendário Nativo -->
        <input 
          type="date" 
          :value="format(selectedDate, 'yyyy-MM-dd')"
          @change="handleDateChange"
          class="px-4 py-2 bg-white text-[#0F172A] font-bold rounded-xl shadow-sm border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20"
        />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#06B6D4]"></div>
    </div>

    <!-- Lista de Marcações -->
    <div v-else class="flex-1 overflow-y-auto">
      
      <!-- Sem marcações -->
      <div v-if="allBookings.length === 0" class="text-center py-20">
        <CalendarDays class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500 font-medium text-lg">Nenhuma marcação para este dia</p>
        <p class="text-gray-400 text-sm mt-1">Selecione outra data no calendário</p>
      </div>

      <!-- Cards de Marcações -->
      <div v-else class="space-y-4">
        <div v-for="booking in allBookings" :key="booking.id"
          class="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all">
          
          <div class="flex items-start justify-between">
            <!-- Info Esquerda -->
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#06B6D4] flex items-center justify-center text-white font-bold text-sm shrink-0">
                {{ getInitials(booking.clientName) }}
              </div>
              
              <div>
                <h4 class="font-bold text-[#0F172A] text-lg">{{ booking.clientName }}</h4>
                <p class="text-[#334155] font-medium">{{ booking.service }}</p>
                <div class="flex items-center gap-3 mt-2 text-sm text-[#64748B]">
                  <span>🚗 {{ booking.vehiclePlate }}</span>
                  <span>•</span>
                  <span>{{ booking.vehicle }}</span>
                </div>
                <div class="flex items-center gap-3 mt-1 text-sm text-[#64748B]">
                  <span>🕐 {{ booking.time }}</span>
                  <span>•</span>
                  <span>⏱ {{ booking.duration }}</span>
                </div>
              </div>
            </div>

            <!-- Status + Ações -->
            <div class="flex flex-col items-end gap-3">
              <span :class="[
                'px-3 py-1.5 rounded-full text-xs font-bold uppercase',
                booking.status === 'PENDENTE' ? 'bg-amber-100 text-amber-700' :
                booking.status === 'EM_PROGRESSO' ? 'bg-blue-100 text-blue-700' :
                booking.status === 'CONCLUIDO' ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-700'
              ]">
                {{ getStatusText(booking.status) }}
              </span>

              <div class="flex gap-2">
                <button v-if="booking.status === 'PENDENTE'"
                  @click="startService(booking)"
                  class="px-4 py-2 bg-[#3B82F6] text-white rounded-xl text-xs font-bold hover:bg-[#2563EB] transition-all">
                  ▶ Iniciar
                </button>
                
                <button v-if="booking.status === 'EM_PROGRESSO'"
                  @click="completeService(booking)"
                  class="px-4 py-2 bg-[#10B981] text-white rounded-xl text-xs font-bold hover:bg-[#059669] transition-all">
                  ✓ Concluir
                </button>

                <button v-if="booking.status === 'CONCLUIDO'"
                  @click="reopenService(booking)"
                  class="px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-xs font-bold hover:bg-amber-200 transition-all">
                  🔄 Reabrir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { CalendarDays } from 'lucide-vue-next'
import { format } from 'date-fns'
import { graphql } from '@/graphql'

interface Booking {
  id: number
  clientId: number
  vehicleId: number
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

const allBookings = ref<Booking[]>([])
const isLoading = ref(true)
const selectedDate = ref(new Date())

const fetchAppointments = async () => {
  isLoading.value = true
  try {
    if (!selectedDate.value || isNaN(selectedDate.value.getTime())) {
      selectedDate.value = new Date()
    }

    const date = format(selectedDate.value, 'yyyy-MM-dd')
    
    const query = `
      query($date: String) {
        appointments(date: $date) {
          data {
            pending { 
              id clientId vehicleId clientName clientPhone 
              service vehicle vehiclePlate date time duration status 
            }
          }
        }
      }
    `
    
    const data = await graphql<{ appointments: any }>(query, { date })
    
    if (data.appointments?.data?.pending) {
      allBookings.value = data.appointments.data.pending.sort((a: Booking, b: Booking) => 
        a.time.localeCompare(b.time)
      )
    } else {
      allBookings.value = []
    }
  } catch (error) {
    console.error('Erro ao carregar marcações:', error)
  } finally {
    isLoading.value = false
  }
}

const handleDateChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.value) {
    selectedDate.value = new Date(input.value + 'T00:00:00')
    fetchAppointments()
  }
}

const getInitials = (name: string) => {
  if (!name) return '??'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    'PENDENTE': 'Pendente',
    'EM_PROGRESSO': 'Em Curso',
    'CONCLUIDO': 'Pronto',
    'AGENDADO': 'Agendado',
    'CONFIRMADO': 'Confirmado'
  }
  return texts[status] || status
}

const startService = async (booking: Booking) => {
  try {
    await graphql(`
      mutation UpdateBookingStatus($input: UpdateStatusInput!) {
        updateBookingStatus(input: $input) { hasError message }
      }
    `, { input: { bookingId: booking.id, status: 'EM_PROGRESSO' } })
    
    // ✅ Buscar preços do serviço
    const servicePrices = await fetchServicePrices(booking.service)
    
    await graphql(`
      mutation CreateWorkshopService($input: CreateServiceInput!) {
        createWorkshopService(input: $input) {
          service { id }
          errors { field message }
        }
      }
    `, {
      input: {
        name: booking.service,
        clientId: booking.clientId || 1,
        vehicleId: booking.vehicleId || 1,
        serviceType: booking.service,
        priceAB: servicePrices.priceAB,
        priceC: servicePrices.priceC,
        priceDE: servicePrices.priceDE,
        observations: '',
        entryChecks: [],
        estimatedValue: servicePrices.priceC
      }
    })
    
    await fetchAppointments()
  } catch (error) {
    console.error('Erro ao iniciar serviço:', error)
  }
}

const fetchServicePrices = async (serviceName: string): Promise<{ priceAB: number, priceC: number, priceDE: number }> => {
  try {
    const query = `query { services { services { name priceAB priceC priceDE } } }`
    const data = await graphql<{ services: { services: { name: string, priceAB: number, priceC: number, priceDE: number }[] } }>(query)
    const found = (data.services?.services || []).find(s => s.name === serviceName)
    return found ? { priceAB: found.priceAB, priceC: found.priceC, priceDE: found.priceDE } : { priceAB: 0, priceC: 0, priceDE: 0 }
  } catch {
    return { priceAB: 0, priceC: 0, priceDE: 0 }
  }
}

const completeService = async (booking: Booking) => {
  try {
    await graphql(`
      mutation UpdateBookingStatus($input: UpdateStatusInput!) {
        updateBookingStatus(input: $input) { hasError message }
      }
    `, { input: { bookingId: booking.id, status: 'CONCLUIDO' } })
    await fetchAppointments()
  } catch (error) {
    console.error('Erro ao concluir serviço:', error)
  }
}

const reopenService = async (booking: Booking) => {
  try {
    await graphql(`
      mutation UpdateBookingStatus($input: UpdateStatusInput!) {
        updateBookingStatus(input: $input) { hasError message }
      }
    `, { input: { bookingId: booking.id, status: 'EM_PROGRESSO' } })
    await fetchAppointments()
  } catch (error) {
    console.error('Erro ao reabrir serviço:', error)
  }
}

onMounted(() => {
  fetchAppointments()
})
</script>