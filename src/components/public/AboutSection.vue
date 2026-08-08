<script setup>
import { computed } from 'vue'
import { useSiteStore } from '../../stores/site'

const siteStore = useSiteStore()
const aboutTitle = computed(() => siteStore.aboutTitle)
const aboutDescription = computed(() => siteStore.aboutDescription)
const aboutBullets = computed(() => siteStore.aboutBullets)
const aboutImageUrl = computed(() => siteStore.aboutImageUrl)

const hasContent = computed(() => !!aboutDescription.value)
</script>

<template>
  <section v-if="hasContent" id="nosotros" class="abt-section">
    <div class="container">
      <div class="abt-section-header text-center mb-5">
        <span class="abt-kicker abt-text-cyan d-block mb-2">CONÓCENOS</span>
        <h2 class="abt-display h2">{{ aboutTitle }}</h2>
      </div>

      <div class="row justify-content-center">
        <div class="col-lg-10">
          <div class="abt-about-card">
            <!-- Decorative quote mark -->
            <div class="abt-about-accent" aria-hidden="true">
              <i class="bi bi-music-note-beamed"></i>
            </div>

            <div class="row g-4 align-items-center">
              <!-- Content Column -->
              <div :class="aboutImageUrl ? 'col-md-7' : 'col-12'">
                <div class="abt-about-content">
                  <p class="mb-4">{{ aboutDescription }}</p>
                  
                  <ul v-if="aboutBullets.length" class="abt-about-list">
                    <li v-for="(bullet, index) in aboutBullets" :key="index">
                      {{ bullet }}
                    </li>
                  </ul>
                </div>
              </div>
              
              <!-- Image Column -->
              <div v-if="aboutImageUrl" class="col-md-5">
                <div class="abt-about-image-wrapper">
                  <img :src="aboutImageUrl" alt="Sobre Grupo Albatros" class="img-fluid rounded shadow" />
                </div>
              </div>
            </div>

            <!-- Stats row -->
            <div class="abt-about-stats">
              <div class="abt-about-stat">
                <span class="abt-about-stat-value abt-text-purple">35+</span>
                <span class="abt-about-stat-label">Años de trayectoria</span>
              </div>
              <div class="abt-about-stat">
                <span class="abt-about-stat-value abt-text-cyan">2800+</span>
                <span class="abt-about-stat-label">Eventos realizados</span>
              </div>
              <div class="abt-about-stat">
                <span class="abt-about-stat-value abt-text-purple">11</span>
                <span class="abt-about-stat-label">Músicos en escena</span>
              </div>
              <div class="abt-about-stat">
                <span class="abt-about-stat-value abt-text-cyan">100%</span>
                <span class="abt-about-stat-label">Música en vivo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.abt-about-card {
  background: var(--abt-surface);
  border: 1px solid var(--abt-purple-dim);
  border-radius: 1.5rem;
  padding: 3rem 2.5rem;
  position: relative;
  overflow: hidden;
}

.abt-about-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--abt-purple), var(--abt-cyan));
}

.abt-about-accent {
  position: absolute;
  top: 1.5rem;
  right: 2rem;
  font-size: 4rem;
  color: rgba(176, 107, 255, 0.1);
  line-height: 1;
  pointer-events: none;
}

.abt-about-content {
  color: var(--abt-text-muted);
  font-size: 1.05rem;
  line-height: 1.8;
}

.abt-about-list {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
}

.abt-about-list li {
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
  color: var(--abt-text);
}

.abt-about-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--abt-cyan);
  font-weight: 700;
}

.abt-about-image-wrapper {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.abt-about-image-wrapper img {
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform var(--abt-transition-smooth);
}

.abt-about-image-wrapper:hover img {
  transform: scale(1.05);
}

.abt-about-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.abt-about-stat {
  text-align: center;
}

.abt-about-stat-value {
  display: block;
  font-family: var(--abt-font-display);
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 0.3rem;
}

.abt-about-stat-label {
  display: block;
  font-size: 0.8rem;
  color: var(--abt-text-muted);
  letter-spacing: 0.03em;
}

@media (max-width: 767.98px) {
  .abt-about-card {
    padding: 2rem 1.5rem;
  }

  .abt-about-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }

  .abt-about-stat-value {
    font-size: 1.6rem;
  }
}
</style>
