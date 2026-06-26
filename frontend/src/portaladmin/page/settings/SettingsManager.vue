<!-- src/portaladmin/page/settings/SettingsManager.vue -->
<template>
  <div class="backdrop-blur-[30px] p-8 flex flex-col h-full overflow-y-auto card-admin">
    
    <div class="flex items-center justify-between mb-8">
      <div>
        <h3 class="text-3xl font-bold text-[#000000]">Configurações</h3>
        <p class="text-[#334155] font-medium mt-1">Gerir definições do sistema</p>
      </div>
      <span class="text-xs bg-[#8B5CF6]/20 text-[#8B5CF6] px-3 py-1 rounded-full font-bold">Superadmin</span>
    </div>

    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <p class="text-[#64748B] font-medium">A carregar configurações...</p>
    </div>

    <div v-else class="space-y-6">

      <!-- ===== Empresa ===== -->
      <div class="bg-white/60 backdrop-blur-sm rounded-2xl border border-[#06B6D4]/20 p-6">
        <h3 class="font-bold text-[#000000] text-lg mb-4 flex items-center gap-2">
          <Building class="w-5 h-5 text-[#06B6D4]" /> Dados da Empresa
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-[#334155] mb-1">Nome da Empresa</label>
            <input v-model="companyName" type="text" class="w-full px-4 py-2 rounded-xl bg-white/80 border border-[#06B6D4]/30 text-[#000000] font-medium" />
          </div>
          <div>
            <label class="block text-sm font-bold text-[#334155] mb-1">Morada</label>
            <input v-model="companyAddress" type="text" class="w-full px-4 py-2 rounded-xl bg-white/80 border border-[#06B6D4]/30 text-[#000000] font-medium" />
          </div>
          <button 
            @click="saveSettings"
            :disabled="isSaving"
            class="px-4 py-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl font-bold text-sm disabled:opacity-50"
          >
            {{ isSaving ? 'A guardar...' : 'Guardar Dados' }}
          </button>
        </div>
      </div>

      <!-- Mensagem -->
      <div v-if="message" :class="['p-4 rounded-xl text-sm font-medium', messageType === 'success' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-500']">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Building } from 'lucide-vue-next';
import { graphql } from '@/graphql';

const isLoading = ref(true);
const isSaving = ref(false);
const message = ref('');
const messageType = ref<'success' | 'error'>('success');

const companyName = ref('LeiriaDetail');
const companyAddress = ref('Leiria, Portugal');

const fetchSettings = async () => {
  try {
    const query = `query { 
      settings { 
        settings { companyName companyAddress } 
      } 
    }`;
    const data = await graphql<{ settings: { settings: any } }>(query);
    if (data.settings?.settings) {
      companyName.value = data.settings.settings.companyName || 'LeiriaDetail';
      companyAddress.value = data.settings.settings.companyAddress || 'Leiria, Portugal';
    }
  } catch (error) {
    console.error('Erro ao carregar configurações:', error);
  } finally {
    isLoading.value = false;
  }
};

const saveSettings = async () => {
  isSaving.value = true;
  message.value = '';
  
  try {
    const mutation = `
      mutation UpdateSettings($input: SettingsInput!) {
        updateSettings(input: $input) { 
          settings { companyName companyAddress }
          message 
          hasError 
        }
      }
    `;
    const data = await graphql<{ updateSettings: any }>(mutation, {
      input: {
        companyName: companyName.value,
        companyAddress: companyAddress.value
      }
    });
    
    if (data.updateSettings?.hasError) {
      message.value = 'Erro ao guardar configurações.';
      messageType.value = 'error';
    } else {
      message.value = data.updateSettings?.message || 'Configurações guardadas com sucesso!';
      messageType.value = 'success';
    }
  } catch (error) {
    message.value = 'Erro ao guardar configurações.';
    messageType.value = 'error';
  } finally {
    isSaving.value = false;
    setTimeout(() => { message.value = ''; }, 3000);
  }
};

onMounted(fetchSettings);
</script>