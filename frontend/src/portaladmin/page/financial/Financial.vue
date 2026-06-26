<template>
  <div class="backdrop-blur-[30px] p-8 flex flex-col h-full overflow-y-auto card-admin">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h3 class="text-3xl font-bold text-[#000000]">Financial Overview</h3>
        <p class="text-[#334155] font-medium mt-1">Track your detailing business revenue and growth</p>
      </div>
      <div class="flex gap-3">
        <button @click="exportPDF" class="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase rounded-xl hover:bg-red-500/20 transition-all flex items-center gap-2">
          <FileText class="w-4 h-4" /> PDF
        </button>
        <button @click="exportCSV" class="px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold uppercase rounded-xl hover:bg-green-500/20 transition-all flex items-center gap-2">
          <FileText class="w-4 h-4" /> CSV
        </button>
      </div>
    </div>

    <div v-if="isLoading && revenueData.length === 0" class="flex-1 flex items-center justify-center text-[#64748B] font-medium">A carregar dados financeiros...</div>

    <template v-else>
      <!-- Filtros de Período -->
      <div class="flex items-center gap-3 mb-6">
        <span class="text-xs font-bold text-[#64748B] uppercase tracking-wider">Período:</span>
        <div class="flex bg-white/80 rounded-xl border border-[#06B6D4]/30 p-1 gap-1">
          <button 
            v-for="p in periodOptions" 
            :key="p.value"
            @click="changePeriod(p.value)"
            :class="[
              'px-4 py-2 rounded-lg text-xs font-bold transition-all',
              activePeriod === p.value 
                ? 'bg-[#06B6D4] text-white shadow-sm' 
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-white/50'
            ]"
          >
            {{ p.label }}
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div class="p-6 border border-black/10 rounded-2xl backdrop-blur-sm card-mini">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.5)]">
                <TrendingUp class="w-6 h-6 text-white" />
              </div>
              <div>
                <p class="text-[#334155] font-bold uppercase tracking-wide text-xs mb-1">{{ periodLabel }} Revenue</p>
                <h2 class="text-2xl font-bold text-[#000000]">€{{ formatPrice(summary.periodRevenue || summary.weeklyRevenue || 0) }}</h2>
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
                <h2 class="text-2xl font-bold text-[#000000]">€{{ formatPrice(summary.expectedIncome || 0) }}</h2>
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
                <h2 class="text-2xl font-bold text-[#000000]">€{{ formatPrice(summary.pendingPayments || 0) }}</h2>
              </div>
            </div>
            <div v-if="summary.pendingCount > 0" class="text-right">
              <span class="text-[#EA580C] bg-[#FFEDD5] px-2 py-1 rounded-md font-bold text-xs shadow-sm">{{ summary.pendingCount }} Inv.</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Chart -->
      <div class="flex-1 min-h-[400px] p-6 rounded-2xl border border-black/10 backdrop-blur-sm flex flex-col card-mini">
        <h4 class="font-bold text-[#000000] text-xl mb-6">Revenue Growth ({{ periodLabel }})</h4>
        <div v-if="revenueData.length === 0" class="flex-1 flex items-center justify-center text-[#94A3B8] font-medium">Sem dados de receita para o período selecionado.</div>
        <div v-else class="flex-1 w-full">
          <!-- 🔥 KEY para forçar re-render quando os dados mudam -->
          <Line :key="chartKey" :data="chartData" :options="chartOptions" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { TrendingUp, Clock, Wallet, FileText } from 'lucide-vue-next'
import { Line } from 'vue-chartjs'
import { graphql } from '@/graphql'
import { generateHistoryPDF, generateHistoryCSV } from '@/services/pdfGenerator'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend)

const activePeriod = ref('7d')
const chartKey = ref(0)  // 🔥 Força re-render do gráfico

const periodOptions = [
  { value: '1d', label: '1 Dia' },
  { value: '7d', label: '1 Semana' },
  { value: '30d', label: '1 Mês' },
  { value: '90d', label: '3 Meses' },
  { value: '365d', label: '1 Ano' },
]

const periodLabel = computed(() => {
  const labels: Record<string, string> = {
    '1d': 'Hoje', '7d': 'Semanal', '30d': 'Mensal', '90d': 'Trimestral', '365d': 'Anual',
  }
  return labels[activePeriod.value] || 'Período'
})

const summary = ref({ periodRevenue: 0, weeklyRevenue: 0, expectedIncome: 0, pendingPayments: 0, pendingCount: 0 })
const revenueData = ref<{ date: string; revenue: number }[]>([])
const isLoading = ref(true)

