<template>
  <div class="backdrop-blur-[30px] p-8 flex flex-col h-full overflow-y-auto card-admin">
    <div class="mb-8">
      <h3 class="text-3xl font-bold text-[#000000]">My Profile</h3>
      <p class="text-[#334155] font-medium mt-1">Manage your account settings</p>
    </div>

    <div v-if="isLoading" class="flex-1 flex items-center justify-center text-[#64748B] font-medium">A carregar perfil...</div>

    <div v-else-if="profile" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Avatar Card -->
      <div class="p-6 border border-black/10 rounded-2xl backdrop-blur-sm card-inner flex flex-col items-center text-center">
        <div class="relative group cursor-pointer mb-4" @click="triggerUpload">
          <div class="w-24 h-24 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center text-white text-4xl font-bold shadow-lg overflow-hidden">
            <img v-if="avatarUrl" :src="avatarUrl" class="w-full h-full object-cover" />
            <span v-else>{{ avatar }}</span>
          </div>
          <!-- ✅ Loading overlay -->
          <div v-if="isUploading" class="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
          <div v-else class="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera class="w-5 h-5 text-white" />
          </div>
          <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileUpload" />
        </div>
        <!-- ✅ Feedback de upload -->
        <p v-if="uploadMessage" :class="['text-xs mb-2', uploadSuccess ? 'text-green-400' : 'text-red-400']">{{ uploadMessage }}</p>
        <h4 class="font-bold text-xl text-[#000000]">{{ profile.firstName }} {{ profile.lastName }}</h4>
        <p class="text-[#64748B] text-sm font-medium mt-1">{{ profile.email }}</p>
        <span class="mt-3 px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#E0F2FE] text-[#0284C7]">Staff</span>
      </div>

      <!-- Info + Password -->
      <div class="lg:col-span-2 space-y-6">
        <div class="p-6 border border-black/10 rounded-2xl backdrop-blur-sm card-inner">
          <h4 class="font-bold text-[#000000] text-lg mb-4">Personal Information</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label class="block text-xs font-bold text-[#64748B] mb-1">First Name</label><p class="text-[#000000] font-bold">{{ profile.firstName || '-' }}</p></div>
            <div><label class="block text-xs font-bold text-[#64748B] mb-1">Last Name</label><p class="text-[#000000] font-bold">{{ profile.lastName || '-' }}</p></div>
            <div><label class="block text-xs font-bold text-[#64748B] mb-1">Email</label><p class="text-[#000000] font-bold">{{ profile.email }}</p></div>
            <div><label class="block text-xs font-bold text-[#64748B] mb-1">Phone</label><p class="text-[#000000] font-bold">{{ profile.phone || '-' }}</p></div>
            <div><label class="block text-xs font-bold text-[#64748B] mb-1">Member since</label><p class="text-[#000000] font-bold">{{ formatDate(profile.createdAt) }}</p></div>
          </div>
        </div>

        <div class="p-6 border border-black/10 rounded-2xl backdrop-blur-sm card-inner">
          <h4 class="font-bold text-[#000000] text-lg mb-4">Change Password</h4>
          <div v-if="passwordMessage" :class="['mb-4 p-3 rounded-xl text-sm font-medium', passwordError ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400']">{{ passwordMessage }}</div>
          <form @submit.prevent="handleChangePassword" class="space-y-4">
            <div><label class="block text-sm font-bold text-[#334155] mb-1">Current Password</label><input required type="password" v-model="passwordForm.current" class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" /></div>
            <div><label class="block text-sm font-bold text-[#334155] mb-1">New Password</label><input required type="password" v-model="passwordForm.newPass" class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" /></div>
            <div><label class="block text-sm font-bold text-[#334155] mb-1">Confirm New Password</label><input required type="password" v-model="passwordForm.confirm" class="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#06B6D4]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 text-[#000000] font-medium" /></div>
            <button type="submit" :disabled="isSubmitting" class="px-6 py-3 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50">{{ isSubmitting ? 'A atualizar...' : 'Update Password' }}</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Camera } from 'lucide-vue-next'
