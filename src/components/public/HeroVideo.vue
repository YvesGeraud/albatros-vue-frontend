<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { animate } from 'animejs'
import { fetchHeroSettings } from '../../api/settings'

const heroVideoUrl = ref(import.meta.env.VITE_HERO_VIDEO_URL || null)

const heroText = ref('')
const showCursor = ref(true)
const phrases = ['¡Haz tu Fiesta Única!', 'Sonido · Iluminación · Pista de Baile', 'Albatros Tlaxcala']
let currentPhrase = 0
let currentChar = 0
let isDeleting = false
let timeout = null

function type() {
  const phrase = phrases[currentPhrase]

  if (!isDeleting) {
    heroText.value = phrase.substring(0, currentChar + 1)
    currentChar++
    if (currentChar === phrase.length) {
      timeout = setTimeout(() => {
        isDeleting = true
        type()
      }, 2200)
      return
    }
    timeout = setTimeout(type, 70)
  } else {
    heroText.value = phrase.substring(0, currentChar - 1)
    currentChar--
    if (currentChar === 0) {
      isDeleting = false
      currentPhrase = (currentPhrase + 1) % phrases.length
      timeout = setTimeout(type, 400)
      return
    }
    timeout = setTimeout(type, 35)
  }
}

const heroContent = ref(null)
const videoRef = ref(null)
const isMuted = ref(true)

function toggleSound() {
  if (!videoRef.value) return
  isMuted.value = !isMuted.value
  videoRef.value.muted = isMuted.value
}

onMounted(async () => {
  type()

  try {
    const data = await fetchHeroSettings()
    if (data?.hero_video_url) {
      let url = data.hero_video_url
      if (url.startsWith('/')) {
        const apiBase = import.meta.env.VITE_API_BASE_URL || ''
        url = apiBase ? `${apiBase.replace(/\/+$/, '')}${url}` : url
      }
      heroVideoUrl.value = url
    }
  } catch {
    // Keep fallback env var or null if API fails
  }

  if (heroContent.value) {
    animate(heroContent.value, {
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 1200,
      easing: 'easeOutCubic',
      delay: 300,
    })
  }
})

onUnmounted(() => {
  clearTimeout(timeout)
})
</script>

<template>
  <section class="abt-hero-section" id="hero">
    <!-- Video background (if URL provided via env) -->
    <video
      v-if="heroVideoUrl"
      ref="videoRef"
      class="abt-hero-video"
      autoplay
      :muted="isMuted"
      loop
      playsinline
    >
      <source :src="heroVideoUrl" type="video/mp4" />
    </video>

    <!-- Animated gradient fallback (when no video) -->
    <div v-else class="abt-hero-gradient-bg" aria-hidden="true">
      <div class="abt-hero-particles" aria-hidden="true">
        <span v-for="n in 20" :key="n" class="abt-particle"></span>
      </div>
    </div>

    <!-- Dark overlay for text readability -->
    <div class="abt-hero-overlay" aria-hidden="true"></div>

    <!-- Content -->
    <div ref="heroContent" class="abt-hero-content" style="opacity: 0;">
      <p class="abt-mono small abt-text-cyan mb-3">TLAXCALA · SONIDO Y EVENTOS</p>
      <h1 class="abt-display fw-bold mb-3">
        <span>{{ heroText }}</span><span class="abt-typewriter-cursor" v-show="showCursor"></span>
      </h1>
      <p class="lead mx-auto" style="max-width: 36rem;">
        Sonido, iluminación, pista de baile y bailarines para que tu evento sea inolvidable.
      </p>
      <div class="d-flex justify-content-center gap-3 flex-wrap">
        <RouterLink :to="{ name: 'quote-builder' }" class="abt-btn-neon">
          Arma tu cotización
        </RouterLink>
        <RouterLink :to="{ name: 'events' }" class="abt-btn-outline">
          Ver eventos
        </RouterLink>
      </div>
    </div>

    <!-- Scroll indicator -->
    <a href="#content-start" class="abt-hero-scroll-indicator" aria-label="Scroll hacia abajo">
      <i class="bi bi-chevron-double-down"></i>
    </a>

    <!-- Sound toggle button -->
    <button
      v-if="heroVideoUrl"
      class="abt-hero-sound-toggle"
      @click="toggleSound"
      :aria-label="isMuted ? 'Activar sonido' : 'Silenciar sonido'"
    >
      <i class="bi" :class="isMuted ? 'bi-volume-mute-fill' : 'bi-volume-up-fill'"></i>
      <span>{{ isMuted ? 'Activar sonido' : 'Sonido activo' }}</span>
    </button>

    <!-- Bottom curve -->
    <div class="abt-hero-bottom-curve" aria-hidden="true">
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="var(--abt-bg)" />
      </svg>
    </div>
  </section>
</template>

<style scoped>
/* Particle animation for gradient fallback */
.abt-hero-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.abt-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(176, 107, 255, 0.4);
  animation: abt-particle-float linear infinite;
}

.abt-particle:nth-child(odd) {
  background: rgba(34, 211, 238, 0.35);
}

.abt-particle:nth-child(1) { left: 5%; top: 20%; animation-duration: 8s; width: 3px; height: 3px; }
.abt-particle:nth-child(2) { left: 15%; top: 60%; animation-duration: 12s; animation-delay: -2s; }
.abt-particle:nth-child(3) { left: 25%; top: 40%; animation-duration: 10s; animation-delay: -4s; }
.abt-particle:nth-child(4) { left: 35%; top: 80%; animation-duration: 9s; animation-delay: -1s; }
.abt-particle:nth-child(5) { left: 45%; top: 15%; animation-duration: 11s; animation-delay: -3s; }
.abt-particle:nth-child(6) { left: 55%; top: 50%; animation-duration: 13s; animation-delay: -5s; }
.abt-particle:nth-child(7) { left: 65%; top: 30%; animation-duration: 8s; animation-delay: -2s; }
.abt-particle:nth-child(8) { left: 75%; top: 70%; animation-duration: 10s; animation-delay: -6s; }
.abt-particle:nth-child(9) { left: 85%; top: 45%; animation-duration: 14s; animation-delay: -1s; }
.abt-particle:nth-child(10) { left: 95%; top: 25%; animation-duration: 9s; animation-delay: -4s; }
.abt-particle:nth-child(11) { left: 10%; top: 85%; animation-duration: 11s; animation-delay: -7s; }
.abt-particle:nth-child(12) { left: 20%; top: 10%; animation-duration: 12s; animation-delay: -3s; }
.abt-particle:nth-child(13) { left: 30%; top: 55%; animation-duration: 8s; animation-delay: -5s; }
.abt-particle:nth-child(14) { left: 40%; top: 35%; animation-duration: 10s; animation-delay: -2s; }
.abt-particle:nth-child(15) { left: 50%; top: 75%; animation-duration: 13s; animation-delay: -6s; }
.abt-particle:nth-child(16) { left: 60%; top: 20%; animation-duration: 9s; animation-delay: -1s; }
.abt-particle:nth-child(17) { left: 70%; top: 65%; animation-duration: 11s; animation-delay: -4s; }
.abt-particle:nth-child(18) { left: 80%; top: 40%; animation-duration: 14s; animation-delay: -3s; }
.abt-particle:nth-child(19) { left: 90%; top: 10%; animation-duration: 8s; animation-delay: -5s; }
.abt-particle:nth-child(20) { left: 50%; top: 50%; animation-duration: 10s; animation-delay: -7s; width: 6px; height: 6px; }

@keyframes abt-particle-float {
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-100vh) translateX(30px) scale(0.5);
    opacity: 0;
  }
}
</style>
