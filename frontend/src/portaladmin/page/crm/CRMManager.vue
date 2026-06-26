<template>
  <div class="backdrop-blur-[30px] p-8 flex flex-col h-full overflow-hidden relative card-admin">
    <div class="flex items-center justify-between mb-8 shrink-0">
      <div>
        <h3 class="text-3xl font-bold text-[#000000]">CRM & Fleet Management</h3>
        <p class="text-[#334155] font-medium mt-1">Unified view of your clients, their vehicles, and service history.</p>
      </div>
      <div class="flex items-center gap-3">
        <button 
          @click="openGlobalHistory" 
          class="bg-white/80 backdrop-blur-sm border-2 border-[#06B6D4]/30 text-[#0F172A] px-5 py-3 rounded-xl font-bold hover:border-[#06B6D4] hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all flex items-center gap-2"
        >
          <History class="w-5 h-5 text-[#06B6D4]" />
          Histórico Global
        </button>
        <button @click="setIsAddClientOpen(true)" class="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white px-5 py-3 rounded-xl font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all flex items-center gap-2">
          <Plus class="w-5 h-5" />
          New Client Profile
        </button>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden">
      <!-- Coluna Esquerda - Lista de Clientes -->
      <div class="w-full lg:w-1/3 flex flex-col h-full bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 p-4">
        <div class="relative mb-6">
          <Search class="h-5 w-5 text-[#06B6D4] absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" />
          <input v-model="searchQuery" type="text" class="w-full pl-10 pr-4 py-3 font-medium bg-white/80 border border-[#06B6D4]/30 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/40 transition-all placeholder-[#94A3B8] text-[#0F172A]" placeholder="Search client, plate, car..." />
        </div>

        <div v-if="isLoading" class="text-center py-10 text-[#64748B] font-medium">A carregar clientes...</div>
        
        <div v-else class="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
          <div v-for="client in filteredClients" :key="client.id" @click="selectClient(client.id)"
            :class="['w-full text-left p-4 rounded-xl border transition-all cursor-pointer',
              selectedClientId === client.id ? 'bg-gradient-to-r from-white to-[#E0F2FE] border-[#06B6D4] shadow-md' : 'bg-white/50 border-white/20 hover:border-[#06B6D4]/50 hover:bg-white']">
            <div class="flex items-center gap-4">
              <div :class="['w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-inner',
                selectedClientId === client.id ? 'bg-[#06B6D4] text-white' : 'bg-[#F1F5F9] text-[#64748B]']">{{ client.avatar }}</div>
              <div class="flex-1 min-w-0">
                <h4 class="font-bold text-[#0F172A] truncate">{{ client.name }}</h4>
                <p class="text-sm font-medium text-[#64748B] flex items-center gap-1 mt-0.5"><Car class="w-3.5 h-3.5" /> {{ client.vehicles?.length || 0 }} Vehicle{{ client.vehicles?.length !== 1 ? 's' : '' }}</p>
              </div>
              <ChevronRight :class="['w-5 h-5', selectedClientId === client.id ? 'text-[#06B6D4]' : 'text-[#CBD5E1]']" />
            </div>
          </div>
          <div v-if="filteredClients.length === 0" class="text-center py-10 text-[#64748B] font-medium">No clients or vehicles found.</div>
        </div>
      </div>

      <!-- Coluna Direita - Detalhes do Cliente -->
      <div v-if="selectedClient" class="w-full lg:w-2/3 flex flex-col overflow-y-auto space-y-6 pr-2">
        <!-- Perfil do Cliente -->
        <div class="p-6 border border-black/10 rounded-2xl backdrop-blur-sm card-inner">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div class="flex items-center gap-5">
              <div class="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#3B82F6] to-[#06B6D4] flex items-center justify-center shadow-lg text-white text-3xl font-bold">{{ selectedClient.avatar }}</div>
              <div>
                <h2 class="text-3xl font-black text-[#000000] tracking-tight">{{ selectedClient.name }}</h2>
                <div class="flex items-center gap-3 mt-2 text-[#475569] font-medium text-sm">
                  <span class="flex items-center gap-1.5 bg-black/5 px-2 py-1 rounded-md"><Phone class="w-4 h-4 text-[#06B6D4]"/> {{ selectedClient.phone }}</span>
                  <span class="flex items-center gap-1.5 bg-black/5 px-2 py-1 rounded-md"><Mail class="w-4 h-4 text-[#06B6D4]"/> {{ selectedClient.email }}</span>
                </div>
              </div>
            </div>
            <div class="bg-white/60 p-4 rounded-xl border border-[#06B6D4]/20 shadow-sm text-center min-w-[120px]">
              <p class="text-[#64748B] text-xs font-bold uppercase mb-1">Lifetime Value</p>
              <p class="text-2xl font-black text-[#000000]">{{ selectedClient.ltv }}</p>
            </div>
          </div>
        </div>

        <!-- Frota do Cliente -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-[#000000] flex items-center gap-2"><Shield class="w-6 h-6 text-[#3B82F6]" /> Client Fleet</h3>
            <button @click="setIsAddVehicleOpen(true)" class="text-sm font-bold text-[#06B6D4] hover:text-[#0284C7] flex items-center gap-1 transition-colors"><Plus class="w-4 h-4" /> Add Vehicle</button>
          </div>
          <div v-if="selectedClient.vehicles && selectedClient.vehicles.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="vehicle in selectedClient.vehicles" :key="vehicle.id" class="bg-white/70 border border-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-[#06B6D4]/10 rounded-bl-full pointer-events-none group-hover:to-[#06B6D4]/20 transition-colors" />
              <div class="flex justify-between items-start mb-3">
                <h4 class="font-bold text-lg text-[#0F172A]">{{ vehicle.plate }}</h4>
                <span class="bg-[#E0F2FE] text-[#0284C7] text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">{{ vehicle.year }}</span>
              </div>
              <p class="text-[#475569] font-bold mb-1">{{ vehicle.brand }} {{ vehicle.model }}</p>
              <p class="text-[#94A3B8] text-sm font-medium">{{ vehicle.size_category === 'P' ? 'Pequeno' : vehicle.size_category === 'G' ? 'Grande' : 'Médio' }}</p>
            </div>
          </div>
          <div v-else class="text-center py-8 text-[#64748B] font-medium bg-white/30 rounded-xl">Nenhum veículo registado.</div>
        </div>

        <!-- Histórico do Cliente -->
        <div class="p-8 border border-black/10 rounded-2xl backdrop-blur-sm card-inner">
          <div class="flex items-center justify-between mb-6">
            <h4 class="font-bold text-[#000000] text-xl flex items-center gap-3"><History class="w-6 h-6 text-[#06B6D4]" /> Unified Service History</h4>
            <button 
              @click="openFullHistory" 
              class="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white px-4 py-2 rounded-xl font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)] hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all flex items-center gap-2 text-sm"
            >
              <ExternalLink class="w-4 h-4" />
              Ver Histórico Completo
            </button>
          </div>
          <div v-if="selectedClient.history && selectedClient.history.length > 0" class="relative border-l-2 border-[#06B6D4]/30 ml-4 space-y-8 pb-4">
            <div v-for="record in recentHistory" :key="record.id" class="relative pl-8">
              <div :class="['absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm', record.status === 'EM_PROGRESSO' ? 'bg-[#06B6D4]' : record.status === 'CONCLUIDO' ? 'bg-[#10B981]' : 'bg-[#94A3B8]']" />
              <div class="bg-white/60 p-4 rounded-xl border border-black/5">
                <div class="flex justify-between items-start gap-2 mb-2">
                  <h5 class="font-bold text-[#0F172A]">{{ record.service }}</h5>
                  <span :class="['px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wide whitespace-nowrap', record.status === 'CONCLUIDO' ? 'bg-[#D1FAE5] text-[#059669]' : record.status === 'EM_PROGRESSO' ? 'bg-[#E0F2FE] text-[#0284C7]' : 'bg-[#F1F5F9] text-[#64748B]']">{{ record.status }}</span>
                </div>
                <p class="text-[#06B6D4] text-sm font-bold">{{ new Date(record.date).toLocaleDateString('pt-PT') }}</p>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-[#64748B] font-medium">Nenhum histórico de serviços.</div>
        </div>
      </div>
      
      <div v-else class="w-full lg:w-2/3 flex items-center justify-center text-[#64748B] font-medium">Selecione um cliente para ver os detalhes.</div>
    </div>

    <!-- ============================================ -->
    <!-- MODAL: HISTÓRICO GLOBAL (LAYOUT DIVIDIDO)    -->
    <!-- ============================================ -->
    <div v-if="isGlobalHistoryOpen" class="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-[16px]">
      <div class="w-full max-w-6xl h-[85vh] bg-white/95 backdrop-blur-xl border border-white/50 p-6 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        <!-- Cabeçalho -->
        <div class="flex justify-between items-center mb-4 shrink-0">
          <h3 class="text-xl font-bold text-[#000000] flex items-center gap-2">
            <History class="w-6 h-6 text-[#06B6D4]" />
            Histórico Global de Serviços
          </h3>
          <div class="flex items-center gap-3">
            <span class="text-sm text-[#64748B] font-medium">{{ filteredGlobalHistory.length }} registos</span>
            <button @click="closeGlobalHistory" class="p-2 hover:bg-black/5 rounded-full transition-colors">
              <X class="w-5 h-5 text-[#334155]" />
            </button>
          </div>
        </div>

        <!-- Conteúdo dividido: Filtros + Calendário | Histórico -->
        <div class="flex gap-6 flex-1 overflow-hidden">
          
          <!-- COLUNA ESQUERDA: Filtros + Calendário -->
          <div class="w-[340px] shrink-0 flex flex-col gap-4 overflow-y-auto pr-2">
            
            <!-- Filtros compactos -->
            <div class="bg-white/60 rounded-xl border border-[#06B6D4]/20 p-4 space-y-3">
              <div>
                <label class="block text-xs font-bold text-[#334155] mb-1">Cliente</label>
                <select 
                  v-model="globalFilter.clientId" 
                  class="w-full px-3 py-2 rounded-lg bg-white/80 border border-[#06B6D4]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium"
                >
                  <option value="">Todos os Clientes</option>
                  <option v-for="client in clients" :key="client.id" :value="client.id">{{ client.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-[#334155] mb-1">Veículo</label>
                <select 
                  v-model="globalFilter.vehicleId" 
                  class="w-full px-3 py-2 rounded-lg bg-white/80 border border-[#06B6D4]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium"
                >
                  <option value="">Todos os Veículos</option>
                  <option v-for="vehicle in allVehicles" :key="vehicle.id" :value="vehicle.id">{{ vehicle.plate }} - {{ vehicle.brand }} {{ vehicle.model }}</option>
                </select>
              </div>
              
              <!-- Datas lado a lado -->
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-xs font-bold text-[#334155] mb-1">Data Início</label>
                  <input 
                    v-model="globalFilter.startDate" 
                    type="date" 
                    class="w-full px-3 py-2 rounded-lg bg-white/80 border border-[#06B6D4]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-[#334155] mb-1">Data Fim</label>
                  <input 
                    v-model="globalFilter.endDate" 
                    type="date" 
                    class="w-full px-3 py-2 rounded-lg bg-white/80 border border-[#06B6D4]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium"
                  />
                </div>
              </div>
              
              <button 
                @click="clearGlobalFilter" 
                class="w-full px-4 py-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-lg font-bold text-sm shadow-[0_0_10px_rgba(59,130,246,0.3)] hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all"
              >
                Limpar Filtros
              </button>
            </div>

            <!-- Mini Calendário -->
            <div class="bg-white/60 rounded-xl border border-[#06B6D4]/20 p-4">
              <div class="flex items-center justify-between mb-3">
                <button @click="previousMonth" class="p-1 hover:bg-[#06B6D4]/10 rounded-lg transition-colors">
                  <ChevronRight class="w-4 h-4 text-[#06B6D4] rotate-180" />
                </button>
                <h4 class="font-bold text-sm text-[#0F172A]">
                  {{ currentGlobalMonth.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' }) }}
                </h4>
                <button @click="nextMonth" class="p-1 hover:bg-[#06B6D4]/10 rounded-lg transition-colors">
                  <ChevronRight class="w-4 h-4 text-[#06B6D4]" />
                </button>
              </div>
              
              <!-- Dias da semana -->
              <div class="grid grid-cols-7 gap-1 mb-1">
                <div v-for="day in ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']" :key="day" class="text-center text-[10px] font-bold text-[#64748B] py-1">
                  {{ day }}
                </div>
              </div>
              
              <!-- Dias do mês -->
              <div class="grid grid-cols-7 gap-1">
                <div 
                  v-for="(day, index) in globalCalendarDays" 
                  :key="index"
                  @click="selectGlobalCalendarDay(day)"
                  :class="[
                    'text-center py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all',
                    day.isCurrentMonth ? 'text-[#0F172A] hover:bg-[#06B6D4]/10' : 'text-[#CBD5E1]',
                    day.isSelected ? 'bg-[#06B6D4] text-white shadow-sm' : '',
                    day.hasHistory ? 'font-bold' : ''
                  ]"
                >
                  <div class="relative">
                    {{ day.date }}
                    <div v-if="day.hasHistory && !day.isSelected" class="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#06B6D4] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- COLUNA DIREITA: Lista de Histórico -->
          <div class="flex-1 overflow-y-auto pr-2 scrollbar-thin">
            <div v-if="filteredGlobalHistory.length > 0" class="space-y-3">
              <div 
                v-for="record in filteredGlobalHistory" 
                :key="record.id" 
                class="bg-white/60 p-4 rounded-xl border border-black/5 hover:shadow-md transition-shadow"
              >
                <div class="flex justify-between items-start gap-4">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <h5 class="font-bold text-[#0F172A] truncate">{{ record.service }}</h5>
                      <span class="text-xs font-medium text-[#06B6D4] bg-[#E0F2FE] px-2 py-0.5 rounded-lg shrink-0">
                        {{ getClientName(record.clientId) }}
                      </span>
                    </div>
                    <div class="flex items-center gap-2 text-xs">
                      <span class="flex items-center gap-1 text-[#06B6D4] font-bold">
                        <Calendar class="w-3.5 h-3.5" />
                        {{ new Date(record.date).toLocaleDateString('pt-PT') }}
                      </span>
                      <span class="text-[#CBD5E1]">•</span>
                      <span class="font-medium text-[#475569] truncate">{{ getVehiclePlate(record.vehicleId) }}</span>
                    </div>
                  </div>
                  <div class="flex flex-col items-end gap-1.5 shrink-0">
                    <span :class="['px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wide', 
                      record.status === 'CONCLUIDO' ? 'bg-[#D1FAE5] text-[#059669]' : 
                      record.status === 'EM_PROGRESSO' ? 'bg-[#E0F2FE] text-[#0284C7]' : 
                      'bg-[#F1F5F9] text-[#64748B]']">
                      {{ record.status }}
                    </span>
                    <span class="text-[#10B981] font-bold text-sm">€{{ record.price }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="flex flex-col items-center justify-center h-full text-[#64748B] font-medium">
              <History class="w-12 h-12 text-[#CBD5E1] mb-3" />
              <p>Nenhum histórico encontrado para os filtros selecionados.</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- MODAL: HISTÓRICO COMPLETO DO CLIENTE         -->
    <!-- ============================================ -->
    <div v-if="isFullHistoryOpen" class="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-[16px]">
      <div class="w-full max-w-4xl h-[85vh] bg-white/95 backdrop-blur-xl border border-white/50 p-8 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div class="flex justify-between items-center mb-6 shrink-0">
          <h3 class="text-2xl font-bold text-[#000000] flex items-center gap-2">
            <History class="w-7 h-7 text-[#06B6D4]" />
            Histórico Completo - {{ selectedClient?.name }}
          </h3>
          <button @click="closeFullHistory" class="p-2 hover:bg-black/5 rounded-full transition-colors">
            <X class="w-6 h-6 text-[#334155]" />
          </button>
        </div>

        <!-- Calendar Filter -->
        <div class="bg-white/60 rounded-xl border border-[#06B6D4]/20 p-6 mb-6 shrink-0">
          <h4 class="font-bold text-[#0F172A] mb-4 flex items-center gap-2">
            <Calendar class="w-5 h-5 text-[#06B6D4]" />
            Filtrar por Data
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-bold text-[#334155] mb-1">Data Início</label>
              <input 
                v-model="dateFilter.start" 
                type="date" 
                class="w-full px-4 py-3 rounded-xl bg-white/80 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-[#334155] mb-1">Data Fim</label>
              <input 
                v-model="dateFilter.end" 
                type="date" 
                class="w-full px-4 py-3 rounded-xl bg-white/80 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium"
              />
            </div>
            <div class="flex items-end">
              <button 
                @click="clearDateFilter" 
                class="w-full px-4 py-3 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl font-bold shadow-[0_0_12px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all text-sm"
              >
                Limpar Filtro
              </button>
            </div>
          </div>
          
          <!-- Mini Calendar -->
          <div class="mt-6 grid grid-cols-7 gap-2">
            <div v-for="day in ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']" :key="day" class="text-center text-xs font-bold text-[#64748B] py-1">
              {{ day }}
            </div>
            <div 
              v-for="(day, index) in calendarDays" 
              :key="index"
              @click="selectCalendarDay(day)"
              :class="[
                'text-center py-2 rounded-lg text-sm font-medium cursor-pointer transition-all',
                day.isCurrentMonth ? 'text-[#0F172A] hover:bg-[#06B6D4]/10' : 'text-[#CBD5E1]',
                day.isSelected ? 'bg-[#06B6D4] text-white shadow-md' : '',
                day.hasHistory ? 'font-bold' : ''
              ]"
            >
              <div class="relative">
                {{ day.date }}
                <div v-if="day.hasHistory" class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#06B6D4] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filtered History List -->
        <div class="flex-1 overflow-y-auto pr-2 scrollbar-thin">
          <div v-if="filteredFullHistory.length > 0" class="space-y-4">
            <div 
              v-for="record in filteredFullHistory" 
              :key="record.id" 
              class="bg-white/60 p-5 rounded-xl border border-black/5 hover:shadow-md transition-shadow"
            >
              <div class="flex justify-between items-start gap-4">
                <div class="flex-1">
                  <h5 class="font-bold text-[#0F172A] text-lg mb-2">{{ record.service }}</h5>
                  <div class="flex items-center gap-3 text-sm">
                    <span class="flex items-center gap-1 text-[#06B6D4] font-bold">
                      <Calendar class="w-4 h-4" />
                      {{ new Date(record.date).toLocaleDateString('pt-PT') }}
                    </span>
                    <span class="text-[#64748B]">•</span>
                    <span class="font-medium text-[#475569]">{{ getVehiclePlate(record.vehicleId) }}</span>
                  </div>
                </div>
                <div class="flex flex-col items-end gap-2">
                  <span :class="['px-3 py-1.5 rounded-full font-bold text-xs uppercase tracking-wide', 
                    record.status === 'CONCLUIDO' ? 'bg-[#D1FAE5] text-[#059669]' : 
                    record.status === 'EM_PROGRESSO' ? 'bg-[#E0F2FE] text-[#0284C7]' : 
                    'bg-[#F1F5F9] text-[#64748B]']">
                    {{ record.status }}
                  </span>
                  <span class="text-[#10B981] font-bold">€{{ record.price }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-12 text-[#64748B] font-medium">
            Nenhum histórico encontrado para o período selecionado.
          </div>
        </div>
      </div>
    </div>

    <!-- Add Client Modal -->
    <div v-if="isAddClientOpen" class="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-[16px]">
      <div class="w-full max-w-sm bg-white/90 backdrop-blur-xl border border-white/50 p-8 rounded-2xl shadow-2xl">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-[#000000]">New Client</h3>
          <button @click="setIsAddClientOpen(false)" class="p-2 hover:bg-black/5 rounded-full"><X class="w-6 h-6 text-[#334155]" /></button>
        </div>
        <form @submit.prevent="handleAddClient" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm font-bold text-[#334155] mb-1">First Name</label><input required v-model="newClient.firstName" class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" /></div>
            <div><label class="block text-sm font-bold text-[#334155] mb-1">Last Name</label><input required v-model="newClient.lastName" class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" /></div>
          </div>
          <div><label class="block text-sm font-bold text-[#334155] mb-1">Email</label><input required type="email" v-model="newClient.email" class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" /></div>
          <div><label class="block text-sm font-bold text-[#334155] mb-1">Phone</label><input v-model="newClient.phone" class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" /></div>
          <button type="submit" :disabled="isSubmitting" class="w-full mt-6 py-4 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl font-bold shadow-[0_0_12px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all disabled:opacity-50">{{ isSubmitting ? 'A criar...' : 'Create Client' }}</button>
        </form>
      </div>
    </div>

    <!-- Add Vehicle Modal -->
    <div v-if="isAddVehicleOpen" class="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-[16px]">
      <div class="w-full max-w-sm bg-white/90 backdrop-blur-xl border border-white/50 p-8 rounded-2xl shadow-2xl">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-[#000000]">Add Vehicle</h3>
          <button @click="setIsAddVehicleOpen(false)" class="p-2 hover:bg-black/5 rounded-full"><X class="w-6 h-6 text-[#334155]" /></button>
        </div>
        <form @submit.prevent="handleAddVehicle" class="space-y-4">
          <div><label class="block text-sm font-bold text-[#334155] mb-1">License Plate</label><input required v-model="newVehicle.plate" class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium uppercase" /></div>
          <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm font-bold text-[#334155] mb-1">Brand</label><input required v-model="newVehicle.brand" class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" /></div>
            <div><label class="block text-sm font-bold text-[#334155] mb-1">Model</label><input required v-model="newVehicle.model" class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" /></div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm font-bold text-[#334155] mb-1">Year</label><input required type="number" v-model="newVehicle.year" class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" /></div>
            <div><label class="block text-sm font-bold text-[#334155] mb-1">Size</label><select v-model="newVehicle.sizeCategory" class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium"><option value="P">Pequeno (P)</option><option value="M">Médio (M)</option><option value="G">Grande (G)</option></select></div>
          </div>
          <button type="submit" :disabled="isSubmitting" class="w-full mt-6 py-4 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl font-bold shadow-[0_0_12px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all disabled:opacity-50">{{ isSubmitting ? 'A adicionar...' : 'Add Vehicle' }}</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search, Car, History, Phone, Mail, Plus, Shield, ChevronRight, X, ExternalLink, Calendar } from 'lucide-vue-next'
import { graphql } from '@/graphql'

interface Vehicle { id: number; plate: string; brand: string; model: string; year: number; color: string; size_category: string }
interface HistoryRecord { id: number; vehicleId: number; date: string; service: string; status: string; price: number; clientId: number }
interface Client { id: number; name: string; phone: string; email: string; ltv: string; avatar: string; vehicles: Vehicle[]; history: HistoryRecord[] }

interface CalendarDay {
  date: number
  isCurrentMonth: boolean
  isSelected: boolean
  hasHistory: boolean
  fullDate: Date
}

const clients = ref<Client[]>([])
const selectedClientId = ref<number | null>(null)
const searchQuery = ref('')
const isLoading = ref(true)
const isSubmitting = ref(false)
const isAddClientOpen = ref(false)
const isAddVehicleOpen = ref(false)
const isFullHistoryOpen = ref(false)
const isGlobalHistoryOpen = ref(false)
const currentCalendarMonth = ref(new Date())
const currentGlobalMonth = ref(new Date())

const newClient = ref({ firstName: '', lastName: '', email: '', phone: '' })
const newVehicle = ref({ plate: '', brand: '', model: '', year: new Date().getFullYear(), sizeCategory: 'M' })
const dateFilter = ref({ start: '', end: '' })
const globalFilter = ref({
  clientId: '',
  vehicleId: '',
  startDate: '',
  endDate: ''
})

// 🔧 Função auxiliar para criar data local sem problemas de timezone
const createLocalDate = (y: number, m: number, d: number): Date => {
  const monthStr = String(m + 1).padStart(2, '0')
  const dayStr = String(d).padStart(2, '0')
  return new Date(`${y}-${monthStr}-${dayStr}T12:00:00`)
}

// 🔧 Função para obter string da data em formato YYYY-MM-DD
const getDateString = (date: Date): string => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const filteredClients = computed(() => {
  if (!searchQuery.value) return clients.value
  const q = searchQuery.value.toLowerCase()
  return clients.value.filter(c => c.name.toLowerCase().includes(q) || c.vehicles?.some(v => v.plate.toLowerCase().includes(q) || v.model.toLowerCase().includes(q)))
})

const selectedClient = computed(() => clients.value.find(c => c.id === selectedClientId.value) || null)

const recentHistory = computed(() => {
  if (!selectedClient.value?.history) return []
  return selectedClient.value.history.slice(0, 5)
})

const allVehicles = computed(() => {
  const vehicles: Vehicle[] = []
  clients.value.forEach(client => {
    client.vehicles?.forEach(v => vehicles.push(v))
  })
  return vehicles
})

const allHistory = computed(() => {
  const history: HistoryRecord[] = []
  clients.value.forEach(client => {
    client.history?.forEach(h => {
      history.push({ ...h, clientId: client.id })
    })
  })
  return history
})

const filteredFullHistory = computed(() => {
  if (!selectedClient.value?.history) return []
  let history = selectedClient.value.history
  
  if (dateFilter.value.start) {
    history = history.filter(h => new Date(h.date) >= new Date(dateFilter.value.start))
  }
  if (dateFilter.value.end) {
    history = history.filter(h => new Date(h.date) <= new Date(dateFilter.value.end))
  }
  
  return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const filteredGlobalHistory = computed(() => {
  let history = allHistory.value
  
  if (globalFilter.value.clientId) {
    history = history.filter(h => h.clientId === Number(globalFilter.value.clientId))
  }
  if (globalFilter.value.vehicleId) {
    history = history.filter(h => h.vehicleId === Number(globalFilter.value.vehicleId))
  }
  if (globalFilter.value.startDate) {
    history = history.filter(h => new Date(h.date) >= new Date(globalFilter.value.startDate))
  }
  if (globalFilter.value.endDate) {
    history = history.filter(h => new Date(h.date) <= new Date(globalFilter.value.endDate))
  }
  
  return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const generateCalendarDays = (month: Date, history: HistoryRecord[]) => {
  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const firstDay = new Date(year, monthIndex, 1)
  const lastDay = new Date(year, monthIndex + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()
  
  const days: CalendarDay[] = []
  
  // Dias do mês anterior
  const prevMonthLastDay = new Date(year, monthIndex, 0).getDate()
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const date = prevMonthLastDay - i
    const fullDate = createLocalDate(year, monthIndex - 1, date)
    days.push({
      date,
      isCurrentMonth: false,
      isSelected: false,
      hasHistory: false,
      fullDate
    })
  }
  
  // Dias do mês atual
  for (let i = 1; i <= daysInMonth; i++) {
    const fullDate = createLocalDate(year, monthIndex, i)
    const dateStr = getDateString(fullDate)
    
    days.push({
      date: i,
      isCurrentMonth: true,
      isSelected: false,
      hasHistory: history.some(h => {
        const hDate = h.date.split('T')[0]
        return hDate === dateStr
      }),
      fullDate
    })
  }
  
  // Dias do mês seguinte
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const fullDate = createLocalDate(year, monthIndex + 1, i)
    days.push({
      date: i,
      isCurrentMonth: false,
      isSelected: false,
      hasHistory: false,
      fullDate
    })
  }
  
  return days
}

const calendarDays = computed(() => {
  return generateCalendarDays(currentCalendarMonth.value, selectedClient.value?.history || [])
})

const globalCalendarDays = computed(() => {
  return generateCalendarDays(currentGlobalMonth.value, allHistory.value)
})

const selectCalendarDay = (day: CalendarDay) => {
  const dateStr = getDateString(day.fullDate)
  
  if (!dateFilter.value.start || (dateFilter.value.start && dateFilter.value.end)) {
    dateFilter.value = { start: dateStr, end: '' }
  } else {
    if (new Date(dateStr) < new Date(dateFilter.value.start)) {
      dateFilter.value = { start: dateStr, end: dateFilter.value.start }
    } else {
      dateFilter.value = { start: dateFilter.value.start, end: dateStr }
    }
  }
}

const selectGlobalCalendarDay = (day: CalendarDay) => {
  const dateStr = getDateString(day.fullDate)
  
  if (!globalFilter.value.startDate || (globalFilter.value.startDate && globalFilter.value.endDate)) {
    globalFilter.value = { ...globalFilter.value, startDate: dateStr, endDate: '' }
  } else {
    if (new Date(dateStr) < new Date(globalFilter.value.startDate)) {
      globalFilter.value = { ...globalFilter.value, startDate: dateStr, endDate: globalFilter.value.startDate }
    } else {
      globalFilter.value = { ...globalFilter.value, startDate: globalFilter.value.startDate, endDate: dateStr }
    }
  }
}

const clearDateFilter = () => {
  dateFilter.value = { start: '', end: '' }
}

const clearGlobalFilter = () => {
  globalFilter.value = { clientId: '', vehicleId: '', startDate: '', endDate: '' }
}

const previousMonth = () => {
  const newDate = new Date(currentGlobalMonth.value)
  newDate.setMonth(newDate.getMonth() - 1)
  currentGlobalMonth.value = newDate
}

const nextMonth = () => {
  const newDate = new Date(currentGlobalMonth.value)
  newDate.setMonth(newDate.getMonth() + 1)
  currentGlobalMonth.value = newDate
}

const fetchClients = async () => {
  try {
    const query = `query { crmClients { clients { id name phone email ltv avatar vehicles { id plate brand model year color size_category } history { id vehicleId date service status price } } errors { field message } } }`
    const data = await graphql<{ crmClients: { clients: Client[]; errors: any[] } }>(query)
    
    console.log('📊 CRM Data:', data);
    if (data.crmClients?.clients) {
      console.log('📊 Primeiro cliente history:', data.crmClients.clients[0]?.history);
    }
    
    if (data.crmClients?.clients) {
      clients.value = data.crmClients.clients
    }
  } catch (error) { console.error('Erro ao carregar clientes:', error) }
  finally { isLoading.value = false }
}

const selectClient = (id: number) => { selectedClientId.value = id }
const setIsAddClientOpen = (value: boolean) => { isAddClientOpen.value = value }
const setIsAddVehicleOpen = (value: boolean) => { isAddVehicleOpen.value = value }

const openFullHistory = () => {
  isFullHistoryOpen.value = true
  currentCalendarMonth.value = new Date()
}

const closeFullHistory = () => {
  isFullHistoryOpen.value = false
  dateFilter.value = { start: '', end: '' }
}

const openGlobalHistory = () => {
  isGlobalHistoryOpen.value = true
  currentGlobalMonth.value = new Date()
}

const closeGlobalHistory = () => {
  isGlobalHistoryOpen.value = false
  globalFilter.value = { clientId: '', vehicleId: '', startDate: '', endDate: '' }
}

const getVehiclePlate = (vehicleId: number) => {
  return selectedClient.value?.vehicles?.find(v => v.id === vehicleId)?.plate || 
         allVehicles.value.find(v => v.id === vehicleId)?.plate || 
         'Veículo não encontrado'
}

const getClientName = (clientId: number) => {
  return clients.value.find(c => c.id === clientId)?.name || 'Cliente não encontrado'
}

const handleAddClient = async () => {
  isSubmitting.value = true
  try {
    const mutation = `mutation AddClient($input: AddClientInput!) { addClient(input: $input) { client { id name } errors { field message } } }`
    const data = await graphql<{ addClient: any }>(mutation, { input: newClient.value })
    if (!data.addClient?.errors?.length) {
      await fetchClients()
      setIsAddClientOpen(false)
      newClient.value = { firstName: '', lastName: '', email: '', phone: '' }
    }
  } catch (error) { console.error('Erro ao criar cliente:', error) }
  finally { isSubmitting.value = false }
}

const handleAddVehicle = async () => {
  if (!selectedClientId.value) return
  isSubmitting.value = true
  try {
    const mutation = `mutation AddVehicle($input: AddVehicleInput!) { addVehicle(input: $input) { hasError message } }`
    const data = await graphql<{ addVehicle: any }>(mutation, { input: { userId: selectedClientId.value, ...newVehicle.value } })
    if (!data.addVehicle?.hasError) {
      await fetchClients()
      setIsAddVehicleOpen(false)
      newVehicle.value = { plate: '', brand: '', model: '', year: new Date().getFullYear(), sizeCategory: 'M' }
    }
  } catch (error) { console.error('Erro ao adicionar veículo:', error) }
  finally { isSubmitting.value = false }
}

onMounted(() => { fetchClients() })
</script>