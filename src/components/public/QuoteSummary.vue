<script setup>
import { computed } from 'vue'
import { useQuoteStore } from '../../stores/quote'

defineProps({
  showWhatsapp: { type: Boolean, default: true },
})

const quote = useQuoteStore()
const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER

const whatsappLink = computed(() => quote.whatsappMessage(waNumber))
</script>

<template>
  <div class="abt-surface p-3">
    <h3 class="h6 abt-mono abt-text-muted mb-3">TU COTIZACIÓN</h3>

    <p v-if="quote.items.length === 0" class="small abt-text-muted mb-0">
      Aún no has agregado nada. Explora el catálogo y suma productos o combos.
    </p>

    <ul v-else class="list-unstyled mb-3">
      <li
        v-for="item in quote.items"
        :key="`${item.type}-${item.id}`"
        class="d-flex justify-content-between small mb-2"
      >
        <span>{{ item.quantity }} × {{ item.name }}</span>
        <span class="abt-mono">${{ (item.unit_price * item.quantity).toLocaleString('es-MX') }}</span>
      </li>
    </ul>

    <div v-if="quote.items.length > 0">
      <div class="d-flex justify-content-between align-items-center border-top pt-3 mb-3" style="border-color: rgba(176,107,255,0.2) !important;">
        <span class="abt-mono abt-text-muted">TOTAL</span>
        <span class="abt-display h5 mb-0 abt-text-cyan">
          ${{ quote.total.toLocaleString('es-MX') }} MXN
        </span>
      </div>

      <div class="d-grid gap-2">
        <slot name="actions">
          <RouterLink :to="{ name: 'quote-builder' }" class="btn abt-btn-neon btn-sm">
            Continuar cotización
          </RouterLink>
          <a v-if="showWhatsapp" :href="whatsappLink" target="_blank" rel="noopener" class="btn abt-btn-whatsapp btn-sm">
            Enviar por WhatsApp
          </a>
        </slot>
      </div>
    </div>
  </div>
</template>
