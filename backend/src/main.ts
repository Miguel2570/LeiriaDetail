// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Importar CSS do Tailwind (se estiver usando)
import './style.css'

const app = createApp(App)

app.use(router)
app.mount('#app')