const chartData = computed(() => {
  console.log(`📊 [ChartData] Computando com ${revenueData.value.length} pontos, período: ${activePeriod.value}`)
  
  return {
    labels: revenueData.value.map(r => {
      if (activePeriod.value === '1d') return r.date
      const date = new Date(r.date + 'T12:00:00')
      if (activePeriod.value === '365d') return date.toLocaleDateString('pt-PT', { month: 'short' })
      return date.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })
    }),
    datasets: [{
      label: 'Revenue',
      data: revenueData.value.map(r => r.revenue),
      fill: true,
      backgroundColor: (ctx: any) => {
        const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 400)
        g.addColorStop(0, 'rgba(6,182,212,0.4)')
        g.addColorStop(1, 'rgba(59,130,246,0)')
        return g
      },
      borderColor: (ctx: any) => {
        const g = ctx.chart.ctx.createLinearGradient(0, 0, 1000, 0)
        g.addColorStop(0, '#3B82F6')
        g.addColorStop(1, '#06B6D4')
        return g
      },
      borderWidth: 4,
      pointBackgroundColor: '#06B6D4',
      pointBorderColor: '#FFFFFF',
      pointBorderWidth: 2,
      pointRadius: activePeriod.value === '365d' ? 3 : 5,
      pointHoverRadius: 7,
      tension: 0.4,
    }],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 300 },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(255,255,255,0.9)',
      titleColor: '#000',
      bodyColor: '#000',
      borderColor: 'rgba(0,0,0,0.1)',
      borderWidth: 1,
      borderRadius: 12,
      padding: 12,
      callbacks: { label: (ctx: any) => `€${ctx.parsed.y.toFixed(2)}` }
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#334155', font: { weight: 600 as const, size: 11 }, maxRotation: 45 },
      border: { display: false }
    },
    y: {
      grid: { color: 'rgba(0,0,0,0.1)' },
      ticks: { color: '#334155', font: { weight: 600 as const, size: 12 }, callback: (v: any) => `€${v}` },
      border: { display: false }
    }
  },
}

const formatPrice = (value: number) => {
  if (value === undefined || value === null) return '0.00'
  return value.toLocaleString('pt-PT', { minimumFractionDigits: 2 })
}

// 🔥 NOVA FUNÇÃO para mudar período
const changePeriod = (period: string) => {
  console.log(`🔄 [Frontend] Mudar período para: ${period}`)
  activePeriod.value = period
  fetchFinancialData()
}

const exportPDF = () => {
  generateHistoryPDF(
    { name: 'LeiriaDetail - Relatório Financeiro', email: 'geral@leiriadetail.pt', phone: '' },
    revenueData.value.map((r, i) => ({
      id: String(i), bookingDate: r.date, bookingTime: '',
      serviceName: 'Receita', servicePrice: r.revenue,
      vehicleName: '', vehiclePlate: '', status: 'CONCLUIDO'
    }))
  )
}

const exportCSV = () => {
  generateHistoryCSV(
    { name: 'LeiriaDetail - Relatório Financeiro', email: 'geral@leiriadetail.pt', phone: '' },
    revenueData.value.map((r, i) => ({
      id: String(i), bookingDate: r.date, bookingTime: '',
      serviceName: 'Receita', servicePrice: r.revenue,
      vehicleName: '', vehiclePlate: '', status: 'CONCLUIDO'
    }))
  )
}

const fetchFinancialData = async () => {
  isLoading.value = true
  try {
    console.log(`🔄 [Frontend] Fetch para período: ${activePeriod.value}`)
    
    const query = `
      query GetFinancialData($period: String!) {
        financialData(period: $period) {
          summary { periodRevenue weeklyRevenue expectedIncome pendingPayments pendingCount }
          revenue { date revenue }
        }
      }
    `
    const data = await graphql<{ financialData: any }>(query, { period: activePeriod.value })
    
    console.log(`📊 [Frontend] Resposta:`, JSON.stringify(data))
    
    if (data.financialData?.summary) {
      summary.value = { ...data.financialData.summary }
      console.log(`📊 [Frontend] Summary atualizado:`, summary.value)
    }
    
    if (data.financialData?.revenue) {
      // 🔥 Criar NOVO array para forçar reatividade
      revenueData.value = [...data.financialData.revenue]
      console.log(`📊 [Frontend] Revenue atualizado: ${revenueData.value.length} pontos`)
    }
    
    // 🔥 Forçar re-render do gráfico
    await nextTick()
    chartKey.value++
    console.log(`📊 [Frontend] ChartKey: ${chartKey.value}`)
    
  } catch (error) {
    console.error('❌ [Frontend] Erro:', error)
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  console.log('🚀 [Frontend] Montado, a carregar dados...')
  fetchFinancialData()
})
</script>