<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useEventsStore } from '../../stores/events'
import { useSiteStore } from '../../stores/site'

const eventsStore = useEventsStore()
const siteStore = useSiteStore()
const activeFilter = ref('all')
const lightboxIndex = ref(null)

const categories = [
  { id: 'all', label: 'Todas', icon: 'bi-grid-fill' },
  { id: 'lights', label: 'Iluminación Robótica', icon: 'bi-lightning-charge-fill' },
  { id: 'audio', label: 'Audio & Escenarios', icon: 'bi-speaker-fill' },
  { id: 'dancefloor', label: 'Pistas LED Pixel', icon: 'bi-grid-3x3-gap-fill' },
  { id: 'weddings', label: 'Bodas de Gala', icon: 'bi-heart-fill' },
  { id: 'quince', label: 'XV Años', icon: 'bi-stars' },
]

const basePhotos = [
  {
    id: 'p1',
    category: 'lights',
    title: 'Show de Luces Móviles & Láser',
    location: 'Salón Balvanera, Tlaxcala',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    description: 'Cabezas robóticas beam sincronizadas con control DMX en vivo.',
  },
  {
    id: 'p2',
    category: 'dancefloor',
    title: 'Pista LED Pixel Infinita',
    location: 'Hacienda Soltepec, Huamantla',
    image: 'https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=1200&q=80',
    description: 'Más de 36 módulos de pista pixel con secuencias personalizadas para vals.',
  },
  {
    id: 'p3',
    category: 'audio',
    title: 'Torres Line Array & Mega Subwoofers',
    location: 'Centro de Convenciones, Tlaxcala',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    description: 'Presión sonora uniforme y cristalina para más de 800 invitados.',
  },
  {
    id: 'p4',
    category: 'weddings',
    title: 'Iluminación Arquitectónica de Boda',
    location: 'Hacienda Santa Bárbara',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    description: 'Bañadores de luz cálida ámbar y entrada con chisperos de pirotecnia fría.',
  },
  {
    id: 'p5',
    category: 'quince',
    title: 'Glow Party XV Años',
    location: 'Jardín Las Rosas, Apizaco',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    description: 'Animación con accesorios neón, robots LED y cabina DJ de alto impacto.',
  },
  {
    id: 'p6',
    category: 'audio',
    title: 'Estructura Truss & Cabina Pro',
    location: 'Explanada de Eventos, Tlaxco',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
    description: 'Montaje de truss de aluminio para escenario principal.',
  },
  {
    id: 'p7',
    category: 'lights',
    title: 'Atmósfera Festiva & Efectos de Niebla',
    location: 'Club de Golf Las Campanas',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    description: 'Máquina de humo denso bajo creando efecto de alfombra de nubes.',
  },
  {
    id: 'p8',
    category: 'weddings',
    title: 'Vals en las Nubes',
    location: 'Hacienda San José, Chiautempan',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
    description: 'Momento estelar de los novios con iluminación cenital suave y humo criogénico.',
  },
  {
    id: 'p9',
    category: 'dancefloor',
    title: 'Pista Iluminada a Ritmo de DJ',
    location: 'Salón Real del Bosque',
    image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1200&q=80',
    description: 'Transición rítmica de colores según el beat de la música.',
  },
  {
    id: 'p10',
    category: 'quince',
    title: 'Apertura de Vals de Quinceañera',
    location: 'Salón Diamante, Tlaxcala',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
    description: 'Coordinación musical precisa y efectos de luces seguidoras.',
  },
  {
    id: 'p11',
    category: 'lights',
    title: 'Festival & Producción Masiva',
    location: 'Foro Artístico, Santa Ana',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
    description: 'Montaje de gran escala con pantallas LED y consolas de iluminación digital.',
  },
  {
    id: 'p12',
    category: 'audio',
    title: 'Monitoreo & Sonido Cristalino',
    location: 'Auditorio Universitario, Tlaxcala',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    description: 'Alineación de fase acústica para microfonía en vivo y discursos solemnes.',
  },
]

