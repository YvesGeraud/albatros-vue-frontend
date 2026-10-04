<script setup>
import { computed, onMounted, ref } from 'vue'
import { adminSettings } from '../../api/admin'
import { adminUploads } from '../../api/uploads'

const activeTab = ref('live')

// Default fallbacks for rich sections
const defaultStats = [
  { value: '35+', label: 'Años de Trayectoria', color: '#b06bff' },
  { value: '2,800+', label: 'Eventos Realizados', color: '#22d3ee' },
  { value: '100%', label: 'Audio & Producción Pro', color: '#f0a838' },
  { value: '15+', label: 'Técnicos & Operadores', color: '#b06bff' },
]

const defaultEras = [
  {
    id: '70s',
    period: "70's",
    badge: '1970 - 1979',
    genre: 'Disco, Funk & Soul',
    title: 'Fiebre Disco & Nacimiento del Baile',
    description: 'Revive la era de las bolas de espejos, el groove del bajo y pistas clásicas. Recreamos la ambientación retro con mezclas icónicas de Bee Gees, Earth Wind & Fire, ABBA y Donna Summer.',
    setup: 'Bola Disco LED, Audio Cálido Hi-Fi, Iluminación Vintage',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    color: '#f0a838',
  },
  {
    id: '80s',
    period: "80's",
    badge: '1980 - 1989',
    genre: 'Synthpop, Rock en Español & Pop',
    title: 'La Revolución Neón & Rock Ochentero',
    description: 'Sintetizadores vibrantes, rock clásico y el pop de Michael Jackson, Queen, Soda Stereo y Timbiriche. Efectos de humo y haces de luz magenta y cian.',
    setup: 'Láser Neón Magenta, Máquinas de Humo, Cabezas Móviles Beam',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
    color: '#ff6bff',
  },
  {
    id: '90s',
    period: "90's",
    badge: '1990 - 1999',
    genre: 'Eurodance, Pop Latino & Cumbia',
    title: 'Explosión de Pista, Cumbia & Éxitos Latinos',
    description: 'De los himnos de eurodance y techno noventero a la cumbia sonidera y la fiesta latina que llena la pista. Refuerzo de graves profundos.',
    setup: 'Subwoofers de 18", Animación en Vivo, Estructuras Truss',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    color: '#22d3ee',
  },
  {
    id: '00s',
    period: "2000's",
    badge: '2000 - 2009',
    genre: 'Reggaetón Clásico, Electrónica & Pop',
    title: 'La Era Digital & El Reggaetón Clásico',
    description: 'Los años dorados del perreo clásico (Daddy Yankee, Don Omar), los éxitos de Black Eyed Peas y música de club. Consolas digitales.',
    setup: 'Consolas Digitales, Iluminación DMX, Show de Animación',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    color: '#b06bff',
  },
  {
    id: 'current',
    period: '2010 - Hoy',
    badge: '2010 - Actualidad',
    genre: 'Pistas LED, Festivales & Éxitos Globales',
    title: 'Espectáculo Total & Producción de Vanguardia',
    description: 'La experiencia audiovisual definitiva. Pistas de baile LED Pixel interactivas, audio Line Array de alta gama y pirotecnia fría.',
    setup: 'Pistas LED Pixel, Line Array Concert, Pirotecnia Fría',
    image: 'https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=1200&q=80',
    color: '#00f0ff',
  },
]

const defaultPhotos = [
  {
    id: 'p1',
    category: 'lights',
    title: 'Show de Luces Móviles & Láser',
    location: 'Salón Balvanera, Tlaxcala',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    description: 'Cabezas robóticas beam sincronizadas con control DMX en vivo.',
  },
  {
    id: 'p2',
    category: 'dancefloor',
    title: 'Pista LED Pixel Infinita',
    location: 'Hacienda Soltepec, Huamantla',
    image: 'https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=1200&q=80',
    description: 'Módulos de pista pixel con secuencias personalizadas para vals.',
  },
  {
    id: 'p3',
    category: 'audio',
    title: 'Torres Line Array & Mega Subwoofers',
    location: 'Centro de Convenciones, Tlaxcala',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    description: 'Presión sonora uniforme y cristalina para más de 800 invitados.',
  },
  {
    id: 'p4',
    category: 'weddings',
    title: 'Iluminación Arquitectónica de Boda',
    location: 'Hacienda Santa Bárbara',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    description: 'Bañadores de luz cálida ámbar y entrada con chisperos de pirotecnia fría.',
  },
  {
    id: 'p5',
    category: 'quince',
    title: 'Glow Party XV Años',
    location: 'Jardín Las Rosas, Apizaco',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    description: 'Animación con accesorios neón, robots LED y cabina DJ.',
  },
]

const defaultVideos = [
  {
    id: 'v1',
    title: 'Show de Luces Móviles & Apertura de Pista',
    venue: 'Centro de Convenciones Tlaxcala',
    duration: '3:45 min',
    category: 'Show Láser',
    youtubeId: 'kJQP7kiw5Fk',
    description: 'Sincronización de 8 cabezas móviles Beam con máquina de niebla.',
  },
  {
    id: 'v2',
    title: 'Vals en las Nubes & Pista LED Pixel',
    venue: 'Hacienda Soltepec, Huamantla',
    duration: '4:12 min',
    category: 'Pistas LED',
    youtubeId: '5qap5aO4i9A',
    description: 'Momento emotivo con niebla baja criogénica y pista LED.',
  },
  {
    id: 'v3',
    title: 'Potencia Line Array & Mega Bajos en Concierto',
    venue: 'Explanada Tlaxco',
    duration: '5:02 min',
    category: 'Line Array',
    youtubeId: 'JGwWNGJdvx8',
    description: 'Prueba de cobertura sonora y refuerzo acústico con subwoofers dobles.',
  },
  {
    id: 'v4',
    title: 'Glow Party & Animación con Robots LED',
    venue: 'Salón Real Diamante',
    duration: '3:20 min',
    category: 'Animación',
    youtubeId: 'L_LUpnjgPso',
    description: 'Pirotecnia fría, zanqueros luminosos y accesorios fluorescentes.',
  },
]

const defaultServices = [
  {
    icon: 'bi-speaker-fill',
    title: 'Sonido Profesional',
    description: 'Equipos de audio Line Array y subwoofers para cualquier tipo de evento, desde íntimos hasta festivales masivos.',
  },
  {
    icon: 'bi-lightning-charge-fill',
    title: 'Iluminación Inteligente',
    description: 'Cabezas móviles robóticas, efectos láser y bañadores LED controlados vía consola DMX en tiempo real.',
  },
  {
    icon: 'bi-grid-3x3-gap-fill',
    title: 'Pistas de Baile LED Pixel',
    description: 'Pistas modulares interactivas con efectos de texto, nombres de festejados y patrones dinámicos de baile.',
  },
  {
    icon: 'bi-people-fill',
    title: 'Animadores & Bailarines',
    description: 'Shows coreografiados, zanqueros, robots con luces LED y entrega de souvenirs neón para encender el ambiente.',
  },
]

