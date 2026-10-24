import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'leaflet/dist/leaflet.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import client, { getToken, setToken } from './api/client'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Expired or revoked admin token: drop it and send the user back to login
// instead of leaving the panel open with every request failing.
client.interceptors.response.use(undefined, (error) => {
  if (error.response?.status === 401 && getToken()) {
    setToken(null)
    useAuthStore().user = null
    const current = router.currentRoute.value
    if (current.meta.requiresAuth) {
      router.push({ name: 'admin-login', query: { redirect: current.fullPath, expired: '1' } })
    }
  }
  return Promise.reject(error)
})

app.mount('#app')