// Merge photos from events in store if present, prioritized with CMS custom photos
const allPhotos = computed(() => {
  const customPhotos = siteStore.curatedPhotos && siteStore.curatedPhotos.length > 0
    ? siteStore.curatedPhotos
    : basePhotos

  const storePhotos = (eventsStore.events || [])
    .filter((e) => e.cover_image || e.image_url)
    .map((e, idx) => ({
      id: `ev-${e.id || idx}`,
      category: e.category || 'weddings',
      title: e.title || 'Producción Albatros',
      location: e.venue_name || e.address || 'Tlaxcala, MX',
      image: e.cover_image || e.image_url,
      description: e.description || 'Montaje profesional Albatros Sonido e Iluminación.',
    }))
  return [...customPhotos, ...storePhotos]
})

const filteredPhotos = computed(() => {
  if (activeFilter.value === 'all') return allPhotos.value
  return allPhotos.value.filter((p) => p.category === activeFilter.value)
})

const currentLightboxPhoto = computed(() => {
  if (lightboxIndex.value === null) return null
  return filteredPhotos.value[lightboxIndex.value] || null
})

function openLightbox(index) {
  lightboxIndex.value = index
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxIndex.value = null
  document.body.style.overflow = ''
}

function nextPhoto() {
  if (lightboxIndex.value === null) return
  lightboxIndex.value = (lightboxIndex.value + 1) % filteredPhotos.value.length
}

function prevPhoto() {
  if (lightboxIndex.value === null) return
  lightboxIndex.value =
    lightboxIndex.value > 0
      ? lightboxIndex.value - 1
      : filteredPhotos.value.length - 1
}

