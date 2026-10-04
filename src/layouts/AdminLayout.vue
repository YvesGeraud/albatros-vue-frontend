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
    <aside class="d-flex flex-column p-3 abt-admin-sidebar" style="width: 260px; background: #0e0c18; border-right: 1px solid rgba(176,107,255,0.18);">
      <div class="d-flex align-items-center justify-content-between mb-4">
        <RouterLink :to="{ name: 'admin-dashboard' }" class="abt-display fw-bold text-decoration-none fs-5 d-flex align-items-center gap-2" style="color: var(--abt-text);">
          <img src="/logo-albatros.png" alt="Logo" style="height: 28px; width: auto;" />
          <span>Albatros <span class="abt-text-purple">Admin</span></span>
        </RouterLink>
      </div>

      <div class="mb-3">
        <a href="/" target="_blank" class="btn btn-sm btn-outline-info w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 py-1 text-decoration-none" style="font-size: 0.8rem;">
          <i class="bi bi-box-arrow-up-right"></i>
          <span>Ver Sitio Público</span>
        </a>
      </div>

      <div class="abt-nav-group-title text-uppercase px-2 mb-2" style="font-size: 0.68rem; letter-spacing: 1.5px; color: #8e8a9f; font-weight: 700;">
        Página Principal (CMS)
      </div>

      <nav class="nav flex-column gap-1 mb-4">
        <RouterLink class="nav-link abt-admin-link d-flex align-items-center gap-2 rounded px-3 py-2" :to="{ name: 'admin-settings' }">
          <i class="bi bi-palette2 text-warning"></i>
          <span class="fw-semibold">Editor de Secciones</span>
        </RouterLink>
      </nav>

      <div class="abt-nav-group-title text-uppercase px-2 mb-2" style="font-size: 0.68rem; letter-spacing: 1.5px; color: #8e8a9f; font-weight: 700;">
        Gestión Comercial
      </div>

      <nav class="nav flex-column gap-1 mb-4">
        <RouterLink class="nav-link abt-admin-link d-flex align-items-center gap-2 rounded px-3 py-2 text-white-50" :to="{ name: 'admin-dashboard' }">
          <i class="bi bi-speedometer2"></i>
          <span>Resumen</span>
        </RouterLink>
        <RouterLink class="nav-link abt-admin-link d-flex align-items-center gap-2 rounded px-3 py-2 text-white-50" :to="{ name: 'admin-quotes' }">
          <i class="bi bi-file-earmark-text"></i>
          <span>Cotizaciones</span>
        </RouterLink>
        <RouterLink class="nav-link abt-admin-link d-flex align-items-center gap-2 rounded px-3 py-2 text-white-50" :to="{ name: 'admin-products' }">
          <i class="bi bi-box-seam"></i>
          <span>Productos</span>
        </RouterLink>
        <RouterLink class="nav-link abt-admin-link d-flex align-items-center gap-2 rounded px-3 py-2 text-white-50" :to="{ name: 'admin-categories' }">
          <i class="bi bi-tags"></i>
          <span>Categorías</span>
        </RouterLink>
        <RouterLink class="nav-link abt-admin-link d-flex align-items-center gap-2 rounded px-3 py-2 text-white-50" :to="{ name: 'admin-combos' }">
          <i class="bi bi-gift"></i>
          <span>Combos / BD</span>
        </RouterLink>
        <RouterLink class="nav-link abt-admin-link d-flex align-items-center gap-2 rounded px-3 py-2 text-white-50" :to="{ name: 'admin-events' }">
          <i class="bi bi-calendar-event"></i>
          <span>Historial Eventos</span>
        </RouterLink>
        <RouterLink class="nav-link abt-admin-link d-flex align-items-center gap-2 rounded px-3 py-2 text-white-50" :to="{ name: 'admin-testimonials' }">
          <i class="bi bi-chat-quote"></i>
          <span>Reseñas BD</span>
        </RouterLink>
      </nav>

      <div class="mt-auto pt-3 border-top border-secondary border-opacity-25">
        <div class="small text-white-50 mb-2 px-2 text-truncate">
          {{ auth.user?.name || auth.user?.email || 'Administrador' }}
        </div>
        <button class="btn btn-outline-danger btn-sm w-100 rounded-pill d-flex align-items-center justify-content-center gap-2" @click="handleLogout">
          <i class="bi bi-box-arrow-left"></i>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
    <main class="flex-grow-1 p-4" style="overflow-y: auto; max-height: 100vh;">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.abt-admin-link {
  color: #c4c1d4;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.abt-admin-link:hover {
  background: rgba(176, 107, 255, 0.12);
  color: #ffffff;
}

.abt-admin-link.router-link-exact-active,
.abt-admin-link.router-link-active {
  background: rgba(176, 107, 255, 0.22);
  color: #22d3ee;
  border-left: 3px solid #b06bff;
}
</style>
