<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import HeroDiscoBall from '../../components/public/HeroDiscoBall.vue'
import EventCard from '../../components/public/EventCard.vue'
import { useEventsStore } from '../../stores/events'

const eventsStore = useEventsStore()

onMounted(() => {
  eventsStore.load()
})
</script>

<template>
  <div>
    <HeroDiscoBall />

    <section class="container py-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="abt-display h3 mb-0">Eventos recientes</h2>
        <RouterLink :to="{ name: 'events' }" class="abt-mono small">Ver todos →</RouterLink>
      </div>
      <div class="row g-3">
        <div v-for="event in eventsStore.events.slice(0, 3)" :key="event.id" class="col-md-4">
          <EventCard :event="event" />
        </div>
        <p v-if="!eventsStore.loading && eventsStore.events.length === 0" class="abt-text-muted">
          Aún no hay eventos publicados.
        </p>
      </div>
    </section>

    <section class="container py-5 text-center">
      <div class="abt-surface p-5">
        <h2 class="abt-display h3 mb-3">¿Listo para tu evento?</h2>
        <p class="abt-text-muted mb-4">
          Arma tu paquete de sonido, iluminación, pista de baile y bailarines,
          y mira el total al instante.
        </p>
        <RouterLink :to="{ name: 'quote-builder' }" class="btn abt-btn-neon btn-lg">
          Ir al cotizador
        </RouterLink>
      </div>
    </section>
  </div>
</template>
