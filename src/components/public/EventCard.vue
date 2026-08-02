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

/**
 * Try to find a cover image for the event from its media array.
 * Falls back to null (which renders the gradient placeholder).
 */
function coverImage(event) {
  if (!event.media?.length) return null
  const photo = event.media.find((m) => m.type === 'photo' && m.url)
  return photo?.url ?? null
}
</script>

<template>
  <RouterLink
    :to="{ name: 'event-detail', params: { slug: event.slug } }"
    class="abt-event-card"
  >
    <!-- Cover image or placeholder -->
    <img
      v-if="coverImage(event)"
      :src="coverImage(event)"
      :alt="event.title"
      class="abt-event-card-image"
      loading="lazy"
    />
    <div v-else class="abt-event-card-placeholder">
      <i class="bi bi-music-note-beamed"></i>
    </div>

    <!-- Card body -->
    <div class="abt-event-card-body">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <span class="abt-kicker abt-text-muted">{{ formattedDate(event.event_date) }}</span>
        <LiveBadge v-if="event.is_live" />
        <span v-else-if="event.status === 'upcoming'" class="abt-kicker abt-text-cyan">PRÓXIMO</span>
      </div>
      <h3 class="h5 abt-display mb-1" style="color: var(--abt-text);">{{ event.title }}</h3>
      <p class="abt-text-muted small mb-0">
        <i class="bi bi-geo-alt-fill me-1" style="color: var(--abt-purple);"></i>
        {{ event.venue_name }} · {{ event.address }}
      </p>
    </div>
  </RouterLink>
</template>
