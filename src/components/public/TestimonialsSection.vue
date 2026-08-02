<script setup>
import { onMounted, ref, computed, onUnmounted } from 'vue'
import { fetchTestimonials } from '../../api/testimonials'

const testimonials = ref([])
const currentIndex = ref(0)
let autoplayTimer = null

const visibleCount = ref(3)

function updateVisibleCount() {
  const w = window.innerWidth
  if (w < 576) visibleCount.value = 1
  else if (w < 992) visibleCount.value = 2
  else visibleCount.value = 3
}

const totalPages = computed(() =>
  Math.ceil(testimonials.value.length / visibleCount.value)
)

const visibleTestimonials = computed(() => {
  const start = currentIndex.value * visibleCount.value
  return testimonials.value.slice(start, start + visibleCount.value)
})

function next() {
  currentIndex.value = (currentIndex.value + 1) % totalPages.value
}

function prev() {
  currentIndex.value = currentIndex.value > 0
    ? currentIndex.value - 1
    : totalPages.value - 1
}

function startAutoplay() {
  autoplayTimer = setInterval(next, 5000)
}

function stopAutoplay() {
  clearInterval(autoplayTimer)
}

onMounted(async () => {
  updateVisibleCount()
  window.addEventListener('resize', updateVisibleCount)
  try {
    testimonials.value = await fetchTestimonials()
    if (testimonials.value.length > visibleCount.value) {
      startAutoplay()
    }
  } catch {
    testimonials.value = []
  }
})

onUnmounted(() => {
  stopAutoplay()
  window.removeEventListener('resize', updateVisibleCount)
})
</script>

<template>
  <section
    v-if="testimonials.length"
    class="abt-section"
    id="testimonials"
    @mouseenter="stopAutoplay"
    @mouseleave="startAutoplay"
  >
    <div class="container">
      <div class="abt-section-header">
        <div class="abt-section-line"></div>
        <h2 class="abt-display">Lo que dicen nuestros clientes</h2>
        <p>Quienes ya bailaron con nosotros lo confirman.</p>
      </div>

      <div class="row g-4">
        <div
          v-for="testimonial in visibleTestimonials"
          :key="testimonial.id"
          class="col-sm-6 col-lg-4"
        >
          <div class="abt-testimonial-card">
            <span class="abt-testimonial-quote">"</span>

            <!-- Rating -->
            <div v-if="testimonial.rating" class="mb-3">
              <span
                v-for="star in 5"
                :key="star"
                :style="{ color: star <= testimonial.rating ? 'var(--abt-amber)' : 'rgba(255,255,255,0.15)' }"
                style="font-size: 1rem;"
              >★</span>
            </div>

            <!-- Content -->
            <p class="flex-grow-1 fst-italic mb-3" style="color: var(--abt-text); font-size: 0.95rem; line-height: 1.7;">
              "{{ testimonial.content }}"
            </p>

            <!-- Author -->
            <div class="d-flex align-items-center gap-3 mt-auto pt-3" style="border-top: 1px solid var(--abt-purple-dim);">
              <img
                v-if="testimonial.avatar_url"
                :src="testimonial.avatar_url"
                class="rounded-circle"
                style="width: 48px; height: 48px; object-fit: cover; border: 2px solid var(--abt-purple-dim);"
                :alt="testimonial.customer_name"
              />
              <div
                v-else
                class="rounded-circle d-flex align-items-center justify-content-center"
                style="width: 48px; height: 48px; background: linear-gradient(135deg, var(--abt-purple), var(--abt-cyan)); font-weight: 700; font-size: 1.1rem; color: #0a0912; flex-shrink: 0;"
              >
                {{ testimonial.customer_name?.charAt(0)?.toUpperCase() }}
              </div>
              <div>
                <div class="fw-semibold" style="color: var(--abt-text);">{{ testimonial.customer_name }}</div>
                <div v-if="testimonial.event_type" class="abt-mono small abt-text-muted">{{ testimonial.event_type }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Carousel nav -->
      <div v-if="totalPages > 1" class="d-flex justify-content-center align-items-center gap-3 mt-4">
        <button class="abt-carousel-btn" @click="prev" aria-label="Anterior">
          <i class="bi bi-chevron-left"></i>
        </button>
        <div class="d-flex gap-2">
          <button
            v-for="page in totalPages"
            :key="page"
            class="abt-carousel-dot"
            :class="{ active: currentIndex === page - 1 }"
            @click="currentIndex = page - 1"
            :aria-label="`Página ${page}`"
          ></button>
        </div>
        <button class="abt-carousel-btn" @click="next" aria-label="Siguiente">
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.abt-carousel-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid var(--abt-purple-dim);
  background: transparent;
  cursor: pointer;
  padding: 0;
  transition: all var(--abt-transition-fast);
}
.abt-carousel-dot.active {
  background: var(--abt-purple);
  border-color: var(--abt-purple);
  transform: scale(1.2);
}
</style>
