import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import './assets/css/main.css'

// i18n (language support from DTube)
const i18n = createI18n({
  locale: navigator.language.split('-')[0] || 'en',
  fallbackLocale: 'en',
  messages: {},
  silentTranslationWarn: true,
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(i18n)
app.mount('#app')
