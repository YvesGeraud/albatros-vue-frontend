<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await auth.logout()
  router.push({ name: 'admin-login' })
}
</script>

<template>
  <div class="d-flex min-vh-100" style="background: var(--abt-bg);">
    <aside class="d-flex flex-column p-3" style="width: 240px; background: var(--abt-bg-alt); border-right: 1px solid rgba(176,107,255,0.15);">
      <RouterLink :to="{ name: 'admin-dashboard' }" class="abt-display fw-bold text-decoration-none mb-4 fs-5" style="color: var(--abt-text);">
        Albatros <span class="abt-text-purple">Admin</span>
      </RouterLink>
      <nav class="nav flex-column gap-1">
        <RouterLink class="nav-link text-white-50" :to="{ name: 'admin-dashboard' }">Panel</RouterLink>
        <RouterLink class="nav-link text-white-50" :to="{ name: 'admin-categories' }">Categorías</RouterLink>
        <RouterLink class="nav-link text-white-50" :to="{ name: 'admin-products' }">Productos</RouterLink>
        <RouterLink class="nav-link text-white-50" :to="{ name: 'admin-combos' }">Combos</RouterLink>
        <RouterLink class="nav-link text-white-50" :to="{ name: 'admin-events' }">Eventos</RouterLink>
        <RouterLink class="nav-link text-white-50" :to="{ name: 'admin-quotes' }">Cotizaciones</RouterLink>
        <RouterLink class="nav-link text-white-50" :to="{ name: 'admin-testimonials' }">Testimonios</RouterLink>
        <RouterLink class="nav-link text-white-50" :to="{ name: 'admin-settings' }">Configuración</RouterLink>
      </nav>
      <button class="btn btn-outline-light btn-sm mt-auto" @click="handleLogout">
        Cerrar sesión
      </button>
    </aside>
    <main class="flex-grow-1 p-4">
      <RouterView />
    </main>
  </div>
</template>
