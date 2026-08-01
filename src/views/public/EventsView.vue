<script setup>
import { onMounted, ref } from 'vue'
import EventCard from '../../components/public/EventCard.vue'
import EventsMap from '../../components/public/EventsMap.vue'
import { useEventsStore } from '../../stores/events'

const eventsStore = useEventsStore()
const filter = ref('all')

onMounted(() => {
  eventsStore.load()
})

function filteredEvents() {
  if (filter.value === 'all') return eventsStore.events
  if (filter.value === 'live') return eventsStore.events.filter((e) => e.is_live)
  return eventsStore.events.filter((e) => e.status === filter.value)
}
</script>

<template>
  <div class="container py-5">
    <h1 class="abt-display h2 mb-4">Eventos</h1>

    <EventsMap :events="eventsStore.events" class="mb-5" />

    <div class="d-flex gap-2 mb-4 flex-wrap">
      <button
        v-for="opt in [
          { key: 'all', label: 'Todos' },
          { key: 'live', label: 'En vivo' },
          { key: 'upcoming', label: 'Próximos' },
          { key: 'past', label: 'Pasados' },
        ]"
        :key="opt.key"
        class="btn btn-sm"
        :class="filter === opt.key ? 'abt-btn-neon' : 'btn-outline-light'"
        @click="filter = opt.key"
      >
        {{ opt.label }}
      </button>
    </div>

    <div class="row g-3">
      <div v-for="event in filteredEvents()" :key="event.id" class="col-md-4">
        <EventCard :event="event" />
      </div>
      <p v-if="!eventsStore.loading && filteredEvents().length === 0" class="abt-text-muted">
        No hay eventos en esta categoría.
      </p>
    </div>
  </div>
</template>
