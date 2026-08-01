<script setup>
import { onMounted, ref } from 'vue'
import { adminQuotes } from '../../api/admin'

const quotes = ref([])
const expandedId = ref(null)
const details = ref({})

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

onMounted(load)
</script>

<template>
  <div>
    <h1 class="abt-display h3 mb-4" style="color: var(--abt-text);">Cotizaciones</h1>

    <table class="table table-dark table-borderless align-middle">
      <thead>
        <tr class="abt-mono small abt-text-muted">
          <th>Cliente</th>
          <th>Total</th>
          <th>Estado</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <template v-for="quote in quotes" :key="quote.id">
          <tr>
            <td>
              {{ quote.customer_name }}
              <div class="small abt-text-muted">{{ quote.customer_email }} · {{ quote.customer_phone }}</div>
            </td>
            <td class="abt-mono">${{ Number(quote.total).toLocaleString('es-MX') }}</td>
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
            <td colspan="4">
              <div class="abt-surface p-3">
                <p v-if="details[quote.id]?.notes" class="small mb-2">
                  <strong>Notas:</strong> {{ details[quote.id].notes }}
                </p>
                <ul class="list-unstyled mb-0 small">
                  <li v-for="item in details[quote.id]?.items ?? []" :key="item.id" class="d-flex justify-content-between">
                    <span>{{ item.quantity }} × {{ item.name }}</span>
                    <span class="abt-mono">${{ Number(item.subtotal).toLocaleString('es-MX') }}</span>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
