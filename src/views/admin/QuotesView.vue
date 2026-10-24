<script setup>
import { computed, onMounted, ref } from 'vue'
import { adminQuotes } from '../../api/admin'

const quotes = ref([])
const expandedId = ref(null)
const details = ref({})
const filter = ref('pending')

async function load() {
  quotes.value = await adminQuotes.list()
}

async function toggle(quote) {
  if (expandedId.value === quote.id) {
    expandedId.value = null
    return
  }
  expandedId.value = quote.id
  if (!details.value[quote.id]) {
    details.value[quote.id] = await adminQuotes.get(quote.id)
  }
}

async function setStatus(quote, status) {
  await adminQuotes.updateStatus(quote.id, status)
  await load()
}

const statusLabels = { pending: 'Pendiente', contacted: 'Contactado', closed: 'Cerrado' }
const packageLabels = { basico: 'Básico', estandar: 'Estándar', golden: 'Golden' }
const venueLabels = { salon: 'Salón', jardin: 'Jardín' }

const filteredQuotes = computed(() =>
  filter.value === 'all' ? quotes.value : quotes.value.filter((q) => q.status === filter.value),
)

function countFor(status) {
  return status === 'all' ? quotes.value.length : quotes.value.filter((q) => q.status === status).length
}

function formatDate(value) {
  if (!value) return '—'
  return new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(load)
</script>

<template>
  <div>
    <h1 class="abt-display h3 mb-4" style="color: var(--abt-text);">Cotizaciones</h1>

    <div class="btn-group mb-3" role="group">
      <button
        v-for="(label, value) in { pending: 'Pendientes', contacted: 'Contactadas', closed: 'Cerradas', all: 'Todas' }"
        :key="value"
        type="button"
        class="btn btn-sm"
        :class="filter === value ? 'btn-light' : 'btn-outline-light'"
        @click="filter = value"
      >
        {{ label }} ({{ countFor(value) }})
      </button>
    </div>

    <table class="table table-dark table-borderless align-middle">
      <thead>
        <tr class="abt-mono small abt-text-muted">
          <th>Cliente</th>
          <th>Paquete / Total</th>
          <th>Evento</th>
          <th>Estado</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="filteredQuotes.length === 0">
          <td colspan="5" class="text-center abt-text-muted small py-4">No hay cotizaciones en esta categoría.</td>
        </tr>
        <template v-for="quote in filteredQuotes" :key="quote.id">
          <tr>
            <td>
              {{ quote.customer_name }}
              <div class="small abt-text-muted">
                {{ [quote.customer_phone, quote.customer_email].filter(Boolean).join(' · ') }}
              </div>
              <div class="small abt-text-muted">Recibida: {{ formatDate(quote.created_at) }}</div>
            </td>
            <td>
              <span v-if="quote.package" class="badge text-bg-warning">{{ packageLabels[quote.package] ?? quote.package }}</span>
              <span v-else class="abt-mono">${{ Number(quote.total).toLocaleString('es-MX') }}</span>
            </td>
            <td class="small">
              <template v-if="quote.package">
                <div><i class="bi bi-people me-1"></i>{{ quote.guests }} invitados</div>
                <div><i class="bi bi-geo-alt me-1"></i>{{ quote.event_location }}</div>
                <div class="abt-text-muted">
                  {{ venueLabels[quote.venue_type] ?? '—' }} · {{ formatDate(quote.event_date) }}
                </div>
              </template>
              <span v-else class="abt-text-muted">{{ formatDate(quote.event_date) }}</span>
            </td>
            <td>
              <select
                class="form-select form-select-sm"
                :value="quote.status"
                @change="setStatus(quote, $event.target.value)"
              >
                <option v-for="(label, value) in statusLabels" :key="value" :value="value">{{ label }}</option>
              </select>
            </td>
            <td class="text-end">
              <button class="btn btn-sm btn-outline-light" @click="toggle(quote)">
                {{ expandedId === quote.id ? 'Ocultar' : 'Ver detalle' }}
              </button>
            </td>
          </tr>
          <tr v-if="expandedId === quote.id">
            <td colspan="5">
              <div class="abt-surface p-3">
                <p v-if="details[quote.id]?.notes" class="small mb-2">
                  <strong>Notas:</strong> {{ details[quote.id].notes }}
                </p>
                <ul v-if="details[quote.id]?.items?.length" class="list-unstyled mb-0 small">
                  <li v-for="item in details[quote.id].items" :key="item.id" class="d-flex justify-content-between">
                    <span>{{ item.quantity }} × {{ item.name }}</span>
                    <span class="abt-mono">${{ Number(item.subtotal).toLocaleString('es-MX') }}</span>
                  </li>
                </ul>
                <p v-else-if="details[quote.id] && !details[quote.id].notes" class="small abt-text-muted mb-0">
                  Sin comentarios adicionales.
                </p>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
