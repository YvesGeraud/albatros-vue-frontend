<script setup>
import { computed, onMounted, ref } from 'vue'
import { adminSettings } from '../../api/admin'
import { adminUploads } from '../../api/uploads'

const settings = ref({
  site_name: '',
  site_tagline: '',
  social_facebook: '',
  social_youtube: '',
  social_instagram: '',
  social_tiktok: '',
  whatsapp_number: '',
  hero_video_path: null,
  hero_video_url: null,
})

const formattedVideoUrl = computed(() => {
  const url = settings.value?.hero_video_url
  if (!url) return null
  if (url.startsWith('/')) {
    const apiBase = import.meta.env.VITE_API_BASE_URL || ''
    return apiBase ? `${apiBase.replace(/\/+$/, '')}${url}` : url
  }
  return url
})

const loading = ref(true)
const uploading = ref(false)
const savingIdentity = ref(false)
const savingSocial = ref(false)
const savingWhatsapp = ref(false)
const error = ref(null)
const successMessage = ref('')

function flashSuccess(msg) {
  successMessage.value = msg
  setTimeout(() => { successMessage.value = '' }, 4000)
}

onMounted(async () => {
  try {
    settings.value = await adminSettings.get()
  } catch {
    error.value = 'Error al cargar la configuración.'
  } finally {
    loading.value = false
  }
})

/* --- Identity --- */
async function saveIdentity() {
  savingIdentity.value = true
  error.value = null
  try {
    const updated = await adminSettings.update({
      site_name: settings.value.site_name,
      site_tagline: settings.value.site_tagline,
    })
    settings.value = updated
    flashSuccess('Nombre y eslogan actualizados.')
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al guardar.'
  } finally {
    savingIdentity.value = false
  }
}

/* --- Social --- */
async function saveSocial() {
  savingSocial.value = true
  error.value = null
  try {
    const updated = await adminSettings.update({
      social_facebook: settings.value.social_facebook || null,
      social_youtube: settings.value.social_youtube || null,
      social_instagram: settings.value.social_instagram || null,
      social_tiktok: settings.value.social_tiktok || null,
    })
    settings.value = updated
    flashSuccess('Redes sociales actualizadas.')
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al guardar.'
  } finally {
    savingSocial.value = false
  }
}

/* --- WhatsApp --- */
async function saveWhatsapp() {
  savingWhatsapp.value = true
  error.value = null
  try {
    const updated = await adminSettings.update({
      whatsapp_number: settings.value.whatsapp_number || null,
    })
    settings.value = updated
    flashSuccess('Número de WhatsApp actualizado.')
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al guardar.'
  } finally {
    savingWhatsapp.value = false
  }
}

/* --- Hero Video --- */
async function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  uploading.value = true
  error.value = null

  try {
    const uploaded = await adminUploads.upload(file, 'hero')
    settings.value.hero_video_path = uploaded.path
    settings.value.hero_video_url = uploaded.url

    await adminSettings.update({ hero_video_path: uploaded.path })
    flashSuccess('Video subido y actualizado correctamente.')
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al subir el video.'
  } finally {
    uploading.value = false
    event.target.value = ''
  }
}

