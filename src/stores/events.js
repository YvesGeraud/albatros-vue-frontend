import { defineStore } from 'pinia'
import { fetchEvents, fetchEvent, fetchLiveNow, fetchFeaturedVideo } from '../api/events'

export const useEventsStore = defineStore('events', {
  state: () => ({
    events: [],
    liveEvent: null,
    featuredVideoEvent: null,
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
    async loadFeaturedVideo() {
      try {
        this.featuredVideoEvent = await fetchFeaturedVideo()
      } catch {
        this.featuredVideoEvent = null
      }
    },
    fetchOne(slug) {
      return fetchEvent(slug)
    },
  },
})
