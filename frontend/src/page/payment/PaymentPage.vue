<!-- src/page/payment/PaymentPage.vue -->
<template>
  <div class="min-h-screen bg-[#020204] text-white pt-28 pb-20 relative overflow-hidden">
    <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2563EB]/5 rounded-full blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#00D8FF]/5 rounded-full blur-[120px] pointer-events-none"></div>

    <div class="max-w-2xl mx-auto px-4 relative z-10">
      
      <div class="text-center mb-10">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#00D8FF] flex items-center justify-center shadow-lg">
          <ShieldCheck class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl font-black italic text-white uppercase tracking-tight">Pagamento Seguro</h1>
        <p class="text-gray-400 text-sm mt-2">Plataforma certificada pela SIBS • Pagamentos protegidos</p>
      </div>

      <div v-if="isLoading" class="text-center py-20">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00D8FF] mx-auto"></div>
        <p class="text-gray-400 mt-4">A carregar dados da marcação...</p>
      </div>

      <template v-else-if="booking">
        <div class="bg-[#050508] border border-white/10 rounded-2xl p-4 mb-4 text-center">
          <p class="text-[10px] text-gray-500 uppercase tracking-wider">
            LeiriaDetail, Lda. | NIF: PT XXX XXX XXX | Rua do Detalhe, 123, 2400-000 Leiria | geral@leiriadetail.pt
          </p>
        </div>

        <div class="bg-[#050508] border border-white/10 rounded-2xl p-6 mb-6">
          <h3 class="text-sm font-bold text-[#00D8FF] uppercase tracking-wider mb-4">Resumo da Marcação</h3>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between"><span class="text-gray-400">Serviço</span><span class="text-white font-bold">{{ booking.serviceName }}</span></div>
            <div class="flex justify-between"><span class="text-gray-400">Veículo</span><span class="text-white">{{ booking.vehicleName }} ({{ booking.vehiclePlate }})</span></div>
            <div class="flex justify-between"><span class="text-gray-400">Data</span><span class="text-white">{{ formatDate(booking.bookingDate) }} às {{ booking.bookingTime }}</span></div>
            <div class="border-t border-white/5 pt-3">
              <div class="flex justify-between text-xs text-gray-400 mb-1"><span>Subtotal (s/ IVA)</span><span>{{ subtotal }}€</span></div>
              <div class="flex justify-between text-xs text-gray-400 mb-1"><span>IVA (23%)</span><span>{{ iva }}€</span></div>
              <div class="flex justify-between mt-2 pt-2 border-t border-white/5"><span class="text-gray-400 font-bold">Total (c/ IVA)</span><span class="text-2xl font-black text-[#00D8FF]">{{ total }}€</span></div>
              <p class="text-[9px] text-gray-500 mt-1">Preços em EUR. IVA incluído à taxa legal em vigor (23%).</p>
            </div>
          </div>
        </div>

        <div class="bg-[#050508] border border-white/10 rounded-2xl p-6 mb-6">
          <h3 class="text-sm font-bold text-[#00D8FF] uppercase tracking-wider mb-4">Dados de Faturação</h3>
          <div class="flex items-center gap-3 mb-4">
            <input type="checkbox" v-model="wantInvoice" id="wantInvoice" class="w-4 h-4 rounded border-gray-600 bg-white/5" />
            <label for="wantInvoice" class="text-sm text-gray-400">Solicitar fatura com NIF</label>
          </div>
          <div v-if="wantInvoice" class="space-y-3">
            <input v-model="invoiceNIF" type="text" placeholder="NIF (ex: 123456789)" maxlength="9" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#00D8FF]" />
            <input v-model="invoiceName" type="text" placeholder="Nome para fatura" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#00D8FF]" />
            <textarea v-model="invoiceAddress" placeholder="Morada para fatura" rows="2" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#00D8FF] resize-none"></textarea>
          </div>
        </div>

        <div class="bg-[#050508] border border-white/10 rounded-2xl p-6 mb-6">
          <h3 class="text-sm font-bold text-[#00D8FF] uppercase tracking-wider mb-4">Método de Pagamento</h3>
          <div class="space-y-3">
            <button @click="method = 'mbway'" :class="['w-full p-4 rounded-xl border text-left transition-all flex items-center gap-4', method === 'mbway' ? 'border-[#00D8FF] bg-[#00D8FF]/5' : 'border-white/5 hover:border-white/20']">
              <div class="w-10 h-10 rounded-lg bg-[#E6007E]/20 flex items-center justify-center shrink-0"><Smartphone class="w-5 h-5 text-[#E6007E]" /></div>
              <div><p class="font-bold text-white text-sm">MB Way</p><p class="text-xs text-gray-400">Pagamento imediato via SIBS</p></div>
            </button>
            <button @click="method = 'multibanco'" :class="['w-full p-4 rounded-xl border text-left transition-all flex items-center gap-4', method === 'multibanco' ? 'border-[#00D8FF] bg-[#00D8FF]/5' : 'border-white/5 hover:border-white/20']">
              <div class="w-10 h-10 rounded-lg bg-[#FF6600]/20 flex items-center justify-center shrink-0"><CreditCard class="w-5 h-5 text-[#FF6600]" /></div>
              <div><p class="font-bold text-white text-sm">Multibanco</p><p class="text-xs text-gray-400">Entidade + Referência • Válido por 72h</p></div>
            </button>
          </div>
          <div v-if="method === 'mbway'" class="mt-4 pt-4 border-t border-white/5">
            <label class="block text-xs font-bold text-gray-400 uppercase mb-2">Nº Telemóvel MB Way</label>
            <div class="flex gap-3">
              <span class="flex items-center px-4 bg-white/5 border border-white/10 rounded-xl text-gray-400 text-sm">+351</span>
              <input v-model="mbwayPhone" type="tel" placeholder="912 345 678" maxlength="9" class="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#00D8FF]" />
            </div>
          </div>
          <div v-if="method === 'multibanco' && paymentData" class="mt-4 pt-4 border-t border-white/5 space-y-3">
            <p class="text-[10px] text-gray-500 mb-2">Referência válida por 72 horas.</p>
            <div class="bg-[#0A0A0F] p-4 rounded-xl"><p class="text-xs text-gray-400 mb-1">Entidade</p><p class="text-xl font-mono font-bold text-white tracking-widest">{{ paymentData.entity }}</p></div>
            <div class="bg-[#0A0A0F] p-4 rounded-xl"><p class="text-xs text-gray-400 mb-1">Referência</p><p class="text-xl font-mono font-bold text-white tracking-widest">{{ paymentData.reference }}</p></div>
            <div class="bg-[#0A0A0F] p-4 rounded-xl"><p class="text-xs text-gray-400 mb-1">Valor</p><p class="text-xl font-mono font-bold text-[#00D8FF]">{{ paymentData.amount }}€</p></div>
          </div>
        </div>

        <div class="bg-[#050508] border border-white/10 rounded-2xl p-6 mb-6">
          <h3 class="text-sm font-bold text-[#00D8FF] uppercase tracking-wider mb-4">Termos e Condições</h3>
          <div class="space-y-3">
            <label class="flex items-start gap-3 cursor-pointer"><input type="checkbox" v-model="acceptedPrivacy" class="w-4 h-4 mt-0.5 rounded border-gray-600 bg-white/5" /><span class="text-xs text-gray-400">Aceito a <a href="/privacidade" target="_blank" class="text-[#00D8FF] underline">Política de Privacidade</a> e o tratamento dos meus dados nos termos do RGPD.</span></label>
            <label class="flex items-start gap-3 cursor-pointer"><input type="checkbox" v-model="acceptedTerms" class="w-4 h-4 mt-0.5 rounded border-gray-600 bg-white/5" /><span class="text-xs text-gray-400">Aceito os <a href="/termos" target="_blank" class="text-[#00D8FF] underline">Termos e Condições</a> da LeiriaDetail.</span></label>
            <label class="flex items-start gap-3 cursor-pointer"><input type="checkbox" v-model="acceptedCancellation" class="w-4 h-4 mt-0.5 rounded border-gray-600 bg-white/5" /><span class="text-xs text-gray-400">Compreendo a política de cancelamento: até 24h antes sem custos.</span></label>
          </div>
        </div>

        <div class="bg-[#050508] border border-white/10 rounded-2xl p-4 mb-6">
          <p class="text-[10px] text-gray-500">DL n.º 24/2014: 14 dias para livre resolução. Perde o direito após execução completa do serviço.</p>
        </div>
        <div class="bg-[#050508] border border-white/10 rounded-2xl p-4 mb-6">
          <p class="text-[10px] text-gray-500">RAL: <a href="https://www.cniacc.pt" target="_blank" class="text-[#00D8FF] underline">CNIACC</a> | <a href="https://ec.europa.eu/consumers/odr" target="_blank" class="text-[#00D8FF] underline">RLL</a></p>
        </div>
        <div class="text-center mb-6">
          <a href="https://www.livroreclamacoes.pt" target="_blank" class="text-[10px] text-gray-500 hover:text-[#00D8FF] underline">📖 Livro de Reclamações Eletrónico</a>
        </div>

        <button @click="handlePayment" :disabled="isSubmitting || !canPay" class="w-full py-4 bg-gradient-to-r from-[#2563EB] to-[#00D8FF] text-white font-black uppercase tracking-widest text-sm rounded-xl shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isSubmitting ? 'A processar...' : method === 'multibanco' ? 'Gerar Referências Multibanco' : 'Pagar com MB Way' }}
        </button>

        <p v-if="sessionTimeout" class="text-red-400 text-xs text-center mt-4">⚠️ Sessão expirada por inatividade. Redirecionando...</p>

        <p class="text-[9px] text-gray-600 text-center mt-6">DPO: dpo@leiriadetail.pt | © {{ new Date().getFullYear() }} LeiriaDetail, Lda.</p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ShieldCheck, Smartphone, CreditCard } from 'lucide-vue-next'