const defaultPackages = [
  {
    id: 'basico',
    name: 'Social Básico',
    badge: 'Íntimo & Versátil',
    price: '$7,500',
    capacity: '50 - 100 personas',
    description: 'Sonido balanceado e iluminación esencial para fiestas privadas y eventos pequeños.',
    speakersCount: 4,
    movingHeadsCount: 2,
    dancersCount: 0,
    hasDanceFloor: false,
    danceFloorSize: 'Sin pista',
    hasSparklers: false,
    sparklersCount: 0,
    featuresText: '4 Bocinas de Alta Fidelidad (2 Subs + 2 Tops)\n2 Cabezas Móviles Robóticas DMX\n1 DJ Profesional en Cabina Iluminada\nIluminación LED Ambiental\nMáquina de Humo Estándar',
  },
  {
    id: 'silver',
    name: 'Fiesta Silver',
    badge: 'Más Solicitado',
    popular: true,
    price: '$14,500',
    capacity: '100 - 200 personas',
    description: 'La combinación perfecta de pista LED, animación en vivo y mayor pegada sonora.',
    speakersCount: 6,
    movingHeadsCount: 4,
    dancersCount: 2,
    hasDanceFloor: true,
    danceFloorSize: 'Pista LED 4x4 (16 m²)',
    hasSparklers: false,
    sparklersCount: 0,
    featuresText: '6 Bocinas de Alta Fidelidad (4 Subwoofers + 2 Cajas Line Array)\n4 Cabezas Móviles Robóticas Beam\nPista de Baile LED Pixel 4x4 Interactiva\n2 Bailarines / Animadores con Souvenirs Neón\n1 DJ con Consola Digital Pioneer\nMáquina de Niebla Baja para Vals',
  },
  {
    id: 'gold',
    name: 'Boda Imperial Gold',
    badge: 'Recomendado',
    featured: true,
    price: '$23,000',
    capacity: '200 - 350 personas',
    description: 'Producción de gala con pirotecnia fría, sonido Line Array volado y pista LED expandida.',
    speakersCount: 8,
    movingHeadsCount: 6,
    dancersCount: 4,
    hasDanceFloor: true,
    danceFloorSize: 'Pista LED 6x6 (36 m²)',
    hasSparklers: true,
    sparklersCount: 2,
    featuresText: '8 Bocinas Pro (4 Mega Subs + 4 Line Array Volados)\n6 Cabezas Móviles + Láser Multicolor Sincronizado\nPista de Baile LED Pixel 6x6 con Efectos Dinámicos\n4 Bailarines / Animadores Coreografiados\n2 Chisperos de Pirotecnia Fría (Sparklers)\nEfecto Vals en las Nubes (Niebla Criogénica Densa)',
  },
  {
    id: 'platinum',
    name: 'Magno Platinum Festival',
    badge: 'Gala Total & Concierto',
    price: '$36,000',
    capacity: '350+ personas',
    description: 'El máximo espectáculo audiovisual. Potencia de concierto masivo, robot LED y efectos totales.',
    speakersCount: 12,
    movingHeadsCount: 8,
    dancersCount: 4,
    hasDanceFloor: true,
    danceFloorSize: 'Pista LED 8x8 (64 m²)',
    hasSparklers: true,
    sparklersCount: 4,
    featuresText: '12 Bocinas Pro (Mega Subs Dobles + Sistema Line Array Concert)\n8 Cabezas Móviles Robóticas 15R + Show Láser Cuádruple\nPista de Baile LED Pixel Gigante 8x8\n4 Bailarines + Robot LED de 2.5 metros con cañón CO2\n4 Chisperos de Pirotecnia Fría Indoor\nEstructura Truss Perimetral Cuadrada Iluminada',
  },
]

const defaultTestimonials = [
  {
    customer_name: 'Mariana & Carlos',
    event_type: 'Boda de Gala · Hacienda Soltepec',
    rating: 5,
    content: '¡La mejor decisión de nuestra boda! El vals con la pista LED y la niebla baja fue de película. Los invitados no pararon de bailar ni un solo minuto.',
  },
  {
    customer_name: 'Familia Paredes Morales',
    event_type: 'XV Años · Salón Balvanera',
    rating: 5,
    content: 'La animación de los bailarines y los robots LED dejaron a todos los jóvenes impactados. El audio sonó potente pero súper claro, sin aturdir.',
  },
  {
    customer_name: 'Ing. Roberto Tlaxcalteca',
    event_type: 'Aniversario Corporativo',
    rating: 5,
    content: 'Puntualidad absoluta en el montaje y una sincronización impecable de luces para la entrega de reconocimientos y la fiesta posterior.',
  },
]

// State holder
const settings = ref({
  site_name: 'Albatros Tlaxcala',
  site_tagline: '',
  social_facebook: '',
  social_youtube: '',
  social_instagram: '',
  social_tiktok: '',
  whatsapp_number: '',
  hero_video_path: null,
  hero_video_url: null,
  hero_kicker: '',
  hero_subtitle: '',
  hero_phrases: '',
  // Live
  live_stream_active: false,
  live_stream_title: '',
  live_stream_youtube_id: '',
  live_stream_venue: '',
  live_stream_address: '',
  live_stream_lat: 19.3182,
  live_stream_lng: -98.2375,
  // Conocenos
  brand_narrative: '',
  brand_bullets_text: '',
  brand_stats: JSON.parse(JSON.stringify(defaultStats)),
  // Trayectoria
  trayectoria_eras: JSON.parse(JSON.stringify(defaultEras)),
  // Photos
  curated_photos: JSON.parse(JSON.stringify(defaultPhotos)),
  // Videos
  curated_videos: JSON.parse(JSON.stringify(defaultVideos)),
  // Services
  services_list: JSON.parse(JSON.stringify(defaultServices)),
  // Simulator
  simulator_packages: JSON.parse(JSON.stringify(defaultPackages)),
  // Testimonials
  testimonials_list: JSON.parse(JSON.stringify(defaultTestimonials)),
})

const loading = ref(true)
const saving = ref(false)
const uploading = ref(false)
const error = ref(null)
const successMessage = ref('')

function flashSuccess(msg) {
  successMessage.value = msg
  setTimeout(() => { successMessage.value = '' }, 4000)
}

const formattedVideoUrl = computed(() => {
  const url = settings.value?.hero_video_url
  if (!url) return null
  if (url.startsWith('/')) {
    const apiBase = import.meta.env.VITE_API_BASE_URL || ''
    return apiBase ? `${apiBase.replace(/\/+$/, '')}${url}` : url
  }
  return url
})

onMounted(async () => {
  try {
    const data = await adminSettings.get()
    settings.value.site_name = data.site_name || 'Albatros Tlaxcala'
    settings.value.site_tagline = data.site_tagline || ''
    settings.value.social_facebook = data.social_facebook || ''
    settings.value.social_youtube = data.social_youtube || ''
    settings.value.social_instagram = data.social_instagram || ''
    settings.value.social_tiktok = data.social_tiktok || ''
    settings.value.whatsapp_number = data.whatsapp_number || ''
    settings.value.hero_video_path = data.hero_video_path || null
    settings.value.hero_video_url = data.hero_video_url || null
    settings.value.hero_kicker = data.hero_kicker || 'TLAXCALA · SONIDO Y EVENTOS'
    settings.value.hero_subtitle = data.hero_subtitle || 'Sonido, iluminación, pista de baile y bailarines para que tu evento sea inolvidable.'
    settings.value.hero_phrases = data.hero_phrases || '¡Haz tu Fiesta Única!|Sonido · Iluminación · Pista de Baile|Albatros Tlaxcala'

    // Live
    settings.value.live_stream_active = Boolean(data.live_stream_active)
    settings.value.live_stream_title = data.live_stream_title || 'Boda Imperial en Vivo'
    settings.value.live_stream_youtube_id = data.live_stream_youtube_id || '5qap5aO4i9A'
    settings.value.live_stream_venue = data.live_stream_venue || 'Hacienda Soltepec, Huamantla, Tlaxcala'
    settings.value.live_stream_address = data.live_stream_address || 'Carretera Huamantla-Puebla Km 3, Tlaxcala'
    settings.value.live_stream_lat = data.live_stream_lat || 19.3182
    settings.value.live_stream_lng = data.live_stream_lng || -98.2375

    // Brand / Conocenos
    settings.value.brand_narrative = data.brand_narrative || data.about_description || 'En Albatros Tlaxcala somos especialistas en transformar cualquier espacio en un escenario de primer nivel. Con más de 35 años de experiencia, brindamos la máxima fidelidad acústica, iluminación robótica sincronizada y pistas de baile interactivas para que tus momentos más importantes brillen con elegancia y energía.'
    
    if (data.brand_bullets_data && Array.isArray(data.brand_bullets_data)) {
      settings.value.brand_bullets_text = data.brand_bullets_data.join('\n')
    } else if (data.about_bullets) {
      settings.value.brand_bullets_text = data.about_bullets
    } else {
      settings.value.brand_bullets_text = 'Ingeniería acústica calibrada para cero distorsión y sonido envolvente.\nIluminación robótica y efectos especiales operados en vivo por técnicos certificados.\nPistas de baile LED Pixel con patrones personalizables para vals y fiesta.'
    }

    if (data.brand_stats_data && Array.isArray(data.brand_stats_data) && data.brand_stats_data.length > 0) {
      settings.value.brand_stats = data.brand_stats_data
    }

    if (data.trayectoria_eras_data && Array.isArray(data.trayectoria_eras_data) && data.trayectoria_eras_data.length > 0) {
      settings.value.trayectoria_eras = data.trayectoria_eras_data
    }

    if (data.curated_photos_data && Array.isArray(data.curated_photos_data) && data.curated_photos_data.length > 0) {
      settings.value.curated_photos = data.curated_photos_data
    }

    if (data.curated_videos_data && Array.isArray(data.curated_videos_data) && data.curated_videos_data.length > 0) {
      settings.value.curated_videos = data.curated_videos_data
    }

    if (data.services_list_data && Array.isArray(data.services_list_data) && data.services_list_data.length > 0) {
      settings.value.services_list = data.services_list_data
    }

    if (data.simulator_packages_data && Array.isArray(data.simulator_packages_data) && data.simulator_packages_data.length > 0) {
      settings.value.simulator_packages = data.simulator_packages_data
    }

    if (data.testimonials_list_data && Array.isArray(data.testimonials_list_data) && data.testimonials_list_data.length > 0) {
      settings.value.testimonials_list = data.testimonials_list_data
    }
  } catch (err) {
    error.value = 'Error al cargar la información del CMS: ' + (err.message || err)
  } finally {
    loading.value = false
  }
})

