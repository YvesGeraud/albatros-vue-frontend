<script setup>
import { computed, ref } from 'vue'
import { useEventsStore } from '../../stores/events'
import { useSiteStore } from '../../stores/site'

const eventsStore = useEventsStore()
const siteStore = useSiteStore()
const dismissed = ref(false)

const liveEvent = computed(() => {
  if (eventsStore.liveEvent) return eventsStore.liveEvent
  if (siteStore.liveStreamActive) {
    return {
      id: 'cms-live',
      title: siteStore.liveStreamTitle || 'Evento En Vivo',
      venue_name: siteStore.liveStreamVenue || 'Tlaxcala',
    }
  }
  return null
})

const isVisible = computed(() => {
  if (!liveEvent.value || dismissed.value) return false
  const dismissedKey = `abt_live_dismissed_${liveEvent.value.id}`
  return !sessionStorage.getItem(dismissedKey)
})

function dismiss() {
  dismissed.value = true
  if (liveEvent.value?.id) {
    sessionStorage.setItem(`abt_live_dismissed_${liveEvent.value.id}`, '1')
  }
}

function scrollToLiveSection() {
  const el = document.getElementById('en-vivo')
  if (el) {
    const navbarHeight = 80
    const pos = el.getBoundingClientRect().top + window.pageYOffset - navbarHeight
    window.scrollTo({ top: pos, behavior: 'smooth' })
  }
}
</script>

<template>
  <Transition name="abt-toast-slide">
    <div
      v-if="isVisible"
      class="abt-live-toast"
      role="alert"
      aria-live="polite"
    >
      <div class="abt-toast-inner">
        <!-- Live Indicator & Title -->
        <div class="d-flex align-items-center gap-2 mb-1">
          <span class="abt-toast-dot"></span>
          <span class="abt-toast-kicker">EN VIVO AHORA</span>
        </div>

        <h4 class="abt-toast-title">{{ liveEvent.title }}</h4>
        <p v-if="liveEvent.venue_name" class="abt-toast-venue mb-2">
          <i class="bi bi-geo-alt-fill text-gold me-1"></i>
          {{ liveEvent.venue_name }}
        </p>

        <!-- Actions -->
        <div class="d-flex align-items-center gap-2 mt-2">
          <button
            class="btn btn-sm abt-toast-btn"
            @click="scrollToLiveSection"
          >
            <i class="bi bi-play-circle-fill me-1"></i> Ver transmisión
          </button>
          <button
            class="btn btn-sm abt-toast-close"
            @click="dismiss"
            aria-label="Cerrar notificación"
          >
            <i class="bi bi-x"></i>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.abt-live-toast {
  position: fixed;
  bottom: 2rem;
  left: 2rem; /* Left side so WhatsApp FAB on right doesn't collide */
  z-index: 9998;
  max-width: 320px;
  background: rgba(18, 14, 27, 0.95);
  border: 1px solid rgba(255, 45, 85, 0.5);
  border-radius: 1.25rem;
  padding: 1rem 1.25rem;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 45, 85, 0.25);
  backdrop-filter: blur(16px);
}

.abt-toast-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #ff2d55;
  box-shadow: 0 0 8px #ff2d55;
  animation: pulse-live 1.2s infinite;
}

@keyframes pulse-live {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.5; }
}

.abt-toast-kicker {
  font-family: var(--abt-font-mono, monospace);
  font-size: 0.72rem;
  font-weight: 800;
  color: #ff3b60;
  letter-spacing: 1px;
}

.abt-toast-title {
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.abt-toast-venue {
  font-size: 0.78rem;
  color: rgba(242, 239, 250, 0.75);
}

.text-gold {
  color: #f0a838;
}

.abt-toast-btn {
  background: linear-gradient(135deg, #ff2d55, #b06bff);
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 700;
  border-radius: 9999px;
  padding: 0.35rem 0.85rem;
  border: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.abt-toast-btn:hover {
  transform: scale(1.04);
  box-shadow: 0 0 15px rgba(255, 45, 85, 0.5);
  color: #ffffff;
}

.abt-toast-close {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.1rem;
  padding: 0.2rem 0.4rem;
  line-height: 1;
}

.abt-toast-close:hover {
  color: #ffffff;
}

/* Slide Transition */
.abt-toast-slide-enter-active,
.abt-toast-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.abt-toast-slide-enter-from,
.abt-toast-slide-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}

@media (max-width: 576px) {
  .abt-live-toast {
    left: 1rem;
    right: 1rem;
    bottom: 5.5rem; /* Above mobile action buttons */
    max-width: none;
  }
}
</style>
