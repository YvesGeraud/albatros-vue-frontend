<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { adminCategories, adminProducts, adminCombos, adminEvents, adminQuotes } from '../../api/admin'

const counts = ref({ categories: 0, products: 0, combos: 0, events: 0, quotes: 0 })

onMounted(async () => {
  const [categories, products, combos, events, quotes] = await Promise.all([
    adminCategories.list(),
    adminProducts.list(),
    adminCombos.list(),
    adminEvents.list(),
    adminQuotes.list(),
  ])
  counts.value = {
    categories: categories.length,
    products: products.length,
    combos: combos.length,
    events: events.length,
    quotes: quotes.filter((q) => q.status === 'pending').length,
  }
})
</script>

<template>
  <div>
    <h1 class="abt-display h3 mb-4" style="color: var(--abt-text);">Panel</h1>
    <div class="row g-3">
      <div class="col-md-3 col-6" v-for="card in [
        { label: 'Categorías', value: counts.categories, to: 'admin-categories' },
        { label: 'Productos', value: counts.products, to: 'admin-products' },
        { label: 'Combos', value: counts.combos, to: 'admin-combos' },
        { label: 'Eventos', value: counts.events, to: 'admin-events' },
        { label: 'Cotizaciones pendientes', value: counts.quotes, to: 'admin-quotes' },
      ]" :key="card.label">
        <RouterLink :to="{ name: card.to }" class="abt-surface d-block p-3 text-decoration-none">
          <span class="abt-mono small abt-text-muted d-block mb-2">{{ card.label }}</span>
          <span class="abt-display h3 abt-text-cyan">{{ card.value }}</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
