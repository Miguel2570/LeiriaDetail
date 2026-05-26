<template>
  <div class="backdrop-blur-[30px] p-8 flex flex-col h-full overflow-y-auto card-admin">
    
    <div class="flex justify-between items-center mb-8">
      <div>
        <h2 class="text-3xl font-bold text-[#000000] tracking-tight">System Overview</h2>
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
          <p class="text-3xl font-bold text-[#000000]">{{ card.value }}</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[300px]">
      
      <div class="lg:col-span-2 p-6 rounded-2xl border border-white/40" style="background: linear-gradient(to bottom right, rgba(255,255,255,0.9), rgba(255,255,255,0.5))">
        <h4 class="font-bold text-[#000000] text-xl mb-4">Revenue Analytics</h4>
        <div class="h-[300px]">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <div class="p-6 rounded-2xl border border-white/40 overflow-y-auto" style="background: linear-gradient(to bottom right, rgba(255,255,255,0.9), rgba(255,255,255,0.5))">
        <h4 class="font-bold text-[#000000] text-xl mb-6">Backend Activity Logs</h4>
        
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

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TrendingUp, Clock, CalendarCheck, Users } from 'lucide-vue-next'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

interface DashboardData {
    HasError: boolean
    Error?: { Message: string }
    Metrics?: {
        faturacaoHoje: number
        marcacoesPendentes: number
        carrosConcluidos: number
        staffAtivo: { ativo: number; total: number }
    }
    Revenue?: Array<{ date: string; revenue: number; expenses: number }>
    ActivityLogs?: Array<{ time: string; text: string; type: string }>
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const metricCards = ref([
  { title: "Faturação Hoje", value: "€0", trend: "A carregar...", icon: TrendingUp, color: "from-[#3B82F6] to-[#06B6D4]" },
  { title: "Marcações Pendentes", value: "0", trend: "A carregar...", icon: Clock, color: "from-[#F59E0B] to-[#EF4444]" },
  { title: "Carros Concluídos", value: "0", trend: "Hoje", icon: CalendarCheck, color: "from-[#10B981] to-[#34D399]" },
  { title: "Staff Ativo", value: "0/0", trend: "A carregar...", icon: Users, color: "from-[#8B5CF6] to-[#EC4899]" },
])

const activityLogs = ref([
  { time: '--:--', text: 'A carregar logs...', type: 'system' }
])

const chartData = ref({
  labels: [] as string[],
  datasets: [
    {
      label: 'Faturação (€)',
      data: [] as number[],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#3B82F6',
      pointBorderColor: '#FFFFFF',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
    {
      label: 'Despesas (€)',
      data: [] as number[],
      borderColor: '#EF4444',
      backgroundColor: 'rgba(239, 68, 68, 0.05)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#EF4444',
      pointBorderColor: '#FFFFFF',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: { size: 12, weight: 'bold' as const },
      },
    },
    tooltip: {
      backgroundColor: '#0A0A0F',
      titleColor: '#FFFFFF',
      bodyColor: '#94A3B8',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(0, 0, 0, 0.06)' },
      ticks: {
        callback: (value: any) => `€${value}`,
        font: { size: 11 },
      },
    },
    x: {
      grid: { display: false },
      ticks: { font: { size: 11 } },
    },
  },
}

const fetchDashboardData = async () => {
  try {
    const response = await fetch('/Dashboard')
    const data: DashboardData = await response.json()
    
    if (data.HasError || !data.Metrics) {
      console.error('Dashboard error:', data.Error?.Message)
      return
    }
    
    const cards = metricCards.value
    if (!cards[0] || !cards[1] || !cards[2] || !cards[3]) return
    
    // Métricas
    cards[0].value = `€${data.Metrics.faturacaoHoje.toFixed(0)}`
    cards[0].trend = data.Metrics.faturacaoHoje > 0 ? 'Hoje' : 'Sem dados'
    cards[1].value = String(data.Metrics.marcacoesPendentes)
    cards[1].trend = data.Metrics.marcacoesPendentes > 0 ? `${data.Metrics.marcacoesPendentes} pendentes` : 'Nenhuma'
    cards[2].value = String(data.Metrics.carrosConcluidos)
    cards[3].value = `${data.Metrics.staffAtivo.ativo}/${data.Metrics.staffAtivo.total}`
    cards[3].trend = data.Metrics.staffAtivo.total - data.Metrics.staffAtivo.ativo > 0 
      ? `${data.Metrics.staffAtivo.total - data.Metrics.staffAtivo.ativo} ausente(s)` 
      : 'Todos ativos'
    
    // Gráfico
    if (data.Revenue && data.Revenue.length > 0) {
      const chart = chartData.value
      const ds0 = chart.datasets[0]
      const ds1 = chart.datasets[1]
      
      if (ds0 && ds1) {
        const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
        chart.labels = data.Revenue.map((r) => {
          const d = new Date(r.date)
          return diasSemana[d.getDay()] || r.date
        })
        ds0.data = data.Revenue.map((r) => r.revenue)
        ds1.data = data.Revenue.map((r) => r.expenses)
      }
    }
    
    // Logs
    if (data.ActivityLogs && data.ActivityLogs.length > 0) {
      activityLogs.value = data.ActivityLogs
    }
    
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error)
  }
}

onMounted(() => {
  fetchDashboardData()
  // Atualizar a cada 60 segundos
  setInterval(fetchDashboardData, 60000)
})
</script>