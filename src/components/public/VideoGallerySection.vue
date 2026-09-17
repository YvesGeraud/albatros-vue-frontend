<script setup>
import { computed, ref } from 'vue'
import { useEventsStore } from '../../stores/events'
import YouTubeEmbed from './YouTubeEmbed.vue'

const eventsStore = useEventsStore()

const curatedVideos = [
  {
    id: 'v1',
    title: 'Show de Luces Móviles & Apertura de Pista',
    venue: 'Centro de Convenciones Tlaxcala',
    duration: '3:45 min',
    tag: 'Iluminación & Show',
    category: 'Show Láser',
    youtubeId: 'kJQP7kiw5Fk', // Luis Fonsi / Despacito sample ID or concert sample
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    description: 'Sincronización de 8 cabezas móviles Beam con rayos estroboscópicos y máquina de niebla.',
  },
  {
    id: 'v2',
    title: 'Vals en las Nubes & Pista LED Pixel',
    venue: 'Hacienda Soltepec, Huamantla',
    duration: '4:12 min',
    tag: 'Boda de Gala',
    category: 'Pistas LED',
    youtubeId: 'fJ9rUzIMcZQ', // Queen / Bohemian Rhapsody sample ID or wedding sample
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    description: 'Momento emotivo con niebla baja criogénica y pista LED de 36 módulos iluminada al compás.',
  },
  {
    id: 'v3',
    title: 'Potencia Line Array & Mega Bajos en Concierto',
    venue: 'Explanada Tlaxco',
    duration: '5:02 min',
    tag: 'Audio Profesional',
    category: 'Line Array',
    youtubeId: 'JGwWNGJdvx8', // Ed Sheeran sample ID
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    description: 'Prueba de cobertura sonora y refuerzo acústico con 8 mega subwoofers dobles.',
  },
  {
    id: 'v4',
    title: 'Glow Party & Animación con Robots LED',
    venue: 'Salón Real Diamante',
    duration: '3:20 min',
    tag: 'XV Años',
    category: 'Animación',
    youtubeId: 'L_LUpnjgPso', // Coldplay sample ID
    thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    description: 'Pirotecnia fría, zanqueros luminosos y accesorios fluorescentes para una fiesta inolvidable.',
  },
]

// Add store videos if present
const allVideos = computed(() => {
  const storeVideos = (eventsStore.events || [])
    .filter((e) => e.media?.some((m) => m.type === 'youtube_video' || m.type === 'youtube_live'))
    .map((e, idx) => {
      const vid = e.media.find((m) => m.type === 'youtube_video' || m.type === 'youtube_live')
      return {
        id: `ev-vid-${e.id || idx}`,
        title: e.title || 'Producción de Evento Albatros',
        venue: e.venue_name || 'Tlaxcala, MX',
        duration: 'En Vivo',
        tag: e.category || 'Evento Real',
        category: 'Producción',
        youtubeId: vid?.external_id || 'kJQP7kiw5Fk',
        thumbnail: e.cover_image || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
        description: e.description || 'Grabación en directo de la producción y montaje de Albatros.',
      }
    })

  return [...storeVideos, ...curatedVideos]
})

const activeVideo = ref(curatedVideos[0])

function selectVideo(video) {
  activeVideo.value = video
}
</script>

