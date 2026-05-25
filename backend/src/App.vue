<template>
  <div class="min-h-screen bg-background">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Cache } from '@/services/cachemanager'

onMounted(() => {
  // Verificar se existe sessão no Cache
  if (Cache.Session.value && Cache.UserId.value) {
    // Sessão existe, podemos fazer alguma validação adicional se necessário
    console.log('✅ Sessão ativa:', {
      session: Cache.Session.value,
      userId: Cache.UserId.value,
      userName: Cache.UserName.value
    })
  } else {
    console.log('⚠️ Nenhuma sessão ativa')
  }
})
</script>