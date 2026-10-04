<script setup>
import { onMounted } from 'vue'
import HeroVideo from '../../components/public/HeroVideo.vue'
import BrandBanner from '../../components/public/BrandBanner.vue'
import LiveEventSection from '../../components/public/LiveEventSection.vue'
import AccordionGallery from '../../components/public/AccordionGallery.vue'
import PhotoGallerySection from '../../components/public/PhotoGallerySection.vue'
import VideoGallerySection from '../../components/public/VideoGallerySection.vue'
import ServicesSection from '../../components/public/ServicesSection.vue'
import StageSimulator from '../../components/public/StageSimulator.vue'
import TestimonialsSection from '../../components/public/TestimonialsSection.vue'
import ScrollReveal from '../../components/public/ScrollReveal.vue'
import { useEventsStore } from '../../stores/events'
import { useSiteStore } from '../../stores/site'

const eventsStore = useEventsStore()
const siteStore = useSiteStore()

onMounted(() => {
  siteStore.load()
  eventsStore.load()
  eventsStore.loadLiveNow()
  eventsStore.loadFeaturedVideo()
})
</script>

<template>
  <div>
    <!-- 1. Hero / Inicio -->
    <HeroVideo />

    <!-- Transmisión en Vivo Condicional & Ubicación en Mapa -->
    <LiveEventSection />

    <!-- 2. Conócenos / Quiénes Somos con Light Rays -->
    <BrandBanner />

    <!-- 3. Trayectoria & Versatilidad (70's a Actualidad) -->
    <ScrollReveal animation="fade-up">
      <AccordionGallery />
    </ScrollReveal>

    <!-- 4. Galería Masiva de Fotos -->
    <ScrollReveal animation="fade-up">
      <PhotoGallerySection />
    </ScrollReveal>

    <!-- 5. Galería de Videos & Producciones en Vivo -->
    <ScrollReveal animation="fade-up">
      <VideoGallerySection />
    </ScrollReveal>

    <!-- 6. Servicios de Producción -->
    <ScrollReveal animation="fade-up">
      <ServicesSection />
    </ScrollReveal>

    <!-- 7. Simulador de Escenario & Paquetes -->
    <ScrollReveal animation="fade-up">
      <StageSimulator />
    </ScrollReveal>

    <!-- 8. Testimonios & Reseñas -->
    <ScrollReveal animation="fade-up">
      <TestimonialsSection />
    </ScrollReveal>
  </div>
</template>