// Universal save function for section CMS
async function saveSection(sectionName) {
  saving.value = true
  error.value = null

  const payload = {
    site_name: settings.value.site_name,
    site_tagline: settings.value.site_tagline,
    social_facebook: settings.value.social_facebook || null,
    social_youtube: settings.value.social_youtube || null,
    social_instagram: settings.value.social_instagram || null,
    social_tiktok: settings.value.social_tiktok || null,
    whatsapp_number: settings.value.whatsapp_number || null,
    hero_video_path: settings.value.hero_video_path,
    hero_kicker: settings.value.hero_kicker,
    hero_subtitle: settings.value.hero_subtitle,
    hero_phrases: settings.value.hero_phrases,

    // Live
    live_stream_active: settings.value.live_stream_active,
    live_stream_title: settings.value.live_stream_title,
    live_stream_youtube_id: settings.value.live_stream_youtube_id,
    live_stream_venue: settings.value.live_stream_venue,
    live_stream_address: settings.value.live_stream_address,
    live_stream_lat: settings.value.live_stream_lat,
    live_stream_lng: settings.value.live_stream_lng,

    // Brand / Conocenos
    brand_narrative: settings.value.brand_narrative,
    about_description: settings.value.brand_narrative,
    brand_bullets_data: settings.value.brand_bullets_text.split('\n').map(b => b.trim()).filter(Boolean),
    about_bullets: settings.value.brand_bullets_text,
    brand_stats_data: settings.value.brand_stats,

    // Datasets
    trayectoria_eras_data: settings.value.trayectoria_eras,
    curated_photos_data: settings.value.curated_photos,
    curated_videos_data: settings.value.curated_videos,
    services_list_data: settings.value.services_list,
    simulator_packages_data: settings.value.simulator_packages,
    testimonials_list_data: settings.value.testimonials_list,
  }

  try {
    const updated = await adminSettings.update(payload)
    if (updated.hero_video_url) settings.value.hero_video_url = updated.hero_video_url
    flashSuccess(`¡${sectionName} guardado con éxito! Los cambios ya están visibles en el sitio.`)
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al guardar los cambios.'
  } finally {
    saving.value = false
  }
}

// Media uploads
async function handleHeroVideoUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  uploading.value = true
  error.value = null
  try {
    const uploaded = await adminUploads.upload(file, 'hero')
    settings.value.hero_video_path = uploaded.path
    settings.value.hero_video_url = uploaded.url
    await saveSection('Video del Hero')
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al subir el video.'
  } finally {
    uploading.value = false
    event.target.value = ''
  }
}

async function removeHeroVideo() {
  if (!confirm('¿Deseas quitar el video del Hero? Se usará el fondo animado por defecto.')) return
  settings.value.hero_video_path = null
  settings.value.hero_video_url = null
  await saveSection('Video del Hero')
}

async function uploadImageToField(file, callback, folder = 'cms') {
  if (!file) return
  uploading.value = true
  error.value = null
  try {
    const res = await adminUploads.upload(file, folder)
    callback(res.url)
    flashSuccess('Imagen subida correctamente.')
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al subir la imagen.'
  } finally {
    uploading.value = false
  }
}

// Helper methods for list management
function addPhoto() {
  settings.value.curated_photos.unshift({
    id: 'p-' + Date.now(),
    category: 'lights',
    title: 'Nueva Foto de Evento',
    location: 'Tlaxcala, Tlax.',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    description: 'Descripción breve de la fotografía.',
  })
}

function removePhoto(idx) {
  settings.value.curated_photos.splice(idx, 1)
}

function addVideo() {
  settings.value.curated_videos.unshift({
    id: 'v-' + Date.now(),
    title: 'Nuevo Video de Presentación',
    venue: 'Tlaxcala',
    duration: '3:30 min',
    category: 'Iluminación & Show',
    youtubeId: 'kJQP7kiw5Fk',
    description: 'Descripción del show en video.',
  })
}

function removeVideo(idx) {
  settings.value.curated_videos.splice(idx, 1)
}

function addService() {
  settings.value.services_list.push({
    icon: 'bi-stars',
    title: 'Nuevo Servicio',
    description: 'Detalle del servicio de producción audiovisual.',
  })
}

function removeService(idx) {
  settings.value.services_list.splice(idx, 1)
}

function addTestimonial() {
  settings.value.testimonials_list.unshift({
    customer_name: 'Nombre de Cliente',
    event_type: 'Boda / XV Años',
    rating: 5,
    content: 'Comentario y reseña sobre la atención y calidad del servicio.',
  })
}

function removeTestimonial(idx) {
  settings.value.testimonials_list.splice(idx, 1)
}
</script>

