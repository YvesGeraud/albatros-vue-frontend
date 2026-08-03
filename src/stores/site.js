import { defineStore } from 'pinia'
import { fetchSiteSettings } from '../api/settings'

export const useSiteStore = defineStore('site', {
  state: () => ({
    siteName: 'Albatros Tlaxcala',
    siteTagline: 'Sonido, iluminación, pista de baile y bailarines para eventos inolvidables.',
    socialFacebook: '',
    socialYoutube: '',
    socialInstagram: '',
    socialTiktok: '',
    whatsappNumber: '',
    heroVideoUrl: null,
    loaded: false,
  }),
  actions: {
    async load() {
      if (this.loaded) return
      try {
        const data = await fetchSiteSettings()
        this.siteName = data.site_name || this.siteName
        this.siteTagline = data.site_tagline || this.siteTagline
        this.socialFacebook = data.social_facebook || ''
        this.socialYoutube = data.social_youtube || ''
        this.socialInstagram = data.social_instagram || ''
        this.socialTiktok = data.social_tiktok || ''
        this.whatsappNumber = data.whatsapp_number || ''

        if (data.hero_video_url) {
          let url = data.hero_video_url
          if (url.startsWith('/')) {
            const apiBase = import.meta.env.VITE_API_BASE_URL || ''
            url = apiBase ? `${apiBase.replace(/\/+$/, '')}${url}` : url
          }
          this.heroVideoUrl = url
        }

        this.loaded = true
      } catch {
        // Use defaults on failure
      }
    },
  },
  getters: {
    socialLinks(state) {
      const links = []
      if (state.socialFacebook) links.push({ icon: 'bi-facebook', url: state.socialFacebook, label: 'Facebook' })
      if (state.socialYoutube) links.push({ icon: 'bi-youtube', url: state.socialYoutube, label: 'YouTube' })
      if (state.socialInstagram) links.push({ icon: 'bi-instagram', url: state.socialInstagram, label: 'Instagram' })
      if (state.socialTiktok) links.push({ icon: 'bi-tiktok', url: state.socialTiktok, label: 'TikTok' })
      return links
    },
    whatsappLink(state) {
      if (!state.whatsappNumber) return null
      return `https://wa.me/${state.whatsappNumber}?text=${encodeURIComponent('¡Hola! Me interesa cotizar un evento con Albatros.')}`
    },
  },
})