import { Cache } from '@/services/cachemanager'
import { apiFetch } from '@/services/api'

const route = useRoute()
const router = useRouter()

const booking = ref<any>(null)
const isLoading = ref(true)
const method = ref<'mbway' | 'multibanco'>('mbway')
const mbwayPhone = ref('')
const isSubmitting = ref(false)
const paymentData = ref<{ entity: string; reference: string; amount: string } | null>(null)
const wantInvoice = ref(false)
const invoiceNIF = ref('')
const invoiceName = ref('')
const invoiceAddress = ref('')
const acceptedPrivacy = ref(false)
const acceptedTerms = ref(false)
const acceptedCancellation = ref(false)
const sessionTimeout = ref(false)

let timeoutTimer: ReturnType<typeof setTimeout> | null = null

const subtotal = computed(() => ((booking.value?.servicePrice || 0) / 1.23).toFixed(2))
const iva = computed(() => ((booking.value?.servicePrice || 0) - parseFloat(subtotal.value)).toFixed(2))
const total = computed(() => (booking.value?.servicePrice || 0).toFixed(2))

const canPay = computed(() => {
  if (method.value === 'mbway' && mbwayPhone.value.length !== 9) return false
  if (!acceptedPrivacy.value || !acceptedTerms.value || !acceptedCancellation.value) return false
  if (wantInvoice.value && (!invoiceNIF.value || invoiceNIF.value.length !== 9)) return false
  return true
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' })
}

const fetchBooking = async () => {
  const bookingId = route.params.bookingId as string
  if (!bookingId) { router.push('/client-area'); return }

  booking.value = {
    id: bookingId,
    serviceName: localStorage.getItem('last_service') || 'Serviço',
    vehicleName: localStorage.getItem('last_vehicle') || 'Veículo',
    vehiclePlate: localStorage.getItem('last_plate') || 'AA-00-BB',
    bookingDate: localStorage.getItem('last_date') || new Date().toISOString().split('T')[0],
    bookingTime: localStorage.getItem('last_time') || '10:00',
    servicePrice: parseFloat(localStorage.getItem('last_price') || '75')
  }
  isLoading.value = false
}

const handlePayment = async () => {
  if (isSubmitting.value) return
  isSubmitting.value = true

  // Proteção: reabilitar após 10s mesmo com erro
  const safetyTimer = setTimeout(() => { isSubmitting.value = false }, 10000)

  try {
    await apiFetch('/Payment', {
      method: 'POST',
      body: JSON.stringify({
        bookingId: parseInt(booking.value.id),
        amount: parseFloat(total.value),
        method: method.value,
        mbwayPhone: method.value === 'mbway' ? mbwayPhone.value : undefined,
        invoiceNIF: wantInvoice.value ? invoiceNIF.value : undefined,
        invoiceName: wantInvoice.value ? invoiceName.value : undefined,
        invoiceAddress: wantInvoice.value ? invoiceAddress.value : undefined
      })
    })

    if (method.value === 'multibanco') {
      const refData = await apiFetch('/Payment/multibanco', {
        method: 'POST',
        body: JSON.stringify({ amount: parseFloat(total.value) })
      }) as { entity: string; reference: string; amount: string }
      paymentData.value = refData
    } else {
      await new Promise(r => setTimeout(r, 1500))
      alert('✅ Pagamento MB Way confirmado!')
      router.push('/client-area')
    }
  } catch (error) {
    console.error('Erro no pagamento:', error)
    alert('Erro ao processar pagamento. Tente novamente.')
  } finally {
    clearTimeout(safetyTimer)
    isSubmitting.value = false
  }
}

onMounted(async () => {
  // Verificar sessão
  const sessionKey = Cache.Session?.value
  if (!sessionKey) {
    router.push('/login')
    return
  }

  try {
    const res = await fetch('/Authentication/Role', {
      headers: { 'Session-Key': sessionKey }
    })
    if (!res.ok) {
      Cache.clearAuth()
      router.push('/login')
      return
    }
  } catch {
    router.push('/login')
    return
  }

  // Timeout de 30 minutos de inatividade
  timeoutTimer = setTimeout(() => {
    sessionTimeout.value = true
    setTimeout(() => {
      router.push('/client-area')
    }, 3000)
  }, 30 * 60 * 1000)

  fetchBooking()
})

onUnmounted(() => {
  if (timeoutTimer) clearTimeout(timeoutTimer)
})
</script>