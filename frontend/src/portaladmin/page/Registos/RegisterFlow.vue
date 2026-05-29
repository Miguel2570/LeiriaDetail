<template>
  <div class="backdrop-blur-[30px] p-8 flex flex-col h-full overflow-hidden relative card-admin">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8 shrink-0">
      <div>
        <h3 class="text-3xl font-bold text-[#000000]">Gestão de Serviços</h3>
        <p class="text-[#334155] font-medium mt-1">Controlo de entradas, checklists e conclusão de serviços.</p>
      </div>
      <button 
        @click="openNewServiceModal" 
        class="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white px-5 py-3 rounded-xl font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all flex items-center gap-2"
      >
        <Plus class="w-5 h-5" />
        Nova Entrada
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 shrink-0">
      <div class="bg-white/60 backdrop-blur-sm rounded-xl border border-[#06B6D4]/20 p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-[#E0F2FE] flex items-center justify-center">
            <Car class="w-5 h-5 text-[#0284C7]" />
          </div>
          <div>
            <p class="text-xs font-bold text-[#64748B] uppercase">Em Aberto</p>
            <p class="text-2xl font-black text-[#0F172A]">{{ stats.emAberto }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white/60 backdrop-blur-sm rounded-xl border border-[#F59E0B]/20 p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
            <ClipboardList class="w-5 h-5 text-[#D97706]" />
          </div>
          <div>
            <p class="text-xs font-bold text-[#64748B] uppercase">Em Progresso</p>
            <p class="text-2xl font-black text-[#0F172A]">{{ stats.emProgresso }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white/60 backdrop-blur-sm rounded-xl border border-[#10B981]/20 p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-[#D1FAE5] flex items-center justify-center">
            <CheckCircle class="w-5 h-5 text-[#059669]" />
          </div>
          <div>
            <p class="text-xs font-bold text-[#64748B] uppercase">Concluídos Hoje</p>
            <p class="text-2xl font-black text-[#0F172A]">{{ stats.concluidosHoje }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white/60 backdrop-blur-sm rounded-xl border border-[#8B5CF6]/20 p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-[#EDE9FE] flex items-center justify-center">
            <DollarSign class="w-5 h-5 text-[#7C3AED]" />
          </div>
          <div>
            <p class="text-xs font-bold text-[#64748B] uppercase">Faturação Hoje</p>
            <p class="text-2xl font-black text-[#0F172A]">€{{ stats.faturacaoHoje.toFixed(0) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <p class="text-[#64748B] font-medium">A carregar serviços...</p>
    </div>

    <!-- Services Table -->
    <div v-else class="flex-1 overflow-hidden flex flex-col bg-white/40 backdrop-blur-md rounded-2xl border border-white/60">
      <!-- Table Header -->
      <div class="p-4 border-b border-black/5 shrink-0">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-[#000000] text-lg flex items-center gap-2">
            <Wrench class="w-5 h-5 text-[#06B6D4]" />
            Serviços em Andamento
          </h3>
          <div class="flex items-center gap-3">
            <select 
              v-model="statusFilter" 
              class="px-4 py-2 rounded-xl bg-white/80 border border-[#06B6D4]/30 text-sm font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20"
            >
              <option value="">Todos os Status</option>
              <option value="EM_ABERTO">Em Aberto</option>
              <option value="EM_PROGRESSO">Em Progresso</option>
              <option value="CONCLUIDO">Concluído</option>
            </select>
            <div class="relative">
              <Search class="h-4 w-4 text-[#06B6D4] absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" />
              <input 
                v-model="serviceSearch" 
                type="text" 
                class="pl-9 pr-4 py-2 text-sm font-medium bg-white/80 border border-[#06B6D4]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#0F172A]" 
                placeholder="Procurar serviço..."
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Table Body -->
      <div class="flex-1 overflow-y-auto scrollbar-thin">
        <table class="w-full">
          <thead class="sticky top-0 bg-white/80 backdrop-blur-sm z-10">
            <tr class="text-left text-xs font-bold text-[#64748B] uppercase tracking-wider">
              <th class="p-4">Cliente / Veículo</th>
              <th class="p-4">Serviço</th>
              <th class="p-4">Entrada</th>
              <th class="p-4">Progresso</th>
              <th class="p-4">Status</th>
              <th class="p-4">Valor</th>
              <th class="p-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="service in filteredServices" 
              :key="service.id" 
              @click="openServiceDetail(service)"
              class="border-t border-black/5 hover:bg-[#06B6D4]/5 cursor-pointer transition-colors"
            >
              <td class="p-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#06B6D4] flex items-center justify-center text-white text-xs font-bold">
                    {{ getClientInitials(service.clientId) }}
                  </div>
                  <div>
                    <p class="font-bold text-[#0F172A] text-sm">{{ getClientName(service.clientId) }}</p>
                    <p class="text-xs text-[#64748B] font-medium">{{ service.vehiclePlate }}</p>
                  </div>
                </div>
              </td>
              <td class="p-4">
                <p class="font-bold text-[#0F172A] text-sm">{{ service.serviceType }}</p>
              </td>
              <td class="p-4">
                <p class="text-sm font-medium text-[#64748B]">{{ formatDate(service.entryDate) }}</p>
                <p class="text-xs text-[#94A3B8]">{{ formatTime(service.entryDate) }}</p>
              </td>
              <td class="p-4">
                <div class="w-full bg-[#F1F5F9] rounded-full h-2">
                  <div 
                    :class="[
                      'h-2 rounded-full transition-all',
                      service.progress === 100 ? 'bg-[#10B981]' : 'bg-[#06B6D4]'
                    ]" 
                    :style="{ width: service.progress + '%' }"
                  ></div>
                </div>
                <p class="text-xs text-[#64748B] font-medium mt-1">{{ service.progress }}%</p>
              </td>
              <td class="p-4">
                <span :class="getStatusBadge(service.status)">
                  {{ getStatusText(service.status) }}
                </span>
              </td>
              <td class="p-4">
                <p class="font-bold text-[#0F172A]">€{{ service.totalValue.toFixed(0) }}</p>
              </td>
              <td class="p-4" @click.stop>
                <div class="flex items-center gap-2">
                  <button 
                    v-if="service.status === 'EM_ABERTO'"
                    @click="handleStartService(service.id)"
                    class="px-3 py-1.5 bg-[#F59E0B] text-white rounded-lg text-xs font-bold hover:bg-[#D97706] transition-colors"
                  >
                    Iniciar
                  </button>
                  <button 
                    v-if="service.status === 'EM_PROGRESSO'"
                    @click="openChecklistModal(service)"
                    class="px-3 py-1.5 bg-[#3B82F6] text-white rounded-lg text-xs font-bold hover:bg-[#2563EB] transition-colors"
                  >
                    Checklist
                  </button>
                  <button 
                    v-if="service.status === 'EM_PROGRESSO'"
                    @click="handleCompleteService(service.id)"
                    class="px-3 py-1.5 bg-[#10B981] text-white rounded-lg text-xs font-bold hover:bg-[#059669] transition-colors"
                  >
                    Concluir
                  </button>
                  <button 
                    @click="openServiceDetail(service)"
                    class="p-1.5 hover:bg-black/5 rounded-lg transition-colors"
                  >
                    <Eye class="w-4 h-4 text-[#64748B]" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredServices.length === 0">
              <td colspan="7" class="text-center py-12 text-[#64748B] font-medium">
                Nenhum serviço encontrado.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- New Service / Entry Modal -->
    <div v-if="isNewServiceOpen" class="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-[16px]">
      <div class="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border border-white/50 p-8 rounded-2xl shadow-2xl">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-[#000000] flex items-center gap-2">
            <Car class="w-7 h-7 text-[#06B6D4]" />
            Nova Entrada de Veículo
          </h3>
          <button @click="closeNewServiceModal" class="p-2 hover:bg-black/5 rounded-full">
            <X class="w-6 h-6 text-[#334155]" />
          </button>
        </div>

        <form @submit.prevent="handleNewService" class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-[#334155] mb-1">Cliente</label>
              <select 
                v-model="newService.clientId" 
                required
                @change="onClientChange"
                class="w-full px-4 py-3 rounded-xl bg-white/80 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium"
              >
                <option value="">Selecionar cliente</option>
                <option v-for="client in clients" :key="client.id" :value="client.id">{{ client.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-bold text-[#334155] mb-1">Veículo</label>
              <select 
                v-model="newService.vehicleId" 
                required
                class="w-full px-4 py-3 rounded-xl bg-white/80 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium"
              >
                <option value="">Selecionar veículo</option>
                <option v-for="vehicle in availableVehicles" :key="vehicle.id" :value="vehicle.id">
                  {{ vehicle.plate }} - {{ vehicle.brand }} {{ vehicle.model }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-[#334155] mb-1">Tipo de Serviço</label>
            <select 
              v-model="newService.serviceType" 
              required
              class="w-full px-4 py-3 rounded-xl bg-white/80 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium"
            >
              <option value="">Selecionar tipo</option>
              <option value="Lavagem Detalhada">Lavagem Detalhada</option>
              <option value="Polimento">Polimento</option>
              <option value="Limpeza de Interior">Limpeza de Interior</option>
              <option value="Proteção Cerâmica">Proteção Cerâmica</option>
              <option value="Higienização">Higienização</option>
              <option value="Manutenção Geral">Manutenção Geral</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-bold text-[#334155] mb-1">Observações de Entrada</label>
            <textarea 
              v-model="newService.observations" 
              rows="3"
              class="w-full px-4 py-3 rounded-xl bg-white/80 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium resize-none"
              placeholder="Estado do veículo, danos existentes, sujidade, etc..."
            ></textarea>
          </div>

          <div class="bg-[#F8FAFC] p-4 rounded-xl border border-[#06B6D4]/20">
            <h4 class="font-bold text-[#0F172A] mb-3 flex items-center gap-2">
              <ClipboardList class="w-5 h-5 text-[#06B6D4]" />
              Checklist Inicial de Entrada
            </h4>
            <div class="grid grid-cols-2 gap-2">
              <label v-for="item in entryChecklist" :key="item" class="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  v-model="newService.entryChecks" 
                  :value="item"
                  class="w-4 h-4 rounded border-[#06B6D4]/30 text-[#06B6D4] focus:ring-[#06B6D4]/20"
                />
                <span class="text-sm font-medium text-[#334155]">{{ item }}</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-[#334155] mb-1">Valor Estimado (€)</label>
            <input 
              v-model="newService.estimatedValue" 
              type="number" 
              required
              class="w-full px-4 py-3 rounded-xl bg-white/80 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium"
            />
          </div>

          <button 
            type="submit" 
            :disabled="isSubmitting"
            class="w-full py-4 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl font-bold shadow-[0_0_12px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all disabled:opacity-50"
          >
            {{ isSubmitting ? 'A registar...' : 'Registar Entrada' }}
          </button>
        </form>
      </div>
    </div>

    <!-- Service Detail Modal -->
    <div v-if="selectedService" class="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-[16px]">
      <div class="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border border-white/50 p-8 rounded-2xl shadow-2xl">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-[#000000]">Detalhes do Serviço</h3>
          <button @click="selectedService = null" class="p-2 hover:bg-black/5 rounded-full">
            <X class="w-6 h-6 text-[#334155]" />
          </button>
        </div>

        <div class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-[#F8FAFC] p-4 rounded-xl">
              <p class="text-xs font-bold text-[#64748B] uppercase mb-1">Cliente</p>
              <p class="font-bold text-[#0F172A]">{{ getClientName(selectedService.clientId) }}</p>
            </div>
            <div class="bg-[#F8FAFC] p-4 rounded-xl">
              <p class="text-xs font-bold text-[#64748B] uppercase mb-1">Veículo</p>
              <p class="font-bold text-[#0F172A]">{{ selectedService.vehiclePlate }}</p>
            </div>
            <div class="bg-[#F8FAFC] p-4 rounded-xl">
              <p class="text-xs font-bold text-[#64748B] uppercase mb-1">Serviço</p>
              <p class="font-bold text-[#0F172A]">{{ selectedService.serviceType }}</p>
            </div>
            <div class="bg-[#F8FAFC] p-4 rounded-xl">
              <p class="text-xs font-bold text-[#64748B] uppercase mb-1">Status</p>
              <span :class="getStatusBadge(selectedService.status)">
                {{ getStatusText(selectedService.status) }}
              </span>
            </div>
          </div>

          <div class="bg-white/60 p-6 rounded-xl border border-[#06B6D4]/20">
            <h4 class="font-bold text-[#0F172A] mb-4 flex items-center gap-2">
              <Clock class="w-5 h-5 text-[#06B6D4]" />
              Linha do Tempo
            </h4>
            <div class="relative border-l-2 border-[#06B6D4]/30 ml-4 space-y-6">
              <div class="relative pl-8">
                <div class="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#3B82F6] border-2 border-white shadow-sm"></div>
                <div>
                  <p class="font-bold text-[#0F172A] text-sm">Entrada</p>
                  <p class="text-xs text-[#64748B]">{{ formatDateTime(selectedService.entryDate) }}</p>
                  <p v-if="selectedService.observations" class="text-sm text-[#475569] mt-1">{{ selectedService.observations }}</p>
                </div>
              </div>
              <div v-if="selectedService.startedAt" class="relative pl-8">
                <div class="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#F59E0B] border-2 border-white shadow-sm"></div>
                <div>
                  <p class="font-bold text-[#0F172A] text-sm">Início do Serviço</p>
                  <p class="text-xs text-[#64748B]">{{ formatDateTime(selectedService.startedAt) }}</p>
                </div>
              </div>
              <div v-if="selectedService.completedAt" class="relative pl-8">
                <div class="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#10B981] border-2 border-white shadow-sm"></div>
                <div>
                  <p class="font-bold text-[#0F172A] text-sm">Concluído</p>
                  <p class="text-xs text-[#64748B]">{{ formatDateTime(selectedService.completedAt) }}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="flex justify-between mb-2">
              <span class="text-sm font-bold text-[#334155]">Progresso</span>
              <span class="text-sm font-bold text-[#06B6D4]">{{ selectedService.progress }}%</span>
            </div>
            <div class="w-full bg-[#F1F5F9] rounded-full h-3">
              <div 
                :class="['h-3 rounded-full transition-all', selectedService.progress === 100 ? 'bg-[#10B981]' : 'bg-gradient-to-r from-[#3B82F6] to-[#06B6D4]']" 
                :style="{ width: selectedService.progress + '%' }"
              ></div>
            </div>
          </div>

          <div class="flex gap-3">
            <button 
              v-if="selectedService.status === 'EM_ABERTO'"
              @click="handleStartService(selectedService.id); selectedService = null"
              class="flex-1 py-3 bg-[#F59E0B] text-white rounded-xl font-bold hover:bg-[#D97706] transition-colors"
            >
              Iniciar Serviço
            </button>
            <button 
              v-if="selectedService.status === 'EM_PROGRESSO'"
              @click="openChecklistModal(selectedService); selectedService = null"
              class="flex-1 py-3 bg-[#3B82F6] text-white rounded-xl font-bold hover:bg-[#2563EB] transition-colors"
            >
              Abrir Checklist
            </button>
            <button 
              v-if="selectedService.status === 'EM_PROGRESSO'"
              @click="handleCompleteService(selectedService.id); selectedService = null"
              class="flex-1 py-3 bg-[#10B981] text-white rounded-xl font-bold hover:bg-[#059669] transition-colors"
            >
              Concluir Serviço
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Checklist Modal - ATUALIZADO -->
    <div v-if="currentChecklistService" class="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-[16px]">
      <div class="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border border-white/50 p-8 rounded-2xl shadow-2xl">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-[#000000] flex items-center gap-2">
            <ClipboardList class="w-7 h-7 text-[#06B6D4]" />
            Checklist de Serviço
          </h3>
          <button @click="currentChecklistService = null" class="p-2 hover:bg-black/5 rounded-full">
            <X class="w-6 h-6 text-[#334155]" />
          </button>
        </div>

        <div class="space-y-6">
          <div class="bg-[#F8FAFC] p-4 rounded-xl">
            <p class="font-bold text-[#0F172A]">{{ currentChecklistService.serviceType }}</p>
            <p class="text-sm text-[#64748B]">{{ currentChecklistService.vehiclePlate }}</p>
          </div>

          <!-- Barra de Progresso Automática -->
          <div class="bg-white/60 p-4 rounded-xl border border-[#06B6D4]/20">
            <div class="flex justify-between mb-2">
              <span class="text-sm font-bold text-[#334155]">Progresso</span>
              <span class="text-sm font-bold text-[#06B6D4]">{{ autoProgress }}%</span>
            </div>
            <div class="w-full bg-[#F1F5F9] rounded-full h-3">
              <div 
                :class="['h-3 rounded-full transition-all duration-500', autoProgress === 100 ? 'bg-[#10B981]' : 'bg-gradient-to-r from-[#3B82F6] to-[#06B6D4]']" 
                :style="{ width: autoProgress + '%' }"
              ></div>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h4 class="font-bold text-[#0F172A]">Itens do Checklist</h4>
              <span class="text-xs font-medium text-[#64748B]">{{ checkedCount }}/{{ serviceChecklist.length }} concluídos</span>
            </div>
            
            <div v-for="(item, index) in serviceChecklist" :key="index" 
              :class="[
                'flex items-center justify-between p-3 rounded-xl border transition-all',
                isItemChecked(item) ? 'bg-[#D1FAE5]/50 border-[#10B981]/30' : 'bg-white/60 border-black/5'
              ]">
              <div class="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  :checked="isItemChecked(item)"
                  @change="toggleChecklistItem(item)"
                  class="w-5 h-5 rounded border-[#06B6D4]/30 text-[#06B6D4] focus:ring-[#06B6D4]/20"
                />
                <span :class="['font-medium', isItemChecked(item) ? 'text-[#059669] line-through' : 'text-[#0F172A]']">
                  {{ item }}
                </span>
              </div>
              <input 
                v-model="checklistNotes[index]" 
                type="text" 
                placeholder="Nota..." 
                class="px-3 py-1.5 text-sm bg-white/80 border border-[#06B6D4]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 w-48"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-[#334155] mb-1">Notas Adicionais</label>
            <textarea 
              v-model="currentChecklistService.serviceNotes" 
              rows="3"
              class="w-full px-4 py-3 rounded-xl bg-white/80 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium resize-none"
              placeholder="Observações durante o serviço..."
            ></textarea>
          </div>

          <!-- Progresso Manual (caso queiras ajustar) -->
          <div>
            <label class="block text-sm font-bold text-[#334155] mb-1">Ajuste Manual (%)</label>
            <input 
              v-model="currentChecklistService.progress" 
              type="range" 
              min="0" 
              max="100" 
              class="w-full"
            />
            <div class="flex justify-between text-xs font-medium text-[#64748B]">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          <button 
            @click="handleSaveChecklist"
            :disabled="isSubmitting"
            class="w-full py-4 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl font-bold shadow-[0_0_12px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all disabled:opacity-50"
          >
            {{ isSubmitting ? 'A guardar...' : 'Guardar Checklist' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search, Car, Clock, Plus, X, Eye, Wrench, ClipboardList, CheckCircle, DollarSign } from 'lucide-vue-next'
import { graphql } from '@/graphql'

interface Service {
  id: number
  clientId: number
  vehicleId: number
  vehiclePlate: string
  serviceType: string
  status: 'EM_ABERTO' | 'EM_PROGRESSO' | 'CONCLUIDO'
  progress: number
  entryDate: string
  startedAt: string | null
  completedAt: string | null
  observations: string
  entryChecks: string[]
  checklistItems: string[]
  serviceNotes: string
  estimatedValue: number
  totalValue: number
}

interface Client {
  id: number
  name: string
  vehicles: Vehicle[]
}

interface Vehicle {
  id: number
  plate: string
  brand: string
  model: string
}

interface Stats {
  emAberto: number
  emProgresso: number
  concluidosHoje: number
  faturacaoHoje: number
}

const services = ref<Service[]>([])
const clients = ref<Client[]>([])
const stats = ref<Stats>({
  emAberto: 0,
  emProgresso: 0,
  concluidosHoje: 0,
  faturacaoHoje: 0
})
const isLoading = ref(true)
const isSubmitting = ref(false)
const isNewServiceOpen = ref(false)
const selectedService = ref<Service | null>(null)
const currentChecklistService = ref<Service | null>(null)
const statusFilter = ref('')
const serviceSearch = ref('')
const checklistNotes = ref<string[]>([])

const newService = ref({
  clientId: '',
  vehicleId: '',
  serviceType: '',
  observations: '',
  entryChecks: [] as string[],
  estimatedValue: 0
})

const entryChecklist = [
  'Verificar lataria',
  'Verificar pintura',
  'Verificar jantes',
  'Verificar pneus',
  'Verificar interior',
  'Verificar vidros',
  'Fotografar danos existentes',
  'Verificar nível de combustível',
  'Verificar documentos',
  'Confirmar chave reserva'
]

const serviceChecklist = [
  'Lavagem exterior',
  'Limpeza de jantes',
  'Limpeza de vidros',
  'Aspiração interior',
  'Limpeza de painéis',
  'Hidratação de couro',
  'Limpeza de tapetes',
  'Polimento',
  'Aplicação de proteção',
  'Revisão final'
]

const checkedCount = computed(() => {
  if (!currentChecklistService.value) return 0
  return currentChecklistService.value.checklistItems.length
})

const autoProgress = computed(() => {
  if (!currentChecklistService.value) return 0
  const total = serviceChecklist.length
  const checked = currentChecklistService.value.checklistItems.length
  
  if (total === 0) return 0
  
  // Se o progresso manual for maior, usa o manual
  const calculatedProgress = Math.round((checked / total) * 100)
  const manualProgress = currentChecklistService.value.progress || 0
  
  return Math.max(calculatedProgress, manualProgress)
})

const toggleChecklistItem = (item: string) => {
  if (!currentChecklistService.value) return
  
  const items = [...currentChecklistService.value.checklistItems]
  const index = items.indexOf(item)
  
  if (index > -1) {
    items.splice(index, 1) // Remove se já estiver checked
  } else {
    items.push(item) // Adiciona se não estiver checked
  }
  
  currentChecklistService.value.checklistItems = items
  
  // Atualiza o progresso automaticamente
  const total = serviceChecklist.length
  const checked = items.length
  currentChecklistService.value.progress = Math.round((checked / total) * 100)
}

const isItemChecked = (item: string) => {
  if (!currentChecklistService.value) return false
  return currentChecklistService.value.checklistItems.includes(item)
}

const availableVehicles = computed(() => {
  if (!newService.value.clientId) return []
  const client = clients.value.find(c => c.id === Number(newService.value.clientId))
  return client?.vehicles || []
})

const filteredServices = computed(() => {
  let filtered = services.value
  
  if (statusFilter.value) {
    filtered = filtered.filter(s => s.status === statusFilter.value)
  }
  
  if (serviceSearch.value) {
    const q = serviceSearch.value.toLowerCase()
    filtered = filtered.filter(s => 
      s.serviceType.toLowerCase().includes(q) ||
      s.vehiclePlate.toLowerCase().includes(q) ||
      getClientName(s.clientId).toLowerCase().includes(q)
    )
  }
  
  return filtered
})

const fetchServices = async () => {
  try {
    const query = `
      query {
        registosServices {
          services {
            id
            clientId
            vehicleId
            vehiclePlate
            serviceType
            status
            progress
            entryDate
            startedAt
            completedAt
            observations
            entryChecks
            checklistItems
            serviceNotes
            estimatedValue
            totalValue
          }
          totalCount
          errors { field message }
        }
      }
    `
    const data = await graphql<{ registosServices: { services: Service[], totalCount: number, errors: any[] } }>(query)
    if (data.registosServices?.services) {
      services.value = data.registosServices.services
    }
  } catch (error) {
    console.error('Erro ao carregar serviços:', error)
  }
}

const fetchStats = async () => {
  try {
    const query = `
      query {
        registosStats {
          stats {
            emAberto
            emProgresso
            concluidosHoje
            faturacaoHoje
          }
          errors { field message }
        }
      }
    `
    const data = await graphql<{ registosStats: { stats: Stats, errors: any[] } }>(query)
    if (data.registosStats?.stats) {
      stats.value = data.registosStats.stats
    }
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error)
  }
}

const fetchClients = async () => {
  try {
    const query = `
      query {
        crmClients {
          clients {
            id
            name
            vehicles {
              id
              plate
              brand
              model
            }
          }
          errors { field message }
        }
      }
    `
    const data = await graphql<{ crmClients: { clients: Client[], errors: any[] } }>(query)
    if (data.crmClients?.clients) {
      clients.value = data.crmClients.clients
    }
  } catch (error) {
    console.error('Erro ao carregar clientes:', error)
  }
}

const fetchData = async () => {
  isLoading.value = true
  await Promise.all([fetchServices(), fetchStats(), fetchClients()])
  isLoading.value = false
}

const handleNewService = async () => {
  isSubmitting.value = true
  try {
    const mutation = `
      mutation CreateWorkshopService($input: CreateServiceInput!) {
        createWorkshopService(input: $input) {
          service { id serviceType status entryDate }
          errors { field message }
        }
      }
    `
    await graphql(mutation, {
      input: {
        clientId: Number(newService.value.clientId),
        vehicleId: Number(newService.value.vehicleId),
        serviceType: newService.value.serviceType,
        observations: newService.value.observations,
        entryChecks: newService.value.entryChecks,
        estimatedValue: Number(newService.value.estimatedValue)
      }
    })
    
    closeNewServiceModal()
    await fetchData()
  } catch (error) {
    console.error('Erro ao criar serviço:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleStartService = async (serviceId: number) => {
  try {
    const mutation = `
      mutation StartWorkshopService($serviceId: Int!) {
        startWorkshopService(serviceId: $serviceId) {
          service { id status progress startedAt }
          errors { field message }
        }
      }
    `
    await graphql(mutation, { serviceId })
    await fetchData()
  } catch (error) {
    console.error('Erro ao iniciar serviço:', error)
  }
}

const handleSaveChecklist = async () => {
  if (!currentChecklistService.value) return
  
  isSubmitting.value = true
  try {
    const mutation = `
      mutation UpdateWorkshopChecklist($input: UpdateChecklistInput!) {
        updateWorkshopChecklist(input: $input) {
          service { id progress checklistItems serviceNotes }
          errors { field message }
        }
      }
    `
    await graphql(mutation, {
      input: {
        serviceId: currentChecklistService.value.id,
        checklist: currentChecklistService.value.checklistItems,
        notes: currentChecklistService.value.serviceNotes,
        progress: currentChecklistService.value.progress
      }
    })
    
    currentChecklistService.value = null
    await fetchData()
  } catch (error) {
    console.error('Erro ao guardar checklist:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleCompleteService = async (serviceId: number) => {
  try {
    const mutation = `
      mutation CompleteWorkshopService($input: CompleteServiceInput!) {
        completeWorkshopService(input: $input) {
          service { id status progress completedAt totalValue }
          errors { field message }
        }
      }
    `
    await graphql(mutation, {
      input: {
        serviceId: serviceId
      }
    })
    await fetchData()
  } catch (error) {
    console.error('Erro ao concluir serviço:', error)
  }
}

// HELPERS

const getClientName = (clientId: number) => {
  return clients.value.find(c => c.id === clientId)?.name || `Cliente #${clientId}`
}

const getClientInitials = (clientId: number) => {
  const name = getClientName(clientId)
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getStatusBadge = (status: string) => {
  const badges: Record<string, string> = {
    'EM_ABERTO': 'px-2.5 py-1 rounded-full font-bold text-xs bg-[#E0F2FE] text-[#0284C7]',
    'EM_PROGRESSO': 'px-2.5 py-1 rounded-full font-bold text-xs bg-[#FEF3C7] text-[#D97706]',
    'CONCLUIDO': 'px-2.5 py-1 rounded-full font-bold text-xs bg-[#D1FAE5] text-[#059669]'
  }
  return badges[status] || ''
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    'EM_ABERTO': 'Em Aberto',
    'EM_PROGRESSO': 'Em Progresso',
    'CONCLUIDO': 'Concluído'
  }
  return texts[status] || status
}

const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-PT')
const formatTime = (date: string) => new Date(date).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
const formatDateTime = (date: string) => new Date(date).toLocaleString('pt-PT')

const onClientChange = () => {
  newService.value.vehicleId = ''
}

const openNewServiceModal = () => {
  isNewServiceOpen.value = true
}

const closeNewServiceModal = () => {
  isNewServiceOpen.value = false
  newService.value = {
    clientId: '',
    vehicleId: '',
    serviceType: '',
    observations: '',
    entryChecks: [],
    estimatedValue: 0
  }
}

const openChecklistModal = (service: Service) => {
  currentChecklistService.value = { ...service }
  
  // Garante que os checklistItems estão inicializados
  if (!currentChecklistService.value.checklistItems) {
    currentChecklistService.value.checklistItems = []
  }
  
  // Inicializa as notas
  checklistNotes.value = serviceChecklist.map(() => '')
}

const openServiceDetail = (service: Service) => {
  selectedService.value = service
}

onMounted(() => {
  fetchData()
})
</script>