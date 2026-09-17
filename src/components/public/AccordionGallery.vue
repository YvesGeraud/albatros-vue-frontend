<script setup>
import { ref } from 'vue'

const activeDecade = ref('current')

const decades = [
  {
    id: '70s',
    period: "70's",
    badge: '1970 - 1979',
    genre: 'Disco, Funk & Soul',
    title: 'Fiebre Disco & Nacimiento del Baile',
    description: 'Revive la era de las bolas de espejos, el groove del bajo y pistas clásicas. Recreamos la ambientación retro con mezclas icónicas de Bee Gees, Earth Wind & Fire, ABBA y Donna Summer.',
    setup: ['Bola Disco LED', 'Audio Cálido Hi-Fi', 'Iluminación Vintage'],
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    color: '#f0a838', // Amber / Gold
  },
  {
    id: '80s',
    period: "80's",
    badge: '1980 - 1989',
    genre: 'Synthpop, Rock en Español & Pop',
    title: 'La Revolución Neón & Rock Ochentero',
    description: 'Sintetizadores vibrantes, rock clásico y el pop de Michael Jackson, Queen, Soda Stereo y Timbiriche. Efectos de humo y haces de luz magenta y cian que transportan a la era retro.',
    setup: ['Láser Neón Magenta', 'Máquinas de Humo', 'Cabezas Móviles Beam'],
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
    color: '#ff6bff', // Neon Pink / Magenta
  },
  {
    id: '90s',
    period: "90's",
    badge: '1990 - 1999',
    genre: 'Eurodance, Pop Latino & Cumbia',
    title: 'Explosión de Pista, Cumbia & Éxitos Latinos',
    description: 'De los himnos de eurodance y techno noventero a la cumbia sonidera y la fiesta latina que llena la pista. Refuerzo de graves profundos que retumban en el pecho y animación constante.',
    setup: ['Subwoofers de 18"', 'Animación en Vivo', 'Estructuras Truss'],
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    color: '#22d3ee', // Cyan
  },
  {
    id: '00s',
    period: "2000's",
    badge: '2000 - 2009',
    genre: 'Reggaetón Clásico, Electrónica & Pop',
    title: 'La Era Digital & El Reggaetón Clásico',
    description: 'Los años dorados del perreo clásico (Daddy Yankee, Don Omar), los éxitos de Black Eyed Peas y música de club. Consolas digitales y luces robóticas calibradas al segundo.',
    setup: ['Consolas Digitales', 'Iluminación DMX', 'Show de Animación'],
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    color: '#b06bff', // Purple
  },
  {
    id: 'current',
    period: '2010 - Hoy',
    badge: '2010 - Actualidad',
    genre: 'Pistas LED, Festivales & Éxitos Globales',
    title: 'Espectáculo Total & Producción de Vanguardia',
    description: 'La experiencia audiovisual definitiva. Pistas de baile LED Pixel interactivas, audio Line Array de alta gama, pirotecnia fría y los éxitos globales y de regional más escuchados del momento.',
    setup: ['Pistas LED Pixel', 'Line Array Concert', 'Pirotecnia Fría'],
    image: 'https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=1200&q=80',
    color: '#00f0ff', // Electric Cyan
  },
]
</script>

<template>
  <section id="trayectoria" class="abt-accordion-gallery-section">
    <div class="container">
      <!-- Section Header with Trayectoria & Versatility Focus -->
      <div class="abt-gallery-intro text-center mb-5">
        <span class="abt-kicker abt-text-gold d-inline-block mb-2">
          ★ NUESTRA TRAYECTORIA &amp; VERSATILIDAD ★
        </span>
        <h2 class="abt-display h1 text-white mb-3">
          Más de 4 Décadas de Música, <span class="abt-gradient-text">Energía y Producción</span>
        </h2>
        <p class="abt-text-muted lead mx-auto mb-0" style="max-width: 46rem;">
          Conoce la evolución de Albatros a través de las décadas. Desde el calor del vinil y el disco de los 70's hasta las mega producciones con pistas LED y audio Line Array de vanguardia, dominamos cada época y formato de evento.
        </p>
      </div>

      <!-- Accordion Gallery Container -->
      <div class="abt-accordion-wrapper">
        <div
          v-for="item in decades"
          :key="item.id"
          class="abt-accordion-panel"
          :class="{ active: activeDecade === item.id }"
          @click="activeDecade = item.id"
          @mouseenter="activeDecade = item.id"
        >
          <!-- Background Image with Overlay -->
          <div
            class="abt-accordion-bg"
            :style="{ backgroundImage: `url(${item.image})` }"
          ></div>
          <div class="abt-accordion-gradient"></div>

          <!-- Collapsed Label (Visible when panel is narrow) -->
          <div class="abt-collapsed-content">
            <span class="abt-collapsed-period">{{ item.period }}</span>
            <span class="abt-collapsed-genre">{{ item.genre }}</span>
          </div>

          <!-- Expanded Content (Visible when active) -->
          <div class="abt-expanded-content">
            <div class="abt-expanded-inner">
              <div class="d-flex align-items-center gap-2 mb-2 flex-wrap">
                <span class="abt-badge-decade" :style="{ borderColor: item.color, color: item.color }">
                  <i class="bi bi-disc-fill me-1"></i> {{ item.badge }}
                </span>
                <span class="abt-badge-genre">
                  {{ item.genre }}
                </span>
              </div>

              <h3 class="abt-panel-title abt-display">{{ item.title }}</h3>
              <p class="abt-panel-desc mb-3">{{ item.description }}</p>

              <!-- Setup highlights -->
              <div class="abt-panel-setup">
                <span class="abt-setup-label">Equipamiento &amp; Montaje:</span>
                <div class="d-flex gap-2 flex-wrap mt-1">
                  <span
                    v-for="tag in item.setup"
                    :key="tag"
                    class="abt-setup-tag"
                  >
                    <i class="bi bi-check-circle-fill me-1" :style="{ color: item.color }"></i>
                    {{ tag }}
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
.abt-accordion-gallery-section {
  padding: 5.5rem 0;
  background: radial-gradient(circle at 50% 10%, rgba(22, 19, 31, 0.8) 0%, #0a0912 100%);
  position: relative;
  overflow: hidden;
}

.abt-kicker {
  font-family: var(--abt-font-mono);
  font-size: 0.82rem;
  letter-spacing: 2px;
  font-weight: 600;
}

.abt-text-gold {
  color: #f0a838;
}

.abt-gradient-text {
  background: linear-gradient(135deg, #ffffff 0%, #b06bff 50%, #22d3ee 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Accordion Outer Wrapper */
.abt-accordion-wrapper {
  display: flex;
  height: 520px;
  width: 100%;
  gap: 0.75rem;
  border-radius: 24px;
  overflow: hidden;
}

/* Individual Panel */
.abt-accordion-panel {
  position: relative;
  flex: 1;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  background: #16131f;
  border: 1px solid rgba(176, 107, 255, 0.15);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  transition: flex 0.65s cubic-bezier(0.25, 1, 0.5, 1),
              border-color 0.3s ease,
              box-shadow 0.3s ease;
  user-select: none;
}

.abt-accordion-panel:hover {
  border-color: rgba(176, 107, 255, 0.45);
}

.abt-accordion-panel.active {
  flex: 4.5;
  border-color: rgba(176, 107, 255, 0.6);
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.6), 0 0 30px rgba(176, 107, 255, 0.2);
}

/* Background Image */
.abt-accordion-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: saturate(0.9) brightness(0.65);
  transform: scale(1.05);
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), filter 0.5s ease;
}

