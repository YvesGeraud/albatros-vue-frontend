<script setup>
import { computed, onMounted, ref } from 'vue'
import { animate, stagger } from 'animejs'
import LightRays from './LightRays.vue'
import { useSiteStore } from '../../stores/site'

const siteStore = useSiteStore()
const sectionRef = ref(null)

const features = [
  { icon: 'bi-speaker-fill', label: 'Audio Line Array & Subwoofers' },
  { icon: 'bi-lightning-charge-fill', label: 'Cabezas Móviles & Efectos Láser' },
  { icon: 'bi-grid-3x3-gap-fill', label: 'Pistas de Baile LED Pixel' },
  { icon: 'bi-stars', label: 'Efectos Especiales & Pirotecnia Fría' },
]

const defaultStats = [
  { value: '35+', label: 'Años de Trayectoria', color: '#b06bff' },
  { value: '2,800+', label: 'Eventos Realizados', color: '#22d3ee' },
  { value: '100%', label: 'Audio & Producción Pro', color: '#f0a838' },
  { value: '15+', label: 'Técnicos & Operadores', color: '#b06bff' },
]

const stats = computed(() => {
  return siteStore.brandStats && siteStore.brandStats.length > 0 ? siteStore.brandStats : defaultStats
})

const aboutDescription = computed(() => {
  return (
    siteStore.brandNarrative ||
    siteStore.aboutDescription ||
    'En Albatros Tlaxcala somos especialistas en transformar cualquier espacio en un escenario de primer nivel. Con más de 35 años de experiencia, brindamos la máxima fidelidad acústica, iluminación robótica sincronizada y pistas de baile interactivas para que tus momentos más importantes brillen con elegancia y energía.'
  )
})

const aboutBullets = computed(() => {
  if (siteStore.brandBullets && siteStore.brandBullets.length > 0) {
    return siteStore.brandBullets
  }
  if (siteStore.aboutBullets && siteStore.aboutBullets.length > 0) {
    return siteStore.aboutBullets
  }
  return [
    'Ingeniería acústica calibrada para cero distorsión y sonido envolvente.',
    'Iluminación robótica y efectos especiales operados en vivo por técnicos certificados.',
    'Pistas de baile LED Pixel con patrones personalizables para vals y fiesta.',
  ]
})

onMounted(() => {
  if (sectionRef.value) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate('.abt-brand-banner-logo', {
              opacity: [0, 1],
              scale: [0.85, 1],
              duration: 900,
              easing: 'easeOutCubic',
            })
            animate('.abt-badge-item', {
              opacity: [0, 1],
              translateY: [25, 0],
              delay: stagger(100, { start: 300 }),
              duration: 700,
              easing: 'easeOutCubic',
            })
            animate('.abt-stat-card', {
              opacity: [0, 1],
              translateY: [20, 0],
              delay: stagger(100, { start: 500 }),
              duration: 700,
              easing: 'easeOutCubic',
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.15 }
    )
    observer.observe(sectionRef.value)
  }
})
</script>

