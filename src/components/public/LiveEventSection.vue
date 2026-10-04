<script setup>
import { computed } from 'vue'
import { useEventsStore } from '../../stores/events'
import { useSiteStore } from '../../stores/site'
import YouTubeEmbed from './YouTubeEmbed.vue'
import EventsMap from './EventsMap.vue'

const eventsStore = useEventsStore()
const siteStore = useSiteStore()

const liveEvent = computed(() => {
  if (eventsStore.liveEvent) return eventsStore.liveEvent
  if (siteStore.liveStreamActive) {
    return {
      id: 'cms-live',
      title: siteStore.liveStreamTitle || 'Evento En Vivo',
      venue_name: siteStore.liveStreamVenue || 'Tlaxcala',
      address: siteStore.liveStreamAddress || '',
      latitude: siteStore.liveStreamLat || 19.3182,
      longitude: siteStore.liveStreamLng || -98.2375,
      media: [
        {
          type: 'youtube_live',
          external_id: siteStore.liveStreamYoutubeId || '5qap5aO4i9A',
          url: `https://www.youtube.com/watch?v=${siteStore.liveStreamYoutubeId || '5qap5aO4i9A'}`,
        },
      ],
    }
  }
  return null
})

const liveVideo = computed(() => {
  if (!liveEvent.value?.media) return null
  return liveEvent.value.media.find(
    (m) => m.type === 'youtube_live' || m.type === 'youtube_video'
  )
})

const googleMapsUrl = computed(() => {
  if (!liveEvent.value) return '#'
  if (liveEvent.value.latitude && liveEvent.value.longitude) {
    return `https://www.google.com/maps/search/?api=1&query=${liveEvent.value.latitude},${liveEvent.value.longitude}`
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${liveEvent.value.venue_name || ''} ${liveEvent.value.address || ''} Tlaxcala`
  )}`
})
</script>

<template>
  <section v-if="liveEvent" id="en-vivo" class="abt-live-section">
    <div class="container">
      <!-- Section Header -->
      <div class="abt-live-header text-center mb-4">
        <div class="d-inline-flex align-items-center gap-2 abt-live-pill mb-2">
          <span class="abt-pulse-dot"></span>
          <span class="abt-live-pill-text">TRANSMISIÓN EN DIRECTO</span>
        </div>
        <h2 class="abt-display h2 text-white mb-2">
          ¡Estamos En Vivo! <span class="abt-gradient-text">{{ liveEvent.title }}</span>
        </h2>
        <p class="abt-text-muted lead fs-6 mx-auto mb-0" style="max-width: 44rem;">
          Disfruta en tiempo real la producción de audio, iluminación y ambiente que estamos viviendo en este momento.
        </p>
      </div>

      <!-- Live Theater Layout (Video Left, Map & Info Right) -->
      <div class="row g-4 align-items-stretch">
        <!-- Live Video Column -->
        <div class="col-lg-7">
          <div class="abt-live-player-box h-100">
            <div v-if="liveVideo" class="abt-video-container">
              <YouTubeEmbed
                :video-id="liveVideo.external_id"
                :title="liveEvent.title"
              />
            </div>
            <div v-else class="abt-no-video d-flex flex-column align-items-center justify-content-center p-5 text-center">
              <i class="bi bi-broadcast text-danger fs-1 mb-2"></i>
              <h4 class="text-white">Transmisión en directo activa</h4>
              <p class="abt-text-muted small mb-0">El video estará disponible en breve.</p>
            </div>
          </div>
        </div>

        <!-- Venue & Live Map Column -->
        <div class="col-lg-5">
          <div class="abt-live-venue-card h-100 p-4 d-flex flex-column justify-content-between">
            <div>
              <div class="d-flex align-items-center justify-content-between mb-3">
                <span class="abt-tag-event">{{ liveEvent.category || 'Evento Especial' }}</span>
                <span class="abt-live-now-badge">
                  <i class="bi bi-record-circle-fill me-1"></i> EN VIVO
                </span>
              </div>

              <h3 class="h4 text-white mb-2">{{ liveEvent.title }}</h3>

              <div class="abt-venue-info mb-3">
                <p class="text-white-75 mb-1 d-flex align-items-center gap-2">
                  <i class="bi bi-geo-alt-fill text-gold"></i>
                  <strong>{{ liveEvent.venue_name || 'Recinto en Tlaxcala' }}</strong>
                </p>
                <p v-if="liveEvent.address" class="abt-text-muted small ps-4 mb-2">
                  {{ liveEvent.address }}
                </p>
                <p v-if="liveEvent.description" class="abt-text-muted small mb-0">
                  {{ liveEvent.description }}
                </p>
              </div>
            </div>

            <!-- Mini Map -->
            <div class="abt-live-map-wrapper mb-3">
              <EventsMap :events="[liveEvent]" style="height: 200px; border-radius: 0.75rem;" />
            </div>

            <!-- Map Action Button -->
            <a
              :href="googleMapsUrl"
              target="_blank"
              rel="noopener"
              class="btn abt-btn-map w-100"
            >
              <i class="bi bi-compass me-2"></i> Ver cómo llegar en Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.abt-live-section {
  position: relative;
  padding: 5rem 0;
  background: radial-gradient(circle at 50% 30%, rgba(255, 30, 80, 0.12) 0%, rgba(14, 11, 23, 0.95) 85%);
  border-top: 2px solid rgba(255, 60, 90, 0.35);
  border-bottom: 1px solid rgba(176, 107, 255, 0.15);
  overflow: hidden;
}

.abt-live-pill {
  background: rgba(255, 45, 85, 0.18);
  border: 1px solid rgba(255, 45, 85, 0.45);
  padding: 0.35rem 0.95rem;
  border-radius: 9999px;
  backdrop-filter: blur(8px);
}

.abt-pulse-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ff2d55;
  box-shadow: 0 0 10px #ff2d55;
  animation: pulse-live 1.2s infinite;
}