function handleKeydown(e) {
  if (lightboxIndex.value === null) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowRight') nextPhoto()
  if (e.key === 'ArrowLeft') prevPhoto()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <section id="fotos" class="abt-photo-gallery-section">
    <div class="container">
      <!-- Section Header -->
      <div class="abt-section-header text-center mb-5">
        <span class="abt-kicker abt-text-purple d-inline-block mb-2">
          ★ NUESTRO TRABAJO EN ACCIÓN ★
        </span>
        <h2 class="abt-display h1 text-white mb-3">
          Galería de <span class="abt-gradient-text">Eventos &amp; Montajes</span>
        </h2>
        <p class="abt-text-muted lead mx-auto mb-4" style="max-width: 44rem;">
          Explora la magia visual de nuestras producciones reales: iluminación inteligente, potencia acústica, pistas LED y la mejor energía en cada pista.
        </p>

        <!-- Filter Chips -->
        <div class="abt-filter-pills d-inline-flex flex-wrap justify-content-center gap-2 p-1">
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="abt-filter-btn"
            :class="{ active: activeFilter === cat.id }"
            @click="activeFilter = cat.id"
          >
            <i class="bi me-1" :class="cat.icon"></i>
            {{ cat.label }}
            <span class="abt-filter-count">
              {{ cat.id === 'all' ? allPhotos.length : allPhotos.filter(p => p.category === cat.id).length }}
            </span>
          </button>
        </div>
      </div>

      <!-- Photo Grid -->
      <div class="row g-4 abt-gallery-grid">
        <div
          v-for="(photo, index) in filteredPhotos"
          :key="photo.id"
          class="col-12 col-sm-6 col-lg-4 col-xl-3 abt-grid-col"
        >
          <div
            class="abt-photo-card"
            @click="openLightbox(index)"
            role="button"
            tabindex="0"
            :aria-label="`Ver ${photo.title}`"
          >
            <div class="abt-photo-thumb-wrapper">
              <img
                :src="photo.image"
                :alt="photo.title"
                loading="lazy"
                class="abt-photo-thumb"
              />
              <div class="abt-photo-overlay">
                <div class="abt-overlay-top">
                  <span class="abt-location-tag">
                    <i class="bi bi-geo-alt-fill me-1"></i>{{ photo.location }}
                  </span>
                </div>
                <div class="abt-overlay-center">
                  <div class="abt-zoom-icon">
                    <i class="bi bi-arrows-fullscreen"></i>
                  </div>
                </div>
                <div class="abt-overlay-bottom">
                  <h4 class="abt-card-title">{{ photo.title }}</h4>
                  <p class="abt-card-desc mb-0">{{ photo.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lightbox Modal -->
      <Teleport to="body">
        <Transition name="abt-modal-fade">
          <div
            v-if="lightboxIndex !== null && currentLightboxPhoto"
            class="abt-lightbox-backdrop"
            @click.self="closeLightbox"
          >
            <div class="abt-lightbox-container">
              <!-- Close Button -->
              <button
                class="abt-lightbox-btn abt-lightbox-close"
                @click="closeLightbox"
                aria-label="Cerrar modal"
              >
                <i class="bi bi-x-lg"></i>
              </button>

              <!-- Prev Button -->
              <button
                class="abt-lightbox-btn abt-lightbox-nav abt-lightbox-prev"
                @click="prevPhoto"
                aria-label="Foto anterior"
              >
                <i class="bi bi-chevron-left"></i>
              </button>

              <!-- Main Media -->
              <div class="abt-lightbox-content">
                <div class="abt-lightbox-image-wrapper">
                  <img
                    :src="currentLightboxPhoto.image"
                    :alt="currentLightboxPhoto.title"
                    class="abt-lightbox-img"
                  />
                </div>

                <!-- Caption bar -->
                <div class="abt-lightbox-caption">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <h3 class="abt-lightbox-title mb-0">{{ currentLightboxPhoto.title }}</h3>
                    <span class="abt-lightbox-counter">
                      {{ lightboxIndex + 1 }} / {{ filteredPhotos.length }}
                    </span>
                  </div>
                  <p class="abt-lightbox-desc mb-0">
                    <i class="bi bi-geo-alt-fill text-gold me-1"></i>
                    {{ currentLightboxPhoto.location }} · {{ currentLightboxPhoto.description }}
                  </p>
                </div>
              </div>

              <!-- Next Button -->
              <button
                class="abt-lightbox-btn abt-lightbox-nav abt-lightbox-next"
                @click="nextPhoto"
                aria-label="Siguiente foto"
              >
                <i class="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </section>
</template>

<style scoped>
.abt-photo-gallery-section {
  position: relative;
  padding: 6rem 0;
  background: radial-gradient(circle at 50% 10%, rgba(26, 21, 44, 0.7) 0%, #0a0912 85%);
  border-top: 1px solid rgba(176, 107, 255, 0.1);
  border-bottom: 1px solid rgba(176, 107, 255, 0.1);
}

.abt-gradient-text {
  background: linear-gradient(135deg, #ffffff 0%, #b06bff 50%, #22d3ee 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.abt-text-purple {
  color: #b06bff;
}

.abt-kicker {
  font-family: var(--abt-font-mono, monospace);
  font-size: 0.8rem;
  letter-spacing: 2px;
  font-weight: 600;
}

/* Filter Pills */
.abt-filter-pills {
  background: rgba(22, 19, 31, 0.7);
  border: 1px solid rgba(176, 107, 255, 0.2);
  border-radius: 9999px;
  backdrop-filter: blur(12px);
}

.abt-filter-btn {
  background: transparent;
  border: none;
  color: rgba(242, 239, 250, 0.75);
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.45rem 0.95rem;
  border-radius: 9999px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.25s ease;
}

.abt-filter-btn:hover {
  color: #ffffff;
  background: rgba(176, 107, 255, 0.15);
}

.abt-filter-btn.active {
  background: linear-gradient(135deg, #b06bff, #7e3aff);
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(176, 107, 255, 0.4);
}

.abt-filter-count {
  font-size: 0.72rem;
  background: rgba(0, 0, 0, 0.35);
  padding: 0.1rem 0.45rem;
  border-radius: 9999px;
  opacity: 0.85;
}

/* Card item */
.abt-photo-card {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  background: rgba(22, 19, 31, 0.5);
  border: 1px solid rgba(176, 107, 255, 0.15);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease, box-shadow 0.35s ease;
  cursor: pointer;
  height: 100%;
}

.abt-photo-card:hover {
  transform: translateY(-6px) scale(1.02);
  border-color: rgba(176, 107, 255, 0.5);
  box-shadow: 0 12px 35px rgba(176, 107, 255, 0.25);
}

.abt-photo-thumb-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.abt-photo-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.abt-photo-card:hover .abt-photo-thumb {
  transform: scale(1.1);
}

/* Card Overlay */
.abt-photo-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(10, 9, 18, 0.35) 0%,
    transparent 35%,
    rgba(10, 9, 18, 0.95) 100%
  );
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

.abt-photo-card:hover .abt-photo-overlay {
  opacity: 1;
}

.abt-location-tag {
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  color: #f2effa;
  background: rgba(10, 9, 18, 0.75);
  backdrop-filter: blur(6px);
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.abt-zoom-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(176, 107, 255, 0.85);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  opacity: 0;
  transform: scale(0.6);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 0 20px rgba(176, 107, 255, 0.8);
}

.abt-photo-card:hover .abt-zoom-icon {
  opacity: 1;
  transform: scale(1);
}

.abt-card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.2rem;
}

.abt-card-desc {
  font-size: 0.78rem;
  color: rgba(242, 239, 250, 0.75);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Lightbox Modal */
.abt-lightbox-backdrop {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(7, 6, 13, 0.95);
  backdrop-filter: blur(15px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.abt-lightbox-container {
  position: relative;
  max-width: 1000px;
  width: 100%;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.abt-lightbox-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 1rem;
  overflow: hidden;
  background: rgba(22, 19, 31, 0.8);
  border: 1px solid rgba(176, 107, 255, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
}

.abt-lightbox-image-wrapper {
  max-height: 72vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000000;
}

.abt-lightbox-img {
  max-height: 72vh;
  max-width: 100%;
  object-fit: contain;
}

.abt-lightbox-caption {
  width: 100%;
  padding: 1rem 1.5rem;
  background: rgba(22, 19, 31, 0.95);
  border-top: 1px solid rgba(176, 107, 255, 0.15);
}

.abt-lightbox-title {
  color: #ffffff;
  font-size: 1.25rem;
  font-family: var(--abt-font-display, serif);
}

.abt-lightbox-counter {
  font-family: var(--abt-font-mono, monospace);
  color: #f0a838;
  font-size: 0.9rem;
  font-weight: 600;
}

.abt-lightbox-desc {
  color: rgba(242, 239, 250, 0.7);
  font-size: 0.88rem;
}

.text-gold {
  color: #f0a838;
}

/* Lightbox Nav Buttons */
.abt-lightbox-btn {
  background: rgba(22, 19, 31, 0.8);
  border: 1px solid rgba(176, 107, 255, 0.3);
  color: #ffffff;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
  backdrop-filter: blur(8px);
}

.abt-lightbox-btn:hover {
  background: #b06bff;
  border-color: #b06bff;
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(176, 107, 255, 0.6);
}

.abt-lightbox-close {
  position: absolute;
  top: -60px;
  right: 0;
  z-index: 10;
}

.abt-lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
}

.abt-lightbox-prev {
  left: -70px;
}

.abt-lightbox-next {
  right: -70px;
}

/* Transitions */
.abt-modal-fade-enter-active,
.abt-modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.abt-modal-fade-enter-from,
.abt-modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 992px) {
  .abt-lightbox-prev {
    left: 10px;
  }
  .abt-lightbox-next {
    right: 10px;
  }
  .abt-lightbox-close {
    top: 10px;
    right: 10px;
  }
}
</style>