async function removeVideo() {
  if (!confirm('¿Seguro de que deseas quitar el video del banner? Se usará el gradiente animado por defecto.')) return

  uploading.value = true
  error.value = null

  try {
    const updated = await adminSettings.update({ hero_video_path: null })
    settings.value = updated
    flashSuccess('Video eliminado correctamente.')
  } catch {
    error.value = 'Error al eliminar el video.'
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <div style="max-width: 800px;">
    <h1 class="abt-display h3 mb-4" style="color: var(--abt-text);">
      <i class="bi bi-gear-wide-connected me-2 abt-text-purple"></i>
      Configuración del Sitio
    </h1>

    <div v-if="loading" class="abt-text-muted">Cargando configuración...</div>

    <template v-else>
      <!-- Global Alerts -->
      <div v-if="error" class="alert alert-danger mb-4 py-2 small d-flex align-items-center gap-2">
        <i class="bi bi-exclamation-triangle-fill"></i>
        {{ error }}
        <button type="button" class="btn-close btn-close-white ms-auto" @click="error = null" style="font-size: 0.6rem;"></button>
      </div>

      <div v-if="successMessage" class="alert alert-success mb-4 py-2 small d-flex align-items-center gap-2">
        <i class="bi bi-check-circle-fill"></i>
        {{ successMessage }}
      </div>

      <!-- ============================================ -->
      <!-- SECTION 1: Identidad -->
      <!-- ============================================ -->
      <section class="abt-surface p-4 mb-4">
        <div class="d-flex align-items-center gap-2 mb-3">
          <i class="bi bi-building fs-5 abt-text-cyan"></i>
          <h2 class="h5 abt-display mb-0" style="color: var(--abt-text);">Identidad</h2>
        </div>
        <p class="abt-text-muted small mb-4">
          El nombre y eslogan se muestran en la barra de navegación, el pie de página y las meta etiquetas del sitio.
        </p>

        <div class="mb-3">
          <label class="form-label small text-white-50 fw-bold" for="siteName">Nombre del grupo</label>
          <input
            id="siteName"
            v-model="settings.site_name"
            type="text"
            class="form-control bg-dark text-light border-secondary"
            placeholder="Ej: Albatros Tlaxcala"
            maxlength="120"
          />
          <div class="form-text abt-text-muted">Se muestra como «Albatros <span class="abt-text-purple">Tlaxcala</span>» (la primera palabra en blanco, el resto en morado).</div>
        </div>

        <div class="mb-4">
          <label class="form-label small text-white-50 fw-bold" for="siteTagline">Eslogan</label>
          <input
            id="siteTagline"
            v-model="settings.site_tagline"
            type="text"
            class="form-control bg-dark text-light border-secondary"
            placeholder="Ej: Sonido, iluminación, pista de baile y bailarines..."
            maxlength="255"
          />
        </div>

        <button
          class="btn abt-btn-neon btn-sm"
          @click="saveIdentity"
          :disabled="savingIdentity"
        >
          <i class="bi bi-check2 me-1"></i>
          {{ savingIdentity ? 'Guardando...' : 'Guardar identidad' }}
        </button>
      </section>

      <!-- ============================================ -->
      <!-- SECTION 2: Redes Sociales -->
      <!-- ============================================ -->
      <section class="abt-surface p-4 mb-4">
        <div class="d-flex align-items-center gap-2 mb-3">
          <i class="bi bi-share fs-5 abt-text-cyan"></i>
          <h2 class="h5 abt-display mb-0" style="color: var(--abt-text);">Redes Sociales</h2>
        </div>
        <p class="abt-text-muted small mb-4">
          Las URLs de las redes sociales aparecen en la barra de navegación y en el pie de página. Deja en blanco las que no uses.
        </p>

        <div class="row g-3 mb-4">
          <div class="col-md-6">
            <label class="form-label small text-white-50 fw-bold" for="socialFacebook">
              <i class="bi bi-facebook me-1" style="color: #1877f2;"></i> Facebook
            </label>
            <input
              id="socialFacebook"
              v-model="settings.social_facebook"
              type="url"
              class="form-control bg-dark text-light border-secondary"
              placeholder="https://www.facebook.com/..."
            />
          </div>
          <div class="col-md-6">
            <label class="form-label small text-white-50 fw-bold" for="socialYoutube">
              <i class="bi bi-youtube me-1" style="color: #ff0000;"></i> YouTube
            </label>
            <input
              id="socialYoutube"
              v-model="settings.social_youtube"
              type="url"
              class="form-control bg-dark text-light border-secondary"
              placeholder="https://www.youtube.com/@..."
            />
          </div>
          <div class="col-md-6">
            <label class="form-label small text-white-50 fw-bold" for="socialInstagram">
              <i class="bi bi-instagram me-1" style="color: #e4405f;"></i> Instagram
            </label>
            <input
              id="socialInstagram"
              v-model="settings.social_instagram"
              type="url"
              class="form-control bg-dark text-light border-secondary"
              placeholder="https://www.instagram.com/..."
            />
          </div>
          <div class="col-md-6">
            <label class="form-label small text-white-50 fw-bold" for="socialTiktok">
              <i class="bi bi-tiktok me-1" style="color: #fff;"></i> TikTok
            </label>
            <input
              id="socialTiktok"
              v-model="settings.social_tiktok"
              type="url"
              class="form-control bg-dark text-light border-secondary"
              placeholder="https://www.tiktok.com/@..."
            />
          </div>
        </div>

        <button
          class="btn abt-btn-neon btn-sm"
          @click="saveSocial"
          :disabled="savingSocial"
        >
          <i class="bi bi-check2 me-1"></i>
          {{ savingSocial ? 'Guardando...' : 'Guardar redes sociales' }}
        </button>
      </section>

      <!-- ============================================ -->
      <!-- SECTION 3: WhatsApp -->
      <!-- ============================================ -->
      <section class="abt-surface p-4 mb-4">
        <div class="d-flex align-items-center gap-2 mb-3">
          <i class="bi bi-whatsapp fs-5" style="color: var(--abt-whatsapp);"></i>
          <h2 class="h5 abt-display mb-0" style="color: var(--abt-text);">WhatsApp</h2>
        </div>
        <p class="abt-text-muted small mb-4">
          Este número aparece en el botón flotante de WhatsApp y en el pie de página. Usa el formato internacional sin «+» ni espacios (ej: <code>5212221234567</code>).
        </p>

        <div class="mb-4">
          <label class="form-label small text-white-50 fw-bold" for="whatsappNumber">Número de WhatsApp</label>
          <div class="input-group">
            <span class="input-group-text bg-dark border-secondary text-white-50">
              <i class="bi bi-telephone-fill"></i>
            </span>
            <input
              id="whatsappNumber"
              v-model="settings.whatsapp_number"
              type="text"
              class="form-control bg-dark text-light border-secondary"
              placeholder="5212221234567"
              maxlength="15"
            />
          </div>
        </div>

        <button
          class="btn abt-btn-neon btn-sm"
          @click="saveWhatsapp"
          :disabled="savingWhatsapp"
        >
          <i class="bi bi-check2 me-1"></i>
          {{ savingWhatsapp ? 'Guardando...' : 'Guardar WhatsApp' }}
        </button>
      </section>

      <!-- ============================================ -->
      <!-- SECTION 4: Video del Banner (Hero) -->
      <!-- ============================================ -->
      <section class="abt-surface p-4">
        <div class="d-flex align-items-center gap-2 mb-3">
          <i class="bi bi-film fs-5 abt-text-cyan"></i>
          <h2 class="h5 abt-display mb-0" style="color: var(--abt-text);">Video del Banner Principal (Hero)</h2>
        </div>
        <p class="abt-text-muted small mb-4">
          Sube un video en formato MP4, WebM o MOV (hasta 100 MB). Este video se mostrará como fondo a pantalla completa en la página de inicio. Si no hay video, se mostrará el gradiente animado por defecto.
        </p>

        <!-- Preview -->
        <div class="mb-4">
          <label class="form-label small text-white-50 fw-bold">Vista previa actual:</label>
          <div v-if="formattedVideoUrl" class="ratio ratio-16x9 rounded overflow-hidden border border-secondary">
            <video :src="formattedVideoUrl" controls autoplay loop style="object-fit: cover;"></video>
          </div>
          <div v-else class="p-4 text-center rounded border border-secondary" style="background: rgba(255,255,255,0.03);">
            <i class="bi bi-film fs-2 text-white-50 d-block mb-2"></i>
            <span class="abt-text-muted small">No hay video configurado. Se está mostrando el fondo de gradiente animado con partículas.</span>
          </div>
        </div>

        <!-- Upload Controls -->
        <div class="d-flex align-items-center gap-3 flex-wrap">
          <label class="btn abt-btn-neon mb-0 position-relative" :class="{ disabled: uploading }">
            <i class="bi bi-upload me-2"></i>
            {{ uploading ? 'Subiendo video...' : 'Subir nuevo video' }}
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
              class="position-absolute top-0 start-0 opacity-0 w-100 h-100 cursor-pointer"
              @change="handleFileUpload"
              :disabled="uploading"
            />
          </label>

          <button
            v-if="formattedVideoUrl"
            class="btn btn-outline-danger btn-sm rounded-pill py-2 px-3"
            @click="removeVideo"
            :disabled="uploading"
          >
            <i class="bi bi-trash me-1"></i> Quitar video
          </button>
        </div>
      </section>
    </template>
  </div>
</template>
