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
    heroKicker: 'TLAXCALA · SONIDO Y EVENTOS',
    heroSubtitle: 'Sonido, iluminación, pista de baile y bailarines para que tu evento sea inolvidable.',
    heroPhrases: ['¡Haz tu Fiesta Única!', 'Sonido · Iluminación · Pista de Baile', 'Albatros Tlaxcala'],
    aboutTitle: 'Sobre Grupo Albatros',
    aboutText: '',
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

        // Hero text fields
        this.heroKicker = data.hero_kicker || this.heroKicker
        this.heroSubtitle = data.hero_subtitle || this.heroSubtitle
        if (data.hero_phrases) {
          this.heroPhrases = data.hero_phrases.split('|').map(p => p.trim()).filter(Boolean)
        }

        // About section
        this.aboutTitle = data.about_title || this.aboutTitle
        this.aboutText = data.about_text || ''

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
