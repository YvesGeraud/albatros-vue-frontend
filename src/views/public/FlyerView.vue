<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSiteStore } from '../../stores/site'

const siteStore = useSiteStore()
const router = useRouter()

// Permite ver visualmente las áreas clickeables (útil para pruebas)
const showDebugOverlay = ref(false)

onMounted(() => {
  siteStore.load()
})

// URLs dinámicas desde el store con respaldos por defecto
const fbUrl = computed(() => siteStore.socialFacebook || 'https://www.facebook.com/albatrostlaxcala')
const ytUrl = computed(() => siteStore.socialYoutube || 'https://www.youtube.com/@albatrostlaxcala')
const igUrl = computed(() => siteStore.socialInstagram || 'https://www.instagram.com/albatros_tlaxcala')
const tkUrl = computed(() => siteStore.socialTiktok || 'https://www.tiktok.com/@albatrostlaxcala')
const waUrl = computed(() => {
  const phone = (siteStore.whatsappNumber || '2461234567').replace(/\D/g, '')
  const msg = encodeURIComponent('¡Hola! Me gustaría cotizar un evento con Grupo Albatros.')
  return `https://wa.me/${phone.startsWith('52') ? phone : '52' + phone}?text=${msg}`
})

// Definición de las áreas interactivas (hotspots) en porcentajes (%)
// Esto garantiza que funcionen perfectamente en móviles, tablets y monitores.
const hotspots = computed(() => [
  {
    id: 'whatsapp-btn',
    label: 'Cotiza tu evento por WhatsApp',
    href: waUrl.value,
    isExternal: true,
    top: 60.1,
    left: 4.5,
    width: 44.5,
    height: 7.7,
    borderRadius: '40px',
  },
  {
    id: 'website-btn',
    label: 'Visita nuestro Sitio Web',
    href: '/',
    isExternal: false,
    top: 60.1,
    left: 51.3,
    width: 44.5,
    height: 7.7,
    borderRadius: '40px',
  },
  {
    id: 'facebook',
    label: 'Facebook - Grupo Albatros',
    href: fbUrl.value,
    isExternal: true,
    top: 71.8,
    left: 17.6,
    width: 14.7,
    height: 8.3,
    borderRadius: '16px',
  },
  {
    id: 'instagram',
    label: 'Instagram - Grupo Albatros',
    href: igUrl.value,
    isExternal: true,
    top: 71.8,
    left: 33.7,
    width: 14.7,
    height: 8.3,
    borderRadius: '16px',
  },
  {
    id: 'youtube',
    label: 'YouTube - Grupo Albatros',
    href: ytUrl.value,
    isExternal: true,
    top: 71.8,
    left: 50.1,
    width: 14.7,
    height: 8.3,
    borderRadius: '16px',
  },
  {
    id: 'tiktok',
    label: 'TikTok - Grupo Albatros',
    href: tkUrl.value,
    isExternal: true,
    top: 71.8,
    left: 66.7,
    width: 14.7,
    height: 8.3,
    borderRadius: '16px',
  },
  {
    id: 'qr-code',
    label: 'Escanéame y contrata tu evento',
    href: '/cotizador',
    isExternal: false,
    top: 80.0,
    left: 36.9,
    width: 26.0,
    height: 15.0,
    borderRadius: '12px',
  },
])

function handleClick(e, spot) {
  if (!spot.isExternal) {
    e.preventDefault()
    router.push(spot.href)
  }
}
</script>

<template>
  <div class="flyer-page py-5">
    <div class="container text-center">
      <div class="mb-4">
        <h1 class="h3 text-gold fw-bold mb-2">Promoción Grupo Albatros</h1>
        <p class="text-muted small mb-3">
          Toca los iconos o botones de la imagen para interactuar
        </p>
        <button
          type="button"
          class="btn btn-sm btn-outline-warning"
          @click="showDebugOverlay = !showDebugOverlay"
        >
          <i class="bi bi-eye me-1"></i>
          {{ showDebugOverlay ? 'Ocultar zonas activas' : 'Ver zonas activas' }}
        </button>
      </div>

      <!-- Contenedor relativo del Flyer con Hotspots -->
      <div class="flyer-card shadow-lg mx-auto">
        <div class="flyer-wrapper">
          <img
            src="/images/flyer-promocional.jpg"
            alt="Grupo Albatros - Sonido, Iluminación y Producción de Eventos"
            class="flyer-image"
          />

          <!-- Hotspots / Zonas interactivas -->
          <a
            v-for="spot in hotspots"
            :key="spot.id"
            :href="spot.href"
            :target="spot.isExternal ? '_blank' : undefined"
            :rel="spot.isExternal ? 'noopener noreferrer' : undefined"
            :title="spot.label"
            :aria-label="spot.label"
            class="flyer-hotspot"
            :class="{ 'debug-visible': showDebugOverlay }"
            :style="{
              top: `${spot.top}%`,
              left: `${spot.left}%`,
              width: `${spot.width}%`,
              height: `${spot.height}%`,
              borderRadius: spot.borderRadius,
            }"
            @click="handleClick($event, spot)"
          >
            <span class="visually-hidden">{{ spot.label }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flyer-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-gold {
  color: #d4af37;
}

.flyer-card {
  max-width: 580px;
  width: 100%;
  border-radius: 18px;
  overflow: hidden;
  background: #0b111e;
  border: 1px solid rgba(212, 175, 55, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.flyer-card:hover {
  box-shadow: 0 10px 30px rgba(212, 175, 55, 0.2);
}

.flyer-wrapper {
  position: relative;
  width: 100%;
  line-height: 0;
  user-select: none;
}

.flyer-image {
  width: 100%;
  height: auto;
  display: block;
}

/* Áreas clickeables transparentes */
.flyer-hotspot {
  position: absolute;
  display: block;
  cursor: pointer;
  background: transparent;
  outline: none;
  transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
  z-index: 5;
  -webkit-tap-highlight-color: transparent;
}

/* Efecto hover suave con brillo dorado */
.flyer-hotspot:hover,
.flyer-hotspot:focus-visible {
  background-color: rgba(212, 175, 55, 0.2);
  box-shadow: 0 0 14px rgba(212, 175, 55, 0.6);
  transform: scale(1.03);
}

.flyer-hotspot:active {
  transform: scale(0.97);
}

/* Modo visualización de zonas */
.flyer-hotspot.debug-visible {
  background-color: rgba(0, 150, 255, 0.35);
  border: 2px dashed #00e5ff;
}

.flyer-hotspot.debug-visible:hover {
  background-color: rgba(255, 0, 100, 0.45);
}
</style>

