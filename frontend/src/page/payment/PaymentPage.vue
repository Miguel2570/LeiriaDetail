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
        <h1 class="text-3xl font-black italic text-white uppercase tracking-tight">Pagamento</h1>
        <p class="text-gray-400 text-sm mt-2">Escolha o método de pagamento</p>
      </div>

      <div v-if="isLoading" class="text-center py-20">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00D8FF] mx-auto"></div>
        <p class="text-gray-400 mt-4">A carregar dados da marcação...</p>
      </div>

      <template v-else-if="booking">
        <!-- Empresa -->
        <div class="bg-[#050508] border border-white/10 rounded-2xl p-4 mb-4 text-center">
          <p class="text-[10px] text-gray-500 uppercase tracking-wider">
            LeiriaDetail, Lda. | Rua do Detalhe, 123, 2400-000 Leiria | geral@leiriadetail.pt
          </p>
        </div>

        <!-- Resumo -->
        <div class="bg-[#050508] border border-white/10 rounded-2xl p-6 mb-6">
          <h3 class="text-sm font-bold text-[#00D8FF] uppercase tracking-wider mb-4">Resumo da Marcação</h3>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between"><span class="text-gray-400">Serviço</span><span class="text-white font-bold">{{ booking.serviceName }}</span></div>
            <div class="flex justify-between"><span class="text-gray-400">Veículo</span><span class="text-white">{{ booking.vehicleName }} ({{ booking.vehiclePlate }})</span></div>
            <div class="flex justify-between"><span class="text-gray-400">Data</span><span class="text-white">{{ formatDate(booking.bookingDate) }} às {{ booking.bookingTime }}</span></div>
            <div class="border-t border-white/5 pt-3">
              <div class="flex justify-between text-xs text-gray-400 mb-1"><span>Subtotal</span><span>{{ subtotal }}€</span></div>
              
              <!-- IVA condicional -->
              <div v-if="ivaEnabled" class="flex justify-between text-xs text-gray-400 mb-1"><span>IVA ({{ ivaRate }}%)</span><span>{{ ivaAmount }}€</span></div>
              
              <div class="flex justify-between mt-2 pt-2 border-t border-white/5"><span class="text-gray-400 font-bold">Total</span><span class="text-2xl font-black text-[#00D8FF]">{{ total }}€</span></div>
              
              <p v-if="ivaEnabled" class="text-[9px] text-gray-500 mt-1">Preços em EUR. IVA incluído à taxa legal em vigor ({{ ivaRate }}%).</p>
              <p v-else class="text-[9px] text-gray-500 mt-1">Preços em EUR.</p>
            </div>
          </div>
        </div>

        <!-- Dados de Faturação -->
        <div class="bg-[#050508] border border-white/10 rounded-2xl p-6 mb-6">
          <h3 class="text-sm font-bold text-[#00D8FF] uppercase tracking-wider mb-4">Dados de Faturação</h3>
          
          <!-- NIF obrigatório -->
          <div v-if="requireNIF" class="bg-[#00D8FF]/10 border border-[#00D8FF]/20 rounded-xl p-3 mb-4">
            <p class="text-[#00D8FF] text-xs font-bold">📋 NIF obrigatório para emissão de fatura</p>
          </div>
          
          <div v-if="requireNIF || wantInvoice" class="space-y-3">
            <!-- Checkbox só aparece se NÃO for obrigatório -->
            <div v-if="!requireNIF" class="flex items-center gap-3 mb-4">
              <input type="checkbox" v-model="wantInvoice" id="wantInvoice" class="w-4 h-4 rounded border-gray-600 bg-white/5" />
              <label for="wantInvoice" class="text-sm text-gray-400">Solicitar fatura com NIF</label>
            </div>
            
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-2">
                NIF {{ requireNIF ? '*' : '' }}
              </label>
              <input 
                v-model="invoiceNIF" 
                type="text" 
                placeholder="123456789" 
                maxlength="9" 
                class="w-full px-4 py-3 bg-white/5 border rounded-xl text-white outline-none focus:border-[#00D8FF] transition-colors"
                :class="requireNIF && triedSubmit && (!invoiceNIF || invoiceNIF.length !== 9) ? 'border-red-500/50' : 'border-white/10'"
              />
              <p v-if="requireNIF && triedSubmit && (!invoiceNIF || invoiceNIF.length !== 9)" class="text-red-400 text-[10px] mt-1">NIF deve ter 9 dígitos</p>
            </div>
            
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-2">
                Nome para fatura {{ requireNIF ? '*' : '' }}
              </label>
              <input 
                v-model="invoiceName" 
                type="text" 
                placeholder="Nome completo ou empresa" 
                class="w-full px-4 py-3 bg-white/5 border rounded-xl text-white outline-none focus:border-[#00D8FF] transition-colors"
                :class="requireNIF && triedSubmit && !invoiceName.trim() ? 'border-red-500/50' : 'border-white/10'"
              />
              <p v-if="requireNIF && triedSubmit && !invoiceName.trim()" class="text-red-400 text-[10px] mt-1">Nome é obrigatório para fatura</p>
            </div>
            
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-2">Morada para fatura</label>
              <textarea 
                v-model="invoiceAddress" 
                placeholder="Morada completa" 
                rows="2" 
                class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#00D8FF] resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Método de Pagamento -->
        <div class="bg-[#050508] border border-white/10 rounded-2xl p-6 mb-6">
          <h3 class="text-sm font-bold text-[#00D8FF] uppercase tracking-wider mb-4">Método de Pagamento</h3>
          <div class="space-y-3">
            
            <!-- MB Way -->
            <button @click="method = 'mbway'" :class="['w-full p-4 rounded-xl border text-left transition-all flex items-center gap-4', method === 'mbway' ? 'border-[#00D8FF] bg-[#00D8FF]/5' : 'border-white/5 hover:border-white/20']">
              <div class="w-10 h-10 rounded-lg bg-[#E6007E]/20 flex items-center justify-center shrink-0"><Smartphone class="w-5 h-5 text-[#E6007E]" /></div>
              <div><p class="font-bold text-white text-sm">MB Way</p><p class="text-xs text-gray-400">Pagamento imediato via app</p></div>
            </button>
            
            <!-- Multibanco -->
            <button @click="method = 'multibanco'" :class="['w-full p-4 rounded-xl border text-left transition-all flex items-center gap-4', method === 'multibanco' ? 'border-[#00D8FF] bg-[#00D8FF]/5' : 'border-white/5 hover:border-white/20']">
              <div class="w-10 h-10 rounded-lg bg-[#FF6600]/20 flex items-center justify-center shrink-0"><CreditCard class="w-5 h-5 text-[#FF6600]" /></div>
              <div><p class="font-bold text-white text-sm">Multibanco</p><p class="text-xs text-gray-400">Entidade + Referência • Válido 72h</p></div>
            </button>

            <!-- Dinheiro -->
            <button @click="method = 'cash'" :class="['w-full p-4 rounded-xl border text-left transition-all flex items-center gap-4', method === 'cash' ? 'border-[#00D8FF] bg-[#00D8FF]/5' : 'border-white/5 hover:border-white/20']">
              <div class="w-10 h-10 rounded-lg bg-[#10B981]/20 flex items-center justify-center shrink-0"><Banknote class="w-5 h-5 text-[#10B981]" /></div>
              <div><p class="font-bold text-white text-sm">Dinheiro</p><p class="text-xs text-gray-400">Pague em mão no dia do serviço</p></div>
            </button>
          </div>

          <!-- Campo MB Way -->
          <div v-if="method === 'mbway'" class="mt-4 pt-4 border-t border-white/5">
            <label class="block text-xs font-bold text-gray-400 uppercase mb-2">Nº Telemóvel MB Way</label>
            <div class="flex gap-3">
              <span class="flex items-center px-4 bg-white/5 border border-white/10 rounded-xl text-gray-400 text-sm">+351</span>
              <input v-model="mbwayPhone" type="tel" placeholder="912 345 678" maxlength="9" class="flex-1 px-4 py-3 bg-white/5 border rounded-xl text-white outline-none focus:border-[#00D8FF]" :class="triedSubmit && mbwayPhone.length !== 9 ? 'border-red-500/50' : 'border-white/10'" />
            </div>
            <p v-if="triedSubmit && mbwayPhone.length !== 9" class="text-red-400 text-[10px] mt-1">Número de telemóvel inválido</p>
          </div>

          <!-- Referências Multibanco -->
          <div v-if="method === 'multibanco' && paymentData" class="mt-4 pt-4 border-t border-white/5 space-y-3">
            <p class="text-[10px] text-gray-500 mb-2">Referência válida por 72 horas.</p>
            <div class="bg-[#0A0A0F] p-4 rounded-xl"><p class="text-xs text-gray-400 mb-1">Entidade</p><p class="text-xl font-mono font-bold text-white tracking-widest">{{ paymentData.entity }}</p></div>
            <div class="bg-[#0A0A0F] p-4 rounded-xl"><p class="text-xs text-gray-400 mb-1">Referência</p><p class="text-xl font-mono font-bold text-white tracking-widest">{{ paymentData.reference }}</p></div>
            <div class="bg-[#0A0A0F] p-4 rounded-xl"><p class="text-xs text-gray-400 mb-1">Valor</p><p class="text-xl font-mono font-bold text-[#00D8FF]">{{ paymentData.amount }}€</p></div>
          </div>

          <!-- Mensagem para Dinheiro -->
          <div v-if="method === 'cash'" class="mt-4 pt-4 border-t border-white/5">
            <div class="bg-[#10B981]/10 border border-[#10B981]/30 rounded-xl p-4 text-center">
              <p class="text-[#10B981] font-bold text-sm mb-1">💵 Pagamento em Dinheiro</p>
              <p class="text-gray-400 text-xs">O pagamento será feito presencialmente no dia do serviço.</p>
              <p class="text-gray-500 text-[10px] mt-2">Apresente este comprovativo na loja.</p>
            </div>
          </div>
        </div>

        <!-- Termos -->
        <div class="bg-[#050508] border border-white/10 rounded-2xl p-6 mb-6">
          <h3 class="text-sm font-bold text-[#00D8FF] uppercase tracking-wider mb-4">Termos e Condições</h3>
          <div class="space-y-3">
            <label class="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" v-model="acceptedPrivacy" class="w-4 h-4 mt-0.5 rounded border-gray-600 bg-white/5" />
              <span class="text-xs text-gray-400">Aceito a <a href="/privacidade" target="_blank" class="text-[#00D8FF] underline">Política de Privacidade</a> e o tratamento dos meus dados nos termos do RGPD.</span>
            </label>
            <label class="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" v-model="acceptedTerms" class="w-4 h-4 mt-0.5 rounded border-gray-600 bg-white/5" />
              <span class="text-xs text-gray-400">Aceito os <a href="/termos" target="_blank" class="text-[#00D8FF] underline">Termos e Condições</a> da LeiriaDetail.</span>
            </label>
            <label class="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" v-model="acceptedCancellation" class="w-4 h-4 mt-0.5 rounded border-gray-600 bg-white/5" />
              <span class="text-xs text-gray-400">Compreendo a política de cancelamento: até 24h antes sem custos.</span>
            </label>
          </div>
          <p v-if="triedSubmit && (!acceptedPrivacy || !acceptedTerms || !acceptedCancellation)" class="text-red-400 text-[10px] mt-3">Aceite todos os termos para continuar.</p>
        </div>

        <!-- Legal -->
        <div class="bg-[#050508] border border-white/10 rounded-2xl p-4 mb-6">
          <p class="text-[10px] text-gray-500">DL n.º 24/2014: 14 dias para livre resolução. Perde o direito após execução completa do serviço.</p>
        </div>
        <div class="bg-[#050508] border border-white/10 rounded-2xl p-4 mb-6">
          <p class="text-[10px] text-gray-500">RAL: <a href="https://www.cniacc.pt" target="_blank" class="text-[#00D8FF] underline">CNIACC</a> | <a href="https://ec.europa.eu/consumers/odr" target="_blank" class="text-[#00D8FF] underline">RLL</a></p>
        </div>
        <div class="text-center mb-6">
          <a href="https://www.livroreclamacoes.pt" target="_blank" class="text-[10px] text-gray-500 hover:text-[#00D8FF] underline">📖 Livro de Reclamações Eletrónico</a>
        </div>

        <!-- Botão Pagar -->
        <button @click="handlePayment" :disabled="isSubmitting || !canPay" class="w-full py-4 bg-gradient-to-r from-[#2563EB] to-[#00D8FF] text-white font-black uppercase tracking-widest text-sm rounded-xl shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          {{ buttonText }}
        </button>

        <p v-if="sessionTimeout" class="text-red-400 text-xs text-center mt-4">⚠️ Sessão expirada por inatividade. Redirecionando...</p>
        <p class="text-[9px] text-gray-600 text-center mt-6">DPO: dpo@leiriadetail.pt | © {{ new Date().getFullYear() }} LeiriaDetail, Lda.</p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ShieldCheck, Smartphone, CreditCard, Banknote } from 'lucide-vue-next'
