import { defineStore } from 'pinia'
import { fetchCatalog } from '../api/catalog'

export const useCatalogStore = defineStore('catalog', {
  state: () => ({
    categories: [],
    products: [],
    combos: [],
    loaded: false,
    loading: false,
    error: null,
  }),
  getters: {
    productsByCategory: (state) => (categoryId) =>
      state.products.filter((p) => p.category_id === categoryId),
  },
  actions: {
    async load({ force = false } = {}) {
      if (this.loaded && !force) return
      this.loading = true
      this.error = null
      try {
        const data = await fetchCatalog()
        this.categories = data.categories
        this.products = data.products
        this.combos = data.combos
        this.loaded = true
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
  },
})
