<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useEventsStore } from '../../stores/events'
import EventsMap from '../../components/public/EventsMap.vue'
import YouTubeEmbed from '../../components/public/YouTubeEmbed.vue'
import FacebookEmbed from '../../components/public/FacebookEmbed.vue'
import PhotoEmbed from '../../components/public/PhotoEmbed.vue'
import LiveBadge from '../../components/public/LiveBadge.vue'

const route = useRoute()
const eventsStore = useEventsStore()
const event = ref(null)
const loading = ref(true)

const dateFormatter = new Intl.DateTimeFormat('es-MX', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

async function load() {
  loading.value = true
  event.value = await eventsStore.fetchOne(route.params.slug)
  loading.value = false
}

onMounted(load)
watch(() => route.params.slug, load)
</script>

<template>
  <div class="container py-5" v-if="event">
    <div class="d-flex align-items-center gap-3 mb-2">
      <span class="abt-mono small abt-text-muted">
        {{ dateFormatter.format(new Date(event.event_date)) }}
      </span>
      <LiveBadge v-if="event.is_live" />
    </div>
    <h1 class="abt-display h2 mb-2">{{ event.title }}</h1>
    <p class="abt-text-muted mb-4">{{ event.venue_name }} · {{ event.address }}</p>
    <p class="mb-5">{{ event.description }}</p>

    <div v-if="event.media?.length" class="row g-4 mb-5">
      <div v-for="media in event.media" :key="media.id" class="col-md-6">
        <YouTubeEmbed
          v-if="media.type === 'youtube_video' || media.type === 'youtube_live'"
          :video-id="media.external_id"
          :title="media.caption || event.title"
        />
        <FacebookEmbed v-else-if="media.type === 'facebook_post'" :url="media.url" />
        <PhotoEmbed v-else-if="media.type === 'photo'" :url="media.url" :caption="media.caption" />
        <p v-if="media.caption" class="small abt-text-muted mt-2">{{ media.caption }}</p>
      </div>
    </div>

    <h2 class="abt-display h4 mb-3">Ubicación</h2>
    <EventsMap :events="[event]" />
  </div>
  <div v-else-if="!loading" class="container py-5">
    <p class="abt-text-muted">Evento no encontrado.</p>
  </div>
</template>
