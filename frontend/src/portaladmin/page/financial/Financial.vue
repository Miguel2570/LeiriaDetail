<template>
  <div class="backdrop-blur-[30px] p-8 flex flex-col h-full overflow-y-auto card-admin">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h3 class="text-3xl font-bold text-[#000000]">Financial Overview</h3>
        <p class="text-[#334155] font-medium mt-1">Track your detailing business revenue and growth</p>
      </div>
      <button class="px-5 py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl font-bold shadow-[0_0_12px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all flex items-center gap-2">
        <CalendarDays class="w-5 h-5" />
        Last 7 Days
      </button>
    </div>

    <div v-if="isLoading" class="flex-1 flex items-center justify-center text-[#64748B] font-medium">A carregar dados financeiros...</div>

    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div class="p-6 border border-black/10 rounded-2xl backdrop-blur-sm card-mini">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.5)]">
                <TrendingUp class="w-6 h-6 text-white" />
              </div>
              <div>
                <p class="text-[#334155] font-bold uppercase tracking-wide text-xs mb-1">Weekly Revenue</p>
                <h2 class="text-2xl font-bold text-[#000000]">€{{ formatPrice(summary.weeklyRevenue) }}</h2>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 border border-black/10 rounded-2xl backdrop-blur-sm card-mini">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.5)]">
                <Wallet class="w-6 h-6 text-white" />
              </div>
              <div>
                <p class="text-[#334155] font-bold uppercase tracking-wide text-xs mb-1">Expected Income</p>
                <h2 class="text-2xl font-bold text-[#000000]">€{{ formatPrice(summary.expectedIncome) }}</h2>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 border border-black/10 rounded-2xl backdrop-blur-sm card-mini">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.5)]">
                <Clock class="w-6 h-6 text-white" />
              </div>
              <div>
                <p class="text-[#334155] font-bold uppercase tracking-wide text-xs mb-1">Pending Payments</p>
                <h2 class="text-2xl font-bold text-[#000000]">€{{ formatPrice(summary.pendingPayments) }}</h2>
              </div>
            </div>
            <div v-if="summary.pendingCount > 0" class="text-right">
              <span class="text-[#EA580C] bg-[#FFEDD5] px-2 py-1 rounded-md font-bold text-xs shadow-sm">{{ summary.pendingCount }} Inv.</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex-1 min-h-[400px] p-6 rounded-2xl border border-black/10 backdrop-blur-sm flex flex-col card-mini">
        <h4 class="font-bold text-[#000000] text-xl mb-6">Revenue Growth (Last 7 Days)</h4>
        <div v-if="revenueData.length === 0" class="flex-1 flex items-center justify-center text-[#94A3B8] font-medium">Sem dados de receita.</div>
        <div v-else class="flex-1 w-full">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { TrendingUp, Clock, CalendarDays, Wallet } from 'lucide-vue-next'
import { Line } from 'vue-chartjs'
import { graphql } from '@/graphql'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend)

const summary = ref({ weeklyRevenue: 0, expectedIncome: 0, pendingPayments: 0, pendingCount: 0 })
const revenueData = ref<{ date: string; revenue: number }[]>([])
const isLoading = ref(true)

const chartData = computed(() => ({
  labels: revenueData.value.map(r => ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][new Date(r.date).getDay()]),
  datasets: [{
    label: 'Revenue', data: revenueData.value.map(r => r.revenue), fill: true,
    backgroundColor: (ctx: any) => { const g = ctx.chart.ctx.createLinearGradient(0,0,0,400); g.addColorStop(0,'rgba(6,182,212,0.4)'); g.addColorStop(1,'rgba(59,130,246,0)'); return g },
    borderColor: (ctx: any) => { const g = ctx.chart.ctx.createLinearGradient(0,0,1000,0); g.addColorStop(0,'#3B82F6'); g.addColorStop(1,'#06B6D4'); return g },
    borderWidth: 4, pointBackgroundColor: '#06B6D4', pointBorderColor: '#FFFFFF', pointBorderWidth: 2, pointRadius: 6, pointHoverRadius: 8, tension: 0.4,
  }],
}))

const chartOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(255,255,255,0.9)', titleColor: '#000', bodyColor: '#000', borderColor: 'rgba(0,0,0,0.1)', borderWidth: 1, borderRadius: 12, padding: 12, callbacks: { label: (ctx: any) => `€${ctx.parsed.y}` } } },
  scales: { x: { grid: { display: false }, ticks: { color: '#334155', font: { weight: 600 as const, size: 12 } }, border: { display: false } }, y: { grid: { color: 'rgba(0,0,0,0.1)' }, ticks: { color: '#334155', font: { weight: 600 as const, size: 12 }, callback: (v: any) => `€${v}` }, border: { display: false } } },
}

const formatPrice = (value: number) => value.toLocaleString('pt-PT', { minimumFractionDigits: 2 })

const fetchFinancialData = async () => {
  try {
    const query = `query { financialData { summary { weeklyRevenue expectedIncome pendingPayments pendingCount } revenue { date revenue } } }`
    const data = await graphql<{ financialData: any }>(query)
    if (data.financialData?.summary) summary.value = data.financialData.summary
    if (data.financialData?.revenue) revenueData.value = data.financialData.revenue
  } catch (error) { console.error('Erro ao carregar dados financeiros:', error) }
  finally { isLoading.value = false }
}

onMounted(() => { fetchFinancialData() })
</script>