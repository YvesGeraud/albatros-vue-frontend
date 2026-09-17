<script setup>
import { computed, ref } from 'vue'

const packages = [
  {
    id: 'basico',
    name: 'Social Básico',
    badge: 'Íntimo & Versátil',
    price: '$7,500',
    capacity: '50 - 100 personas',
    description: 'Sonido balanceado e iluminación esencial para fiestas privadas y eventos pequeños.',
    speakersCount: 4, // 2 subs + 2 tops (1 pair per side)
    movingHeadsCount: 2,
    dancersCount: 0,
    hasDanceFloor: false,
    danceFloorSize: 'Sin pista',
    hasSparklers: false,
    sparklersCount: 0,
    features: [
      '4 Bocinas de Alta Fidelidad (2 Subs + 2 Tops)',
      '2 Cabezas Móviles Robóticas DMX',
      '1 DJ Profesional en Cabina Iluminada',
      'Iluminación LED Ambiental',
      'Máquina de Humo Estándar',
      'Micrófono Inalámbrico para Protocolo',
    ],
  },
  {
    id: 'silver',
    name: 'Fiesta Silver',
    badge: 'Más Solicitado',
    popular: true,
    price: '$14,500',
    capacity: '100 - 200 personas',
    description: 'La combinación perfecta de pista LED, animación en vivo y mayor pegada sonora.',
    speakersCount: 6, // 4 subs + 2 line array
    movingHeadsCount: 4,
    dancersCount: 2,
    hasDanceFloor: true,
    danceFloorSize: 'Pista LED 4x4 (16 m²)',
    hasSparklers: false,
    sparklersCount: 0,
    features: [
      '6 Bocinas de Alta Fidelidad (4 Subwoofers + 2 Cajas Line Array)',
      '4 Cabezas Móviles Robóticas Beam',
      'Pista de Baile LED Pixel 4x4 Interactiva',
      '2 Bailarines / Animadores con Souvenirs Neón',
      '1 DJ con Consola Digital Pioneer',
      'Máquina de Niebla Baja para Vals',
      'Estructura Truss de Aluminio Iluminada',
    ],
  },
  {
    id: 'gold',
    name: 'Boda Imperial Gold',
    badge: 'Recomendado',
    featured: true,
    price: '$23,000',
    capacity: '200 - 350 personas',
    description: 'Producción de gala con pirotecnia fría, sonido Line Array volado y pista LED expandida.',
    speakersCount: 8, // 4 subs + 4 line array
    movingHeadsCount: 6,
    dancersCount: 4,
    hasDanceFloor: true,
    danceFloorSize: 'Pista LED 6x6 (36 m²)',
    hasSparklers: true,
    sparklersCount: 2,
    features: [
      '8 Bocinas Pro (4 Mega Subs + 4 Line Array Volados)',
      '6 Cabezas Móviles + Láser Multicolor Sincronizado',
      'Pista de Baile LED Pixel 6x6 con Efectos Dinámicos',
      '4 Bailarines / Animadores Coreografiados',
      '2 Chisperos de Pirotecnia Fría (Sparklers)',
      'Efecto Vals en las Nubes (Niebla Criogénica Densa)',
      'Cabina DJ de Cristal Espejo',
    ],
  },
  {
    id: 'platinum',
    name: 'Magno Platinum Festival',
    badge: 'Gala Total & Concierto',
    price: '$36,000',
    capacity: '350+ personas',
    description: 'El máximo espectáculo audiovisual. Potencia de concierto masivo, robot LED y efectos totales.',
    speakersCount: 12, // 6 subs + 6 line array
    movingHeadsCount: 8,
    dancersCount: 6,
    hasDanceFloor: true,
    danceFloorSize: 'Pista LED 8x8 + Pasarela',
    hasSparklers: true,
    sparklersCount: 4,
    features: [
      '12 Bocinas de Concierto (6 Mega Subwoofers + 6 Line Array Curvo)',
      '8 Cabezas Móviles + 4 Estrobos + Show Láser Cuádruple',
      'Pista de Baile LED Pixel 8x8 + Pasarela de Honor',
      '6 Bailarines Temáticos + Robot Zanquero LED Gigante',
      '4 Chisperos de Pirotecnia Fría Simultáneos',
      'Cañón de Confeti Continuo + Niebla Criogénica',
      'Operadores de Audio e Iluminación en Vivo',
    ],
  },
]

const activePackageId = ref('silver')

