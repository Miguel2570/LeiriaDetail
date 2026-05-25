<template>
  <div class="min-h-screen bg-background">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from './composables/useAuth'

const { checkAuth } = useAuth()

// Verificar autenticação ao iniciar o app
onMounted(() => {
  checkAuth()
})
</script>