<template>
  <section id="videos" class="abt-video-gallery-section">
    <div class="container">
      <!-- Section Header -->
      <div class="abt-section-header text-center mb-5">
        <span class="abt-kicker abt-text-gold d-inline-block mb-2">
          ★ EXPERIENCIAS EN ALTA DEFINICIÓN ★
        </span>
        <h2 class="abt-display h1 text-white mb-3">
          Galería de <span class="abt-gradient-text">Videos &amp; Shows en Vivo</span>
        </h2>
        <p class="abt-text-muted lead mx-auto mb-0" style="max-width: 44rem;">
          Siente la emoción, la sincronización de iluminación robótica y la potencia del sonido en cada una de nuestras coberturas de eventos reales.
        </p>
      </div>

      <!-- Main Video Theater Layout -->
      <div class="row g-4 align-items-stretch">
        <!-- Main Featured Video Player -->
        <div class="col-lg-8">
          <div class="abt-featured-player-card">
            <div class="abt-player-wrapper">
              <YouTubeEmbed
                :video-id="activeVideo.youtubeId"
                :title="activeVideo.title"
              />
            </div>
            <div class="abt-player-info p-4">
              <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span class="abt-video-tag-pill">
                  <i class="bi bi-play-circle-fill me-1"></i> {{ activeVideo.tag }}
                </span>
                <span class="abt-video-time">
                  <i class="bi bi-clock me-1"></i> {{ activeVideo.duration }}
                </span>
                <span class="abt-video-location ms-auto">
                  <i class="bi bi-geo-alt-fill text-gold me-1"></i> {{ activeVideo.venue }}
                </span>
              </div>
              <h3 class="abt-player-title text-white mb-2">{{ activeVideo.title }}</h3>
              <p class="abt-player-desc mb-0">{{ activeVideo.description }}</p>
            </div>
          </div>
        </div>

        <!-- Video Playlist / Cards Side Column -->
        <div class="col-lg-4">
          <div class="abt-playlist-card h-100">
            <div class="abt-playlist-header p-3">
              <h4 class="h6 text-white mb-0 d-flex align-items-center gap-2">
                <i class="bi bi-collection-play-fill text-purple"></i>
                Videos de Producción ({{ allVideos.length }})
              </h4>
            </div>

            <div class="abt-playlist-items p-2 d-flex flex-column gap-2">
              <div
                v-for="video in allVideos"
                :key="video.id"
                class="abt-playlist-item"
                :class="{ active: activeVideo.id === video.id }"
                @click="selectVideo(video)"
                role="button"
                tabindex="0"
              >
                <!-- Thumbnail with play icon -->
                <div class="abt-item-thumb-wrapper">
                  <img
                    :src="video.thumbnail"
                    :alt="video.title"
                    class="abt-item-thumb"
                  />
                  <div class="abt-item-play-overlay">
                    <i class="bi" :class="activeVideo.id === video.id ? 'bi-volume-up-fill' : 'bi-play-fill'"></i>
                  </div>
                </div>

                <!-- Info -->
                <div class="abt-item-info">
                  <span class="abt-item-tag">{{ video.tag }}</span>
                  <h5 class="abt-item-title">{{ video.title }}</h5>
                  <span class="abt-item-meta">
                    <i class="bi bi-geo-alt text-gold me-1"></i>{{ video.venue }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.abt-video-gallery-section {
  position: relative;
  padding: 6rem 0;
  background: radial-gradient(circle at 50% 50%, rgba(20, 16, 32, 0.9) 0%, #0a0912 100%);
  border-top: 1px solid rgba(176, 107, 255, 0.1);
  border-bottom: 1px solid rgba(176, 107, 255, 0.1);
}

.abt-gradient-text {
  background: linear-gradient(135deg, #ffffff 0%, #b06bff 50%, #22d3ee 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.abt-text-gold {
  color: #f0a838;
}

.text-gold {
  color: #f0a838;
}

.text-purple {
  color: #b06bff;
}

.abt-kicker {
  font-family: var(--abt-font-mono, monospace);
  font-size: 0.8rem;
  letter-spacing: 2px;
  font-weight: 600;
}

/* Featured Player Card */
.abt-featured-player-card {
  background: rgba(22, 19, 31, 0.7);
  border: 1px solid rgba(176, 107, 255, 0.25);
  border-radius: 1.25rem;
  overflow: hidden;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.abt-player-wrapper {
  background: #000000;
  border-bottom: 1px solid rgba(176, 107, 255, 0.15);
}

.abt-player-info {
  background: rgba(18, 15, 27, 0.95);
  flex-grow: 1;
}

.abt-video-tag-pill {
  background: rgba(176, 107, 255, 0.2);
  border: 1px solid rgba(176, 107, 255, 0.4);
  color: #f2effa;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
}

.abt-video-time {
  font-family: var(--abt-font-mono, monospace);
  font-size: 0.8rem;
  color: rgba(242, 239, 250, 0.6);
}

.abt-video-location {
  font-size: 0.82rem;
  color: rgba(242, 239, 250, 0.75);
}

.abt-player-title {
  font-size: 1.35rem;
  font-weight: 700;
}

.abt-player-desc {
  color: rgba(242, 239, 250, 0.75);
  font-size: 0.92rem;
  line-height: 1.6;
}

/* Playlist Side Card */
.abt-playlist-card {
  background: rgba(22, 19, 31, 0.6);
  border: 1px solid rgba(176, 107, 255, 0.2);
  border-radius: 1.25rem;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(12px);
  overflow: hidden;
}

.abt-playlist-header {
  border-bottom: 1px solid rgba(176, 107, 255, 0.15);
  background: rgba(16, 13, 24, 0.8);
}

.abt-playlist-items {
  max-height: 520px;
  overflow-y: auto;
}

/* Scrollbar styling */
.abt-playlist-items::-webkit-scrollbar {
  width: 6px;
}
.abt-playlist-items::-webkit-scrollbar-track {
  background: rgba(10, 9, 18, 0.4);
}
.abt-playlist-items::-webkit-scrollbar-thumb {
  background: rgba(176, 107, 255, 0.3);
  border-radius: 3px;
}

.abt-playlist-item {
  display: flex;
  gap: 0.85rem;
  padding: 0.65rem;
  border-radius: 0.75rem;
  border: 1px solid transparent;
  background: rgba(14, 12, 21, 0.5);
  cursor: pointer;
  transition: all 0.25s ease;
}

.abt-playlist-item:hover {
  background: rgba(176, 107, 255, 0.12);
  border-color: rgba(176, 107, 255, 0.3);
  transform: translateX(3px);
}

.abt-playlist-item.active {
  background: rgba(176, 107, 255, 0.2);
  border-color: #b06bff;
  box-shadow: 0 0 15px rgba(176, 107, 255, 0.25);
}

.abt-item-thumb-wrapper {
  position: relative;
  width: 100px;
  height: 68px;
  flex-shrink: 0;
  border-radius: 0.5rem;
  overflow: hidden;
}

.abt-item-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.abt-item-play-overlay {
  position: absolute;
  inset: 0;
  background: rgba(10, 9, 18, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.25rem;
  transition: all 0.25s ease;
}

.abt-playlist-item:hover .abt-item-play-overlay,
.abt-playlist-item.active .abt-item-play-overlay {
  background: rgba(176, 107, 255, 0.6);
  color: #0a0912;
  font-weight: 700;
}

.abt-item-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.abt-item-tag {
  font-size: 0.7rem;
  color: #b06bff;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.abt-item-title {
  font-size: 0.88rem;
  color: #ffffff;
  font-weight: 600;
  margin: 0.15rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.abt-item-meta {
  font-size: 0.75rem;
  color: rgba(242, 239, 250, 0.6);
}
</style>