const activePackage = computed(() => {
  return packages.find((p) => p.id === activePackageId.value) || packages[1]
})

// Subwoofers and Line Array splitting (distributed left and right)
const speakersPerSide = computed(() => {
  return Math.ceil(activePackage.value.speakersCount / 2)
})

// Dancers array for TransitionGroup
const dancersList = computed(() => {
  const count = activePackage.value.dancersCount
  return Array.from({ length: count }, (_, i) => ({
    id: `dancer-${i + 1}`,
    side: i % 2 === 0 ? 'left' : 'right',
    offset: Math.floor(i / 2) * 45 + 18,
    isRobot: activePackage.value.id === 'platinum' && i === count - 1,
  }))
})

// Moving heads on truss
const movingHeadsList = computed(() => {
  return Array.from({ length: activePackage.value.movingHeadsCount }, (_, i) => ({
    id: `head-${i + 1}`,
    delay: (i * 0.25).toFixed(2),
  }))
})

// Sparkler positions
const sparklersList = computed(() => {
  if (!activePackage.value.hasSparklers) return []
  return Array.from({ length: activePackage.value.sparklersCount }, (_, i) => ({
    id: `sparkler-${i + 1}`,
    position: i === 0 ? 'far-left' : i === 1 ? 'far-right' : i === 2 ? 'mid-left' : 'mid-right',
  }))
})

function selectPackage(pkgId) {
  activePackageId.value = pkgId
}

function sendWhatsAppQuote() {
  const pkg = activePackage.value
  const msg = encodeURIComponent(
    `¡Hola Albatros! Me interesa cotizar el paquete "${pkg.name}" (${pkg.price} MXN) para mi evento. ¿Tienen disponibilidad?`
  )
  window.open(`https://wa.me/522461234567?text=${msg}`, '_blank')
}
</script>

