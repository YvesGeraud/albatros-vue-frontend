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
  <section v-if="video" class="abt-section" style="background: linear-gradient(180deg, transparent, rgba(176, 107, 255, 0.04), transparent);">
    <div class="container">
      <div class="row g-5 align-items-center">
        <div class="col-lg-7">
          <div class="abt-surface-glass p-2" style="border-radius: 1.25rem;">
            <YouTubeEmbed :video-id="video.external_id" :title="event.title" />
          </div>
        </div>
        <div class="col-lg-5">
          <LiveBadge v-if="event.is_live" class="mb-3" />
          <span v-else class="abt-kicker abt-text-cyan d-block mb-3">ÚLTIMO EVENTO</span>
          <h2 class="abt-display h3 mb-2">{{ event.title }}</h2>
          <p class="abt-text-muted mb-4">
            <i class="bi bi-geo-alt-fill me-1" style="color: var(--abt-purple);"></i>
            {{ event.venue_name }} · {{ event.address }}
          </p>
          <RouterLink
            :to="{ name: 'event-detail', params: { slug: event.slug } }"
            class="abt-btn-neon"
          >
            Ver evento completo
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
