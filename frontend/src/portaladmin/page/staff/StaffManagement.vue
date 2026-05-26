<template>
  <div class="backdrop-blur-[30px] p-8 flex flex-col h-full relative card-admin">
    <div class="flex items-center justify-between mb-8">
      <h3 class="text-3xl font-bold text-[#000000]">Roles & Permissions</h3>
      <button @click="openModal" class="px-4 py-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-bold rounded-xl shadow-[0_0_12px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all flex items-center gap-2">
        <Plus class="w-5 h-5" /> Add Staff
      </button>
    </div>

    <div v-if="isLoading" class="flex-1 flex items-center justify-center text-[#64748B] font-medium">A carregar staff...</div>

    <div v-else class="overflow-x-auto flex-1">
      <table class="w-full">
        <thead>
          <tr class="border-b border-black/10">
            <th class="text-left py-3 px-4 text-[#334155] font-semibold">Name</th>
            <th class="text-left py-3 px-4 text-[#334155] font-semibold">Email</th>
            <th class="text-left py-3 px-4 text-[#334155] font-semibold">Role</th>
            <th class="text-left py-3 px-4 text-[#334155] font-semibold">Status</th>
            <th class="text-left py-3 px-4 text-[#334155] font-semibold">Tasks</th>
            <th class="text-right py-3 px-4 text-[#334155] font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="staff in staffList" :key="staff.id" class="border-b border-black/5 hover:bg-black/5 transition-colors">
            <td class="py-4 px-4 text-[#000000] font-bold">{{ staff.name }}</td>
            <td class="py-4 px-4 text-[#475569] text-sm">{{ staff.email }}</td>
            <td class="py-4 px-4">
              <select @change="handleRoleChange(staff.id, ($event.target as HTMLSelectElement).value)" class="px-3 py-1.5 rounded-lg bg-white/60 border border-[#06B6D4]/30 text-sm font-semibold text-[#000000]">
                <option value="operator" :selected="staff.role === 'operator'">Operator</option>
                <option value="manager" :selected="staff.role === 'manager'">Manager</option>
                <option value="admin" :selected="staff.role === 'admin'">Admin</option>
                <option value="superadmin" :selected="staff.role === 'superadmin'">Super Admin</option>
              </select>
            </td>
            <td class="py-4 px-4">
              <span :class="['px-3 py-1.5 rounded-full inline-flex items-center gap-2 font-bold text-xs uppercase',
                staff.status === 'active' ? 'bg-[#D1FAE5] text-[#059669]' : 'bg-[#F1F5F9] text-[#64748B]']">
                <span :class="['w-2 h-2 rounded-full', staff.status === 'active' ? 'bg-[#059669] animate-pulse' : 'bg-[#94A3B8]']" />
                {{ staff.status }}
              </span>
            </td>
            <td class="py-4 px-4 text-[#334155] font-medium">{{ staff.tasks || 0 }}</td>
            <td class="py-4 px-4 text-right">
              <button @click="handleRemove(staff.id)" class="px-3 py-1.5 text-sm bg-[#FEE2E2] text-[#DC2626] rounded-lg font-bold hover:bg-[#FECACA] transition-all">
                Remove
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-[16px]">
      <div class="w-full max-w-sm bg-white/90 backdrop-blur-xl border border-white/50 p-8 rounded-2xl shadow-2xl">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-[#000000]">Promote to Staff</h3>
          <button @click="closeModal" class="p-2 hover:bg-black/5 rounded-full"><X class="w-6 h-6 text-[#334155]" /></button>
        </div>
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">{{ errorMessage }}</div>
        <form @submit.prevent="handleAddStaff" class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-[#334155] mb-1">User Email</label>
            <input required type="email" v-model="form.email" @input="errorMessage = ''" class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" placeholder="user@email.com" />
          </div>
          <div>
            <label class="block text-sm font-bold text-[#334155] mb-1">Role</label>
            <select v-model="form.role" class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium">
              <option value="operator">Operator</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
          <button type="submit" :disabled="isSubmitting" class="w-full mt-6 py-4 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl font-bold shadow-[0_0_12px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all disabled:opacity-50">
            {{ isSubmitting ? 'A promover...' : 'Promote to Staff' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, X } from 'lucide-vue-next'
import { apiFetch } from '@/services/api'

interface Staff {
  id: number
  name: string
  email: string
  role: string
  status: string
  tasks: number
}

const staffList = ref<Staff[]>([])
const isLoading = ref(true)
const isModalOpen = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')
const form = ref({ email: '', role: 'operator' })

const fetchStaff = async () => {
  try {
    const data = await apiFetch('/Staff')
    if (!data.HasError && data.Staff) {
      staffList.value = data.Staff
    }
  } catch (error) {
    console.error('Erro ao carregar staff:', error)
  } finally {
    isLoading.value = false
  }
}

const openModal = () => {
  form.value = { email: '', role: 'operator' }
  errorMessage.value = ''
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleAddStaff = async () => {
  isSubmitting.value = true
  errorMessage.value = ''
  try {
    const data = await apiFetch('/Staff/promote', {
      method: 'POST',
      body: JSON.stringify(form.value)
    })
    if (!data.HasError) {
      await fetchStaff()
      closeModal()
    } else {
      errorMessage.value = data.Error?.Message || 'Erro ao promover utilizador.'
    }
  } catch (error) {
    errorMessage.value = 'Erro de conexão.'
  } finally {
    isSubmitting.value = false
  }
}

const handleRoleChange = async (id: number, role: string) => {
  try {
    await apiFetch('/Staff/Role', {
      method: 'PUT',
      body: JSON.stringify({ id, role })
    })
    await fetchStaff()
  } catch (error) {
    console.error('Erro ao atualizar role:', error)
  }
}

const handleRemove = async (id: number) => {
  if (!confirm('Remover este staff?')) return
  try {
    await apiFetch(`/Staff/${id}`, { method: 'DELETE' })
    staffList.value = staffList.value.filter(s => s.id !== id)
  } catch (error) {
    console.error('Erro ao remover staff:', error)
  }
}

onMounted(() => {
  fetchStaff()
})
</script>