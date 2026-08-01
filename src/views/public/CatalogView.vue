<script setup>
import { computed, onMounted, ref } from 'vue'
import { useCatalogStore } from '../../stores/catalog'
import ProductCard from '../../components/public/ProductCard.vue'
import ComboCard from '../../components/public/ComboCard.vue'
import QuoteSummary from '../../components/public/QuoteSummary.vue'

const catalog = useCatalogStore()
const activeCategory = ref('combos')

onMounted(() => {
  catalog.load()
})

const productsForActiveCategory = computed(() =>
  catalog.productsByCategory(activeCategory.value)
)
</script>

<template>
  <div class="container py-5">
    <h1 class="abt-display h2 mb-4">Catálogo</h1>

    <div class="row g-4">
      <div class="col-lg-8">
        <div class="d-flex gap-2 mb-4 flex-wrap">
          <button
            class="btn btn-sm"
            :class="activeCategory === 'combos' ? 'abt-btn-neon' : 'btn-outline-light'"
            @click="activeCategory = 'combos'"
          >
            Combos
          </button>
          <button
            v-for="category in catalog.categories"
            :key="category.id"
            class="btn btn-sm"
            :class="activeCategory === category.id ? 'abt-btn-neon' : 'btn-outline-light'"
            @click="activeCategory = category.id"
          >
            {{ category.name }}
          </button>
        </div>

        <div v-if="activeCategory === 'combos'" class="row g-3">
          <div v-for="combo in catalog.combos" :key="combo.id" class="col-md-6">
            <ComboCard :combo="combo" />
          </div>
        </div>
        <div v-else class="row g-3">
          <div v-for="product in productsForActiveCategory" :key="product.id" class="col-md-6">
            <ProductCard :product="product" />
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="sticky-top" style="top: 1.5rem;">
          <QuoteSummary />
        </div>
      </div>
    </div>
  </div>
</template>