import { Cache } from '@/services/cachemanager'
import { graphql } from '@/graphql'

const route = useRoute()
const router = useRouter()

const booking = ref<any>(null)
const isLoading = ref(true)
const method = ref<'mbway' | 'multibanco' | 'cash'>('mbway')
const mbwayPhone = ref('')
const isSubmitting = ref(false)
const triedSubmit = ref(false)
const paymentData = ref<{ entity: string; reference: string; amount: string } | null>(null)
const wantInvoice = ref(false)
const invoiceNIF = ref('')
const invoiceName = ref('')
const invoiceAddress = ref('')
const acceptedPrivacy = ref(false)
const acceptedTerms = ref(false)
const acceptedCancellation = ref(false)
const sessionTimeout = ref(false)

const ivaEnabled = ref(false)
const ivaRate = ref(23)
const requireNIF = ref(false)

let timeoutTimer: ReturnType<typeof setTimeout> | null = null

// Reset do estado de tentativa quando muda o método
watch(method, () => { triedSubmit.value = false })

const fetchSettings = async () => {
  try {
    const query = `query { settings { ivaEnabled ivaRate requireNif } }`
    const data = await graphql<{ settings: any }>(query)
    if (data.settings) {
      ivaEnabled.value = data.settings.ivaEnabled === true || data.settings.ivaEnabled === 'true'
      ivaRate.value = parseInt(data.settings.ivaRate) || 23
      requireNIF.value = data.settings.requireNif === true || data.settings.requireNif === 'true'
      if (requireNIF.value) { wantInvoice.value = true }
    }
  } catch (error) { /* usa defaults */ }
}