<template>
  <section id="paquetes" class="abt-packages-section">
    <div class="container">
      <!-- Section Header -->
      <div class="abt-section-header text-center mb-5">
        <span class="abt-kicker abt-text-gold d-inline-block mb-2">
          ★ MONTAJE VIRTUAL EN TIEMPO REAL ★
        </span>
        <h2 class="abt-display h1 text-white mb-3">
          Simulador de <span class="abt-gradient-text">Escenario &amp; Paquetes</span>
        </h2>
        <p class="abt-text-muted lead mx-auto mb-0" style="max-width: 46rem;">
          Cambia de paquete y observa cómo se transforma físicamente el escenario: más bocinas, bailarines en escena, la pista LED encendiéndose y efectos pirotécnicos al instante.
        </p>
      </div>

      <!-- Package Selection Tabs / Pills -->
      <div class="abt-package-tabs-wrapper mb-4">
        <div class="abt-package-tabs">
          <button
            v-for="pkg in packages"
            :key="pkg.id"
            class="abt-pkg-tab-btn"
            :class="{ active: activePackageId === pkg.id, popular: pkg.popular, featured: pkg.featured }"
            @click="selectPackage(pkg.id)"
          >
            <div class="abt-tab-top">
              <span v-if="pkg.popular" class="abt-tab-badge">POPULAR</span>
              <span v-else-if="pkg.featured" class="abt-tab-badge abt-badge-gold">TOP BODA</span>
              <span v-else class="abt-tab-badge-subtle">{{ pkg.capacity.split(' ')[0] }} pers.</span>
            </div>
            <span class="abt-tab-title">{{ pkg.name }}</span>
            <span class="abt-tab-price">{{ pkg.price }}</span>
          </button>
        </div>
      </div>

      <!-- Live Stage Simulator Container (The 2.5D Concert Stage) -->
      <div class="abt-stage-container mb-5">
        <!-- Live Hardware Status Counters Bar -->
        <div class="abt-stage-status-bar">
          <div class="abt-status-badge">
            <i class="bi bi-speaker-fill text-purple"></i>
            <span><strong>{{ activePackage.speakersCount }}</strong> Bocinas</span>
          </div>
          <div class="abt-status-badge">
            <i class="bi bi-lightning-charge-fill text-cyan"></i>
            <span><strong>{{ activePackage.movingHeadsCount }}</strong> Cabezas Móviles</span>
          </div>
          <div class="abt-status-badge" :class="{ 'text-muted-off': !activePackage.hasDanceFloor }">
            <i class="bi bi-grid-3x3-gap-fill" :class="activePackage.hasDanceFloor ? 'text-cyan' : 'text-white-50'"></i>
            <span>{{ activePackage.danceFloorSize }}</span>
          </div>
          <div class="abt-status-badge" :class="{ 'text-muted-off': activePackage.dancersCount === 0 }">
            <i class="bi bi-person-arms-up" :class="activePackage.dancersCount > 0 ? 'text-gold' : 'text-white-50'"></i>
            <span><strong>{{ activePackage.dancersCount }}</strong> Bailarines</span>
          </div>
          <div class="abt-status-badge" :class="{ 'text-muted-off': !activePackage.hasSparklers }">
            <i class="bi bi-stars" :class="activePackage.hasSparklers ? 'text-gold' : 'text-white-50'"></i>
            <span>{{ activePackage.hasSparklers ? `${activePackage.sparklersCount} Chisperos Fríos` : 'Sin Pirotecnia' }}</span>
          </div>
        </div>

        <!-- The Virtual Stage Viewport -->
        <div class="abt-stage-viewport">
          <!-- Ambient concert backlight & beams -->
          <div class="abt-stage-backlight" :class="`theme-${activePackage.id}`"></div>

          <!-- Top Truss Structure -->
          <div class="abt-stage-truss">
            <div class="abt-truss-beam"></div>

            <!-- Moving Heads with Light Beams -->
            <div class="abt-moving-heads-row">
              <div
                v-for="head in movingHeadsList"
                :key="head.id"
                class="abt-moving-head-fixture"
                :style="{ animationDelay: `${head.delay}s` }"
              >
                <div class="abt-head-chassis">
                  <div class="abt-head-lens"></div>
                </div>
                <!-- Projected Light Cone Beam -->
                <div class="abt-light-beam" :class="`beam-${activePackage.id}`"></div>
              </div>
            </div>
          </div>

          <!-- Stage Core Playing Field -->
          <div class="abt-stage-field">
            <!-- Left Audio Tower (Line Array & Subs) -->
            <div class="abt-audio-stack abt-audio-left">
              <span class="abt-stack-label">TORRE L</span>
              <div class="abt-speakers-column">
                <!-- Tops / Line Array items that drop in -->
                <TransitionGroup name="speaker-drop">
                  <div
                    v-for="idx in speakersPerSide"
                    :key="`l-speaker-${idx}`"
                    class="abt-speaker-box"
                    :class="{ 'is-sub': idx === 1 || idx === 2 }"
                  >
                    <div class="abt-speaker-cone"></div>
                    <div v-if="idx <= 2" class="abt-speaker-cone secondary"></div>
                    <div class="abt-speaker-brand">ALBATROS</div>
                    <!-- Audio Pulse Wave -->
                    <div class="abt-sound-wave"></div>
                  </div>
                </TransitionGroup>
              </div>
            </div>

            <!-- Stage Floor with Dance Floor (Center) -->
            <div class="abt-stage-center">
              <!-- Dance Floor Surface -->
              <div
                class="abt-dance-floor-surface"
                :class="{ 'is-active': activePackage.hasDanceFloor, [activePackage.id]: true }"
              >
                <!-- Glowing Pixel Grid when active -->
                <div v-if="activePackage.hasDanceFloor" class="abt-pixel-grid">
                  <div
                    v-for="cell in 36"
                    :key="cell"
                    class="abt-pixel-cell"
                    :style="{ animationDelay: `${(cell * 0.08) % 1.6}s` }"
                  ></div>
                </div>
                <!-- Off Stage Wooden Planks when inactive -->
                <div v-else class="abt-floor-off">
                  <span class="abt-floor-off-label">Piso Convencional (Sin Pista LED)</span>
                </div>
              </div>

              <!-- Sparkler Fountains (Pirotecnia Fría) -->
              <div
                v-for="sparkler in sparklersList"
                :key="sparkler.id"
                class="abt-sparkler-fountain"
                :class="sparkler.position"
              >
                <div class="abt-sparkler-machine"></div>
                <div class="abt-spark-particles"></div>
              </div>

              <!-- Characters Layer: DJ & Dancers -->
              <div class="abt-characters-container">
                <!-- Central DJ Booth -->
                <div class="abt-dj-booth">
                  <div class="abt-dj-figure">
                    <div class="abt-dj-head">
                      <div class="abt-headphones"></div>
                    </div>
                    <div class="abt-dj-body"></div>
                  </div>
                  <div class="abt-dj-table">
                    <div class="abt-dj-mixer">
                      <div class="abt-eq-lights"></div>
                    </div>
                    <span class="abt-dj-logo">ALBATROS DJ</span>
                  </div>
                </div>

                <!-- Dancers / Animators (Animated entrance/exit) -->
                <TransitionGroup name="dancer-stage">
                  <div
                    v-for="dancer in dancersList"
                    :key="dancer.id"
                    class="abt-dancer-figure"
                    :class="{
                      'is-robot': dancer.isRobot,
                      'side-left': dancer.side === 'left',
                      'side-right': dancer.side === 'right',
                    }"
                    :style="{
                      [dancer.side === 'left' ? 'left' : 'right']: `${dancer.offset}%`,
                    }"
                  >
                    <!-- Character Silhouette & Accessories -->
                    <div class="abt-dancer-head" :class="{ 'robot-head': dancer.isRobot }">
                      <div v-if="!dancer.isRobot" class="abt-glow-hat"></div>
                    </div>
                    <div class="abt-dancer-body" :class="{ 'robot-body': dancer.isRobot }">
                      <div class="abt-glow-stick left"></div>
                      <div class="abt-glow-stick right"></div>
                    </div>
                    <span class="abt-dancer-label">
                      {{ dancer.isRobot ? 'Robot LED' : 'Animador' }}
                    </span>
                  </div>
                </TransitionGroup>
              </div>

              <!-- Fog / Low Mist Layer -->
              <div class="abt-stage-mist"></div>
            </div>

            <!-- Right Audio Tower (Line Array & Subs) -->
            <div class="abt-audio-stack abt-audio-right">
              <span class="abt-stack-label">TORRE R</span>
              <div class="abt-speakers-column">
                <TransitionGroup name="speaker-drop">
                  <div
                    v-for="idx in speakersPerSide"
                    :key="`r-speaker-${idx}`"
                    class="abt-speaker-box"
                    :class="{ 'is-sub': idx === 1 || idx === 2 }"
                  >
                    <div class="abt-speaker-cone"></div>
                    <div v-if="idx <= 2" class="abt-speaker-cone secondary"></div>
                    <div class="abt-speaker-brand">ALBATROS</div>
                    <!-- Audio Pulse Wave -->
                    <div class="abt-sound-wave"></div>
                  </div>
                </TransitionGroup>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Package Detailed Spec Card -->
      <div class="abt-package-details-card">
        <div class="row g-4 align-items-center">
          <div class="col-lg-7">
            <div class="d-flex align-items-center gap-2 mb-2 flex-wrap">
              <span class="abt-badge-pkg-name">{{ activePackage.name }}</span>
              <span class="abt-badge-capacity">
                <i class="bi bi-people-fill me-1"></i>{{ activePackage.capacity }}
              </span>
              <span v-if="activePackage.hasDanceFloor" class="abt-badge-led-active">
                <i class="bi bi-check-circle-fill me-1"></i>Pista LED Incluida
              </span>
            </div>

            <h3 class="abt-display h2 text-white mb-2">{{ activePackage.name }}</h3>
            <p class="abt-text-muted mb-4">{{ activePackage.description }}</p>

            <!-- Features Checklist Grid -->
            <div class="row g-2">
              <div
                v-for="feat in activePackage.features"
                :key="feat"
                class="col-md-6"
              >
                <div class="abt-feature-item">
                  <i class="bi bi-check2-circle text-purple"></i>
                  <span>{{ feat }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Price & Actions Column -->
          <div class="col-lg-5 text-center text-lg-end">
            <div class="abt-price-box p-4">
              <span class="abt-price-label d-block text-white-50 small mb-1">Inversión para tu evento:</span>
              <div class="abt-price-main mb-1">
                <span class="abt-currency">$</span>
                <span class="abt-amount">{{ activePackage.price.replace('$', '') }}</span>
                <span class="abt-currency-tag">MXN</span>
              </div>
              <p class="text-white-50 small mb-4">
                *Incluye transporte, montaje, desmontaje y operadores técnicos.
              </p>

              <div class="d-flex flex-column flex-sm-row gap-2 justify-content-lg-end">
                <button
                  class="abt-btn-neon w-100"
                  @click="sendWhatsAppQuote"
                >
                  <i class="bi bi-whatsapp me-2"></i> Cotizar este paquete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.abt-packages-section {
  position: relative;
  padding: 6rem 0;
  background: radial-gradient(circle at 50% 20%, rgba(26, 20, 48, 0.75) 0%, #0a0912 90%);
  border-top: 1px solid rgba(176, 107, 255, 0.12);
  border-bottom: 1px solid rgba(176, 107, 255, 0.12);
  overflow: hidden;
}

.abt-gradient-text {
  background: linear-gradient(135deg, #ffffff 0%, #b06bff 50%, #22d3ee 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.abt-text-gold {
  color: #f0a838;
}

.abt-kicker {
  font-family: var(--abt-font-mono, monospace);
  font-size: 0.8rem;
  letter-spacing: 2px;
  font-weight: 600;
}

.text-purple {
  color: #b06bff;
}

.text-cyan {
  color: #22d3ee;
}

/* Package Tabs */
.abt-package-tabs-wrapper {
  display: flex;
  justify-content: center;
}

.abt-package-tabs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  width: 100%;
  max-width: 950px;
}

.abt-pkg-tab-btn {
  background: rgba(22, 19, 31, 0.7);
  border: 1px solid rgba(176, 107, 255, 0.2);
  border-radius: 1rem;
  padding: 1rem;
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(10px);
}

.abt-pkg-tab-btn:hover {
  border-color: rgba(176, 107, 255, 0.5);
  transform: translateY(-2px);
}

.abt-pkg-tab-btn.active {
  background: linear-gradient(135deg, rgba(35, 27, 58, 0.95), rgba(20, 16, 32, 0.95));
  border-color: #b06bff;
  box-shadow: 0 0 25px rgba(176, 107, 255, 0.35);
  transform: translateY(-4px);
}

.abt-tab-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.2rem;
}

.abt-tab-badge {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  background: #22d3ee;
  color: #0a0912;
  padding: 0.15rem 0.45rem;
  border-radius: 9999px;
}

.abt-badge-gold {
  background: #f0a838 !important;
}

.abt-tab-badge-subtle {
  font-size: 0.72rem;
  color: rgba(242, 239, 250, 0.5);
  font-family: var(--abt-font-mono, monospace);
}

.abt-tab-title {
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
}

.abt-tab-price {
  font-family: var(--abt-font-mono, monospace);
  color: #f0a838;
  font-size: 0.95rem;
  font-weight: 600;
}

/* Stage Simulator Container */
.abt-stage-container {
  background: rgba(13, 11, 20, 0.95);
  border: 1px solid rgba(176, 107, 255, 0.25);
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7);
}

