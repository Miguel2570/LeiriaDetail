<template>
  <div class="backdrop-blur-[30px] p-8 flex flex-col h-full relative card-admin">
    <div class="flex items-center justify-between mb-8">
      <h3 class="text-3xl font-bold text-[#000000]">Roles & Permissions</h3>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

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

const fetchStaff = async () => {
  try {
    const response = await fetch('/Staff')
    const data = await response.json()
    if (!data.HasError && data.Staff) {
      staffList.value = data.Staff
    }
  } catch (error) {
    console.error('Erro ao carregar staff:', error)
  } finally {
    isLoading.value = false
  }
}

const handleRoleChange = async (id: number, role: string) => {
  try {
    await fetch('/Staff/Role', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
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
    await fetch(`/Staff/${id}`, { method: 'DELETE' })
    staffList.value = staffList.value.filter(s => s.id !== id)
  } catch (error) {
    console.error('Erro ao remover staff:', error)
  }
}

onMounted(() => {
  fetchStaff()
})
</script>