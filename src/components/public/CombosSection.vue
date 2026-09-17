<script setup>
import { onMounted } from 'vue'
import { useCatalogStore } from '../../stores/catalog'
import ComboCard from './ComboCard.vue'
import QuoteSummary from './QuoteSummary.vue'

const catalog = useCatalogStore()

onMounted(() => {
  catalog.load()
})
</script>

<template>
  <section id="cotizador" class="abt-section abt-combos-section">
    <div class="container">
      <div class="abt-section-header text-center mb-5">
        <span class="abt-kicker abt-text-gold d-block mb-2">PAQUETES &amp; COTIZACIÓN EN VIVO</span>
        <h2 class="abt-display h1 mb-2">Arma tu <span class="abt-gradient-text">Paquete Ideal</span></h2>
        <p class="abt-text-muted mx-auto" style="max-width: 36rem;">
          Selecciona un paquete o ajusta las cantidades a tu medida. Ve el total y contáctanos por WhatsApp al instante.
        </p>
      </div>

      <div class="row g-4">
        <!-- Combos List -->
        <div class="col-lg-8">
          <div v-if="catalog.loading" class="text-center py-5">
            <div class="spinner-border text-light" role="status"></div>
            <p class="abt-text-muted mt-2">Cargando paquetes...</p>
          </div>

          <div v-else-if="catalog.combos.length" class="row g-3">
            <div
              v-for="combo in catalog.combos"
              :key="combo.id"
              class="col-md-6"
            >
              <ComboCard :combo="combo" />
            </div>
          </div>

          <div v-else class="abt-surface p-4 text-center">
            <p class="abt-text-muted mb-0">No hay paquetes disponibles en este momento.</p>
          </div>
        </div>

        <!-- Sticky Quote Summary -->
        <div class="col-lg-4">
          <div class="sticky-top" style="top: 6rem; z-index: 10;">
            <QuoteSummary />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.abt-combos-section {
  position: relative;
  background: radial-gradient(circle at 80% 20%, rgba(34, 211, 238, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 20% 80%, rgba(176, 107, 255, 0.05) 0%, transparent 50%);
}

.abt-gradient-text {
  background: linear-gradient(135deg, #ffffff 0%, #f0a838 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