/* Status Bar */
.abt-stage-status-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: rgba(22, 19, 31, 0.85);
  border-bottom: 1px solid rgba(176, 107, 255, 0.15);
}

.abt-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: #f2effa;
  background: rgba(10, 9, 18, 0.6);
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
}

.abt-status-badge.text-muted-off {
  opacity: 0.45;
  border-style: dashed;
}

/* Stage Viewport */
.abt-stage-viewport {
  position: relative;
  min-height: 480px;
  background: #07060c;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  perspective: 900px;
}

/* Backlight Glow */
.abt-stage-backlight {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 650px;
  height: 250px;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
  pointer-events: none;
  transition: all 0.8s ease;
}

.abt-stage-backlight.theme-basico {
  background: #7e3aff;
}
.abt-stage-backlight.theme-silver {
  background: linear-gradient(90deg, #22d3ee, #b06bff);
}
.abt-stage-backlight.theme-gold {
  background: linear-gradient(90deg, #f0a838, #b06bff);
  opacity: 0.5;
}
.abt-stage-backlight.theme-platinum {
  background: linear-gradient(90deg, #ff0077, #b06bff, #00f0ff);
  opacity: 0.65;
}

/* Truss on top */
.abt-stage-truss {
  position: relative;
  z-index: 5;
  width: 100%;
  padding: 1rem 3rem 0;
}

.abt-truss-beam {
  width: 100%;
  height: 14px;
  background: repeating-linear-gradient(
    45deg,
    #4a455a,
    #4a455a 6px,
    #252233 6px,
    #252233 12px
  );
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.6);
}

.abt-moving-heads-row {
  display: flex;
  justify-content: space-evenly;
  margin-top: -2px;
}

.abt-moving-head-fixture {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.abt-head-chassis {
  width: 22px;
  height: 22px;
  background: #1d1a29;
  border: 1px solid #71688d;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px rgba(176, 107, 255, 0.4);
}

.abt-head-lens {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 0 12px #22d3ee, 0 0 20px #b06bff;
}

/* Projected Light Beams */
.abt-light-beam {
  position: absolute;
  top: 22px;
  width: 60px;
  height: 380px;
  clip-path: polygon(45% 0%, 55% 0%, 100% 100%, 0% 100%);
  opacity: 0.35;
  pointer-events: none;
  transform-origin: top center;
  animation: beam-sweep 4s ease-in-out infinite alternate;
}

@keyframes beam-sweep {
  0% {
    transform: rotate(-15deg);
  }
  100% {
    transform: rotate(15deg);
  }
}

.beam-basico {
  background: linear-gradient(180deg, rgba(176, 107, 255, 0.7) 0%, transparent 100%);
}
.beam-silver {
  background: linear-gradient(180deg, rgba(34, 211, 238, 0.7) 0%, transparent 100%);
}
.beam-gold {
  background: linear-gradient(180deg, rgba(240, 168, 56, 0.7) 0%, transparent 100%);
}
.beam-platinum {
  background: linear-gradient(180deg, rgba(255, 107, 255, 0.8) 0%, transparent 100%);
}

/* Stage Playing Field */
.abt-stage-field {
  position: relative;
  z-index: 4;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 2rem 1.5rem;
  height: 380px;
}

/* Audio Stacks (Speakers) */
.abt-audio-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 6;
  width: 80px;
}

.abt-stack-label {
  font-family: var(--abt-font-mono, monospace);
  font-size: 0.65rem;
  color: #b06bff;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 0.25rem;
}

.abt-speakers-column {
  display: flex;
  flex-direction: column-reverse; /* Stacks upwards */
  gap: 4px;
  align-items: center;
}

.abt-speaker-box {
  width: 70px;
  height: 44px;
  background: #171520;
  border: 1px solid #3d3752;
  border-radius: 4px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 4px;
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.7);
}

.abt-speaker-box.is-sub {
  width: 80px;
  height: 52px;
  background: #12101b;
  border-color: #554d72;
}

.abt-speaker-cone {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: radial-gradient(circle, #2a253b 30%, #0d0b13 70%);
  border: 2px solid #5a5177;
  position: relative;
  animation: bass-pulse 0.8s infinite alternate ease-in-out;
}

.abt-speaker-cone.secondary {
  width: 22px;
  height: 22px;
}

@keyframes bass-pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 2px rgba(176, 107, 255, 0.2);
  }
  100% {
    transform: scale(1.06);
    box-shadow: 0 0 10px rgba(176, 107, 255, 0.6);
  }
}

