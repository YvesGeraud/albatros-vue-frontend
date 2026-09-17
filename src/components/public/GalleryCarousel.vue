<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },
})

const activeFilter = ref('all')
const currentIndex = ref(0)
const selectedImage = ref(null)
const autoplayTimer = ref(null)
const isPaused = ref(false)

const galleryItems = [
  {
    id: 1,
    category: 'sound',
    title: 'Torres Line Array en Acción',
    subtitle: 'Potencia acústica cristalina',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    tag: 'Sonido Profesional',
  },
  {
    id: 2,
    category: 'lights',
    title: 'Show Láser & Cabezas Móviles',
    subtitle: 'Iluminación robótica sincronizada',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    tag: 'Iluminación',
  },
  {
    id: 3,
    category: 'dancefloor',
    title: 'Pista LED Pixel Interactiva',
    subtitle: 'Efectos visuales bajo tus pies',
    image: 'https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=1200&q=80',
    tag: 'Pistas LED',
  },
  {
    id: 4,
    category: 'events',
    title: 'XV Años de Ensueño',
    subtitle: 'Fiestas mágicas con la mejor ambientación',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    tag: 'XV Años & Bodas',
  },
  {
    id: 5,
    category: 'events',
    title: 'Boda Espectacular',
    subtitle: 'El día más especial con audio e iluminación de gala',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    tag: 'Bodas',
  },
  {
    id: 6,
    category: 'sound',
    title: 'Cabina DJ & Estructura Truss',
    subtitle: 'Diseño imponente para el escenario',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
    tag: 'Escenarios',
  },
]

// Merge with store events if available
const allItems = computed(() => {
  const eventPhotos = (props.events || [])
    .filter((e) => e.cover_image || e.image_url)
    .map((e, idx) => ({
      id: `ev-${e.id || idx}`,
      category: 'events',
      title: e.name || e.title || 'Evento Albatros',
      subtitle: e.location || 'Tlaxcala, MX',
      image: e.cover_image || e.image_url,
      tag: 'Evento Real',
    }))

  return [...eventPhotos, ...galleryItems]
})

const filteredItems = computed(() => {
  if (activeFilter.value === 'all') return allItems.value
  return allItems.value.filter((item) => item.category === activeFilter.value)
})

const itemsPerPage = ref(3)

const maxIndex = computed(() => {
  return Math.max(0, filteredItems.value.length - itemsPerPage.value)
})

const visibleItems = computed(() => {
  const start = currentIndex.value
  return filteredItems.value.slice(start, start + itemsPerPage.value)
})

const updateItemsPerPage = () => {
  const width = window.innerWidth
  if (width < 640) itemsPerPage.value = 1
  else if (width < 1024) itemsPerPage.value = 2
  else itemsPerPage.value = 3

  if (currentIndex.value > maxIndex.value) {
    currentIndex.value = maxIndex.value
  }
}

const next = () => {
  if (currentIndex.value < maxIndex.value) {
    currentIndex.value++
  } else {
    currentIndex.value = 0
  }
}

const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  } else {
    currentIndex.value = maxIndex.value
  }
}

const setFilter = (filter) => {
  activeFilter.value = filter
  currentIndex.value = 0
}

const openLightbox = (image) => {
  selectedImage.value = image
}

const closeLightbox = () => {
  selectedImage.value = null
}

const startAutoplay = () => {
  stopAutoplay()
  autoplayTimer.value = setInterval(() => {
    if (!isPaused.value && !selectedImage.value) {
      next()
    }
  }, 4500)
}

const stopAutoplay = () => {
  if (autoplayTimer.value) {
    clearInterval(autoplayTimer.value)
    autoplayTimer.value = null
  }
}

onMounted(() => {
  updateItemsPerPage()
  window.addEventListener('resize', updateItemsPerPage)
  startAutoplay()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateItemsPerPage)
  stopAutoplay()
})
</script>

