<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useEventsStore } from '../stores/events'

const eventsStore = useEventsStore()
onMounted(() => {
  eventsStore.loadLiveNow()
})
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <nav class="navbar navbar-expand-md navbar-dark border-bottom" style="background: var(--abt-bg-alt); border-color: rgba(176,107,255,0.15) !important;">
      <div class="container">
        <RouterLink class="navbar-brand abt-display fw-bold" :to="{ name: 'home' }">
          Albatros <span class="abt-text-purple">Tlaxcala</span>
        </RouterLink>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#abtNavbar"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="abtNavbar">
          <ul class="navbar-nav ms-auto align-items-md-center gap-md-2">
            <li class="nav-item">
              <RouterLink class="nav-link" :to="{ name: 'events' }">Eventos</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" :to="{ name: 'catalog' }">Catálogo</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="btn abt-btn-neon btn-sm ms-md-2" :to="{ name: 'quote-builder' }">
                Cotizar
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <RouterLink
      v-if="eventsStore.liveEvent"
      :to="{ name: 'event-detail', params: { slug: eventsStore.liveEvent.slug } }"
      class="text-decoration-none"
    >
      <div class="text-center py-2 abt-mono small" style="background: var(--abt-orange); color: #1a0700;">
        🔴 EN VIVO AHORA — {{ eventsStore.liveEvent.title }} · ver transmisión
      </div>
    </RouterLink>

    <main class="flex-grow-1">
      <RouterView />
    </main>

    <footer class="border-top py-4 mt-5" style="background: var(--abt-bg-alt); border-color: rgba(176,107,255,0.15) !important;">
      <div class="container text-center abt-text-muted small">
        © {{ new Date().getFullYear() }} Albatros Tlaxcala — Sonido &amp; eventos
      </div>
    </footer>
  </div>
</template>
