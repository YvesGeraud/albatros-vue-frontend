import { defineStore } from 'pinia'
import { submitQuote } from '../api/quotes'

function key(type, id) {
  return `${type}-${id}`
}

export const useQuoteStore = defineStore('quote', {
  state: () => ({
    // key -> { type: 'product'|'combo', id, name, unit_price, quantity }
    selections: {},
    customer: { name: '', email: '', phone: '', event_date: '', notes: '' },
    submitting: false,
    submitError: null,
    lastQuote: null,
  }),
  getters: {
    items: (state) => Object.values(state.selections),
    itemCount: (state) => Object.values(state.selections).reduce((sum, i) => sum + i.quantity, 0),
    total: (state) =>
      Object.values(state.selections).reduce((sum, i) => sum + i.unit_price * i.quantity, 0),
  },
  actions: {
    setQuantity(type, item, quantity) {
      const k = key(type, item.id)
      if (quantity <= 0) {
        delete this.selections[k]
        return
      }
      this.selections[k] = {
        type,
        id: item.id,
        name: item.name,
        unit_price: Number(item.price),
        quantity,
      }
    },
    quantityOf(type, id) {
      const found = this.selections[key(type, id)]
      return found ? found.quantity : 0
    },
    increment(type, item) {
      this.setQuantity(type, item, this.quantityOf(type, item.id) + 1)
    },
    decrement(type, item) {
      this.setQuantity(type, item, this.quantityOf(type, item.id) - 1)
    },
    clear() {
      this.selections = {}
    },
    whatsappMessage(waNumber) {
      const lines = [
        'Hola, me gustaria pedir la siguiente cotizacion a Albatros Tlaxcala:',
        '',
        ...this.items.map(
          (i) => `- ${i.quantity} x ${i.name} ($${i.unit_price.toFixed(2)} c/u) = $${(i.unit_price * i.quantity).toFixed(2)}`
        ),
        '',
        `Total estimado: $${this.total.toFixed(2)} MXN`,
      ]
      const text = encodeURIComponent(lines.join('\n'))
      return `https://wa.me/${waNumber}?text=${text}`
    },
    async submit() {
      this.submitting = true
      this.submitError = null
      try {
        const payload = {
          ...this.customer,
          items: this.items.map((i) => ({
            quotable_type: i.type,
            quotable_id: i.id,
            quantity: i.quantity,
          })),
        }
        this.lastQuote = await submitQuote(payload)
        return this.lastQuote
      } catch (err) {
        this.submitError = err
        throw err
      } finally {
        this.submitting = false
      }
    },
  },
})
