<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import EventCard from './EventCard.vue'

const props = defineProps({
  events: { type: Array, required: true },
  title: { type: String, default: 'Eventos recientes' },
  subtitle: { type: String, default: '' },
})

const currentPage = ref(0)
const cardsPerPage = ref(3)
const containerRef = ref(null)

const totalPages = computed(() =>
  Math.ceil(props.events.length / cardsPerPage.value)
)

const visibleEvents = computed(() => {
  const start = currentPage.value * cardsPerPage.value
  return props.events.slice(start, start + cardsPerPage.value)
})

function next() {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
  } else {
    currentPage.value = 0
  }
}

function prev() {
  if (currentPage.value > 0) {
    currentPage.value--
  } else {
    currentPage.value = totalPages.value - 1
  }
}

function updateCardsPerPage() {
  const width = window.innerWidth
  if (width < 576) cardsPerPage.value = 1
  else if (width < 992) cardsPerPage.value = 2
  else cardsPerPage.value = 3
  /* Reset to a valid page after resize */
  if (currentPage.value >= totalPages.value) {
    currentPage.value = Math.max(0, totalPages.value - 1)
  }
}

onMounted(() => {
  updateCardsPerPage()
  window.addEventListener('resize', updateCardsPerPage)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateCardsPerPage)
})
</script>

<template>
  <div ref="containerRef">
    <!-- Header with nav arrows -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="abt-display h3 mb-1">{{ title }}</h2>
        <p v-if="subtitle" class="abt-text-muted mb-0 small">{{ subtitle }}</p>
      </div>
      <div v-if="totalPages > 1" class="abt-carousel-nav">
        <button class="abt-carousel-btn" @click="prev" aria-label="Anterior">
          <i class="bi bi-chevron-left"></i>
        </button>
        <span class="abt-mono small abt-text-muted">
          {{ currentPage + 1 }}/{{ totalPages }}
        </span>
        <button class="abt-carousel-btn" @click="next" aria-label="Siguiente">
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- Cards Grid -->
    <div class="row g-4">
      <transition-group name="abt-carousel-slide">
        <div
          v-for="event in visibleEvents"
          :key="event.id"
          class="col-sm-6 col-lg-4"
        >
          <EventCard :event="event" />
        </div>
      </transition-group>
    </div>

    <!-- Dot indicators -->
    <div v-if="totalPages > 1" class="d-flex justify-content-center gap-2 mt-4">
      <button
        v-for="page in totalPages"
        :key="page"
        class="abt-carousel-dot"
        :class="{ active: currentPage === page - 1 }"
        @click="currentPage = page - 1"
        :aria-label="`Página ${page}`"
      ></button>
    </div>
  </div>
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
.abt-carousel-dot:hover:not(.active) {
  border-color: rgba(176, 107, 255, 0.5);
}

/* Slide transitions */
.abt-carousel-slide-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.abt-carousel-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
}
.abt-carousel-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.abt-carousel-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
