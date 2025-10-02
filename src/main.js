import './assets/styles/tailwind.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import http from './services/http'
import { provideHttpSymbol } from './composables/useHttp'

const app = createApp(App)

app.use(router)

provideHttpSymbol(app, http)

app.mount('#app')
