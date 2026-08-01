import { defineStore } from 'pinia'
import { fetchEvents, fetchEvent, fetchLiveNow } from '../api/events'

export const useEventsStore = defineStore('events', {
  state: () => ({
    events: [],
    liveEvent: null,
    loading: false,
    error: null,
  }),
  actions: {
    async load(params = {}) {
      this.loading = true
      this.error = null
      try {
        this.events = await fetchEvents(params)
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
    async loadLiveNow() {
      try {
        this.liveEvent = await fetchLiveNow()
      } catch {
        this.liveEvent = null
      }
    },
    fetchOne(slug) {
      return fetchEvent(slug)
    },
  },
})
