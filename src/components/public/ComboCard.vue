<script setup>
import { useQuoteStore } from '../../stores/quote'

defineProps({
  combo: { type: Object, required: true },
})

const quote = useQuoteStore()
</script>

<template>
  <div class="abt-surface p-3 h-100 d-flex flex-column" style="border-color: rgba(240,168,56,0.35);">
    <img v-if="combo.image_url" :src="combo.image_url" class="img-fluid rounded mb-2" :alt="combo.name" />
    <span class="abt-mono small abt-text-amber mb-1">COMBO</span>
    <h3 class="h6 mb-1" style="color: var(--abt-text);">{{ combo.name }}</h3>
    <p class="small abt-text-muted flex-grow-1">{{ combo.description }}</p>
    <ul class="small abt-text-muted mb-2 ps-3" v-if="combo.products?.length">
      <li v-for="p in combo.products" :key="p.id">{{ p.quantity }} × {{ p.name }}</li>
    </ul>
    <div class="d-flex justify-content-between align-items-center mt-2">
      <span class="abt-mono abt-text-cyan">${{ Number(combo.price).toLocaleString('es-MX') }}</span>
      <div class="d-flex align-items-center gap-2">
        <button
          class="btn btn-sm btn-outline-light"
          @click="quote.decrement('combo', combo)"
          :disabled="quote.quantityOf('combo', combo.id) === 0"
        >
          −
        </button>
        <span class="abt-mono" style="min-width: 1.5rem; text-align: center;">
          {{ quote.quantityOf('combo', combo.id) }}
        </span>
        <button class="btn btn-sm abt-btn-neon" @click="quote.increment('combo', combo)">
          +
        </button>
      </div>
    </div>
  </div>
</template>
