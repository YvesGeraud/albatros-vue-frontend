<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { animate, stagger } from 'animejs'

const floorTiles = ref(null)
const sparkles = ref(null)
let floorAnim
let sparkleAnim

onMounted(() => {
  if (floorTiles.value) {
    floorAnim = animate(floorTiles.value.querySelectorAll('.abt-tile'), {
      backgroundColor: [
        { to: 'var(--abt-purple)' },
        { to: 'var(--abt-cyan)' },
        { to: 'var(--abt-amber)' },
        { to: 'rgba(255,255,255,0.05)' },
      ],
      delay: stagger(90, { grid: [8, 4], from: 'center' }),
      loop: true,
      duration: 3200,
      easing: 'easeInOutSine',
    })
  }

  if (sparkles.value) {
    sparkleAnim = animate(sparkles.value.querySelectorAll('.abt-sparkle'), {
      opacity: [{ to: 1 }, { to: 0.15 }],
      scale: [{ to: 1.3 }, { to: 0.7 }],
      delay: stagger(120),
      loop: true,
      alternate: true,
      duration: 1400,
      easing: 'easeInOutQuad',
    })
  }
})

onUnmounted(() => {
  floorAnim?.pause()
  sparkleAnim?.pause()
})
</script>

<template>
  <div class="abt-hero position-relative overflow-hidden py-5">
    <div class="container position-relative py-5 text-center" style="z-index: 2;">
      <p class="abt-mono small abt-text-cyan mb-3">TLAXCALA · SONIDO Y EVENTOS</p>
      <h1 class="display-3 abt-display fw-bold mb-3">
        Albatros <span class="abt-text-purple">Tlaxcala</span>
      </h1>
      <p class="lead abt-text-muted mb-4 mx-auto" style="max-width: 40rem;">
        Sonido, iluminación, pista de baile y bailarines para que tu evento
        brille como en los años 80.
      </p>
      <div class="d-flex justify-content-center gap-3 flex-wrap">
        <RouterLink :to="{ name: 'quote-builder' }" class="btn abt-btn-neon">
          Arma tu cotización
        </RouterLink>
        <RouterLink :to="{ name: 'events' }" class="btn btn-outline-light">
          Ver eventos
        </RouterLink>
      </div>
    </div>

    <div class="abt-disco-ball" aria-hidden="true">
      <div ref="sparkles" class="abt-sparkles">
        <span v-for="n in 10" :key="n" class="abt-sparkle"></span>
      </div>
    </div>

    <div ref="floorTiles" class="abt-dancefloor" aria-hidden="true">
      <span v-for="n in 32" :key="n" class="abt-tile"></span>
    </div>
  </div>
</template>

<style scoped>
.abt-hero {
  background: radial-gradient(circle at 50% 0%, rgba(176, 107, 255, 0.25), transparent 60%),
    var(--abt-bg);
}

.abt-disco-ball {
  width: 90px;
  height: 90px;
  margin: 0 auto 2rem;
  border-radius: 50%;
  position: relative;
  background: repeating-conic-gradient(
    from 0deg,
    #cfcfe0 0deg 8deg,
    #7d7896 8deg 16deg
  );
  box-shadow:
    inset -8px -8px 20px rgba(0, 0, 0, 0.5),
    inset 6px 6px 12px rgba(255, 255, 255, 0.4),
    0 0 40px rgba(176, 107, 255, 0.5);
  animation: abt-spin 6s linear infinite;
}

@keyframes abt-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.abt-sparkles {
  position: absolute;
  inset: -40px;
}

.abt-sparkle {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--abt-cyan);
}
.abt-sparkle:nth-child(1) { top: 0; left: 20%; }
.abt-sparkle:nth-child(2) { top: 10%; left: 80%; }
.abt-sparkle:nth-child(3) { top: 30%; left: 5%; }
.abt-sparkle:nth-child(4) { top: 40%; left: 95%; }
.abt-sparkle:nth-child(5) { top: 60%; left: 15%; }
.abt-sparkle:nth-child(6) { top: 70%; left: 85%; }
.abt-sparkle:nth-child(7) { top: 85%; left: 30%; }
.abt-sparkle:nth-child(8) { top: 90%; left: 70%; }
.abt-sparkle:nth-child(9) { top: 15%; left: 45%; }
.abt-sparkle:nth-child(10) { top: 75%; left: 50%; }

.abt-dancefloor {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 3px;
  max-width: 480px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  z-index: 1;
}

.abt-tile {
  aspect-ratio: 1;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.05);
}
</style>
