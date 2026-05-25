<template>
  <div class="backdrop-blur-[30px] p-8 flex flex-col h-full overflow-y-auto" :style="cardStyle">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h3 class="text-3xl font-[Poppins] font-bold text-[#000000]">Financial Overview</h3>
        <p class="text-[#334155] font-medium mt-1">Track your detailing business revenue and growth</p>
      </div>
      <button class="px-5 py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl font-bold shadow-[0_0_12px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all flex items-center gap-2">
        <CalendarDays class="w-5 h-5" />
        Last 7 Days
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="p-6 border border-black/10 rounded-2xl backdrop-blur-sm" :style="miniCardStyle">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.5)]">
              <TrendingUp class="w-6 h-6 text-white" />
            </div>
            <div>
              <p class="text-[#334155] font-bold uppercase tracking-wide text-xs mb-1">Weekly Revenue</p>
              <h2 class="text-2xl font-[Poppins] font-bold text-[#000000]">€16,700.00</h2>
            </div>
          </div>
          <div class="text-right">
            <span class="text-[#0284C7] bg-[#E0F2FE] px-2 py-1 rounded-md font-bold text-xs shadow-sm">+12.5%</span>
          </div>
        </div>
      </div>

      <div class="p-6 border border-black/10 rounded-2xl backdrop-blur-sm" :style="miniCardStyle">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.5)]">
              <Wallet class="w-6 h-6 text-white" />
            </div>
            <div>
              <p class="text-[#334155] font-bold uppercase tracking-wide text-xs mb-1">Expected Income</p>
              <h2 class="text-2xl font-[Poppins] font-bold text-[#000000]">€3,450.00</h2>
            </div>
          </div>
        </div>
      </div>

      <div class="p-6 border border-black/10 rounded-2xl backdrop-blur-sm" :style="miniCardStyle">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.5)]">
              <Clock class="w-6 h-6 text-white" />
            </div>
            <div>
              <p class="text-[#334155] font-bold uppercase tracking-wide text-xs mb-1">Pending Payments</p>
              <h2 class="text-2xl font-[Poppins] font-bold text-[#000000]">€1,240.00</h2>
            </div>
          </div>
          <div class="text-right">
            <span class="text-[#EA580C] bg-[#FFEDD5] px-2 py-1 rounded-md font-bold text-xs shadow-sm">3 Inv.</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="flex-1 min-h-[400px] p-6 rounded-2xl border border-black/10 backdrop-blur-sm flex flex-col" :style="miniCardStyle">
      <h4 class="font-[Poppins] font-bold text-[#000000] text-xl mb-6">Revenue Growth (Last 7 Days)</h4>
      <div class="flex-1 w-full">
        <Line :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TrendingUp, Clock, CalendarDays, Wallet } from 'lucide-vue-next'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
)

const chartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Revenue',
      data: [1200, 2100, 1800, 2400, 2800, 3500, 2900],
      fill: true,
      backgroundColor: (context: any) => {
        const ctx = context.chart.ctx
        const gradient = ctx.createLinearGradient(0, 0, 0, 400)
        gradient.addColorStop(0, 'rgba(6, 182, 212, 0.4)')
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)')
        return gradient
      },
      borderColor: (context: any) => {
        const ctx = context.chart.ctx
        const gradient = ctx.createLinearGradient(0, 0, 1000, 0)
        gradient.addColorStop(0, '#3B82F6')
        gradient.addColorStop(1, '#06B6D4')
        return gradient
      },
      borderWidth: 4,
      pointBackgroundColor: '#06B6D4',
      pointBorderColor: '#FFFFFF',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
      tension: 0.4,
    },
  ],
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      titleColor: '#000000',
      bodyColor: '#000000',
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderWidth: 1,
      borderRadius: 12,
      padding: 12,
      callbacks: {
        label: (context: any) => `€${context.parsed.y}`,
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#334155',
        font: {
          weight: 600 as const,
          size: 12,
        },
      },
      border: {
        display: false,
      },
    },
    y: {
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
      ticks: {
        color: '#334155',
        font: {
          weight: 600 as const,
          size: 12,
        },
        callback: (value: any) => `€${value}`,
      },
      border: {
        display: false,
      },
    },
  },
}

const cardStyle = {
  background: 'linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2)), #FFFFFF',
  boxShadow: '0 0 12px 0 rgba(0, 0, 0, 0.7)',
  borderRadius: '16px',
}

const miniCardStyle = {
  background: 'linear-gradient(to bottom right, rgba(255,255,255,0.8), rgba(255,255,255,0.4))'
}
</script>