<template>
  <section id="conocenos" ref="sectionRef" class="abt-brand-banner">
    <!-- WebGL Background Visual: Light Rays (Definitive Effect) -->
    <LightRays
      rays-origin="top-center"
      rays-color="#b06bff"
      :rays-speed="1.2"
      :light-spread="1.35"
      :ray-length="2.4"
      :pulsating="true"
      :follow-mouse="true"
      :mouse-influence="0.18"
      :distortion="0.05"
    />

    <!-- Ambient Glow effects -->
    <div class="abt-glow abt-glow-purple" aria-hidden="true"></div>
    <div class="abt-glow abt-glow-gold" aria-hidden="true"></div>

    <div class="container position-relative z-2 text-center py-5">
      <!-- Centered Logo -->
      <div class="abt-brand-banner-logo-wrapper mb-4">
        <img
          src="/logo-albatros.jpeg"
          alt="Albatros Tlaxcala Logo"
          class="abt-brand-banner-logo img-fluid"
        />
      </div>

      <!-- Tagline & Description (Fused Quiénes Somos / Conócenos) -->
      <div class="abt-brand-banner-text mx-auto mb-4" style="max-width: 52rem;">
        <span class="abt-kicker abt-text-gold d-inline-block mb-2">
          ★ QUIÉNES SOMOS • PRODUCCIÓN PROFESIONAL DE EVENTOS ★
        </span>
        <h2 class="abt-display h1 text-white mb-3">
          Transformamos Cada Momento en un <span class="abt-gradient-text">Recuerdo Inolvidable</span>
        </h2>
        <p class="abt-text-muted lead fs-6 mb-4">
          {{ aboutDescription }}
        </p>

        <!-- Bullet Highlights -->
        <div class="row g-2 justify-content-center text-start mx-auto mb-4" style="max-width: 44rem;">
          <div
            v-for="(bullet, idx) in aboutBullets"
            :key="idx"
            class="col-12 col-md-12"
          >
            <div class="abt-bullet-item">
              <i class="bi bi-patch-check-fill text-gold me-2"></i>
              <span>{{ bullet }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Feature Badges -->
      <div class="row g-3 justify-content-center mb-5">
        <div
          v-for="feat in features"
          :key="feat.label"
          class="col-auto abt-badge-item"
        >
          <div class="abt-pill-badge">
            <i class="bi" :class="feat.icon"></i>
            <span>{{ feat.label }}</span>
          </div>
        </div>
      </div>

      <!-- Stats Bar (Fused from old Conócenos) -->
      <div class="row g-3 justify-content-center mx-auto" style="max-width: 58rem;">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="col-6 col-md-3 abt-stat-card"
        >
          <div class="abt-stat-box">
            <div class="abt-stat-number" :style="{ color: stat.color }">{{ stat.value }}</div>
            <div class="abt-stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.abt-brand-banner {
  position: relative;
  overflow: hidden;
  padding: 5.5rem 0;
  background: radial-gradient(circle at 50% 50%, rgba(22, 19, 31, 0.85) 0%, #0a0912 100%);
  border-top: 1px solid rgba(176, 107, 255, 0.12);
  border-bottom: 1px solid rgba(176, 107, 255, 0.12);
}

.abt-brand-banner-logo-wrapper {
  display: inline-block;
  position: relative;
}

.abt-brand-banner-logo {
  max-height: 145px;
  width: auto;
  filter: drop-shadow(0 0 25px rgba(176, 107, 255, 0.45)) drop-shadow(0 0 50px rgba(240, 168, 56, 0.2));
  transition: transform 0.4s ease, filter 0.4s ease;
}

.abt-brand-banner-logo:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 0 35px rgba(176, 107, 255, 0.65)) drop-shadow(0 0 70px rgba(240, 168, 56, 0.35));
}

.abt-glow {
  position: absolute;
  width: 450px;
  height: 450px;
  border-radius: 50%;
  filter: blur(120px);
  pointer-events: none;
  opacity: 0.22;
}

.abt-glow-purple {
  top: 10%;
  left: 20%;
  background: #b06bff;
}

.abt-glow-gold {
  bottom: 10%;
  right: 20%;
  background: #f0a838;
}

.abt-gradient-text {
  background: linear-gradient(135deg, #ffffff 0%, #b06bff 50%, #22d3ee 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.abt-kicker {
  font-family: var(--abt-font-mono, monospace);
  font-size: 0.8rem;
  letter-spacing: 2px;
  font-weight: 600;
}

.abt-text-gold,
.text-gold {
  color: #f0a838;
}

.abt-bullet-item {
  display: flex;
  align-items: baseline;
  background: rgba(22, 19, 31, 0.45);
  border: 1px solid rgba(176, 107, 255, 0.15);
  border-radius: 0.75rem;
  padding: 0.55rem 0.95rem;
  font-size: 0.9rem;
  color: #f2effa;
  backdrop-filter: blur(6px);
}

.abt-pill-badge {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 1.1rem;
  background: rgba(22, 19, 31, 0.7);
  border: 1px solid rgba(176, 107, 255, 0.22);
  border-radius: 9999px;
  color: #f2effa;
  font-size: 0.88rem;
  font-weight: 500;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.abt-pill-badge:hover {
  transform: translateY(-2px);
  border-color: #b06bff;
  box-shadow: 0 6px 20px rgba(176, 107, 255, 0.25);
}

.abt-pill-badge i {
  color: #b06bff;
  font-size: 1rem;
}

.abt-badge-item,
.abt-stat-card {
  opacity: 0;
}

/* Stats Box */
.abt-stat-box {
  background: rgba(22, 19, 31, 0.65);
  border: 1px solid rgba(176, 107, 255, 0.2);
  border-radius: 1rem;
  padding: 1.25rem 0.75rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.abt-stat-box:hover {
  transform: translateY(-3px);
  border-color: rgba(176, 107, 255, 0.45);
}

.abt-stat-number {
  font-family: var(--abt-font-display, serif);
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 0.25rem;
}

.abt-stat-label {
  font-size: 0.78rem;
  color: rgba(242, 239, 250, 0.7);
  font-weight: 500;
}

@media (max-width: 768px) {
  .abt-brand-banner {
    padding: 3.5rem 0;
  }
  .abt-brand-banner-logo {
    max-height: 100px;
  }
  .abt-stat-number {
    font-size: 1.6rem;
  }
}
</style>
