<script setup lang="ts">
import { TrendingUp, Clock, CalendarCheck, Users } from 'lucide-vue-next'

const cardStyle = {
  background: 'linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2)), #FFFFFF',
  boxShadow: '0 0 12px 0 rgba(0, 0, 0, 0.7)',
  borderRadius: '16px',
}

const metricCards = [
  { title: "Faturação Hoje", value: "€1,240", trend: "+8%", icon: TrendingUp, color: "from-[#3B82F6] to-[#06B6D4]" },
  { title: "Marcações Pendentes", value: "12", trend: "3 Urgent", icon: Clock, color: "from-[#F59E0B] to-[#EF4444]" },
  { title: "Carros Concluídos", value: "4", trend: "Hoje", icon: CalendarCheck, color: "from-[#10B981] to-[#34D399]" },
  { title: "Staff Ativo", value: "8/10", trend: "2 em pausa", icon: Users, color: "from-[#8B5CF6] to-[#EC4899]" },
]

const activityLogs = [
  { time: '10:42 AM', text: 'API: Bay 2 status updated to [Finished]', type: 'system' },
  { time: '09:15 AM', text: 'Frontend: Nova marcação Cerâmica. A aguardar aprovação.', type: 'user' },
  { time: '09:00 AM', text: 'Auth: Login do Admin efetuado (IP: 192.168.1.102)', type: 'auth' },
  { time: '08:30 AM', text: 'Cron: Sincronização de Inventário completa. 3 alertas.', type: 'system' },
]
</script>

<template>
  <div class="backdrop-blur-[30px] p-8 flex flex-col h-full overflow-y-auto" :style="cardStyle">
    
    <div class="flex justify-between items-center mb-8">
      <div>
        <h2 class="text-3xl font-[Poppins] font-bold text-[#000000] tracking-tight">System Overview</h2>
        <p class="text-[#334155] font-medium mt-1">LeiriaDetail Backend & Performance Engine</p>
      </div>
      <div class="px-4 py-2 bg-black/5 rounded-lg border border-black/10 text-sm font-bold text-[#000000]">
        Status: <span class="text-[#10B981]">All Systems Operational</span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div 
        v-for="(card, i) in metricCards" 
        :key="i"
        class="p-6 rounded-2xl border border-white/40 shadow-sm relative overflow-hidden group transition-all hover:-translate-y-1 hover:shadow-md"
        style="background: linear-gradient(to bottom right, rgba(255,255,255,0.8), rgba(255,255,255,0.4))"
      >
        <div class="absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform">
          <component :is="card.icon" class="w-20 h-20" />
        </div>
        
        <div class="relative z-10 flex justify-between items-start mb-4">
          <div :class="`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg text-white`">
            <component :is="card.icon" class="w-6 h-6" />
          </div>
          <span class="px-2.5 py-1 rounded-full bg-white/60 text-xs font-bold text-[#334155] shadow-sm">{{ card.trend }}</span>
        </div>
        <div class="relative z-10">
          <h3 class="text-[#475569] font-bold text-sm mb-1">{{ card.title }}</h3>
          <p class="font-[Poppins] text-3xl font-bold text-[#000000]">{{ card.value }}</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[300px]">
      
      <div class="lg:col-span-2 p-6 rounded-2xl border border-white/40 flex flex-col justify-center items-center" style="background: linear-gradient(to bottom right, rgba(255,255,255,0.9), rgba(255,255,255,0.5))">
        <h4 class="font-[Poppins] font-bold text-[#000000] text-xl mb-2 w-full text-left">Revenue Analytics</h4>
        <div class="flex-1 w-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl mt-4">
          <p class="text-gray-400 font-medium">Área de gráfico (A aguardar biblioteca Vue-ChartJS)</p>
        </div>
      </div>

      <div class="p-6 rounded-2xl border border-white/40 overflow-y-auto" style="background: linear-gradient(to bottom right, rgba(255,255,255,0.9), rgba(255,255,255,0.5))">
        <h4 class="font-[Poppins] font-bold text-[#000000] text-xl mb-6">Backend Activity Logs</h4>
        
        <div class="space-y-5">
          <div v-for="(activity, i) in activityLogs" :key="i" class="flex gap-4 items-start">
            <div :class="[
              'w-2.5 h-2.5 mt-1.5 rounded-full shadow-sm shrink-0',
              activity.type === 'system' ? 'bg-[#8B5CF6]' : 
              activity.type === 'auth' ? 'bg-[#10B981]' : 'bg-[#06B6D4]'
            ]"></div>
            <div>
              <p class="text-[10px] font-bold text-[#64748B] mb-0.5 tracking-wider">{{ activity.time }}</p>
              <p class="text-sm font-medium text-[#1E293B] leading-snug">{{ activity.text }}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>