.abt-speaker-brand {
  position: absolute;
  bottom: 2px;
  font-size: 0.45rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.4);
}

/* Sound wave pulses */
.abt-sound-wave {
  position: absolute;
  inset: -6px;
  border: 1px solid rgba(176, 107, 255, 0.25);
  border-radius: 8px;
  opacity: 0;
  pointer-events: none;
  animation: wave-expand 1.6s infinite ease-out;
}

@keyframes wave-expand {
  0% {
    transform: scale(0.95);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.35);
    opacity: 0;
  }
}

/* Center Stage Floor */
.abt-stage-center {
  position: relative;
  flex-grow: 1;
  max-width: 680px;
  height: 320px;
  margin: 0 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

/* Dance Floor */
.abt-dance-floor-surface {
  position: absolute;
  bottom: 0;
  left: 5%;
  right: 5%;
  height: 150px;
  transform: rotateX(55deg);
  transform-origin: bottom center;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.8);
}

.abt-dance-floor-surface.is-active {
  background: #0f0d19;
  border: 2px solid #b06bff;
  box-shadow: 0 0 30px rgba(176, 107, 255, 0.5), inset 0 0 25px rgba(34, 211, 238, 0.3);
}

.abt-pixel-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(6, 1fr);
  width: 100%;
  height: 100%;
  gap: 3px;
  padding: 3px;
}

