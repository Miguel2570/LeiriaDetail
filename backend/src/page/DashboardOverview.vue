<template>
  <motion.div 
    :initial="{ opacity: 0, y: 10 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.4 }"
    class="backdrop-blur-[30px] p-8 flex flex-col h-full overflow-y-auto" 
    :style="cardStyle"
  >
    <div class="flex items-center justify-between mb-8">
      <div>
        <h3 class="text-3xl font-[Poppins] font-bold text-[#000000]">Welcome Back, Super Admin</h3>
        <p class="text-[#334155] font-medium mt-2">Here's the live system overview for LeiriaDetail.</p>
      </div>
    </div>

    <motion.div 
      :variants="containerVariants"
      :initial="'hidden'"
      :animate="'show'"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      <motion.div v-for="(card, idx) in metricCards" :key="idx" :variants="itemVariants" class="p-6 border border-black/10 rounded-2xl bg-white/50 backdrop-blur-sm" :style="{ background: 'linear-gradient(to bottom right, rgba(255,255,255,0.9), rgba(255,255,255,0.5))' }">
        <div class="flex items-center justify-between mb-4">
          <div :class="`w-12 h-12 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center shadow-lg`">
            <component :is="card.icon" class="w-6 h-6 text-white" />
          </div>
          <span class="text-[#0284C7] bg-[#E0F2FE] px-3 py-1 rounded-full font-bold text-xs shadow-sm">
            {{ card.trend }}
          </span>
        </div>
        <p class="text-[#334155] font-bold uppercase tracking-wide text-xs mb-1">{{ card.title }}</p>
        <h2 class="text-3xl font-[Poppins] font-bold text-[#000000]">{{ card.value }}</h2>
      </motion.div>
    </motion.div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[400px]">
      <div class="lg:col-span-2 border border-black/10 rounded-2xl p-6 bg-white/50 backdrop-blur-sm flex flex-col" :style="{ background: 'linear-gradient(to bottom right, rgba(255,255,255,0.9), rgba(255,255,255,0.5))' }">
        <h4 class="font-[Poppins] font-bold text-[#000000] text-xl mb-6">Weekly Revenue vs Appointments</h4>
        <div class="flex-1 w-full h-full min-h-[300px]">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </div>
      
      <div class="border border-black/10 rounded-2xl p-6 bg-white/50 backdrop-blur-sm overflow-y-auto" :style="{ background: 'linear-gradient(to bottom right, rgba(255,255,255,0.9), rgba(255,255,255,0.5))' }">
        <h4 class="font-[Poppins] font-bold text-[#000000] text-xl mb-6">Backend Activity Logs</h4>
        <div class="space-y-5">
          <div v-for="(activity, i) in activities" :key="i" class="flex gap-4 items-start">
            <div :class="`w-2.5 h-2.5 mt-1.5 rounded-full shadow-sm ${
              activity.type === 'system' ? 'bg-[#8B5CF6]' :
              activity.type === 'auth' ? 'bg-[#10B981]' : 'bg-[#06B6D4]'
            }`" />
            <div>
              <p class="text-[#000000] font-bold text-sm leading-tight">{{ activity.text }}</p>
              <p class="text-[#64748B] text-xs font-semibold mt-0.5">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
</template>

<script setup lang="ts">
import { TrendingUp, Clock, CalendarCheck, Users } from 'lucide-vue-next'
import { motion } from 'motion-v'
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
      data: [1200, 2100, 800, 1600, 2400, 3200, 1500],
      fill: true,
      backgroundColor: (context: any) => {
        const ctx = context.chart.ctx
        const gradient = ctx.createLinearGradient(0, 0, 0, 400)
        gradient.addColorStop(0, 'rgba(6, 182, 212, 0.4)')
        gradient.addColorStop(1, 'rgba(6, 182, 212, 0)')
        return gradient
      },
      borderColor: '#06B6D4',
      borderWidth: 3,
      pointBackgroundColor: '#06B6D4',
      pointBorderColor: '#FFFFFF',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
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
      bodyColor: '#0284C7',
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderWidth: 1,
      borderRadius: 12,
      padding: 12,
      titleFont: {
        weight: 600 as const,
      },
      bodyFont: {
        weight: 600 as const,
      },
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
        color: '#475569',
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
        color: 'rgba(0, 0, 0, 0.05)',
      },
      ticks: {
        color: '#475569',
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

const activities = [
  { time: '10:42 AM', text: 'API: Bay 2 status updated to [Finished]', type: 'system' },
  { time: '09:15 AM', text: 'Frontend Request: New Ceramic Coating Booking. Awaiting approval.', type: 'user' },
  { time: '09:00 AM', text: 'Auth: Admin login success (IP: 192.168.1.102)', type: 'auth' },
  { time: '08:30 AM', text: 'Cron: Inventory sync complete. 3 alerts generated.', type: 'system' },
  { time: '08:15 AM', text: 'Database: Backup snapshot created.', type: 'system' },
]

const metricCards = [
  {
    title: "Today's Revenue",
    value: "€1,240",
    trend: "+8%",
    icon: TrendingUp,
    color: "from-[#3B82F6] to-[#06B6D4]",
  },
  {
    title: "Pending Requests",
    value: "14",
    trend: "5 Action Req",
    icon: CalendarCheck,
    color: "from-[#8B5CF6] to-[#D946EF]",
  },
  {
    title: "Staff Online",
    value: "4/5",
    trend: "All bays active",
    icon: Users,
    color: "from-[#10B981] to-[#34D399]",
  },
  {
    title: "Avg. Turnaround",
    value: "3.2h",
    trend: "-15min",
    icon: Clock,
    color: "from-[#F59E0B] to-[#FBBF24]",
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}


const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring" as const, 
      stiffness: 300, 
      damping: 24 
    } 
  }
}

const cardStyle = {
  background: 'linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2)), #FFFFFF',
  boxShadow: '0 0 12px 0 rgba(0, 0, 0, 0.7)',
  borderRadius: '16px',
}
</script>