.abt-accordion-panel:hover .abt-accordion-bg {
  filter: saturate(1.1) brightness(0.75);
}

.abt-accordion-panel.active .abt-accordion-bg {
  transform: scale(1);
  filter: saturate(1.15) brightness(0.8);
}

/* Dark Gradient Vignette */
.abt-accordion-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(10, 9, 18, 0.2) 0%,
    rgba(10, 9, 18, 0.5) 40%,
    rgba(10, 9, 18, 0.95) 100%
  );
  transition: opacity 0.4s ease;
}

/* Collapsed Content (Vertical Decade Name) */
.abt-collapsed-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 2.5rem;
  z-index: 3;
  opacity: 1;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.abt-accordion-panel.active .abt-collapsed-content {
  opacity: 0;
}

.abt-collapsed-period {
  font-family: var(--abt-font-display);
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffffff;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  letter-spacing: 2px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
}

.abt-collapsed-genre {
  display: none;
}

/* Expanded Content */
.abt-expanded-content {
  position: absolute;
  inset: 0;
  z-index: 4;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2.5rem;
  opacity: 0;
  transform: translateY(20px);
  pointer-events: none;
  transition: opacity 0.5s ease 0.15s, transform 0.5s cubic-bezier(0.25, 1, 0.5, 1) 0.15s;
}

.abt-accordion-panel.active .abt-expanded-content {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.abt-expanded-inner {
  max-width: 42rem;
}

.abt-badge-decade {
  padding: 0.3rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-family: var(--abt-font-mono);
  font-weight: 700;
  background: rgba(10, 9, 18, 0.7);
  border: 1px solid;
  backdrop-filter: blur(8px);
}

.abt-badge-genre {
  padding: 0.3rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  color: #f2effa;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
}

.abt-panel-title {
  color: #ffffff;
  font-size: 1.85rem;
  font-weight: 700;
  margin-bottom: 0.6rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
}

.abt-panel-desc {
  color: #d1cbe5;
  font-size: 0.95rem;
  line-height: 1.55;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
}

.abt-setup-label {
  font-size: 0.78rem;
  font-family: var(--abt-font-mono);
  color: #9d97b3;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.abt-setup-tag {
  display: inline-flex;
  align-items: center;
  font-size: 0.82rem;
  padding: 0.3rem 0.75rem;
  background: rgba(22, 19, 31, 0.75);
  border: 1px solid rgba(176, 107, 255, 0.25);
  border-radius: 9999px;
  color: #f2effa;
  backdrop-filter: blur(6px);
}

/* Responsive Behavior for Mobile & Tablets */
@media (max-width: 991px) {
  .abt-accordion-wrapper {
    flex-direction: column;
    height: auto;
    gap: 0.85rem;
  }

  .abt-accordion-panel {
    flex: none;
    height: 120px;
    transition: height 0.6s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.3s ease;
  }

  .abt-accordion-panel.active {
    flex: none;
    height: 400px;
  }

  .abt-collapsed-content {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 1.5rem;
    height: 100%;
  }

  .abt-collapsed-period {
    writing-mode: horizontal-tb;
    transform: none;
    font-size: 1.5rem;
  }

  .abt-collapsed-genre {
    display: inline-block;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.85rem;
  }

  .abt-expanded-content {
    padding: 1.5rem;
  }

  .abt-panel-title {
    font-size: 1.4rem;
  }

  .abt-panel-desc {
    font-size: 0.88rem;
  }
}
</style>
