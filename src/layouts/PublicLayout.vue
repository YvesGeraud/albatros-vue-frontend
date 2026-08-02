<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, onUnmounted, ref } from 'vue'
import { useEventsStore } from '../stores/events'

const eventsStore = useEventsStore()
const navScrolled = ref(false)
const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || ''

function onScroll() {
  navScrolled.value = window.scrollY > 50
}

onMounted(() => {
  eventsStore.loadLiveNow()
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <!-- Live banner (above navbar when there's a live event) -->
    <RouterLink
      v-if="eventsStore.liveEvent"
      :to="{ name: 'event-detail', params: { slug: eventsStore.liveEvent.slug } }"
      class="abt-live-banner text-decoration-none"
    >
      🔴 EN VIVO AHORA — {{ eventsStore.liveEvent.title }} · ver transmisión →
    </RouterLink>

    <!-- Glassmorphism Navbar -->
    <nav
      class="abt-navbar"
      :class="{ 'abt-navbar--scrolled': navScrolled }"
      :style="eventsStore.liveEvent ? 'top: 42px;' : ''"
    >
      <div class="container d-flex align-items-center justify-content-between">
        <!-- Brand -->
        <RouterLink class="navbar-brand abt-display fw-bold fs-4 text-decoration-none" :to="{ name: 'home' }" style="color: var(--abt-text);">
          Albatros <span class="abt-text-purple">Tlaxcala</span>
        </RouterLink>

        <!-- Mobile toggle -->
        <button
          class="navbar-toggler d-md-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#abtNavbar"
          aria-label="Toggle navigation"
          style="border: 1px solid rgba(255,255,255,0.15); padding: 0.4rem 0.6rem;"
        >
          <i class="bi bi-list" style="color: var(--abt-text); font-size: 1.4rem;"></i>
        </button>

        <!-- Nav links + social -->
        <div class="collapse navbar-collapse" id="abtNavbar">
          <ul class="navbar-nav ms-auto align-items-md-center gap-md-1 mt-3 mt-md-0">
            <li class="nav-item">
              <RouterLink class="nav-link" :to="{ name: 'home' }">Inicio</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" :to="{ name: 'events' }">Eventos</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" :to="{ name: 'catalog' }">Catálogo</RouterLink>
            </li>
            <li class="nav-item ms-md-1">
              <RouterLink class="abt-btn-neon btn-sm d-inline-block" :to="{ name: 'quote-builder' }">
                Cotizar
              </RouterLink>
            </li>
          </ul>

          <!-- Social icons -->
          <div class="abt-social-icons ms-md-4 mt-3 mt-md-0">
            <a href="https://www.facebook.com/albatrostlaxcala" target="_blank" rel="noopener" aria-label="Facebook">
              <i class="bi bi-facebook"></i>
            </a>
            <a href="https://www.youtube.com/@grupoalbatros" target="_blank" rel="noopener" aria-label="YouTube">
              <i class="bi bi-youtube"></i>
            </a>
            <!--
            <a href="#" target="_blank" rel="noopener" aria-label="Instagram">
              <i class="bi bi-instagram"></i>
            </a>
            <a href="#" target="_blank" rel="noopener" aria-label="TikTok">
              <i class="bi bi-tiktok"></i>
            </a>
            -->
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
            <h5 class="abt-display">
              Albatros <span class="abt-text-purple">Tlaxcala</span>
            </h5>
            <p class="abt-text-muted small mb-3">
              Sonido, iluminación, pista de baile y bailarines para eventos
              inolvidables en Tlaxcala y alrededores.
            </p>
            <div class="abt-social-icons">
              <a href="https://www.facebook.com/albatrostlaxcala" target="_blank" rel="noopener" aria-label="Facebook">
                <i class="bi bi-facebook"></i>
              </a>
              <a href="https://www.youtube.com/@grupoalbatros" target="_blank" rel="noopener" aria-label="YouTube">
                <i class="bi bi-youtube"></i>
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
              <li v-if="whatsappNumber">
                <a
                  :href="`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('¡Hola! Me interesa cotizar un evento.')}`"
                  target="_blank"
                  rel="noopener"
                  class="d-flex align-items-center gap-2"
                >
                  <i class="bi bi-whatsapp" style="color: var(--abt-whatsapp);"></i>
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/albatrostlaxcala" target="_blank" rel="noopener" class="d-flex align-items-center gap-2">
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
            © {{ new Date().getFullYear() }} Albatros Tlaxcala — Sonido &amp; Eventos.
            Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>

    <!-- WhatsApp Floating Button -->
    <a
      v-if="whatsappNumber"
      :href="`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('¡Hola! Me interesa cotizar un evento con Albatros.')}`"
      target="_blank"
      rel="noopener"
      class="abt-whatsapp-fab"
      aria-label="Contactar por WhatsApp"
    >
      <i class="bi bi-whatsapp"></i>
    </a>
  </div>
</template>