<template>
  <div class="abt-cms-container pb-5">
    <!-- Header -->
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
      <div>
        <h1 class="abt-display h3 mb-1" style="color: var(--abt-text);">
          <i class="bi bi-palette2 me-2 abt-text-purple"></i>
          Editor de Secciones (CMS)
        </h1>
        <p class="abt-text-muted small mb-0">
          Modifica en tiempo real cada sección de la landing page pública sin tocar código.
        </p>
      </div>

      <div class="d-flex align-items-center gap-2">
        <a href="/" target="_blank" class="btn btn-outline-info btn-sm rounded-pill px-3">
          <i class="bi bi-box-arrow-up-right me-1"></i> Ver Sitio Público
        </a>
      </div>
    </div>

    <!-- Feedback Alerts -->
    <div v-if="error" class="alert alert-danger mb-4 py-2 small d-flex align-items-center gap-2">
      <i class="bi bi-exclamation-triangle-fill"></i>
      {{ error }}
      <button type="button" class="btn-close btn-close-white ms-auto" @click="error = null" style="font-size: 0.65rem;"></button>
    </div>

    <div v-if="successMessage" class="alert alert-success mb-4 py-2 small d-flex align-items-center gap-2">
      <i class="bi bi-check-circle-fill"></i>
      {{ successMessage }}
    </div>

    <div v-if="loading" class="abt-text-muted py-5 text-center">
      <div class="spinner-border text-info mb-2" role="status"></div>
      <div>Cargando datos del CMS...</div>
    </div>

    <div v-else>
      <!-- Section Navigation Pills -->
      <div class="abt-cms-nav-scroll mb-4">
        <ul class="nav nav-pills flex-nowrap gap-2 p-1 rounded-pill" style="background: rgba(22, 19, 31, 0.7); border: 1px solid rgba(176,107,255,0.2);">
          <li class="nav-item">
            <button
              class="nav-link rounded-pill text-nowrap d-flex align-items-center gap-2 py-2 px-3"
              :class="{ active: activeTab === 'live' }"
              @click="activeTab = 'live'"
            >
              <span class="abt-live-dot" :class="{ active: settings.live_stream_active }"></span>
              <span>0. En Vivo</span>
            </button>
          </li>
          <li class="nav-item">
            <button
              class="nav-link rounded-pill text-nowrap d-flex align-items-center gap-2 py-2 px-3"
              :class="{ active: activeTab === 'hero' }"
              @click="activeTab = 'hero'"
            >
              <i class="bi bi-film"></i>
              <span>1. Hero / Video</span>
            </button>
          </li>
          <li class="nav-item">
            <button
              class="nav-link rounded-pill text-nowrap d-flex align-items-center gap-2 py-2 px-3"
              :class="{ active: activeTab === 'conocenos' }"
              @click="activeTab = 'conocenos'"
            >
              <i class="bi bi-stars"></i>
              <span>2. Conócenos</span>
            </button>
          </li>
          <li class="nav-item">
            <button
              class="nav-link rounded-pill text-nowrap d-flex align-items-center gap-2 py-2 px-3"
              :class="{ active: activeTab === 'trayectoria' }"
              @click="activeTab = 'trayectoria'"
            >
              <i class="bi bi-clock-history"></i>
              <span>3. Trayectoria</span>
            </button>
          </li>
          <li class="nav-item">
            <button
              class="nav-link rounded-pill text-nowrap d-flex align-items-center gap-2 py-2 px-3"
              :class="{ active: activeTab === 'photos' }"
              @click="activeTab = 'photos'"
            >
              <i class="bi bi-images"></i>
              <span>4. Galería Fotos</span>
            </button>
          </li>
          <li class="nav-item">
            <button
              class="nav-link rounded-pill text-nowrap d-flex align-items-center gap-2 py-2 px-3"
              :class="{ active: activeTab === 'videos' }"
              @click="activeTab = 'videos'"
            >
              <i class="bi bi-youtube"></i>
              <span>5. Galería Videos</span>
            </button>
          </li>
          <li class="nav-item">
            <button
              class="nav-link rounded-pill text-nowrap d-flex align-items-center gap-2 py-2 px-3"
              :class="{ active: activeTab === 'services' }"
              @click="activeTab = 'services'"
            >
              <i class="bi bi-sliders"></i>
              <span>6. Servicios</span>
            </button>
          </li>
          <li class="nav-item">
            <button
              class="nav-link rounded-pill text-nowrap d-flex align-items-center gap-2 py-2 px-3"
              :class="{ active: activeTab === 'packages' }"
              @click="activeTab = 'packages'"
            >
              <i class="bi bi-speaker"></i>
              <span>7. Paquetes / Simulador</span>
            </button>
          </li>
          <li class="nav-item">
            <button
              class="nav-link rounded-pill text-nowrap d-flex align-items-center gap-2 py-2 px-3"
              :class="{ active: activeTab === 'testimonials' }"
              @click="activeTab = 'testimonials'"
            >
              <i class="bi bi-chat-heart"></i>
              <span>8. Testimonios</span>
            </button>
          </li>
          <li class="nav-item">
            <button
              class="nav-link rounded-pill text-nowrap d-flex align-items-center gap-2 py-2 px-3"
              :class="{ active: activeTab === 'contact' }"
              @click="activeTab = 'contact'"
            >
              <i class="bi bi-whatsapp"></i>
              <span>9. Redes & WhatsApp</span>
            </button>
          </li>
        </ul>
      </div>

      <!-- ======================================================== -->
      <!-- TAB 0: EN VIVO (#en-vivo)                                -->
      <!-- ======================================================== -->
      <section v-show="activeTab === 'live'" class="abt-cms-card p-4">
        <div class="d-flex align-items-center justify-content-between mb-3 border-bottom border-secondary pb-3">
          <div class="d-flex align-items-center gap-2">
            <span class="fs-4">🔴</span>
            <div>
              <h2 class="h5 abt-display mb-0 text-white">Transmisión en Vivo & Mapa interactivo</h2>
              <div class="abt-text-muted small">Controla la barra flotante de notificación y la sección de transmisión #en-vivo.</div>
            </div>
          </div>
          <button class="btn abt-btn-neon btn-sm px-4" @click="saveSection('Transmisión en Vivo')" :disabled="saving">
            <i class="bi bi-check2 me-1"></i> {{ saving ? 'Guardando...' : 'Guardar Sección' }}
          </button>
        </div>

        <div class="row g-4">
          <div class="col-lg-6">
            <!-- Active Toggle -->
            <div class="p-3 rounded mb-4" style="background: rgba(255, 45, 85, 0.08); border: 1px solid rgba(255, 45, 85, 0.3);">
              <div class="form-check form-switch fs-5 d-flex align-items-center gap-3">
                <input
                  id="liveActiveSwitch"
                  v-model="settings.live_stream_active"
                  class="form-check-input ms-0 cursor-pointer"
                  type="checkbox"
                  role="switch"
                />
                <label class="form-check-label text-white fw-bold mb-0 cursor-pointer" for="liveActiveSwitch">
                  {{ settings.live_stream_active ? '🔥 EVENTO EN VIVO ACTIVO' : '⚪ Transmisión desactivada' }}
                </label>
              </div>
              <div class="abt-text-muted small mt-2">
                Cuando está activo, aparece el banner flotante con punto rojo parpadeante en la esquina inferior izquierda y la sección con el reproductor de YouTube y el mapa Leaflet.
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label small text-white-50 fw-bold">Título del Evento en Vivo</label>
              <input
                v-model="settings.live_stream_title"
                type="text"
                class="form-control bg-dark text-light border-secondary"
                placeholder="Ej: Boda Imperial en Hacienda Soltepec"
              />
            </div>

            <div class="mb-3">
              <label class="form-label small text-white-50 fw-bold">ID del Video de YouTube Live</label>
              <div class="input-group">
                <span class="input-group-text bg-dark border-secondary text-white-50">youtube.com/watch?v=</span>
                <input
                  v-model="settings.live_stream_youtube_id"
                  type="text"
                  class="form-control bg-dark text-light border-secondary"
                  placeholder="Ej: 5qap5aO4i9A o kJQP7kiw5Fk"
                />
              </div>
              <div class="form-text abt-text-muted">Introduce solo el código del video de YouTube (ej. <code>5qap5aO4i9A</code>).</div>
            </div>

            <div class="mb-3">
              <label class="form-label small text-white-50 fw-bold">Nombre del Salón / Lugar</label>
              <input
                v-model="settings.live_stream_venue"
                type="text"
                class="form-control bg-dark text-light border-secondary"
                placeholder="Ej: Hacienda Soltepec, Huamantla"
              />
            </div>

            <div class="mb-3">
              <label class="form-label small text-white-50 fw-bold">Dirección Completa</label>
              <input
                v-model="settings.live_stream_address"
                type="text"
                class="form-control bg-dark text-light border-secondary"
                placeholder="Ej: Carretera Huamantla-Puebla Km 3, Huamantla, Tlaxcala"
              />
            </div>

            <div class="row g-2">
              <div class="col-6">
                <label class="form-label small text-white-50 fw-bold">Latitud GPS</label>
                <input
                  v-model="settings.live_stream_lat"
                  type="text"
                  class="form-control bg-dark text-light border-secondary"
                  placeholder="19.3182"
                />
              </div>
              <div class="col-6">
                <label class="form-label small text-white-50 fw-bold">Longitud GPS</label>
                <input
                  v-model="settings.live_stream_lng"
                  type="text"
                  class="form-control bg-dark text-light border-secondary"
                  placeholder="-98.2375"
                />
              </div>
            </div>
          </div>

          <div class="col-lg-6">
            <label class="form-label small text-white-50 fw-bold">Vista previa del reproductor:</label>
            <div class="ratio ratio-16x9 rounded overflow-hidden border border-secondary shadow-lg">
              <iframe
                v-if="settings.live_stream_youtube_id"
                :src="`https://www.youtube.com/embed/${settings.live_stream_youtube_id}?autoplay=0`"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
              <div v-else class="d-flex align-items-center justify-content-center bg-dark text-white-50">
                Introduce un ID de video válido para previsualizar.
              </div>
            </div>
            <div class="p-3 mt-3 rounded bg-dark border border-secondary small text-white-50">
              <i class="bi bi-geo-alt-fill text-danger me-2"></i>
              <strong>Ubicación fijada:</strong> {{ settings.live_stream_venue }} ({{ settings.live_stream_lat }}, {{ settings.live_stream_lng }})
            </div>
          </div>
        </div>
      </section>

      <!-- ======================================================== -->
      <!-- TAB 1: HERO / VIDEO (#hero)                              -->
      <!-- ======================================================== -->
      <section v-show="activeTab === 'hero'" class="abt-cms-card p-4">
        <div class="d-flex align-items-center justify-content-between mb-3 border-bottom border-secondary pb-3">
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-film fs-4 text-cyan"></i>
            <div>
              <h2 class="h5 abt-display mb-0 text-white">Inicio / Hero</h2>
              <div class="abt-text-muted small">Video de fondo a pantalla completa, títulos y frases typewriter.</div>
            </div>
          </div>
          <button class="btn abt-btn-neon btn-sm px-4" @click="saveSection('Hero / Inicio')" :disabled="saving">
            <i class="bi bi-check2 me-1"></i> {{ saving ? 'Guardando...' : 'Guardar Sección' }}
          </button>
        </div>

        <div class="row g-4">
          <div class="col-lg-6">
            <div class="mb-3">
              <label class="form-label small text-white-50 fw-bold">Kicker (texto superior en dorado)</label>
              <input
                v-model="settings.hero_kicker"
                type="text"
                class="form-control bg-dark text-light border-secondary"
                placeholder="TLAXCALA · SONIDO Y EVENTOS"
              />
            </div>

            <div class="mb-3">
              <label class="form-label small text-white-50 fw-bold">Frases del typewriter (separadas por «|»)</label>
              <textarea
                v-model="settings.hero_phrases"
                rows="3"
                class="form-control bg-dark text-light border-secondary"
                placeholder="¡Haz tu Fiesta Única!|Sonido · Iluminación · Pista de Baile|Albatros Tlaxcala"
              ></textarea>
              <div class="form-text abt-text-muted">Escribe cada frase que rotará automáticamente separada con una barra vertical «|».</div>
            </div>

            <div class="mb-3">
              <label class="form-label small text-white-50 fw-bold">Subtítulo descriptivo</label>
              <textarea
                v-model="settings.hero_subtitle"
                rows="3"
                class="form-control bg-dark text-light border-secondary"
                placeholder="Sonido, iluminación, pista de baile y bailarines para que tu evento sea inolvidable."
              ></textarea>
            </div>
          </div>

          <div class="col-lg-6">
            <label class="form-label small text-white-50 fw-bold">Video de Fondo:</label>
            <div v-if="formattedVideoUrl" class="ratio ratio-16x9 rounded overflow-hidden border border-secondary mb-3">
              <video :src="formattedVideoUrl" controls loop muted autoplay style="object-fit: cover;"></video>
            </div>
            <div v-else class="p-4 text-center rounded border border-secondary mb-3" style="background: rgba(255,255,255,0.03);">
              <i class="bi bi-film fs-2 text-white-50 d-block mb-2"></i>
              <span class="abt-text-muted small">No hay video configurado. Se está mostrando el gradiente animado por defecto.</span>
            </div>

            <div class="d-flex align-items-center gap-2 flex-wrap">
              <label class="btn abt-btn-neon btn-sm mb-0 position-relative" :class="{ disabled: uploading }">
                <i class="bi bi-upload me-1"></i> {{ uploading ? 'Subiendo video...' : 'Subir Video MP4 / WebM' }}
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  class="position-absolute top-0 start-0 opacity-0 w-100 h-100 cursor-pointer"
                  @change="handleHeroVideoUpload"
                  :disabled="uploading"
                />
              </label>

              <button v-if="formattedVideoUrl" class="btn btn-outline-danger btn-sm rounded-pill" @click="removeHeroVideo" :disabled="uploading">
                <i class="bi bi-trash me-1"></i> Quitar video
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- ======================================================== -->
      <!-- TAB 2: CONÓCENOS (#conocenos)                            -->
      <!-- ======================================================== -->
      <section v-show="activeTab === 'conocenos'" class="abt-cms-card p-4">
        <div class="d-flex align-items-center justify-content-between mb-3 border-bottom border-secondary pb-3">
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-stars fs-4 text-gold"></i>
            <div>
              <h2 class="h5 abt-display mb-0 text-white">Conócenos / Quiénes Somos</h2>
              <div class="abt-text-muted small">Narrativa de la empresa con efecto WebGL Light Rays y las 4 estadísticas de trayectoria.</div>
            </div>
          </div>
          <button class="btn abt-btn-neon btn-sm px-4" @click="saveSection('Conócenos')" :disabled="saving">
            <i class="bi bi-check2 me-1"></i> {{ saving ? 'Guardando...' : 'Guardar Sección' }}
          </button>
        </div>

        <div class="row g-4">
          <div class="col-lg-7">
            <div class="mb-3">
              <label class="form-label small text-white-50 fw-bold">Texto Narrativo Institucional</label>
              <textarea
                v-model="settings.brand_narrative"
                rows="5"
                class="form-control bg-dark text-light border-secondary"
                placeholder="En Albatros Tlaxcala somos especialistas en..."
              ></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label small text-white-50 fw-bold">Puntos Clave / Viñetas (uno por línea)</label>
              <textarea
                v-model="settings.brand_bullets_text"
                rows="4"
                class="form-control bg-dark text-light border-secondary"
                placeholder="Ingeniería acústica calibrada para cero distorsión..."
              ></textarea>
            </div>
          </div>

          <div class="col-lg-5">
            <label class="form-label small text-white-50 fw-bold mb-2">4 Estadísticas de Prestigio:</label>
            <div class="d-flex flex-column gap-3">
              <div v-for="(stat, sIdx) in settings.brand_stats" :key="sIdx" class="p-3 rounded border border-secondary bg-dark">
                <div class="row g-2 align-items-center">
                  <div class="col-4">
                    <input
                      v-model="stat.value"
                      type="text"
                      class="form-control bg-black text-light border-secondary fw-bold"
                      placeholder="35+"
                    />
                  </div>
                  <div class="col-8">
                    <input
                      v-model="stat.label"
                      type="text"
                      class="form-control bg-black text-light border-secondary"
                      placeholder="Años de Trayectoria"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ======================================================== -->
      <!-- TAB 3: TRAYECTORIA (#trayectoria)                        -->
      <!-- ======================================================== -->
      <section v-show="activeTab === 'trayectoria'" class="abt-cms-card p-4">
        <div class="d-flex align-items-center justify-content-between mb-3 border-bottom border-secondary pb-3">
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-clock-history fs-4 text-warning"></i>
            <div>
              <h2 class="h5 abt-display mb-0 text-white">Trayectoria Musical (70's a Hoy)</h2>
              <div class="abt-text-muted small">Galería de acordeón con las 5 épocas musicales de la empresa.</div>
            </div>
          </div>
          <button class="btn abt-btn-neon btn-sm px-4" @click="saveSection('Trayectoria')" :disabled="saving">
            <i class="bi bi-check2 me-1"></i> {{ saving ? 'Guardando...' : 'Guardar Sección' }}
          </button>
        </div>

        <div class="d-flex flex-column gap-4">
          <div
            v-for="(era, eIdx) in settings.trayectoria_eras"
            :key="era.id || eIdx"
            class="p-3 rounded border border-secondary"
            style="background: rgba(22, 19, 31, 0.6);"
          >
            <div class="d-flex align-items-center gap-2 mb-3">
              <span class="badge px-3 py-1 rounded-pill" :style="{ background: era.color || '#b06bff', color: '#0a0912', fontWeight: '800' }">
                {{ era.period }}
              </span>
              <input
                v-model="era.title"
                type="text"
                class="form-control form-control-sm bg-dark text-light border-secondary fw-bold"
                placeholder="Título de la época"
              />
            </div>

            <div class="row g-3">
              <div class="col-md-4">
                <label class="form-label small text-white-50">Géneros musicales:</label>
                <input
                  v-model="era.genre"
                  type="text"
                  class="form-control form-control-sm bg-dark text-light border-secondary"
                  placeholder="Disco, Funk & Soul"
                />
              </div>
              <div class="col-md-4">
                <label class="form-label small text-white-50">Equipamiento / Setup:</label>
                <input
                  v-model="era.setup"
                  type="text"
                  class="form-control form-control-sm bg-dark text-light border-secondary"
                  placeholder="Láser Neón, Cabezas Móviles"
                />
              </div>
              <div class="col-md-4">
                <label class="form-label small text-white-50">Color representativo:</label>
                <input
                  v-model="era.color"
                  type="color"
                  class="form-control form-control-sm form-control-color bg-dark border-secondary w-100"
                />
              </div>
              <div class="col-md-8">
                <label class="form-label small text-white-50">Descripción de la época:</label>
                <textarea
                  v-model="era.description"
                  rows="2"
                  class="form-control form-control-sm bg-dark text-light border-secondary"
                ></textarea>
              </div>
              <div class="col-md-4">
                <label class="form-label small text-white-50">Foto de fondo (URL o Subir):</label>
                <div class="d-flex align-items-center gap-2">
                  <input
                    v-model="era.image"
                    type="text"
                    class="form-control form-control-sm bg-dark text-light border-secondary"
                    placeholder="https://..."
                  />
                  <label class="btn btn-outline-info btn-sm mb-0 position-relative flex-shrink-0" :class="{ disabled: uploading }">
                    <i class="bi bi-upload"></i>
                    <input
                      type="file"
                      accept="image/*"
                      class="position-absolute top-0 start-0 opacity-0 w-100 h-100 cursor-pointer"
                      @change="(e) => uploadImageToField(e.target.files[0], (url) => era.image = url, 'trayectoria')"
                      :disabled="uploading"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ======================================================== -->
      <!-- TAB 4: GALERÍA DE FOTOS (#galeria)                       -->
      <!-- ======================================================== -->
      <section v-show="activeTab === 'photos'" class="abt-cms-card p-4">
        <div class="d-flex align-items-center justify-content-between mb-3 border-bottom border-secondary pb-3">
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-images fs-4 text-cyan"></i>
            <div>
              <h2 class="h5 abt-display mb-0 text-white">Galería Masiva de Fotos</h2>
              <div class="abt-text-muted small">Administra las fotos que se muestran en el grid filtrable del sitio público.</div>
            </div>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-info btn-sm rounded-pill px-3" @click="addPhoto">
              <i class="bi bi-plus-lg me-1"></i> Agregar Foto
            </button>
            <button class="btn abt-btn-neon btn-sm px-4" @click="saveSection('Galería de Fotos')" :disabled="saving">
              <i class="bi bi-check2 me-1"></i> {{ saving ? 'Guardando...' : 'Guardar Galería' }}
            </button>
          </div>
        </div>

        <div class="row g-3">
          <div
            v-for="(photo, pIdx) in settings.curated_photos"
            :key="photo.id || pIdx"
            class="col-md-6 col-lg-4"
          >
            <div class="p-3 rounded border border-secondary bg-dark h-100 d-flex flex-column">
              <!-- Thumbnail -->
              <div class="ratio ratio-16x9 rounded overflow-hidden mb-2 border border-secondary">
                <img :src="photo.image" :alt="photo.title" style="object-fit: cover;" />
              </div>

              <!-- Upload direct image button -->
              <div class="mb-2">
                <label class="btn btn-sm btn-outline-secondary w-100 position-relative py-1" style="font-size: 0.75rem;" :class="{ disabled: uploading }">
                  <i class="bi bi-cloud-arrow-up me-1"></i> Cambiar imagen de archivo
                  <input
                    type="file"
                    accept="image/*"
                    class="position-absolute top-0 start-0 opacity-0 w-100 h-100 cursor-pointer"
                    @change="(e) => uploadImageToField(e.target.files[0], (url) => photo.image = url, 'gallery')"
                    :disabled="uploading"
                  />
                </label>
              </div>

              <div class="mb-2">
                <label class="form-label small text-white-50 fw-bold mb-1">Título</label>
                <input
                  v-model="photo.title"
                  type="text"
                  class="form-control form-control-sm bg-black text-light border-secondary"
                  placeholder="Título de la fotografía"
                />
              </div>

              <div class="mb-2">
                <label class="form-label small text-white-50 fw-bold mb-1">Categoría</label>
                <select v-model="photo.category" class="form-select form-select-sm bg-black text-light border-secondary">
                  <option value="lights">Iluminación Robótica</option>
                  <option value="audio">Audio & Escenarios</option>
                  <option value="dancefloor">Pistas LED Pixel</option>
                  <option value="weddings">Bodas de Gala</option>
                  <option value="quince">XV Años</option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label small text-white-50 fw-bold mb-1">Lugar / Salón</label>
                <input
                  v-model="photo.location"
                  type="text"
                  class="form-control form-control-sm bg-black text-light border-secondary"
                  placeholder="Salón Balvanera, Tlaxcala"
                />
              </div>

              <button class="btn btn-outline-danger btn-sm mt-auto py-1" @click="removePhoto(pIdx)">
                <i class="bi bi-trash me-1"></i> Eliminar Foto
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- ======================================================== -->
      <!-- TAB 5: GALERÍA DE VIDEOS (#videos)                       -->
      <!-- ======================================================== -->
      <section v-show="activeTab === 'videos'" class="abt-cms-card p-4">
        <div class="d-flex align-items-center justify-content-between mb-3 border-bottom border-secondary pb-3">
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-youtube fs-4 text-danger"></i>
            <div>
              <h2 class="h5 abt-display mb-0 text-white">Galería de Videos</h2>
              <div class="abt-text-muted small">Videos de YouTube con reproductor embebido y detalles de producción.</div>
            </div>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-info btn-sm rounded-pill px-3" @click="addVideo">
              <i class="bi bi-plus-lg me-1"></i> Agregar Video
            </button>
            <button class="btn abt-btn-neon btn-sm px-4" @click="saveSection('Galería de Videos')" :disabled="saving">
              <i class="bi bi-check2 me-1"></i> {{ saving ? 'Guardando...' : 'Guardar Videos' }}
            </button>
          </div>
        </div>

        <div class="row g-3">
          <div
            v-for="(video, vIdx) in settings.curated_videos"
            :key="video.id || vIdx"
            class="col-md-6"
          >
            <div class="p-3 rounded border border-secondary bg-dark h-100 d-flex flex-column">
              <!-- Preview -->
              <div class="ratio ratio-16x9 rounded overflow-hidden mb-3 border border-secondary">
                <iframe
                  v-if="video.youtubeId"
                  :src="`https://www.youtube.com/embed/${video.youtubeId}`"
                  allowfullscreen
                ></iframe>
              </div>

              <div class="mb-2">
                <label class="form-label small text-white-50 fw-bold mb-1">Título del Video</label>
                <input
                  v-model="video.title"
                  type="text"
                  class="form-control form-control-sm bg-black text-light border-secondary"
                />
              </div>

              <div class="row g-2 mb-2">
                <div class="col-6">
                  <label class="form-label small text-white-50 fw-bold mb-1">ID de YouTube</label>
                  <input
                    v-model="video.youtubeId"
                    type="text"
                    class="form-control form-control-sm bg-black text-light border-secondary"
                    placeholder="kJQP7kiw5Fk"
                  />
                </div>
                <div class="col-6">
                  <label class="form-label small text-white-50 fw-bold mb-1">Duración</label>
                  <input
                    v-model="video.duration"
                    type="text"
                    class="form-control form-control-sm bg-black text-light border-secondary"
                    placeholder="3:45 min"
                  />
                </div>
              </div>

              <div class="row g-2 mb-3">
                <div class="col-6">
                  <label class="form-label small text-white-50 fw-bold mb-1">Lugar / Salón</label>
                  <input
                    v-model="video.venue"
                    type="text"
                    class="form-control form-control-sm bg-black text-light border-secondary"
                    placeholder="Centro de Convenciones"
                  />
                </div>
                <div class="col-6">
                  <label class="form-label small text-white-50 fw-bold mb-1">Categoría</label>
                  <input
                    v-model="video.category"
                    type="text"
                    class="form-control form-control-sm bg-black text-light border-secondary"
                    placeholder="Show Láser"
                  />
                </div>
              </div>

              <button class="btn btn-outline-danger btn-sm mt-auto py-1" @click="removeVideo(vIdx)">
                <i class="bi bi-trash me-1"></i> Quitar Video
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- ======================================================== -->
      <!-- TAB 6: SERVICIOS (#servicios)                            -->
      <!-- ======================================================== -->
      <section v-show="activeTab === 'services'" class="abt-cms-card p-4">
        <div class="d-flex align-items-center justify-content-between mb-3 border-bottom border-secondary pb-3">
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-sliders fs-4 text-purple"></i>
            <div>
              <h2 class="h5 abt-display mb-0 text-white">Servicios</h2>
              <div class="abt-text-muted small">Tarjetas de servicios principales ofrecidos para eventos.</div>
            </div>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-info btn-sm rounded-pill px-3" @click="addService">
              <i class="bi bi-plus-lg me-1"></i> Agregar Servicio
            </button>
            <button class="btn abt-btn-neon btn-sm px-4" @click="saveSection('Servicios')" :disabled="saving">
              <i class="bi bi-check2 me-1"></i> {{ saving ? 'Guardando...' : 'Guardar Servicios' }}
            </button>
          </div>
        </div>

        <div class="row g-3">
          <div
            v-for="(srv, sIdx) in settings.services_list"
            :key="sIdx"
            class="col-md-6"
          >
            <div class="p-3 rounded border border-secondary bg-dark h-100 d-flex flex-column">
              <div class="d-flex align-items-center gap-2 mb-2">
                <input
                  v-model="srv.icon"
                  type="text"
                  class="form-control form-control-sm bg-black text-light border-secondary text-center"
                  style="max-width: 140px;"
                  placeholder="bi-speaker-fill"
                />
                <input
                  v-model="srv.title"
                  type="text"
                  class="form-control form-control-sm bg-black text-light border-secondary fw-bold"
                  placeholder="Título del Servicio"
                />
              </div>

              <div class="mb-3">
                <textarea
                  v-model="srv.description"
                  rows="3"
                  class="form-control form-control-sm bg-black text-light border-secondary"
                  placeholder="Descripción del servicio"
                ></textarea>
              </div>

              <button class="btn btn-outline-danger btn-sm mt-auto py-1" @click="removeService(sIdx)">
                <i class="bi bi-trash me-1"></i> Eliminar
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- ======================================================== -->
      <!-- TAB 7: PAQUETES & SIMULADOR (#paquetes)                 -->
      <!-- ======================================================== -->
      <section v-show="activeTab === 'packages'" class="abt-cms-card p-4">
        <div class="d-flex align-items-center justify-content-between mb-3 border-bottom border-secondary pb-3">
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-speaker fs-4 text-cyan"></i>
            <div>
              <h2 class="h5 abt-display mb-0 text-white">Paquetes & Simulador de Escenario</h2>
              <div class="abt-text-muted small">
                Configura los precios y las cantidades físicas (bocinas, cabezas móviles, pista LED, bailarines, sparklers) que reaccionan interactivamente en el simulador 3D.
              </div>
            </div>
          </div>
          <button class="btn abt-btn-neon btn-sm px-4" @click="saveSection('Paquetes')" :disabled="saving">
            <i class="bi bi-check2 me-1"></i> {{ saving ? 'Guardando...' : 'Guardar Paquetes' }}
          </button>
        </div>

        <div class="d-flex flex-column gap-4">
          <div
            v-for="(pkg, pIdx) in settings.simulator_packages"
            :key="pkg.id || pIdx"
            class="p-4 rounded border border-secondary"
            style="background: rgba(22, 19, 31, 0.7);"
          >
            <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
              <div class="d-flex align-items-center gap-2">
                <span class="badge bg-secondary text-uppercase">{{ pkg.id }}</span>
                <input
                  v-model="pkg.name"
                  type="text"
                  class="form-control bg-dark text-light border-secondary fw-bold"
                  style="min-width: 220px;"
                />
              </div>

              <div class="d-flex align-items-center gap-2">
                <input
                  v-model="pkg.price"
                  type="text"
                  class="form-control bg-dark text-warning border-secondary fw-bold text-end"
                  style="max-width: 140px;"
                  placeholder="$14,500"
                />
                <input
                  v-model="pkg.badge"
                  type="text"
                  class="form-control bg-dark text-light border-secondary"
                  style="max-width: 160px;"
                  placeholder="Más Solicitado"
                />
              </div>
            </div>

            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label class="form-label small text-white-50">Capacidad sugerida</label>
                <input
                  v-model="pkg.capacity"
                  type="text"
                  class="form-control form-control-sm bg-dark text-light border-secondary"
                  placeholder="100 - 200 personas"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label small text-white-50">Descripción comercial</label>
                <input
                  v-model="pkg.description"
                  type="text"
                  class="form-control form-control-sm bg-dark text-light border-secondary"
                />
              </div>
            </div>

            <!-- Stage Simulator Hardware Parameters -->
            <div class="p-3 rounded mb-3" style="background: rgba(0, 0, 0, 0.4); border: 1px dashed rgba(176,107,255,0.3);">
              <div class="fw-bold text-info small mb-3">
                <i class="bi bi-cpu me-1"></i> Parámetros Físicos del Simulador de Escenario (Reacción Visual):
              </div>
              <div class="row g-3">
                <div class="col-6 col-md-3">
                  <label class="form-label small text-white-50">Bocinas en escena</label>
                  <input
                    v-model.number="pkg.speakersCount"
                    type="number"
                    min="2"
                    max="16"
                    step="2"
                    class="form-control form-control-sm bg-dark text-light border-secondary"
                  />
                  <div class="form-text abt-text-muted" style="font-size: 0.7rem;">Aparecen en el simulador</div>
                </div>

                <div class="col-6 col-md-3">
                  <label class="form-label small text-white-50">Cabezas Móviles</label>
                  <input
                    v-model.number="pkg.movingHeadsCount"
                    type="number"
                    min="0"
                    max="12"
                    step="2"
                    class="form-control form-control-sm bg-dark text-light border-secondary"
                  />
                  <div class="form-text abt-text-muted" style="font-size: 0.7rem;">Robóticas en truss</div>
                </div>

                <div class="col-6 col-md-3">
                  <label class="form-label small text-white-50">Bailarines</label>
                  <input
                    v-model.number="pkg.dancersCount"
                    type="number"
                    min="0"
                    max="6"
                    class="form-control form-control-sm bg-dark text-light border-secondary"
                  />
                  <div class="form-text abt-text-muted" style="font-size: 0.7rem;">Personajes en pista</div>
                </div>

                <div class="col-6 col-md-3">
                  <label class="form-label small text-white-50">Pista LED Pixel</label>
                  <div class="form-check form-switch pt-1">
                    <input
                      v-model="pkg.hasDanceFloor"
                      class="form-check-input"
                      type="checkbox"
                    />
                    <label class="form-check-label text-white-50 small">{{ pkg.hasDanceFloor ? 'Encendida' : 'Sin pista' }}</label>
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label small text-white-50">Tamaño de Pista</label>
                  <input
                    v-model="pkg.danceFloorSize"
                    type="text"
                    class="form-control form-control-sm bg-dark text-light border-secondary"
                    placeholder="Pista LED 4x4 (16 m²)"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label small text-white-50">Pirotecnia Fría (Sparklers)</label>
                  <div class="d-flex align-items-center gap-2">
                    <div class="form-check form-switch">
                      <input
                        v-model="pkg.hasSparklers"
                        class="form-check-input"
                        type="checkbox"
                      />
                    </div>
                    <input
                      v-model.number="pkg.sparklersCount"
                      type="number"
                      min="0"
                      max="8"
                      class="form-control form-control-sm bg-dark text-light border-secondary"
                      placeholder="Cantidad de chisperos"
                      style="max-width: 120px;"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Features Bullet list -->
            <div>
              <label class="form-label small text-white-50">Lista de Características / Viñetas (una por línea):</label>
              <textarea
                v-model="pkg.featuresText"
                rows="3"
                class="form-control form-control-sm bg-dark text-light border-secondary"
              ></textarea>
            </div>
          </div>
        </div>
      </section>

      <!-- ======================================================== -->
      <!-- TAB 8: TESTIMONIOS (#testimonios)                        -->
      <!-- ======================================================== -->
      <section v-show="activeTab === 'testimonials'" class="abt-cms-card p-4">
        <div class="d-flex align-items-center justify-content-between mb-3 border-bottom border-secondary pb-3">
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-chat-heart fs-4 text-warning"></i>
            <div>
              <h2 class="h5 abt-display mb-0 text-white">Testimonios & Reseñas de Clientes</h2>
              <div class="abt-text-muted small">Comentarios y valoraciones mostradas en el carrusel de la página principal.</div>
            </div>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-info btn-sm rounded-pill px-3" @click="addTestimonial">
              <i class="bi bi-plus-lg me-1"></i> Agregar Reseña
            </button>
            <button class="btn abt-btn-neon btn-sm px-4" @click="saveSection('Testimonios')" :disabled="saving">
              <i class="bi bi-check2 me-1"></i> {{ saving ? 'Guardando...' : 'Guardar Reseñas' }}
            </button>
          </div>
        </div>

        <div class="row g-3">
          <div
            v-for="(t, tIdx) in settings.testimonials_list"
            :key="tIdx"
            class="col-md-6"
          >
            <div class="p-3 rounded border border-secondary bg-dark h-100 d-flex flex-column">
              <div class="row g-2 mb-2">
                <div class="col-8">
                  <label class="form-label small text-white-50 fw-bold mb-1">Nombre del Cliente / Pareja</label>
                  <input
                    v-model="t.customer_name"
                    type="text"
                    class="form-control form-control-sm bg-black text-light border-secondary"
                    placeholder="Mariana & Carlos"
                  />
                </div>
                <div class="col-4">
                  <label class="form-label small text-white-50 fw-bold mb-1">Estrellas</label>
                  <select v-model.number="t.rating" class="form-select form-select-sm bg-black text-warning border-secondary">
                    <option :value="5">★★★★★ (5)</option>
                    <option :value="4">★★★★☆ (4)</option>
                    <option :value="3">★★★☆☆ (3)</option>
                  </select>
                </div>
              </div>

              <div class="mb-2">
                <label class="form-label small text-white-50 fw-bold mb-1">Evento & Lugar</label>
                <input
                  v-model="t.event_type"
                  type="text"
                  class="form-control form-control-sm bg-black text-light border-secondary"
                  placeholder="Boda de Gala · Hacienda Soltepec"
                />
              </div>

              <div class="mb-3">
                <label class="form-label small text-white-50 fw-bold mb-1">Comentario</label>
                <textarea
                  v-model="t.content"
                  rows="3"
                  class="form-control form-control-sm bg-black text-light border-secondary"
                  placeholder="Escribe la opinión del cliente..."
                ></textarea>
              </div>

              <button class="btn btn-outline-danger btn-sm mt-auto py-1" @click="removeTestimonial(tIdx)">
                <i class="bi bi-trash me-1"></i> Eliminar
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- ======================================================== -->
      <!-- TAB 9: REDES & WHATSAPP (#contacto)                      -->
      <!-- ======================================================== -->
      <section v-show="activeTab === 'contact'" class="abt-cms-card p-4">
        <div class="d-flex align-items-center justify-content-between mb-3 border-bottom border-secondary pb-3">
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-whatsapp fs-4 text-success"></i>
            <div>
              <h2 class="h5 abt-display mb-0 text-white">Redes Sociales, WhatsApp & Identidad</h2>
              <div class="abt-text-muted small">Configuración de enlaces sociales, número de cotización directa y datos globales.</div>
            </div>
          </div>
          <button class="btn abt-btn-neon btn-sm px-4" @click="saveSection('Redes & Contacto')" :disabled="saving">
            <i class="bi bi-check2 me-1"></i> {{ saving ? 'Guardando...' : 'Guardar Contacto' }}
          </button>
        </div>

        <div class="row g-4">
          <div class="col-lg-6">
            <div class="mb-3">
              <label class="form-label small text-white-50 fw-bold">Nombre del Grupo / Marca</label>
              <input
                v-model="settings.site_name"
                type="text"
                class="form-control bg-dark text-light border-secondary"
                placeholder="Albatros Tlaxcala"
              />
            </div>

            <div class="mb-3">
              <label class="form-label small text-white-50 fw-bold">Eslogan</label>
              <input
                v-model="settings.site_tagline"
                type="text"
                class="form-control bg-dark text-light border-secondary"
                placeholder="Sonido, iluminación, pista de baile y bailarines..."
              />
            </div>

            <div class="mb-3">
              <label class="form-label small text-white-50 fw-bold">Número de WhatsApp (con código de país sin +)</label>
              <div class="input-group">
                <span class="input-group-text bg-dark border-secondary text-success">
                  <i class="bi bi-whatsapp"></i>
                </span>
                <input
                  v-model="settings.whatsapp_number"
                  type="text"
                  class="form-control bg-dark text-light border-secondary"
                  placeholder="5212221234567"
                />
              </div>
              <div class="form-text abt-text-muted">Aparece en el botón flotante y botones de cotización directa.</div>
            </div>
          </div>

          <div class="col-lg-6">
            <div class="mb-3">
              <label class="form-label small text-white-50 fw-bold">
                <i class="bi bi-facebook me-1" style="color: #1877f2;"></i> Facebook URL
              </label>
              <input
                v-model="settings.social_facebook"
                type="text"
                class="form-control bg-dark text-light border-secondary"
                placeholder="https://facebook.com/..."
              />
            </div>

            <div class="mb-3">
              <label class="form-label small text-white-50 fw-bold">
                <i class="bi bi-youtube me-1 text-danger"></i> YouTube URL
              </label>
              <input
                v-model="settings.social_youtube"
                type="text"
                class="form-control bg-dark text-light border-secondary"
                placeholder="https://youtube.com/@..."
              />
            </div>

            <div class="mb-3">
              <label class="form-label small text-white-50 fw-bold">
                <i class="bi bi-instagram me-1" style="color: #e4405f;"></i> Instagram URL
              </label>
              <input
                v-model="settings.social_instagram"
                type="text"
                class="form-control bg-dark text-light border-secondary"
                placeholder="https://instagram.com/..."
              />
            </div>

            <div class="mb-3">
              <label class="form-label small text-white-50 fw-bold">
                <i class="bi bi-tiktok me-1 text-light"></i> TikTok URL
              </label>
              <input
                v-model="settings.social_tiktok"
                type="text"
                class="form-control bg-dark text-light border-secondary"
                placeholder="https://tiktok.com/@..."
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.abt-cms-container {
  max-width: 1100px;
  margin: 0 auto;
}

.abt-cms-card {
  background: rgba(14, 12, 24, 0.95);
  border: 1px solid rgba(176, 107, 255, 0.18);
  border-radius: 1rem;
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.abt-cms-nav-scroll {
  overflow-x: auto;
  padding-bottom: 0.25rem;
}

.abt-cms-nav-scroll::-webkit-scrollbar {
  height: 4px;
}

.abt-cms-nav-scroll::-webkit-scrollbar-thumb {
  background: rgba(176, 107, 255, 0.3);
  border-radius: 4px;
}

.nav-pills .nav-link {
  color: #c4c1d4;
  font-size: 0.84rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-pills .nav-link:hover {
  color: #ffffff;
  background: rgba(176, 107, 255, 0.15);
}

.nav-pills .nav-link.active {
  background: linear-gradient(135deg, #b06bff 0%, #22d3ee 100%);
  color: #0a0912;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(176, 107, 255, 0.35);
}

.abt-live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #6c757d;
  display: inline-block;
  transition: background 0.3s ease;
}

.abt-live-dot.active {
  background: #ff2d55;
  box-shadow: 0 0 8px #ff2d55;
  animation: pulse-live 1.5s infinite;
}

@keyframes pulse-live {
  0% { transform: scale(0.9); opacity: 0.8; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0.8; }
}

.cursor-pointer {
  cursor: pointer;
}
</style>
