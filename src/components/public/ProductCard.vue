<script setup>
import { useQuoteStore } from '../../stores/quote'

defineProps({
  product: { type: Object, required: true },
})

const quote = useQuoteStore()
</script>

<template>
  <div class="abt-surface abt-card-accent p-3 h-100 d-flex flex-column">
    <img v-if="product.image_url" :src="product.image_url" class="img-fluid rounded mb-2" :alt="product.name" />
    <h3 class="h6 mb-1" style="color: var(--abt-text);">{{ product.name }}</h3>
    <p class="small abt-text-muted flex-grow-1">{{ product.description }}</p>
    <div class="d-flex justify-content-between align-items-center mt-2">
      <span class="abt-mono abt-text-cyan">${{ Number(product.price).toLocaleString('es-MX') }}</span>
      <div class="d-flex align-items-center gap-2">
        <button
          class="btn btn-sm btn-outline-light"
          @click="quote.decrement('product', product)"
          :disabled="quote.quantityOf('product', product.id) === 0"
        >
          −
        </button>
        <span class="abt-mono" style="min-width: 1.5rem; text-align: center;">
          {{ quote.quantityOf('product', product.id) }}
        </span>
        <button class="btn btn-sm abt-btn-neon" @click="quote.increment('product', product)">
          +
        </button>
      </div>
    </div>
  </div>
</template>
