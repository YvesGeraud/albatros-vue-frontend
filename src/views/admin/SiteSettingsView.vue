<script setup>
import { computed, onMounted, ref } from 'vue'
import { adminSettings } from '../../api/admin'
import { adminUploads } from '../../api/uploads'

const settings = ref({
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
const saving = ref(false)
const error = ref(null)
const successMessage = ref('')

onMounted(async () => {
  try {
    settings.value = await adminSettings.get()
  } catch {
    error.value = 'Error al cargar la configuración.'
  } finally {
    loading.value = false
  }
})

async function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  uploading.value = true
  error.value = null
  successMessage.value = ''

  try {
    const uploaded = await adminUploads.upload(file, 'hero')
    settings.value.hero_video_path = uploaded.path
    settings.value.hero_video_url = uploaded.url

    await adminSettings.update({ hero_video_path: uploaded.path })
    successMessage.value = 'Video subido y actualizado correctamente.'
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al subir el video.'
  } finally {
    uploading.value = false
    event.target.value = ''
  }
}

async function removeVideo() {
  if (!confirm('¿Seguro de que deseas quitar el video del banner? Se usará el gradiente animado por defecto.')) return

  saving.value = true
  error.value = null
  successMessage.value = ''

  try {
    const updated = await adminSettings.update({ hero_video_path: null })
    settings.value = updated
    successMessage.value = 'Video eliminado correctamente.'
  } catch {
    error.value = 'Error al eliminar el video.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div style="max-width: 800px;">
    <h1 class="abt-display h3 mb-4" style="color: var(--abt-text);">Configuración del Sitio</h1>

    <div v-if="loading" class="abt-text-muted">Cargando configuración...</div>

    <div v-else class="abt-surface p-4">
      <h2 class="h5 abt-display mb-3" style="color: var(--abt-text);">Video del Banner Principal (Hero)</h2>
      <p class="abt-text-muted small mb-4">
        Sube un video en formato MP4, WebM o MOV (hasta 100 MB). Este video se mostrará como fondo a pantalla completa en la página de inicio. Si no hay video, se mostrará el gradiente animado por defecto.
      </p>

      <div v-if="error" class="alert alert-danger mb-4 py-2 small">
        {{ error }}
      </div>

      <div v-if="successMessage" class="alert alert-success mb-4 py-2 small">
        {{ successMessage }}
      </div>

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
          :disabled="saving || uploading"
        >
          <i class="bi bi-trash me-1"></i> Quitar video
        </button>
      </div>
    </div>
  </div>
</template>