import { graphql } from '@/graphql'
import { Cache } from '@/services/cachemanager'

interface Profile {
  id: number; firstName: string; lastName: string; email: string; phone: string; avatarUrl?: string; isVerified: boolean; createdAt: string; updatedAt: string
}

const profile = ref<Profile | null>(null)
const isLoading = ref(true)
const isSubmitting = ref(false)
const isUploading = ref(false)
const uploadMessage = ref('')
const uploadSuccess = ref(false)
const passwordMessage = ref('')
const passwordError = ref(false)
const passwordForm = ref({ current: '', newPass: '', confirm: '' })
const fileInput = ref<HTMLInputElement | null>(null)
const avatarUrl = ref('')

const avatar = computed(() => {
  if (!profile.value) return '?'
  const parts = `${profile.value.firstName} ${profile.value.lastName}`.trim().split(' ')
  return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : (parts[0]?.[0] || '?').toUpperCase()
})

const formatDate = (date: string) => date ? new Date(date).toLocaleDateString('pt-PT', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'

const triggerUpload = () => fileInput.value?.click()

const handleFileUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  
  isUploading.value = true
  uploadMessage.value = ''

  const reader = new FileReader()
  reader.onload = async (e) => {
    const img = new Image()
    img.onload = async () => {
      const canvas = document.createElement('canvas')
      const size = Math.min(img.width, img.height, 150)
      canvas.width = size; canvas.height = size
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0, size, size)
      const base64 = canvas.toDataURL('image/jpeg', 0.3)
      
      try {
        const response = await fetch('/Profile/Avatar', {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Session-Key': Cache.Session?.value || ''  // ✅ Corrigido
          },
          body: JSON.stringify({ avatarUrl: base64 })
        })
        
        const data = await response.json()
        if (!data.HasError) {
          avatarUrl.value = base64
          uploadMessage.value = 'Foto atualizada!'
          uploadSuccess.value = true
        } else {
          uploadMessage.value = 'Erro ao guardar foto.'
          uploadSuccess.value = false
        }
      } catch (error) {
        uploadMessage.value = 'Erro ao guardar foto.'
        uploadSuccess.value = false
      }
      
      isUploading.value = false
      setTimeout(() => { uploadMessage.value = '' }, 3000)
    }
    img.src = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const fetchProfile = async () => {
  try {
    const query = `query { profile { profile { id firstName lastName email phone avatarUrl isVerified createdAt } } }`
    const data = await graphql<{ profile: { profile: Profile } }>(query)
    if (data.profile?.profile) {
      profile.value = data.profile.profile
      avatarUrl.value = data.profile.profile.avatarUrl || ''
    }
  } catch (error) { console.error('Erro ao carregar perfil:', error) }
  finally { isLoading.value = false }
}

const handleChangePassword = async () => {
  if (passwordForm.value.newPass !== passwordForm.value.confirm) { passwordMessage.value = 'As passwords não coincidem.'; passwordError.value = true; return }
  if (passwordForm.value.newPass.length < 6) { passwordMessage.value = 'A password deve ter pelo menos 6 caracteres.'; passwordError.value = true; return }
  isSubmitting.value = true; passwordMessage.value = ''
  try {
    const mutation = `mutation ChangePassword($input: ChangePasswordInput!) { changeProfilePassword(input: $input) { message hasError } }`
    const data = await graphql<{ changeProfilePassword: any }>(mutation, { input: { currentPassword: passwordForm.value.current, newPassword: passwordForm.value.newPass } })
    if (data.changeProfilePassword?.hasError) {
      passwordMessage.value = data.changeProfilePassword.message || 'Erro ao alterar password.'; passwordError.value = true
    } else {
      passwordMessage.value = 'Password alterada com sucesso!'; passwordError.value = false
      passwordForm.value = { current: '', newPass: '', confirm: '' }
    }
  } catch (error) { passwordMessage.value = 'Erro de conexão.'; passwordError.value = true }
  finally { isSubmitting.value = false }
}

onMounted(() => { fetchProfile() })
</script>