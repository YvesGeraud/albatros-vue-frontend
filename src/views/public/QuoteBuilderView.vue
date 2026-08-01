<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useQuoteStore } from '../../stores/quote'

const quote = useQuoteStore()
const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER
const submitted = ref(false)

const whatsappLink = computed(() => quote.whatsappMessage(waNumber))

async function handleSubmit() {
  await quote.submit()
  submitted.value = true
}
</script>

<template>
  <div class="container py-5">
    <h1 class="abt-display h2 mb-4">Tu cotización</h1>

    <div v-if="submitted" class="abt-surface p-4 text-center">
      <h2 class="h4 abt-display mb-2">¡Listo, {{ quote.customer.name }}!</h2>
      <p class="abt-text-muted mb-3">
        Recibimos tu cotización #{{ quote.lastQuote?.id }} por un total de
        ${{ quote.total.toLocaleString('es-MX') }} MXN. Te contactaremos pronto.
      </p>
      <a :href="whatsappLink" target="_blank" rel="noopener" class="btn abt-btn-whatsapp">
        Confirmar también por WhatsApp
      </a>
    </div>

    <div v-else class="row g-4">
      <div class="col-lg-7">
        <div v-if="quote.items.length === 0" class="abt-surface p-4 text-center">
          <p class="abt-text-muted mb-3">Tu cotización está vacía.</p>
          <RouterLink :to="{ name: 'catalog' }" class="btn abt-btn-neon btn-sm">
            Ir al catálogo
          </RouterLink>
        </div>

        <div v-else class="abt-surface p-4">
          <ul class="list-unstyled mb-3">
            <li
              v-for="item in quote.items"
              :key="`${item.type}-${item.id}`"
              class="d-flex justify-content-between align-items-center mb-2"
            >
              <span>{{ item.quantity }} × {{ item.name }}</span>
              <span class="abt-mono">${{ (item.unit_price * item.quantity).toLocaleString('es-MX') }}</span>
            </li>
          </ul>
          <div class="d-flex justify-content-between align-items-center border-top pt-3" style="border-color: rgba(176,107,255,0.2) !important;">
            <span class="abt-mono abt-text-muted">TOTAL</span>
            <span class="abt-display h4 mb-0 abt-text-cyan">${{ quote.total.toLocaleString('es-MX') }} MXN</span>
          </div>
        </div>
      </div>

      <div class="col-lg-5" v-if="quote.items.length > 0">
        <form class="abt-surface p-4" @submit.prevent="handleSubmit">
          <h2 class="h6 abt-mono abt-text-muted mb-3">TUS DATOS</h2>

          <div class="mb-3">
            <label class="form-label small">Nombre</label>
            <input v-model="quote.customer.name" type="text" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label small">Correo</label>
            <input v-model="quote.customer.email" type="email" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label small">Teléfono</label>
            <input v-model="quote.customer.phone" type="tel" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label small">Fecha del evento</label>
            <input v-model="quote.customer.event_date" type="date" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label small">Notas</label>
            <textarea v-model="quote.customer.notes" class="form-control" rows="3"></textarea>
          </div>

          <p v-if="quote.submitError" class="text-danger small">
            Ocurrió un error al enviar tu cotización. Intenta de nuevo.
          </p>

          <div class="d-grid gap-2">
            <button type="submit" class="btn abt-btn-neon" :disabled="quote.submitting">
              {{ quote.submitting ? 'Enviando...' : 'Enviar cotización' }}
            </button>
            <a :href="whatsappLink" target="_blank" rel="noopener" class="btn abt-btn-whatsapp">
              Enviar por WhatsApp
            </a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
