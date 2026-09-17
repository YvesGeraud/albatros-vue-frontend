<script setup>
import { onMounted, ref, computed, onUnmounted } from 'vue'
import { fetchTestimonials } from '../../api/testimonials'

const defaultTestimonials = [
  {
    id: 'dt-1',
    customer_name: 'Mariana & Carlos',
    event_type: 'Boda de Gala · Hacienda Soltepec',
    rating: 5,
    content: '¡La mejor decisión de nuestra boda! El vals con la pista LED y la niebla baja fue de película. Los invitados no pararon de bailar ni un solo minuto.',
  },
  {
    id: 'dt-2',
    customer_name: 'Familia Paredes Morales',
    event_type: 'XV Años · Salón Balvanera',
    rating: 5,
    content: 'La animación de los bailarines y los robots LED dejaron a todos los jóvenes impactados. El audio sonó potente pero súper claro, sin aturdir.',
  },
  {
    id: 'dt-3',
    customer_name: 'Ing. Roberto Tlaxcalteca',
    event_type: 'Aniversario Corporativo',
    rating: 5,
    content: 'Puntualidad absoluta en el montaje y una sincronización impecable de luces para la entrega de reconocimientos y la fiesta posterior. 100% recomendados.',
  },
  {
    id: 'dt-4',
    customer_name: 'Sofia & Rodrigo',
    event_type: 'Boda Civil & Fiesta de Noche',
    rating: 5,
    content: 'El paquete Gold superó todas nuestras expectativas. Las chisperos de pirotecnia fría en nuestra entrada fueron el momento más fotografiado de la noche.',
  },
  {
    id: 'dt-5',
    customer_name: 'Generación Medicina UATx',
    event_type: 'Cena Baile de Graduación',
    rating: 5,
    content: 'Llenaron una pista de más de 400 personas con la mejor selección musical y luces robóticas de primer nivel. ¡Inolvidable!',
  },
]

const testimonials = ref(defaultTestimonials)
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
    const data = await fetchTestimonials()
    if (data && data.length > 0) {
      testimonials.value = [...data, ...defaultTestimonials]
    }
    if (testimonials.value.length > visibleCount.value) {
      startAutoplay()
    }
  } catch {
    // Keep default testimonials
  }
})

onUnmounted(() => {
  stopAutoplay()
  window.removeEventListener('resize', updateVisibleCount)
})
</script>

<template>
  <section
    id="testimonios"
    class="abt-section"
    @mouseenter="stopAutoplay"
    @mouseleave="startAutoplay"
  >
    <div class="container">
      <div class="abt-section-header text-center mb-5">
        <span class="abt-kicker abt-text-gold d-inline-block mb-2">★ OPINIONES &amp; RESEÑAS REALES ★</span>
        <h2 class="abt-display h1 text-white mb-2">Lo Que Dicen Nuestros Clientes</h2>
        <p class="abt-text-muted lead mx-auto mb-0" style="max-width: 40rem;">
          Quienes ya vivieron una fiesta con Albatros te cuentan su experiencia.
        </p>
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
