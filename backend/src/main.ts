import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'  // Esta linha deve existir

createApp(App)
  .use(router)
  .mount('#app')