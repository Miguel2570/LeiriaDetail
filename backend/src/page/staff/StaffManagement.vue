<template>
  <motion.div 
    :initial="{ opacity: 0, y: 10 }"
    :animate="{ opacity: 1, y: 0 }"
    class="backdrop-blur-[30px] p-8 flex flex-col h-full relative" 
    :style="cardStyle"
  >
    <div class="flex items-center justify-between mb-8">
      <h3 class="text-3xl font-[Poppins] font-bold text-[#000000]">Roles & Permissions</h3>
      <button 
        @click="setIsModalOpen(true)"
        class="px-4 py-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl font-bold shadow-[0_0_12px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all flex items-center gap-2"
      >
        <Plus class="w-5 h-5" />
        Add Staff
      </button>
    </div>

    <div class="overflow-x-auto flex-1">
      <table class="w-full">
        <thead>
          <tr class="border-b border-black/10">
            <th class="text-left py-3 px-4 text-[#334155] font-semibold">Employee</th>
            <th class="text-left py-3 px-4 text-[#334155] font-semibold">Role</th>
            <th class="text-left py-3 px-4 text-[#334155] font-semibold">Status</th>
            <th class="text-right py-3 px-4 text-[#334155] font-semibold">Actions</th>
           </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            <motion.tr 
              v-for="staff in staffData"
              :key="staff.id"
              :initial="{ opacity: 0, x: -10 }"
              :animate="{ opacity: 1, x: 0 }"
              :exit="{ opacity: 0, x: 10 }"
              class="border-b border-black/5 hover:bg-black/5 transition-colors"
            >
              <td class="py-4 px-4 text-[#000000] font-bold">{{ staff.name }}</td>
              <td class="py-4 px-4">
                <div class="flex items-center gap-2">
                  <ShieldAlert v-if="staff.role === 'Super Admin'" class="w-4 h-4 text-[#0284C7]" />
                  <User v-else class="w-4 h-4 text-[#475569]" />
                  <span :class="`font-semibold ${staff.role === 'Super Admin' ? 'text-[#0284C7]' : 'text-[#475569]'}`">
                    {{ staff.role }}
                  </span>
                </div>
              </td>
              <td class="py-4 px-4">
                <span :class="`px-3 py-1.5 rounded-full inline-flex items-center gap-2 font-bold text-xs uppercase tracking-wide ${
                  staff.status === 'active'
                    ? 'bg-[#E0F2FE] text-[#0284C7] shadow-[0_0_10px_rgba(2,132,199,0.3)]'
                    : staff.status === 'busy'
                    ? 'bg-[#FEE2E2] text-[#DC2626] shadow-[0_0_10px_rgba(220,38,38,0.3)]'
                    : 'bg-[#D1FAE5] text-[#059669] shadow-[0_0_10px_rgba(5,150,105,0.3)]'
                }`">
                  <span class="w-2 h-2 rounded-full bg-current animate-pulse" />
                  {{ staff.status }}
                </span>
              </td>
              <td class="py-4 px-4 text-right">
                <button 
                  @click="removeStaff(staff.id)"
                  class="px-3 py-1.5 text-sm bg-[#FEE2E2] border border-black/10 text-[#DC2626] rounded-lg font-bold hover:bg-[#FECACA] transition-all shadow-sm"
                >
                  Remove
                </button>
              </td>
            </motion.tr>
          </AnimatePresence>
        </tbody>
      </table>
    </div>

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
          class="w-full max-w-sm bg-white/90 backdrop-blur-xl border border-white/50 p-8 rounded-2xl shadow-2xl"
        >
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-[Poppins] font-bold text-[#000000]">Add New Staff</h3>
            <button @click="setIsModalOpen(false)" class="p-2 hover:bg-black/5 rounded-full transition-colors">
              <X class="w-6 h-6 text-[#334155]" />
            </button>
          </div>

          <form @submit="handleAddStaff" class="space-y-4">
            <div>
              <label class="block text-sm font-bold text-[#334155] mb-1">Full Name</label>
              <input 
                required
                type="text" 
                v-model="newStaff.name"
                class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium"
                placeholder="e.g. Tiago Mendes"
              />
            </div>
            
            <div>
              <label class="block text-sm font-bold text-[#334155] mb-1">Role</label>
              <select 
                v-model="newStaff.role"
                class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium"
              >
                <option value="Operator">Operator</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Manager">Manager</option>
              </select>
            </div>

            <button type="submit" class="w-full mt-6 py-4 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl font-bold shadow-[0_0_12px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all">
              Create Account
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  </motion.div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { motion, AnimatePresence } from 'motion-v'
import { ShieldAlert, User, Shield, Plus, X } from 'lucide-vue-next'

interface Staff {
  id: number
  name: string
  role: string
  workload: string
  status: string
  tasks: number
}

const initialStaff: Staff[] = [
  { id: 1, name: 'João Silva', role: 'Super Admin', workload: '85%', status: 'active', tasks: 12 },
  { id: 2, name: 'Maria Santos', role: 'Operator', workload: '62%', status: 'active', tasks: 8 },
  { id: 3, name: 'Pedro Costa', role: 'Operator', workload: '45%', status: 'available', tasks: 5 },
  { id: 4, name: 'Ana Ferreira', role: 'Super Admin', workload: '90%', status: 'busy', tasks: 15 },
]

const staffData = ref<Staff[]>(initialStaff)
const isModalOpen = ref(false)
const newStaff = ref({ name: '', role: 'Operator' })

const setIsModalOpen = (value: boolean) => {
  isModalOpen.value = value
}

const removeStaff = (id: number) => {
  staffData.value = staffData.value.filter(s => s.id !== id)
}

const handleAddStaff = (e: Event) => {
  e.preventDefault()
  if (!newStaff.value.name) return
  
  staffData.value = [{ 
    id: Date.now(), 
    name: newStaff.value.name, 
    role: newStaff.value.role, 
    workload: '0%', 
    status: 'available', 
    tasks: 0 
  }, ...staffData.value]
  
  isModalOpen.value = false
  newStaff.value = { name: '', role: 'Operator' }
}

const cardStyle = {
  background: 'linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2)), #FFFFFF',
  boxShadow: '0 0 12px 0 rgba(0, 0, 0, 0.7)',
  borderRadius: '16px',
}
</script>