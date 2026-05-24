<template>
  <div class="min-h-screen bg-[#020204] text-white pt-28 pb-20 relative overflow-hidden">
    <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2563EB]/5 rounded-full blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#00D8FF]/5 rounded-full blur-[120px] pointer-events-none"></div>

    <div class="max-w-6xl mx-auto px-4 relative z-10">
      
      <!-- Cabeçalho -->
      <div class="mb-8 border-b border-white/5 pb-8">
        <h2 class="text-[#00D8FF] font-black tracking-[0.4em] uppercase text-[10px] mb-2 italic">Área Privada</h2>
        <h1 class="text-4xl font-black italic tracking-tighter uppercase text-white">
          Olá, <span class="bg-gradient-to-r from-[#2563EB] to-[#00D8FF] bg-clip-text text-transparent">{{ customerName }}</span>
        </h1>
      </div>

      <!-- Layout: Menu Vertical + Conteúdo -->
      <div class="flex gap-8">
        
        <!-- Menu Vertical -->
        <div class="w-64 shrink-0 space-y-1">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
            :class="activeTab === tab.id 
              ? 'bg-[#2563EB]/10 text-[#00D8FF] border border-[#00D8FF]/20' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'"
          >
            <component :is="tab.icon" class="w-5 h-5" />
            <span class="text-sm font-bold uppercase tracking-wider">{{ tab.label }}</span>
          </button>
        </div>

        <!-- Conteúdo -->
        <div class="flex-1 min-w-0">
          
          <!-- ============ PERFIL ============ -->
          <div v-if="activeTab === 'profile'" class="space-y-8">
            
            <!-- Dados Pessoais -->
            <div class="bg-[#050508] border border-white/10 rounded-2xl p-6">
              <h3 class="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <User class="w-5 h-5 text-[#00D8FF]" /> Dados Pessoais
              </h3>

              <div v-if="profileSuccess" class="mb-4 p-4 bg-green-500/10 border border-green-500/50 rounded-xl text-green-400 text-sm">
                {{ profileSuccess }}
              </div>
              <div v-if="profileError" class="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
                {{ profileError }}
              </div>

              <form @submit.prevent="handleUpdateProfile" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-gray-400 uppercase mb-2">Nome</label>
                    <input v-model="profile.firstName" type="text" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3B82F6] transition-all" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-400 uppercase mb-2">Apelido</label>
                    <input v-model="profile.lastName" type="text" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3B82F6] transition-all" />
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase mb-2">Email</label>
                  <input :value="profile.email" type="email" disabled class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-500 outline-none cursor-not-allowed" />
                </div>

                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase mb-2">Telemóvel</label>
                  <input v-model="profile.phone" type="tel" placeholder="912 345 678" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3B82F6] transition-all" />
                </div>

                <button type="submit" :disabled="profileSubmitting" class="px-6 py-3 bg-gradient-to-r from-[#2563EB] to-[#00D8FF] text-white text-xs font-bold uppercase tracking-wider rounded-xl disabled:opacity-50">
                  {{ profileSubmitting ? 'A guardar...' : 'Guardar Alterações' }}
                </button>
              </form>
            </div>

            <!-- Alterar Password -->
            <div class="bg-[#050508] border border-white/10 rounded-2xl p-6">
              <h3 class="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Lock class="w-5 h-5 text-[#00D8FF]" /> Alterar Password
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase mb-2">Password Atual</label>
                  <input v-model="passwordForm.currentPassword" type="password" placeholder="••••••••" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3B82F6]" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase mb-2">Nova Password</label>
                  <input v-model="passwordForm.newPassword" type="password" placeholder="••••••••" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3B82F6]" />
                </div>
              </div>

              <button @click="handleChangePassword" :disabled="passwordSubmitting" class="px-6 py-3 bg-[#00D8FF]/10 border border-[#00D8FF]/30 text-[#00D8FF] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#00D8FF]/20 disabled:opacity-50">
                {{ passwordSubmitting ? 'A alterar...' : 'Alterar Password' }}
              </button>
              <p v-if="passwordMessage" class="text-xs mt-2" :class="passwordError ? 'text-red-400' : 'text-green-400'">{{ passwordMessage }}</p>
            </div>

            <!-- Info da Conta -->
            <div class="bg-[#050508] border border-white/10 rounded-2xl p-6">
              <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <ShieldAlert class="w-5 h-5 text-[#00D8FF]" /> Conta
              </h3>
              <p class="text-sm text-gray-400">✅ Conta verificada</p>
              <p class="text-sm text-gray-400">📅 Membro desde {{ profile.createdAt || 'N/D' }}</p>
              <p class="text-sm text-gray-400">🚗 Veículos: {{ vehicles.length }}</p>
              <p class="text-sm text-gray-400">📅 Marcações: {{ bookings.length }}</p>
            </div>
          </div>

          <!-- ============ VEÍCULOS ============ -->
          <div v-if="activeTab === 'vehicles'" class="bg-[#050508] border border-white/10 rounded-2xl p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Car class="w-5 h-5 text-[#00D8FF]" /> Os Meus Veículos
              </h3>
              <button @click="showAddVehicleForm = !showAddVehicleForm" class="px-4 py-2 bg-gradient-to-r from-[#2563EB] to-[#00D8FF] text-white text-xs font-bold rounded-xl">
                <Plus class="w-4 h-4 inline mr-1" /> {{ showAddVehicleForm ? 'Cancelar' : 'Adicionar' }}
              </button>
            </div>

            <Transition name="slide">
              <div v-if="showAddVehicleForm" class="mb-6 p-6 border border-white/10 rounded-xl bg-white/[0.02]">
                <div v-if="vehicleError" class="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-xs">{{ vehicleError }}</div>
                <form @submit.prevent="handleAddVehicle" class="space-y-4">
                  <div>
                    <label class="block text-xs font-bold text-gray-400 uppercase mb-2">Matrícula *</label>
                    <input v-model="newVehicle.license_plate" type="text" placeholder="AA-11-BB" class="w-full px-4 py-3 border rounded-xl text-white outline-none" :class="plateStatus.class" @input="handlePlateInput" maxlength="8" required />
                    <p v-if="plateStatus.message" class="text-xs mt-1" :class="plateStatus.messageClass">{{ plateStatus.message }}</p>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div><label class="block text-xs font-bold text-gray-400 uppercase mb-2">Marca *</label><input v-model="newVehicle.brand" type="text" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none" required /></div>
                    <div><label class="block text-xs font-bold text-gray-400 uppercase mb-2">Modelo *</label><input v-model="newVehicle.model" type="text" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none" required /></div>
                  </div>
                  <div class="grid grid-cols-3 gap-4">
                    <div><label class="block text-xs font-bold text-gray-400 uppercase mb-2">Ano</label><input v-model="newVehicle.year" type="number" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none" /></div>
                    <div>
                      <label class="block text-xs font-bold text-gray-400 uppercase mb-2">Combustível</label>
                      <select v-model="newVehicle.fuel_type" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none">
                        <option value="">Selecionar</option>
                        <option value="Gasolina">Gasolina</option><option value="Diesel">Diesel</option><option value="Elétrico">Elétrico</option><option value="Híbrido">Híbrido</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-gray-400 uppercase mb-2">Categoria</label>
                      <select v-model="newVehicle.size_category" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none">
                        <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option><option value="E">E</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" :disabled="vehicleSubmitting || !plateStatus.isValid" class="w-full py-3 bg-gradient-to-r from-[#2563EB] to-[#00D8FF] text-white font-bold rounded-xl disabled:opacity-50 text-sm uppercase tracking-wider">
                    {{ vehicleSubmitting ? 'A guardar...' : 'Guardar Veículo' }}
                  </button>
                </form>
              </div>
            </Transition>

            <div v-if="vehicles.length > 0" class="space-y-3">
              <div v-for="v in vehicles" :key="v.id" class="p-4 border rounded-xl flex justify-between items-center" :class="v.isPrimary ? 'border-[#00D8FF]/30 bg-[#00D8FF]/5' : 'border-white/5 bg-white/[0.01]'">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-[#2563EB]/10 flex items-center justify-center"><Car class="w-5 h-5 text-[#00D8FF]" /></div>
                  <div>
                    <span class="text-white font-bold text-sm">{{ v.brand }} {{ v.model }}</span>
                    <span v-if="v.isPrimary" class="text-[10px] bg-[#00D8FF]/20 text-[#00D8FF] px-2 py-0.5 rounded-full ml-2">Principal</span>
                    <p class="text-xs text-gray-400">{{ v.licensePlate }} • {{ v.year || 'N/D' }}</p>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button v-if="!v.isPrimary" @click="handleSetPrimary(v.id)" class="text-[10px] uppercase font-bold text-gray-400 hover:text-[#00D8FF]">Principal</button>
                  <button @click="handleDeleteVehicle(v.id)" class="text-[10px] uppercase font-bold text-red-400 hover:text-red-300">Remover</button>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-12"><Car class="w-12 h-12 text-gray-600 mx-auto mb-3" /><p class="text-gray-400 text-sm">Nenhum veículo.</p></div>
          </div>

          <!-- ============ MARCAÇÕES ============ -->
          <div v-if="activeTab === 'bookings'">
            <div v-if="isLoading" class="flex justify-center py-20"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00D8FF]"></div></div>
            <div v-else-if="bookings.length === 0" class="bg-[#050508] border border-white/10 rounded-2xl p-12 text-center">
              <Calendar class="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h4 class="text-white font-bold mb-1">Sem agendamentos</h4>
              <router-link to="/agenda" class="text-[#00D8FF] text-sm font-bold hover:underline">Agendar agora →</router-link>
            </div>
            <div v-else class="space-y-4">
              <div v-for="b in bookings" :key="b.id" class="bg-[#050508] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <h4 class="font-bold text-white">{{ b.service_name }}</h4>
                    <p class="text-xs text-gray-400">🚗 {{ b.vehicle_name }} • {{ b.vehicle_plate }}</p>
                  </div>
                  <span :class="['text-[10px] font-black uppercase px-3 py-1.5 rounded-full', b.status === 'PENDENTE' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500']">● {{ b.status }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <div class="flex gap-4 text-xs text-gray-400">
                    <span>📅 {{ formatDate(b.booking_date) }}</span>
                    <span>🕐 {{ b.booking_time }}</span>
                  </div>
                  <span class="text-lg font-black text-[#00D8FF]">{{ b.service_price }}€</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { Calendar, Clock, Sparkles, CalendarPlus, ShieldCheck, Car, Plus, User, Mail, Phone, Lock, ShieldAlert } from 'lucide-vue-next';
import { graphql } from '@/services/graphql';
import { Cache } from '@/CacheManagement/cachemanager';
import { validatePortuguesePlate } from '@/services/licensePlateService';

interface Booking {
  id: string;
  booking_date: string;
  booking_time: string;
  status: string;
  vehicle_name: string;
  vehicle_plate: string;
  service_name: string;
  service_price: number;
}

interface Vehicle {
  id: string;
  licensePlate: string;
  brand: string;
  model: string;
  year: number | null;
  fuelType: string | null;
  sizeCategory: string;
  isPrimary: boolean;
}

// Tabs
const tabs = [
  { id: 'profile' as const, label: 'Perfil', icon: User },
  { id: 'bookings' as const, label: 'Marcações', icon: Clock },
  { id: 'vehicles' as const, label: 'Veículos', icon: Car },
];
const activeTab = ref<'bookings' | 'vehicles' | 'profile'>('profile');

// Dados comuns
const customerName = ref(Cache.UserName.value || 'Cliente');
const isLoading = ref(true);
const bookings = ref<Booking[]>([]);
const vehicles = ref<Vehicle[]>([]);

// Perfil
const profile = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  createdAt: '',
});
const profileSubmitting = ref(false);
const profileSuccess = ref('');
const profileError = ref('');

// Password
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
});
const passwordSubmitting = ref(false);
const passwordMessage = ref('');
const passwordError = ref(false);

