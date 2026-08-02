<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import YouTubeEmbed from './YouTubeEmbed.vue'
import LiveBadge from './LiveBadge.vue'

const props = defineProps({
  event: { type: Object, required: true },
})

const video = computed(() =>
  props.event.media?.find((m) => m.type === 'youtube_video' || m.type === 'youtube_live')
)
</script>

<template>
  <section v-if="video" class="container py-5">
    <div class="row g-4 align-items-center">
      <div class="col-lg-7">
        <YouTubeEmbed :video-id="video.external_id" :title="event.title" />
      </div>
      <div class="col-lg-5">
        <LiveBadge v-if="event.is_live" class="mb-3" />
        <span v-else class="abt-kicker abt-text-cyan d-block mb-3">ÚLTIMO EVENTO</span>
        <h2 class="abt-display h3 mb-2">{{ event.title }}</h2>
        <p class="abt-text-muted mb-4">{{ event.venue_name }} · {{ event.address }}</p>
        <RouterLink :to="{ name: 'event-detail', params: { slug: event.slug } }" class="btn abt-btn-neon">
          Ver evento
        </RouterLink>
      </div>
    </div>
  </section>
</template>
