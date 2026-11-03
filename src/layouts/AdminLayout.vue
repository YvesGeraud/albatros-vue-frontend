<script setup>
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useIdleLogout } from '../composables/useIdleLogout'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const sections = [
  { tab: 'live', label: '0. En Vivo', icon: 'bi bi-broadcast' },
  { tab: 'hero', label: '1. Hero / Video', icon: 'bi bi-film' },
  { tab: 'conocenos', label: '2. Conócenos', icon: 'bi bi-stars' },
  { tab: 'trayectoria', label: '3. Trayectoria', icon: 'bi bi-clock-history' },
  { tab: 'photos', label: '4. Galerí­a Fotos', icon: 'bi bi-images' },
  { tab: 'videos', label: '5. Galerí­a Videos', icon: 'bi bi-youtube' },
  { tab: 'services', label: '6. Servicios', icon: 'bi bi-sliders' },
  { tab: 'event_packages', label: '7. Paquetes', icon: 'bi bi-box-seam' },
  { tab: 'testimonials', label: '8. Testimonios', icon: 'bi bi-chat-heart' },
  { tab: 'contact', label: '9. Redes & WhatsApp', icon: 'bi bi-whatsapp' },
]

function isActive(tab) {
  return route.name === 'admin-settings' && (route.query.tab || 'live') === tab
}

useIdleLogout()

async function handleLogout() {
  await auth.logout()
  router.push({ name: 'admin-login' })
}
</script>

<template>
  <div class="d-flex min-vh-100" style="background: var(--abt-bg);">
    <aside class="d-flex flex-column p-3 abt-admin-sidebar" style="width: 260px; background: #0e0c18; border-right: 1px solid rgba(176,107,255,0.18);">
      <div class="d-flex align-items-center justify-content-between mb-4">
        <RouterLink :to="{ name: 'admin-settings' }" class="abt-display fw-bold text-decoration-none fs-5 d-flex align-items-center gap-2" style="color: var(--abt-text);">
          <img src="/logo-albatros.jpeg" alt="Logo" style="height: 28px; width: auto;" />
          <span>Albatros <span class="abt-text-purple">Admin</span></span>
        </RouterLink>
      </div>

      <div class="mb-3">
        <a href="/" target="_blank" class="btn btn-sm btn-outline-info w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 py-1 text-decoration-none" style="font-size: 0.8rem;">
          <i class="bi bi-box-arrow-up-right"></i>
          <span>Ver Sitio PÃºblico</span>
        </a>
      </div>

      <div class="abt-nav-group-title text-uppercase px-2 mb-2" style="font-size: 0.68rem; letter-spacing: 1.5px; color: #8e8a9f; font-weight: 700;">
        PÃ¡gina Principal (CMS)
      </div>


      <nav class="nav flex-column gap-1 mb-4">
        <RouterLink v-for="s in sections" :key="s.tab" class="nav-link abt-admin-link d-flex align-items-center gap-2 rounded px-3 py-2" :class="{ 'router-link-exact-active': isActive(s.tab) }" :to="{ name: 'admin-settings', query: { tab: s.tab } }">
          <i :class="s.icon"></i>
          <span>{{ s.label }}</span>
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

.abt-admin-link.router-link-exact-active {
  background: rgba(176, 107, 255, 0.22);
  color: #22d3ee;
  border-left: 3px solid #b06bff;
}
</style>