.abt-pixel-cell {
  background: #231c38;
  border-radius: 2px;
  animation: pixel-pulse 2s infinite alternate ease-in-out;
}

@keyframes pixel-pulse {
  0% {
    background: #251b3d;
    box-shadow: inset 0 0 4px rgba(176, 107, 255, 0.2);
  }
  50% {
    background: #00e5ff;
    box-shadow: inset 0 0 8px rgba(0, 229, 255, 0.8);
  }
  100% {
    background: #b06bff;
    box-shadow: inset 0 0 8px rgba(176, 107, 255, 0.8);
  }
}

.abt-floor-off {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #1c1926 0%, #100e18 100%);
  border: 1px solid #2f2a40;
  display: flex;
  align-items: center;
  justify-content: center;
}

.abt-floor-off-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.3);
  font-family: var(--abt-font-mono, monospace);
  letter-spacing: 1px;
}

/* Sparkler Fountains */
.abt-sparkler-fountain {
  position: absolute;
  bottom: 60px;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.abt-sparkler-fountain.far-left {
  left: 8%;
}
.abt-sparkler-fountain.far-right {
  right: 8%;
}
.abt-sparkler-fountain.mid-left {
  left: 24%;
}
.abt-sparkler-fountain.mid-right {
  right: 24%;
}

.abt-sparkler-machine {
  width: 18px;
  height: 22px;
  background: #2a253d;
  border: 1px solid #f0a838;
  border-radius: 3px;
}

.abt-spark-particles {
  position: absolute;
  bottom: 22px;
  width: 16px;
  height: 130px;
  background: linear-gradient(0deg, #fff7c2, #f0a838 50%, transparent 100%);
  filter: blur(1px);
  clip-path: polygon(40% 100%, 60% 100%, 100% 0%, 0% 0%);
  animation: spark-spray 0.15s infinite alternate ease-in-out;
  box-shadow: 0 0 20px #f0a838;
}

@keyframes spark-spray {
  0% {
    height: 110px;
    opacity: 0.85;
    transform: scaleX(0.85);
  }
  100% {
    height: 145px;
    opacity: 1;
    transform: scaleX(1.15);
  }
}

/* Characters Container */
.abt-characters-container {
  position: relative;
  z-index: 6;
  width: 100%;
  height: 160px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

/* DJ Booth */
.abt-dj-booth {
  position: absolute;
  bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 8;
}

.abt-dj-figure {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: -4px;
  animation: dj-bob 0.8s infinite alternate ease-in-out;
}

@keyframes dj-bob {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-4px);
  }
}

.abt-dj-head {
  width: 18px;
  height: 18px;
  background: #201c2e;
  border: 1px solid #7c729e;
  border-radius: 50%;
  position: relative;
}

.abt-headphones {
  position: absolute;
  top: -2px;
  left: -3px;
  right: -3px;
  bottom: 4px;
  border-top: 3px solid #b06bff;
  border-left: 3px solid #b06bff;
  border-right: 3px solid #b06bff;
  border-radius: 8px 8px 0 0;
}

.abt-dj-body {
  width: 26px;
  height: 24px;
  background: #181524;
  border-radius: 6px 6px 0 0;
}

.abt-dj-table {
  width: 100px;
  height: 38px;
  background: #1a1627;
  border: 1px solid #b06bff;
  border-radius: 4px;
  box-shadow: 0 0 15px rgba(176, 107, 255, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 3px;
}

.abt-dj-mixer {
  width: 80%;
  height: 10px;
  background: #0f0d18;
  border-radius: 2px;
  overflow: hidden;
}

.abt-eq-lights {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #00ffaa, #ffbb00, #ff0055);
  animation: eq-pulse 0.4s infinite alternate;
}

@keyframes eq-pulse {
  0% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}

.abt-dj-logo {
  font-family: var(--abt-font-mono, monospace);
  font-size: 0.55rem;
  font-weight: 800;
  color: #f0a838;
}

/* Dancers */
.abt-dancer-figure {
  position: absolute;
  bottom: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 7;
  animation: dancer-jump 0.6s infinite alternate ease-in-out;
}

@keyframes dancer-jump {
  0% {
    transform: translateY(0) rotate(-2deg);
  }
  100% {
    transform: translateY(-8px) rotate(2deg);
  }
}

.abt-dancer-head {
  width: 16px;
  height: 16px;
  background: #252037;
  border: 1px solid #22d3ee;
  border-radius: 50%;
  position: relative;
}

.abt-glow-hat {
  position: absolute;
  top: -4px;
  left: -2px;
  right: -2px;
  height: 4px;
  background: #22d3ee;
  border-radius: 2px;
  box-shadow: 0 0 8px #22d3ee;
}

.abt-dancer-body {
  width: 22px;
  height: 32px;
  background: #171424;
  border-radius: 4px;
  position: relative;
}

.abt-glow-stick {
  position: absolute;
  width: 3px;
  height: 18px;
  background: #ff00ea;
  box-shadow: 0 0 10px #ff00ea;
  top: -2px;
}

.abt-glow-stick.left {
  left: -6px;
  transform: rotate(-35deg);
}

.abt-glow-stick.right {
  right: -6px;
  transform: rotate(35deg);
}

.abt-dancer-label {
  font-size: 0.55rem;
  font-weight: 700;
  color: #22d3ee;
  margin-top: 3px;
  text-shadow: 0 0 6px rgba(34, 211, 238, 0.8);
}

/* Giant LED Robot for Platinum */
.abt-dancer-figure.is-robot {
  transform: scale(1.35) translateY(-8px);
}

.robot-head {
  background: #0f0d1a !important;
  border-color: #ff0055 !important;
  box-shadow: 0 0 12px #ff0055;
}

.robot-body {
  background: #12101e !important;
  border: 1px solid #00f0ff;
  box-shadow: 0 0 15px #00f0ff;
}

/* Stage Mist / Fog */
.abt-stage-mist {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: linear-gradient(0deg, rgba(255, 255, 255, 0.12), transparent);
  filter: blur(8px);
  pointer-events: none;
  z-index: 9;
}

/* TRANSITIONS */

/* Speaker drop with elastic physics */
.speaker-drop-enter-active {
  transition: all 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.speaker-drop-leave-active {
  transition: all 0.35s ease-in;
}
.speaker-drop-enter-from {
  opacity: 0;
  transform: translateY(-40px) scale(0.85);
}
.speaker-drop-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.85);
}

/* Dancer stage entrance/exit */
.dancer-stage-enter-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.dancer-stage-leave-active {
  transition: all 0.4s ease-in;
}
.dancer-stage-enter-from.side-left {
  opacity: 0;
  transform: translateX(-50px) scale(0.7);
}
.dancer-stage-enter-from.side-right {
  opacity: 0;
  transform: translateX(50px) scale(0.7);
}
.dancer-stage-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.5);
}

