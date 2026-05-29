<!-- src/portaladmin/page/holiday/HolidayManager.vue -->
<template>
  <div class="backdrop-blur-[30px] p-8 flex flex-col h-full overflow-y-auto card-admin">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h3 class="text-3xl font-bold text-[#000000]">Feriados & Bloqueios</h3>
        <p class="text-[#334155] font-medium mt-1">Gerir dias em que a loja está fechada</p>
      </div>
      <button @click="openModal()" class="px-4 py-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-bold rounded-xl shadow-md flex items-center gap-2">
        <Plus class="w-4 h-4" /> Bloquear Dia
      </button>
    </div>

    <div v-if="isLoading" class="flex-1 flex items-center justify-center">A carregar...</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="d in dates" :key="d.id" class="p-4 border border-black/10 rounded-xl bg-white/50 flex justify-between items-center">
        <div>
          <p class="font-bold text-[#000000]">{{ formatDate(d.date) }}</p>
          <p class="text-xs text-[#64748B]">{{ d.reason }}</p>
          <span v-if="d.is_recurring" class="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full mt-1 inline-block">Recorrente</span>
        </div>
        <button @click="handleRemove(d.id)" class="text-red-400 hover:text-red-600">
          <Trash2 class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-[16px]">
      <div class="w-full max-w-sm bg-white/90 p-8 rounded-2xl shadow-2xl">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold">Bloquear Dia</h3>
          <button @click="closeModal"><X class="w-5 h-5" /></button>
        </div>
        <form @submit.prevent="handleAdd" class="space-y-4">
          <div><label class="block text-sm font-bold mb-1">Data</label><input required type="date" v-model="form.date" class="w-full px-4 py-2 rounded-xl border" /></div>
          <div><label class="block text-sm font-bold mb-1">Motivo</label><input required v-model="form.reason" placeholder="Ex: Férias, Feriado..." class="w-full px-4 py-2 rounded-xl border" /></div>
          <div class="flex items-center gap-2"><input type="checkbox" v-model="form.isRecurring" /><label class="text-sm">Repetir todos os anos</label></div>
          <button type="submit" :disabled="isSubmitting" class="w-full py-3 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl font-bold">
            {{ isSubmitting ? 'A guardar...' : 'Bloquear Dia' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Trash2, X } from 'lucide-vue-next'
import { graphql } from '@/graphql'


interface BlockedDate { id: number; date: string; reason: string; is_recurring: boolean }

const dates = ref<BlockedDate[]>([])
const isLoading = ref(true)
const isModalOpen = ref(false)
const isSubmitting = ref(false)
const form = ref({ date: '', reason: '', isRecurring: false })

const formatDate = (d: string) => {
    if (!d) return ''
    const [year, month, day] = d.split('-')
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })
}

const fetchDates = async () => {
  try {
    const query = `query { blockedDates { dates { id date reason isRecurring } } }`
    const data = await graphql<{ blockedDates: { dates: BlockedDate[] } }>(query)
    if (data.blockedDates?.dates) dates.value = data.blockedDates.dates
  } catch (e) { console.error(e) }
  finally { isLoading.value = false }
}

const openModal = () => { form.value = { date: '', reason: '', isRecurring: false }; isModalOpen.value = true }
const closeModal = () => { isModalOpen.value = false }

const handleAdd = async () => {
  isSubmitting.value = true
  try {
    const mutation = `mutation($input: AddBlockedDateInput!) { addBlockedDate(input: $input) { hasError } }`
    await graphql(mutation, { input: form.value })
    await fetchDates()
    closeModal()
  } catch (e) { console.error(e) }
  finally { isSubmitting.value = false }
}

const handleRemove = async (id: number) => {
  if (!confirm('Remover?')) return
  try {
    await graphql(`mutation { removeBlockedDate(id: "${id}") { hasError } }`)
    dates.value = dates.value.filter(d => d.id !== id)
  } catch (e) { console.error(e) }
}

onMounted(() => fetchDates())
</script>