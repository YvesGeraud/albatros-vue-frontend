<script setup>
import { RouterLink } from 'vue-router'
import LiveBadge from './LiveBadge.vue'

defineProps({
  event: { type: Object, required: true },
})

const dateFormatter = new Intl.DateTimeFormat('es-MX', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

function formattedDate(iso) {
  return dateFormatter.format(new Date(iso))
}
</script>

<template>
  <RouterLink
    :to="{ name: 'event-detail', params: { slug: event.slug } }"
    class="abt-surface abt-card-accent d-block p-3 h-100 text-decoration-none"
  >
    <div class="d-flex justify-content-between align-items-start mb-2">
      <span class="abt-kicker abt-text-muted">{{ formattedDate(event.event_date) }}</span>
      <LiveBadge v-if="event.is_live" />
      <span v-else-if="event.status === 'upcoming'" class="abt-kicker abt-text-cyan">PRÓXIMO</span>
    </div>
    <h3 class="h5 abt-display mb-1" style="color: var(--abt-text);">{{ event.title }}</h3>
    <p class="abt-text-muted small mb-0">{{ event.venue_name }} · {{ event.address }}</p>
  </RouterLink>
</template>