/* Details Card */
.abt-package-details-card {
  background: rgba(22, 19, 31, 0.85);
  border: 1px solid rgba(176, 107, 255, 0.25);
  border-radius: 1.5rem;
  padding: 2.5rem;
  backdrop-filter: blur(12px);
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.4);
}

.abt-badge-pkg-name {
  background: rgba(176, 107, 255, 0.2);
  border: 1px solid rgba(176, 107, 255, 0.5);
  color: #f2effa;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.3rem 0.8rem;
  border-radius: 9999px;
}

.abt-badge-capacity {
  background: rgba(240, 168, 56, 0.15);
  border: 1px solid rgba(240, 168, 56, 0.4);
  color: #f0a838;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.3rem 0.8rem;
  border-radius: 9999px;
}

.abt-badge-led-active {
  background: rgba(34, 211, 238, 0.15);
  border: 1px solid rgba(34, 211, 238, 0.4);
  color: #22d3ee;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.3rem 0.8rem;
  border-radius: 9999px;
}

.abt-feature-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.92rem;
  color: #f2effa;
}

.abt-price-box {
  background: rgba(15, 12, 23, 0.8);
  border: 1px solid rgba(176, 107, 255, 0.25);
  border-radius: 1.25rem;
}

.abt-price-main {
  display: flex;
  align-items: baseline;
  justify-content: center;
}

@media (min-width: 992px) {
  .abt-price-main {
    justify-content: flex-end;
  }
}

.abt-currency {
  font-size: 1.5rem;
  color: #f0a838;
  font-weight: 700;
}

.abt-amount {
  font-size: 2.75rem;
  font-weight: 800;
  color: #ffffff;
  font-family: var(--abt-font-display, serif);
  line-height: 1;
}

.abt-currency-tag {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  margin-left: 0.4rem;
}

/* Responsiveness */
@media (max-width: 992px) {
  .abt-package-tabs {
    grid-template-columns: repeat(2, 1fr);
  }
  .abt-stage-viewport {
    min-height: 440px;
  }
}

@media (max-width: 600px) {
  .abt-package-tabs {
    grid-template-columns: 1fr;
  }
  .abt-audio-stack {
    width: 55px;
  }
  .abt-speaker-box {
    width: 50px;
    height: 34px;
  }
  .abt-speaker-box.is-sub {
    width: 58px;
    height: 40px;
  }
  .abt-stage-field {
    padding: 0 0.5rem 1rem;
  }
  .abt-stage-center {
    margin: 0 0.5rem;
  }
}
</style>
