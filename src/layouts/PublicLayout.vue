<script setup>
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useEventsStore } from '../stores/events'
import { useSiteStore } from '../stores/site'
import GooeyNav from '../components/public/GooeyNav.vue'
import LiveToastNotification from '../components/public/LiveToastNotification.vue'

const eventsStore = useEventsStore()
const siteStore = useSiteStore()
const navScrolled = ref(false)
const mobileOpen = ref(false)
const route = useRoute()
const router = useRouter()

function toggleMobile() {
  mobileOpen.value = !mobileOpen.value
}

function onMobileLinkClick(e, item) {
  e.preventDefault()
  mobileOpen.value = false
  if (route.name !== 'home') {
    router.push({ name: 'home', hash: item.href })
    return
  }
  const target = document.querySelector(item.href)
  if (target) {
    const top = target.getBoundingClientRect().top + window.scrollY - 70
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  }
}

function onKeydown(e) {
  if (e.key === 'Escape') mobileOpen.value = false
}

function onResize() {
  if (window.innerWidth >= 992) mobileOpen.value = false
}

watch(() => route.fullPath, () => { mobileOpen.value = false })

const navItems = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Conócenos', href: '#conocenos' },
  { label: 'Trayectoria', href: '#trayectoria' },
  { label: 'Fotos', href: '#fotos' },
  { label: 'Videos', href: '#videos' },
  /*{ label: 'Servicios Producción Audiovisual', href: '#servicios' },*/
  { label: 'Paquetes para Eventos', href: '#paquetes' },
  { label: 'Testimonios', href: '#testimonios' },
]

function onScroll() {
  navScrolled.value = window.scrollY > 50
}

onMounted(async () => {
  siteStore.load()
  eventsStore.loadLiveNow()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('resize', onResize, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <!-- Glassmorphism Navbar -->
    <nav
      class="abt-navbar"
      :class="{ 'abt-navbar--scrolled': navScrolled || mobileOpen, 'abt-navbar--open': mobileOpen }"
    >
      <div class="container">
        <div class="abt-navbar-wrapper">
          <!-- Logo (left) -->
          <RouterLink class="abt-brand text-decoration-none" :to="{ name: 'home' }">
            <img src="/logo-albatros.jpeg" alt="Albatros" class="abt-brand-logo" />
          </RouterLink>

          <!-- Gooey Nav (centered, desktop only) -->
          <div class="abt-nav-center">
            <GooeyNav :items="navItems" />
          </div>

          <!-- Hamburger (mobile only) -->
          <button
            id="abt-nav-toggle"
            type="button"
            class="abt-nav-toggle"
            :class="{ 'is-open': mobileOpen }"
            :aria-expanded="mobileOpen"
            aria-controls="abt-mobile-menu"
            aria-label="Abrir menú"
            @click="toggleMobile"
          >
            <span></span><span></span><span></span>
          </button>

          <!-- Social icons (right, desktop only) -->
          <div v-if="siteStore.socialLinks.length" class="abt-social-icons abt-nav-social">
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

        <!-- Mobile collapsible menu -->
        <div
          id="abt-mobile-menu"
          class="abt-mobile-menu"
          :class="{ 'is-open': mobileOpen }"
          :aria-hidden="!mobileOpen"
        >
          <div class="abt-mobile-menu-inner">
            <ul class="abt-mobile-links">
              <li
                v-for="(item, i) in navItems"
                :key="item.label"
                :style="{ '--i': i }"
              >
                <a
                  :href="item.href"
                  :tabindex="mobileOpen ? 0 : -1"
                  @click="onMobileLinkClick($event, item)"
                >
                  {{ item.label }}
                  <i class="bi bi-chevron-right"></i>
                </a>
              </li>
            </ul>
            <div v-if="siteStore.socialLinks.length" class="abt-social-icons abt-mobile-social">
              <a
                v-for="link in siteStore.socialLinks"
                :key="link.label"
                :href="link.url"
                target="_blank"
                rel="noopener"
                :aria-label="link.label"
                :tabindex="mobileOpen ? 0 : -1"
              >
                <i class="bi" :class="link.icon"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Backdrop for mobile menu -->
    <div class="abt-mobile-backdrop" :class="{ 'is-open': mobileOpen }" @click="mobileOpen = false"></div>

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
              <img src="/logo-albatros.jpeg" alt="Albatros" style="height: 40px; width: auto;" />
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

    <!-- Live Event Non-Intrusive Floating Toast -->
    <LiveToastNotification />

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
