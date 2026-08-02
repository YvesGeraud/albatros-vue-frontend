<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import HeroVideo from '../../components/public/HeroVideo.vue'
import ServicesSection from '../../components/public/ServicesSection.vue'
import EventsCarousel from '../../components/public/EventsCarousel.vue'
import FeaturedVideoBanner from '../../components/public/FeaturedVideoBanner.vue'
import TestimonialsSection from '../../components/public/TestimonialsSection.vue'
import ScrollReveal from '../../components/public/ScrollReveal.vue'
import { useEventsStore } from '../../stores/events'

const eventsStore = useEventsStore()

onMounted(() => {
  eventsStore.load()
  eventsStore.loadFeaturedVideo()
})
</script>

<template>
  <div>
    <!-- Hero -->
    <HeroVideo />

    <!-- Anchor for scroll indicator -->
    <div id="content-start"></div>

    <!-- Services -->
    <ServicesSection />

    <!-- Featured Video -->
    <ScrollReveal animation="fade-up">
      <FeaturedVideoBanner v-if="eventsStore.featuredVideoEvent" :event="eventsStore.featuredVideoEvent" />
    </ScrollReveal>

    <!-- Events Carousel -->
    <ScrollReveal animation="fade-up" :delay="100">
      <section class="abt-section">
        <div class="container">
          <EventsCarousel
            v-if="eventsStore.events.length"
            :events="eventsStore.events"
            title="Eventos Recientes"
            subtitle="Revive nuestros mejores momentos"
          />
          <p v-if="!eventsStore.loading && eventsStore.events.length === 0" class="abt-text-muted text-center">
            Aún no hay eventos publicados.
          </p>
          <div class="text-center mt-4" v-if="eventsStore.events.length">
            <RouterLink :to="{ name: 'events' }" class="abt-btn-outline">
              Ver todos los eventos →
            </RouterLink>
          </div>
        </div>
      </section>
    </ScrollReveal>

    <!-- Testimonials -->
    <ScrollReveal animation="fade-up" :delay="100">
      <TestimonialsSection />
    </ScrollReveal>

    <!-- CTA Section -->
    <ScrollReveal animation="scale">
      <section class="abt-section">
        <div class="container">
          <div class="abt-cta-section">
            <span class="abt-kicker abt-text-cyan d-block mb-3">COTIZA AHORA</span>
            <h2 class="abt-display h2 mb-3">¿Listo para tu evento?</h2>
            <p class="abt-text-muted mb-4 mx-auto" style="max-width: 32rem;">
              Arma tu paquete de sonido, iluminación, pista de baile y bailarines,
              y mira el total al instante.
            </p>
            <RouterLink :to="{ name: 'quote-builder' }" class="abt-btn-neon btn-lg">
              Ir al cotizador
            </RouterLink>
          </div>
        </div>
      </section>
    </ScrollReveal>
  </div>
</template>
