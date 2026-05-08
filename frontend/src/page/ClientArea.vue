<script setup lang="ts">
import { Calendar, Clock, FileText, Download, Car } from 'lucide-vue-next'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const mockUser = { name: 'João Silva', email: 'joao@exemplo.com' }
const mockBookings = [
  { id: 1, service: 'Premium', date: '2026-04-25', status: 'Confirmado', price: 90, plate: 'AB-12-CD' }
]

const generatePDF = () => {
  const doc = new jsPDF()
  doc.text('LeiriaDetail - Histórico de Serviços', 14, 20)
  autoTable(doc, {
    startY: 30,
    head: [['Data', 'Serviço', 'Matrícula', 'Valor']],
    body: mockBookings.map(b => [b.date, b.service, b.plate, `${b.price}€`]),
  })
  doc.save(`Historico_${mockUser.name}.pdf`) [cite: 149]
}
</script>

<template>
  <div class="py-16 container mx-auto px-4">
    <div class="mb-8">
      <h1 class="text-4xl font-bold">Área do <span class="text-[#06B6D4]">Cliente</span></h1>
      <p class="text-gray-500">Bem-vindo, {{ mockUser.name }}! [cite: 151]</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div class="p-6 bg-white border rounded-xl shadow-sm">
        <div class="flex justify-between items-center mb-2 text-gray-400">
          <span class="text-sm">Total Serviços</span>
          <Calendar class="h-4 w-4" />
        </div>
        <div class="text-2xl font-bold">{{ mockBookings.length }}</div>
      </div>
      </div>

    <div class="bg-white border rounded-xl p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold">Histórico de Serviços</h2>
        <button @click="generatePDF" class="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:opacity-90">
          <Download class="h-4 w-4" /> Exportar PDF
        </button>
      </div>
      </div>
  </div>
</template>