<template>
  <section id="galeria" class="abt-gallery-section" @mouseenter="isPaused = true" @mouseleave="isPaused = false">
    <div class="container">
      <!-- Section Header -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
        <div>
          <span class="abt-kicker abt-text-purple d-block mb-2">GALERÍA EXCLUSIVA</span>
          <h2 class="abt-display h2 mb-1">Nuestros <span class="abt-text-gold">Eventos en Vivo</span></h2>
          <p class="abt-text-muted mb-0">Revive la energía, el montaje y la magia que llevamos a cada pista.</p>
        </div>

        <!-- Carousel Navigation Controls -->
        <div class="d-flex align-items-center gap-2">
          <button
            class="abt-nav-arrow-btn"
            aria-label="Anterior"
            @click="prev"
          >
            <i class="bi bi-chevron-left"></i>
          </button>
          <button
            class="abt-nav-arrow-btn"
            aria-label="Siguiente"
            @click="next"
          >
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="d-flex gap-2 mb-4 flex-wrap">
        <button
          class="abt-filter-btn"
          :class="{ active: activeFilter === 'all' }"
          @click="setFilter('all')"
        >
          Todos
        </button>
        <button
          class="abt-filter-btn"
          :class="{ active: activeFilter === 'events' }"
          @click="setFilter('events')"
        >
          Bodas &amp; XV Años
        </button>
        <button
          class="abt-filter-btn"
          :class="{ active: activeFilter === 'sound' }"
          @click="setFilter('sound')"
        >
          Sonido &amp; Audio
        </button>
        <button
          class="abt-filter-btn"
          :class="{ active: activeFilter === 'lights' }"
          @click="setFilter('lights')"
        >
          Iluminación &amp; Láser
        </button>
        <button
          class="abt-filter-btn"
          :class="{ active: activeFilter === 'dancefloor' }"
          @click="setFilter('dancefloor')"
        >
          Pistas LED
        </button>
      </div>

      <!-- Carousel Cards Grid -->
      <div class="row g-4">
        <div
          v-for="item in visibleItems"
          :key="item.id"
          class="col-12 col-md-6 col-lg-4"
        >
          <div class="abt-gallery-card" @click="openLightbox(item)">
            <div class="abt-gallery-thumb-wrapper">
              <img
                :src="item.image"
                :alt="item.title"
                class="abt-gallery-img"
                loading="lazy"
              />
              <div class="abt-gallery-overlay">
                <span class="abt-gallery-zoom-badge">
                  <i class="bi bi-arrows-fullscreen"></i>
                </span>
              </div>
              <span class="abt-gallery-tag">{{ item.tag }}</span>
            </div>
            <div class="abt-gallery-info">
              <h3 class="abt-gallery-title">{{ item.title }}</h3>
              <p class="abt-gallery-subtitle mb-0">{{ item.subtitle }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Carousel Dots / Progress -->
      <div v-if="maxIndex > 0" class="d-flex justify-content-center gap-2 mt-4">
        <button
          v-for="idx in maxIndex + 1"
          :key="idx"
          class="abt-carousel-dot"
          :class="{ active: currentIndex === idx - 1 }"
          :aria-label="`Ir a imagen ${idx}`"
          @click="currentIndex = idx - 1"
        ></button>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <div
        v-if="selectedImage"
        class="abt-lightbox-backdrop"
        @click.self="closeLightbox"
      >
        <div class="abt-lightbox-content">
          <button class="abt-lightbox-close" aria-label="Cerrar" @click="closeLightbox">
            <i class="bi bi-x-lg"></i>
          </button>
          <img
            :src="selectedImage.image"
            :alt="selectedImage.title"
            class="abt-lightbox-img"
          />
          <div class="abt-lightbox-caption">
            <h4 class="abt-display text-white mb-1">{{ selectedImage.title }}</h4>
            <p class="abt-text-muted mb-0">{{ selectedImage.subtitle }}</p>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<style scoped>
.abt-gallery-section {
  padding: 5rem 0;
  position: relative;
  background: var(--abt-bg);
}

.abt-kicker {
  font-family: var(--abt-font-mono);
  font-size: 0.8rem;
  letter-spacing: 2px;
  font-weight: 600;
}

.abt-text-purple {
  color: #b06bff;
}

.abt-text-gold {
  color: #f0a838;
}

.abt-filter-btn {
  padding: 0.45rem 1.1rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(22, 19, 31, 0.6);
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  backdrop-filter: blur(8px);
}

.abt-filter-btn:hover {
  background: rgba(176, 107, 255, 0.15);
  border-color: #b06bff;
  color: #ffffff;
}

.abt-filter-btn.active {
  background: linear-gradient(135deg, #b06bff 0%, #22d3ee 100%);
  border-color: transparent;
  color: #0a0912;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(176, 107, 255, 0.35);
}

.abt-nav-arrow-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(176, 107, 255, 0.25);
  background: rgba(22, 19, 31, 0.7);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
  backdrop-filter: blur(8px);
}

.abt-nav-arrow-btn:hover {
  background: #b06bff;
  border-color: #b06bff;
  color: #0a0912;
  transform: scale(1.08);
  box-shadow: 0 0 15px rgba(176, 107, 255, 0.4);
}

.abt-gallery-card {
  border-radius: 16px;
  overflow: hidden;
  background: rgba(22, 19, 31, 0.55);
  border: 1px solid rgba(176, 107, 255, 0.12);
  cursor: pointer;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.3s ease, box-shadow 0.3s ease;
}

.abt-gallery-card:hover {
  transform: translateY(-6px);
  border-color: rgba(176, 107, 255, 0.4);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(176, 107, 255, 0.15);
}

.abt-gallery-thumb-wrapper {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.abt-gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.abt-gallery-card:hover .abt-gallery-img {
  transform: scale(1.08);
}

.abt-gallery-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(10, 9, 18, 0.8) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.abt-gallery-card:hover .abt-gallery-overlay {
  opacity: 1;
}

.abt-gallery-zoom-badge {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: #0a0912;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transform: scale(0.8);
  transition: transform 0.3s ease;
}

.abt-gallery-card:hover .abt-gallery-zoom-badge {
  transform: scale(1);
}

.abt-gallery-tag {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.3rem 0.75rem;
  border-radius: 9999px;
  background: rgba(10, 9, 18, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  backdrop-filter: blur(8px);
}

.abt-gallery-info {
  padding: 1.25rem 1.5rem;
}

.abt-gallery-title {
  color: #ffffff;
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 0.35rem;
}

.abt-gallery-subtitle {
  color: #9d97b3;
  font-size: 0.88rem;
}

.abt-carousel-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.abt-carousel-dot.active {
  width: 28px;
  border-radius: 5px;
  background: #b06bff;
  box-shadow: 0 0 10px rgba(176, 107, 255, 0.6);
}

/* Lightbox Modal */
.abt-lightbox-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(10, 9, 18, 0.92);
  backdrop-filter: blur(16px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  animation: fadeIn 0.25s ease;
}

.abt-lightbox-content {
  position: relative;
  max-width: 900px;
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  background: #16131f;
  border: 1px solid rgba(176, 107, 255, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
}

.abt-lightbox-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(10, 9, 18, 0.7);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s ease;
}

.abt-lightbox-close:hover {
  background: #ff6b35;
  border-color: #ff6b35;
}

.abt-lightbox-img {
  width: 100%;
  max-height: 65vh;
  object-fit: cover;
}

.abt-lightbox-caption {
  padding: 1.5rem;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
