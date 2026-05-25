<template>
  <RouterView />
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