@keyframes pulse-live {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.35);
    opacity: 0.6;
  }
}

.abt-live-pill-text {
  font-family: var(--abt-font-mono, monospace);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #ff3b60;
}

.abt-gradient-text {
  background: linear-gradient(135deg, #ffffff 0%, #ff3b60 50%, #f0a838 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.abt-live-player-box {
  background: #000000;
  border: 1px solid rgba(255, 45, 85, 0.3);
  border-radius: 1.25rem;
  overflow: hidden;
  box-shadow: 0 15px 45px rgba(255, 45, 85, 0.15);
}

.abt-live-venue-card {
  background: rgba(22, 19, 31, 0.85);
  border: 1px solid rgba(176, 107, 255, 0.25);
  border-radius: 1.25rem;
  backdrop-filter: blur(12px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
}

.abt-tag-event {
  font-family: var(--abt-font-mono, monospace);
  font-size: 0.75rem;
  color: #b06bff;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.abt-live-now-badge {
  background: #ff2d55;
  color: #ffffff;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  letter-spacing: 0.5px;
  animation: pulse-live 1.5s infinite;
}

.abt-live-map-wrapper {
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid rgba(176, 107, 255, 0.2);
}

.abt-btn-map {
  background: rgba(176, 107, 255, 0.15);
  border: 1px solid rgba(176, 107, 255, 0.4);
  color: #ffffff;
  font-size: 0.88rem;
  font-weight: 600;
  padding: 0.6rem 1rem;
  border-radius: 9999px;
  transition: all 0.25s ease;
}

.abt-btn-map:hover {
  background: #b06bff;
  color: #0a0912;
  box-shadow: 0 0 15px rgba(176, 107, 255, 0.5);
}

.text-gold {
  color: #f0a838;
}
</style>
