<!-- src/portaladmin/page/audit/AuditLogs.vue -->
<template>
  <div class="backdrop-blur-[30px] p-8 flex flex-col h-full overflow-y-auto card-admin">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h3 class="text-3xl font-bold text-[#000000]">Audit Logs</h3>
        <p class="text-[#334155] font-medium mt-1">Security & Activity Tracking</p>
      </div>
      <div class="flex gap-3">
        <select v-model="filterAction" class="px-4 py-2 bg-white/60 border border-[#06B6D4]/30 rounded-xl text-sm font-semibold text-[#000000]">
          <option value="">All Actions</option>
          <option value="LOGIN">Login</option>
          <option value="DELETE">Delete</option>
          <option value="UPDATE">Update</option>
          <option value="CREATE">Create</option>
        </select>
        <input type="date" v-model="filterDate" class="px-4 py-2 bg-white/60 border border-[#06B6D4]/30 rounded-xl text-sm text-[#000000]" />
      </div>
    </div>

    <div v-if="isLoading" class="flex-1 flex items-center justify-center text-[#64748B]">A carregar...</div>

    <div v-else class="overflow-x-auto flex-1">
      <table class="w-full">
        <thead>
          <tr class="border-b border-black/10">
            <th class="text-left py-3 px-4 text-[#334155] font-semibold text-xs">Date/Time</th>
            <th class="text-left py-3 px-4 text-[#334155] font-semibold text-xs">User</th>
            <th class="text-left py-3 px-4 text-[#334155] font-semibold text-xs">Action</th>
            <th class="text-left py-3 px-4 text-[#334155] font-semibold text-xs">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in filteredLogs" :key="log.id" class="border-b border-black/5 hover:bg-black/5 transition-colors">
            <td class="py-3 px-4 text-[#000000] text-xs font-mono">{{ formatDate(log.created_at) }}</td>
            <td class="py-3 px-4 text-[#475569] text-xs">{{ log.email || 'System' }}</td>
            <td class="py-3 px-4">
              <span :class="['px-2 py-0.5 rounded-full text-[10px] font-bold uppercase',
                log.action === 'DELETE' ? 'bg-red-100 text-red-600' :
                log.action === 'CREATE' ? 'bg-green-100 text-green-600' :
                log.action === 'UPDATE' ? 'bg-blue-100 text-blue-600' :
                'bg-gray-100 text-gray-600']">
                {{ log.action }}
              </span>
            </td>
            <td class="py-3 px-4 text-[#475569] text-xs max-w-xs truncate">{{ log.details ? JSON.stringify(log.details) : '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { graphql } from '@/graphql'

interface AuditLog {
  id: number
  user_id: number
  email: string
  action: string
  details: any
  created_at: string
}

const logs = ref<AuditLog[]>([])
const isLoading = ref(true)
const filterAction = ref('')
const filterDate = ref('')

const filteredLogs = computed(() => {
  return logs.value.filter(log => {
    if (filterAction.value && log.action !== filterAction.value) return false
    if (filterDate.value && !log.created_at.startsWith(filterDate.value)) return false
    return true
  })
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('pt-PT')
}

const fetchLogs = async () => {
  try {
    const query = `query { auditLogs { logs { id userId email action details createdAt } } }`
    const data = await graphql<{ auditLogs: { logs: AuditLog[] } }>(query)
    if (data.auditLogs?.logs) logs.value = data.auditLogs.logs
  } catch (error) { console.error('Erro ao carregar logs:', error) }
  finally { isLoading.value = false }
}

onMounted(() => fetchLogs())
</script>