// Veículos
const showAddVehicleForm = ref(false);
const vehicleSubmitting = ref(false);
const vehicleError = ref('');
const newVehicle = ref({
  license_plate: '',
  brand: '',
  model: '',
  year: null as number | null,
  fuel_type: '',
  size_category: 'C'
});
const plateStatus = reactive({
  isValid: false,
  class: 'bg-white/5 border-white/10 focus:border-[#3B82F6]',
  message: '',
  messageClass: ''
});

// ============ PERFIL ============
const loadProfile = async () => {
  try {
    const query = `
      query {
        profile {
          profile {
            id
            firstName
            lastName
            email
            phone
            isVerified
            createdAt
          }
          hasError
        }
      }
    `;
    const data = await graphql<{ profile: { profile: any; hasError: boolean } }>(query);
    
    if (data.profile?.profile && !data.profile.hasError) {
      const p = data.profile.profile;
      profile.firstName = p.firstName || '';
      profile.lastName = p.lastName || '';
      profile.email = p.email || '';
      profile.phone = p.phone || '';
      profile.createdAt = p.createdAt 
        ? new Date(p.createdAt).toLocaleDateString('pt-PT', { year: 'numeric', month: 'long' })
        : '';
    }
  } catch (error) {
    console.error('Erro ao carregar perfil:', error);
  }
};