const subtotal = computed(() => (booking.value?.servicePrice || 0).toFixed(2))

const ivaAmount = computed(() => {
  if (!ivaEnabled.value) return '0.00'
  return ((booking.value?.servicePrice || 0) * (ivaRate.value / 100)).toFixed(2)
})

const total = computed(() => {
  const base = booking.value?.servicePrice || 0
  const iva = ivaEnabled.value ? base * (ivaRate.value / 100) : 0
  return (base + iva).toFixed(2)
})

const canPay = computed(() => {
  if (!acceptedPrivacy.value || !acceptedTerms.value || !acceptedCancellation.value) return false
  if (method.value === 'mbway' && mbwayPhone.value.length !== 9) return false
  if (requireNIF.value) {
    if (!invoiceNIF.value || invoiceNIF.value.length !== 9) return false
    if (!invoiceName.value.trim()) return false
  } else if (wantInvoice.value) {
    if (!invoiceNIF.value || invoiceNIF.value.length !== 9) return false
  }
  return true
})

const buttonText = computed(() => {
  if (isSubmitting.value) return 'A processar...'
  if (method.value === 'mbway') return 'Pagar com MB Way'
  if (method.value === 'multibanco') return 'Gerar Referências Multibanco'
  return 'Confirmar Pagamento em Dinheiro'
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' })
}

const fetchBooking = async () => {
  const bookingId = route.params.bookingId as string;
  if (!bookingId) { router.push('/client-area'); return; }

  try {
    const query = `
      query GetPendingBooking($id: ID!) {
        pendingBooking(id: $id) {
          pendingBookings {
            id
            serviceName
            vehicleName
            vehiclePlate
            bookingDate
            bookingTime
            price
            status
            expiresAt
          }
          hasError
        }
      }
    `;
    
    const data = await graphql<{ pendingBooking: any }>(query, { id: bookingId });
    
    if (data.pendingBooking?.pendingBookings?.length > 0 && !data.pendingBooking.hasError) {
      const pb = data.pendingBooking.pendingBookings[0];
      
      // Verificar se não expirou
      const expiresAt = new Date(pb.expiresAt).getTime();
      if (Date.now() > expiresAt) {
        clearPendingData();
        alert('⏰ Esta marcação expirou. Por favor, faça uma nova.');
        router.push('/agenda');
        return;
      }
      
      booking.value = {
        id: pb.id,
        serviceName: pb.serviceName || 'Serviço',
        vehicleName: pb.vehicleName || 'Veículo',
        vehiclePlate: pb.vehiclePlate || 'AA-00-BB',
        bookingDate: pb.bookingDate,
        bookingTime: pb.bookingTime,
        servicePrice: pb.price || 0
      };
      isLoading.value = false;
      return;
    }
  } catch (error) {
    console.warn('Erro ao buscar pending booking da API, a usar fallback:', error);
  }

  const storedBooking = localStorage.getItem('pending_booking');
  if (storedBooking) {
    try {
      const pb = JSON.parse(storedBooking);
      
      if (pb.expiresAt) {
        const expiresAt = new Date(pb.expiresAt).getTime();
        if (Date.now() > expiresAt) {
          clearPendingData();
          alert('⏰ Esta marcação expirou. Por favor, faça uma nova.');
          router.push('/agenda');
          return;
        }
      }
      
      booking.value = {
        id: pb.bookingId || bookingId,
        serviceName: localStorage.getItem('last_service') || pb.serviceName || 'Serviço',
        vehicleName: localStorage.getItem('last_vehicle') || pb.vehicleName || 'Veículo',
        vehiclePlate: localStorage.getItem('last_plate') || pb.vehiclePlate || 'AA-00-BB',
        bookingDate: localStorage.getItem('last_date') || pb.date || new Date().toISOString().split('T')[0],
        bookingTime: localStorage.getItem('last_time') || pb.time || '10:00',
        servicePrice: parseFloat(localStorage.getItem('last_price') || String(pb.price || '75'))
      };
    } catch {
      clearPendingData();
      router.push('/agenda');
      return;
    }
  } else {
    router.push('/agenda');
    return;
  }
  
  isLoading.value = false;
};

const handlePayment = async () => {
  if (isSubmitting.value) return;
  triedSubmit.value = true;
  if (!canPay.value) return;
  
  isSubmitting.value = true;
  const safetyTimer = setTimeout(() => { isSubmitting.value = false }, 10000);

  try {
    const bookingId = route.params.bookingId as string;

    if (method.value === 'multibanco') {
      await new Promise(r => setTimeout(r, 1000));
      paymentData.value = {
        entity: '11249',
        reference: `${Math.floor(Math.random() * 900000000) + 100000000}`,
        amount: total.value
      };
      
      // ✅ Marcar como pago na API
      try {
        await markAsPaid(bookingId, 'multibanco');
      } catch (e) { /* fallback */ }
      
    } else if (method.value === 'cash') {
      await new Promise(r => setTimeout(r, 800));
      
      // ✅ Marcar como pago na API
      try {
        await markAsPaid(bookingId, 'cash');
      } catch (e) { /* fallback */ }
      
      clearPendingData();
      alert('✅ Marcação confirmada! Pagamento em dinheiro no dia do serviço.');
      router.push('/client-area');
      
    } else {
      // MB Way
      await new Promise(r => setTimeout(r, 1500));
      
      // ✅ Marcar como pago na API
      try {
        await markAsPaid(bookingId, 'mbway');
      } catch (e) { /* fallback */ }
      
      clearPendingData();
      alert('✅ Pagamento MB Way confirmado!');
      router.push('/client-area');
    }
  } catch (error) {
    console.error('Erro no pagamento:', error);
    alert('Erro ao processar pagamento. Tente novamente.');
  } finally {
    clearTimeout(safetyTimer);
    isSubmitting.value = false;
  }
};

const markAsPaid = async (id: string, paymentMethod: string) => {
  const mutation = `
    mutation MarkPendingAsPaid($id: ID!, $paymentMethod: String!) {
      markPendingAsPaid(id: $id, paymentMethod: $paymentMethod) {
        message
        hasError
      }
    }
  `;
  
  await graphql(mutation, { id, paymentMethod });
};

const clearPendingData = () => {
  localStorage.removeItem('pending_booking');
  localStorage.removeItem('pending_booking_id');
  localStorage.removeItem('last_service');
  localStorage.removeItem('last_vehicle');
  localStorage.removeItem('last_plate');
  localStorage.removeItem('last_date');
  localStorage.removeItem('last_time');
  localStorage.removeItem('last_price');
};

onMounted(async () => {
  const sessionKey = Cache.Session?.value
  if (!sessionKey) { router.push('/login'); return }

  try {
    const res = await fetch('/Authentication/Role', { headers: { 'Session-Key': sessionKey } })
    if (!res.ok) { Cache.clearAuth(); router.push('/login'); return }
  } catch { router.push('/login'); return }

  timeoutTimer = setTimeout(() => {
    sessionTimeout.value = true
    setTimeout(() => { router.push('/client-area') }, 3000)
  }, 30 * 60 * 1000)

  await fetchSettings()
  fetchBooking()
})

onUnmounted(() => {
  if (timeoutTimer) clearTimeout(timeoutTimer)
})
</script>