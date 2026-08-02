<script setup>
import { onMounted, ref } from 'vue'
import { animate, stagger } from 'animejs'

const cardsRef = ref(null)

const services = [
  {
    icon: 'bi-speaker-fill',
    title: 'Sonido Profesional',
    description: 'Equipos de audio de alta potencia para cualquier tipo de evento, desde íntimos hasta masivos.',
  },
  {
    icon: 'bi-lightbulb-fill',
    title: 'Iluminación',
    description: 'Luces inteligentes, láser y efectos especiales que transforman cualquier espacio.',
  },
  {
    icon: 'bi-vinyl-fill',
    title: 'Pista de Baile',
    description: 'Pistas LED interactivas que llevan la fiesta a otro nivel con efectos sincronizados.',
  },
  {
    icon: 'bi-people-fill',
    title: 'Bailarines',
    description: 'Show de bailarines profesionales para animar y sorprender a tus invitados.',
  },
]

onMounted(() => {
  if (cardsRef.value) {
    const cards = cardsRef.value.querySelectorAll('.abt-service-card')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(cards, {
              opacity: [0, 1],
              translateY: [40, 0],
              delay: stagger(120),
              duration: 800,
              easing: 'easeOutCubic',
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )
    observer.observe(cardsRef.value)
  }
})
</script>

<template>
  <section class="abt-section" id="services">
    <div class="container">
      <div class="abt-section-header">
        <div class="abt-section-line"></div>
        <h2 class="abt-display">Nuestros Servicios</h2>
        <p>Todo lo que necesitas para que tu evento sea inolvidable, en un solo lugar.</p>
      </div>

      <div ref="cardsRef" class="row g-4">
        <div
          v-for="(service, i) in services"
          :key="i"
          class="col-sm-6 col-lg-3"
        >
          <div class="abt-service-card" style="opacity: 0;">
            <i class="bi abt-service-icon" :class="service.icon"></i>
            <h3 class="abt-display">{{ service.title }}</h3>
            <p>{{ service.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
