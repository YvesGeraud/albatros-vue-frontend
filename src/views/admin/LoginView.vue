<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref(null)
const loading = ref(false)

async function handleSubmit() {
  loading.value = true
  error.value = null
  try {
    await auth.login({ email: email.value, password: password.value })
    router.push(route.query.redirect || { name: 'admin-dashboard' })
  } catch {
    error.value = 'Credenciales inválidas.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="d-flex align-items-center justify-content-center min-vh-100" style="background: var(--abt-bg);">
    <form class="abt-surface p-4" style="width: 22rem;" @submit.prevent="handleSubmit">
      <h1 class="abt-display h4 mb-4 text-center">
        Albatros <span class="abt-text-purple">Admin</span>
      </h1>

      <div class="mb-3">
        <label class="form-label small">Correo</label>
        <input v-model="email" type="email" class="form-control" required autofocus />
      </div>
      <div class="mb-3">
        <label class="form-label small">Contraseña</label>
        <input v-model="password" type="password" class="form-control" required />
      </div>

      <p v-if="error" class="text-danger small">{{ error }}</p>

      <button type="submit" class="btn abt-btn-neon w-100" :disabled="loading">
        {{ loading ? 'Entrando...' : 'Entrar' }}
      </button>
    </form>
  </div>
</template>
