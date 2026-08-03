<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useEventsStore } from '../stores/events'
import { useSiteStore } from '../stores/site'
import Swal from 'sweetalert2'

const eventsStore = useEventsStore()
const siteStore = useSiteStore()
const router = useRouter()
const navScrolled = ref(false)
const mobileMenuOpen = ref(false)

function onScroll() {
  navScrolled.value = window.scrollY > 50
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

onMounted(async () => {
  siteStore.load()
  eventsStore.loadLiveNow()
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

/* SweetAlert2 for live events — once per session */
watch(
  () => eventsStore.liveEvent,
  (liveEvent) => {
    if (!liveEvent) return
    const key = `abt_live_shown_${liveEvent.id}`
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')

    Swal.fire({
      html: `
        <div style="text-align:center;">
          <div style="display:inline-flex;align-items:center;gap:0.5rem;margin-bottom:0.75rem;">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#ff6b35;animation:pulse 1.2s infinite;"></span>
            <span style="font-family:'JetBrains Mono',monospace;font-weight:700;font-size:0.8rem;letter-spacing:0.1em;color:#ff6b35;">EN VIVO AHORA</span>
          </div>
          <h2 style="font-family:'Fraunces',serif;color:#f2effa;font-size:1.5rem;margin:0.5rem 0;">${liveEvent.title}</h2>
          <p style="color:#9d97b3;font-size:0.9rem;margin:0;">¡No te lo pierdas! Haz clic para ver la transmisión.</p>
        </div>
      `,
      background: 'rgba(22, 19, 31, 0.95)',
      backdrop: 'rgba(10, 9, 18, 0.7)',
      showConfirmButton: true,
      confirmButtonText: '<i class="bi bi-play-circle me-2"></i> Ver transmisión',
      showCancelButton: true,
      cancelButtonText: 'Cerrar',
      customClass: {
        popup: 'abt-swal-popup',
        confirmButton: 'abt-swal-confirm',
        cancelButton: 'abt-swal-cancel',
      },
      buttonsStyling: false,
      timer: 12000,
      timerProgressBar: true,
    }).then((result) => {
      if (result.isConfirmed) {
        router.push({ name: 'event-detail', params: { slug: liveEvent.slug } })
      }
    })
  },
  { immediate: true },
)
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <!-- Glassmorphism Navbar -->
    <nav
      class="abt-navbar"
      :class="{ 'abt-navbar--scrolled': navScrolled }"
    >
      <div class="container d-flex align-items-center justify-content-between">
        <!-- Brand with logo -->
        <RouterLink class="abt-brand d-flex align-items-center text-decoration-none" :to="{ name: 'home' }" @click="closeMobileMenu">
          <img src="/logo-albatros.png" alt="Albatros" class="abt-brand-logo" />
        </RouterLink>

        <!-- Mobile toggle -->
        <button
          class="abt-mobile-toggle d-md-none"
          type="button"
          @click="toggleMobileMenu"
          :aria-expanded="mobileMenuOpen"
          aria-label="Toggle navigation"
        >
          <i class="bi" :class="mobileMenuOpen ? 'bi-x-lg' : 'bi-list'"></i>
        </button>

        <!-- Nav links + social -->
        <div class="abt-nav-collapse" :class="{ 'abt-nav-collapse--open': mobileMenuOpen }">
          <ul class="abt-nav-links">
            <li><RouterLink class="abt-nav-link" :to="{ name: 'home' }" @click="closeMobileMenu">Inicio</RouterLink></li>
            <li><RouterLink class="abt-nav-link" :to="{ name: 'events' }" @click="closeMobileMenu">Eventos</RouterLink></li>
            <li><RouterLink class="abt-nav-link" :to="{ name: 'catalog' }" @click="closeMobileMenu">Catálogo</RouterLink></li>
            <li>
              <RouterLink class="abt-btn-neon btn-sm d-inline-block" :to="{ name: 'quote-builder' }" @click="closeMobileMenu">
                Cotizar
              </RouterLink>
            </li>
          </ul>

          <!-- Social icons (dynamic from store) -->
          <div v-if="siteStore.socialLinks.length" class="abt-social-icons ms-md-4 mt-3 mt-md-0">
            <a
              v-for="link in siteStore.socialLinks"
              :key="link.label"
              :href="link.url"
              target="_blank"
              rel="noopener"
              :aria-label="link.label"
            >
              <i class="bi" :class="link.icon"></i>
            </a>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="flex-grow-1">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="abt-footer">
      <div class="container">
        <div class="row g-4">
          <!-- Brand & description -->
          <div class="col-lg-4">
            <div class="mb-3">
              <img src="/logo-albatros.png" alt="Albatros" style="height: 40px; width: auto;" />
            </div>
            <p class="abt-text-muted small mb-3">
              {{ siteStore.siteTagline }}
            </p>
            <div v-if="siteStore.socialLinks.length" class="abt-social-icons">
              <a
                v-for="link in siteStore.socialLinks"
                :key="link.label"
                :href="link.url"
                target="_blank"
                rel="noopener"
                :aria-label="link.label"
              >
                <i class="bi" :class="link.icon"></i>
              </a>
            </div>
          </div>

          <!-- Quick links -->
          <div class="col-sm-6 col-lg-2 offset-lg-2">
            <h5>Navegación</h5>
            <ul class="list-unstyled small d-flex flex-column gap-2">
              <li><RouterLink :to="{ name: 'home' }">Inicio</RouterLink></li>
              <li><RouterLink :to="{ name: 'events' }">Eventos</RouterLink></li>
              <li><RouterLink :to="{ name: 'catalog' }">Catálogo</RouterLink></li>
              <li><RouterLink :to="{ name: 'quote-builder' }">Cotizador</RouterLink></li>
            </ul>
          </div>

          <!-- Contact -->
          <div class="col-sm-6 col-lg-3 offset-lg-1">
            <h5>Contacto</h5>
            <ul class="list-unstyled small d-flex flex-column gap-2 abt-text-muted">
              <li v-if="siteStore.whatsappLink">
                <a
                  :href="siteStore.whatsappLink"
                  target="_blank"
                  rel="noopener"
                  class="d-flex align-items-center gap-2"
                >
                  <i class="bi bi-whatsapp" style="color: var(--abt-whatsapp);"></i>
                  WhatsApp
                </a>
              </li>
              <li v-if="siteStore.socialFacebook">
                <a :href="siteStore.socialFacebook" target="_blank" rel="noopener" class="d-flex align-items-center gap-2">
                  <i class="bi bi-facebook" style="color: #1877f2;"></i>
                  Facebook
                </a>
              </li>
              <li class="d-flex align-items-center gap-2">
                <i class="bi bi-geo-alt-fill" style="color: var(--abt-purple);"></i>
                Tlaxcala, México
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom bar -->
        <div class="abt-footer-bottom">
          <p class="abt-text-muted small mb-0">
            © {{ new Date().getFullYear() }} {{ siteStore.siteName }} — Sonido &amp; Eventos.
            Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>

    <!-- WhatsApp Floating Button -->
    <a
      v-if="siteStore.whatsappLink"
      :href="siteStore.whatsappLink"
      target="_blank"
      rel="noopener"
      class="abt-whatsapp-fab"
      aria-label="Contactar por WhatsApp"
    >
      <i class="bi bi-whatsapp"></i>
    </a>
  </div>
</template>