const handleUpdateProfile = async () => {
  profileSuccess.value = '';
  profileError.value = '';
  profileSubmitting.value = true;

  try {
    const mutation = `
      mutation UpdateProfile($input: UpdateProfileInput!) {
        updateProfile(input: $input) {
          firstName
          lastName
          phone
          message
          hasError
          error { field message }
        }
      }
    `;

    const data = await graphql<{ updateProfile: any }>(mutation, {
      input: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone
      }
    });

    if (data.updateProfile.hasError) {
      profileError.value = data.updateProfile.error?.message || 'Erro ao atualizar perfil.';
      return;
    }

    // Atualizar cache
    Cache.UserName.value = profile.firstName;
    localStorage.setItem('user_name', profile.firstName);
    customerName.value = profile.firstName;
    
    profileSuccess.value = data.updateProfile.message || 'Perfil atualizado com sucesso!';
    setTimeout(() => { profileSuccess.value = ''; }, 3000);
  } catch (error: any) {
    profileError.value = error.message || 'Erro ao atualizar perfil.';
  } finally {
    profileSubmitting.value = false;
  }
};

const handleChangePassword = async () => {
  passwordMessage.value = '';
  passwordError.value = false;
  
  if (!passwordForm.currentPassword || !passwordForm.newPassword) {
    passwordMessage.value = 'Preencha ambos os campos.';
    passwordError.value = true;
    return;
  }
  
  if (passwordForm.newPassword.length < 6) {
    passwordMessage.value = 'A nova password deve ter pelo menos 6 caracteres.';
    passwordError.value = true;
    return;
  }
  
  passwordSubmitting.value = true;

  try {
    const mutation = `
      mutation ChangeProfilePassword($input: ChangePasswordInput!) {
        changeProfilePassword(input: $input) {
          message
          hasError
          error { field message }
        }
      }
    `;

    const data = await graphql<{ changePassword: any }>(mutation, {
      input: {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }
    });

    if (data.changePassword.hasError) {
      passwordMessage.value = data.changePassword.error?.message || 'Erro ao alterar password.';
      passwordError.value = true;
      return;
    }

    passwordMessage.value = data.changePassword.message || 'Password alterada com sucesso!';
    passwordError.value = false;
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
  } catch (error: any) {
    passwordMessage.value = error.message || 'Erro ao alterar password.';
    passwordError.value = true;
  } finally {
    passwordSubmitting.value = false;
  }
};

