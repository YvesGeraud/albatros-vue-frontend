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
    aboutDescription: '',
    brandNarrative: '',
    brandBullets: [],
    brandStats: null,
    trayectoriaEras: null,
    curatedPhotos: null,
    curatedVideos: null,
    servicesList: null,
    simulatorPackages: null,
    testimonialsList: null,
    liveStreamActive: false,
    liveStreamTitle: '',
    liveStreamYoutubeId: '',
    liveStreamVenue: '',
    liveStreamAddress: '',
    liveStreamLat: 19.3182,
    liveStreamLng: -98.2375,
    loaded: false,
  }),
  actions: {
    async load(force = false) {
      if (this.loaded && !force) return
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
        this.aboutDescription = data.about_description || ''
        if (data.about_bullets) {
          this.aboutBullets = data.about_bullets.split('\n').map(b => b.trim()).filter(Boolean)
        }
        if (data.about_image_url) {
          let url = data.about_image_url
          if (url.startsWith('/')) {
            const apiBase = import.meta.env.VITE_API_BASE_URL || ''
            url = apiBase ? `${apiBase.replace(/\/+$/, '')}${url}` : url
          }
          this.aboutImageUrl = url
        }

        // CMS Section datasets
        this.brandNarrative = data.brand_narrative || ''
        this.brandBullets = data.brand_bullets_data || this.aboutBullets || []
        this.brandStats = data.brand_stats_data || null
        this.trayectoriaEras = data.trayectoria_eras_data || null
        this.curatedPhotos = data.curated_photos_data || null
        this.curatedVideos = data.curated_videos_data || null
        this.servicesList = data.services_list_data || null
        this.simulatorPackages = data.simulator_packages_data || null
        this.testimonialsList = data.testimonials_list_data || null

        // Live stream
        this.liveStreamActive = Boolean(data.live_stream_active)
        this.liveStreamTitle = data.live_stream_title || ''
        this.liveStreamYoutubeId = data.live_stream_youtube_id || ''
        this.liveStreamVenue = data.live_stream_venue || ''
        this.liveStreamAddress = data.live_stream_address || ''
        this.liveStreamLat = Number(data.live_stream_lat) || 19.3182
        this.liveStreamLng = Number(data.live_stream_lng) || -98.2375

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