// ============ MARCAÇÕES ============
const loadBookings = async () => {
  const userId = Cache.UserId.value;
  if (!userId) { isLoading.value = false; return; }

  try {
    const query = `query GetDashboardData($userId: Int!) { customerBookings(user_id: $userId) { id booking_date booking_time status vehicle_name vehicle_plate service_name service_price } }`;
    const response = await graphql<{ customerBookings: Booking[] }>(query, { userId: parseInt(userId, 10) });
    bookings.value = response.customerBookings;
  } catch (error) {
    console.error("Erro ao carregar marcações:", error);
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' });
};

// ============ VEÍCULOS ============
const loadVehicles = async () => {
  try {
    const query = `query { userVehicles { vehicles { id licensePlate brand model year fuelType sizeCategory isPrimary } } }`;
    const data = await graphql<{ userVehicles: { vehicles: Vehicle[] } }>(query);
    vehicles.value = data.userVehicles.vehicles;
  } catch (error) {
    console.error('Erro ao carregar veículos:', error);
  }
};

const handlePlateInput = () => {
  const plate = newVehicle.value.license_plate;
  if (plate.length < 2) {
    plateStatus.isValid = false;
    plateStatus.class = 'bg-white/5 border-white/10 focus:border-[#3B82F6]';
    plateStatus.message = '';
    return;
  }
  const result = validatePortuguesePlate(plate);
  plateStatus.isValid = result.isValid;
  if (result.isValid) {
    plateStatus.class = 'bg-green-500/5 border-green-500/50';
    plateStatus.message = result.estimatedYear ? `✅ Válida • ~${result.estimatedYear}` : '✅ Válida';
    plateStatus.messageClass = 'text-green-400';
    if (result.estimatedYear) newVehicle.value.year = result.estimatedYear;
  } else {
    plateStatus.class = 'bg-red-500/5 border-red-500/50';
    plateStatus.message = `⚠️ ${result.errorMessage}`;
    plateStatus.messageClass = 'text-red-400';
  }
};

const handleAddVehicle = async () => {
  vehicleError.value = '';
  vehicleSubmitting.value = true;
  try {
    const mutation = `mutation AddVehicle($input: AddVehicleInput!) { addVehicle(input: $input) { vehicle { id } hasError error { message } } }`;
    const data = await graphql<{ addVehicle: any }>(mutation, { input: { licensePlate: newVehicle.value.license_plate, brand: newVehicle.value.brand, model: newVehicle.value.model, year: newVehicle.value.year, fuelType: newVehicle.value.fuel_type || null, sizeCategory: newVehicle.value.size_category } });
    if (data.addVehicle.hasError) { vehicleError.value = data.addVehicle.error?.message || 'Erro.'; return; }
    newVehicle.value = { license_plate: '', brand: '', model: '', year: null, fuel_type: '', size_category: 'C' };
    plateStatus.isValid = false;
    plateStatus.class = 'bg-white/5 border-white/10 focus:border-[#3B82F6]';
    plateStatus.message = '';
    showAddVehicleForm.value = false;
    await loadVehicles();
  } catch (error: any) { vehicleError.value = error.message; } 
  finally { vehicleSubmitting.value = false; }
};

const handleSetPrimary = async (vehicleId: string) => {
  try { await graphql(`mutation { setPrimaryVehicle(vehicleId: "${vehicleId}") { hasError } }`); await loadVehicles(); } catch (error) { console.error(error); }
};

const handleDeleteVehicle = async (vehicleId: string) => {
  if (!confirm('Remover?')) return;
  try { const data = await graphql<{ deleteVehicle: { success: boolean } }>(`mutation { deleteVehicle(vehicleId: "${vehicleId}") { success } }`); if (data.deleteVehicle.success) await loadVehicles(); } catch (error) { console.error(error); }
};

onMounted(() => {
  loadProfile();
  loadBookings();
  loadVehicles();
});
</script>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-10px); }
</style>