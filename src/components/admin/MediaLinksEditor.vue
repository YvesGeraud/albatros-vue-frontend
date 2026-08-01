<script setup>
import { reactive, ref } from 'vue'
import { adminEventMedia } from '../../api/admin'
import { adminUploads } from '../../api/uploads'

const props = defineProps({
  eventId: { type: Number, required: true },
  media: { type: Array, default: () => [] },
})

const emit = defineEmits(['refresh'])

const form = reactive({ type: 'youtube_video', url: '', external_id: '', caption: '' })
const selectedFile = ref(null)
const uploading = ref(false)

function extractYoutubeId(url) {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : ''
}

function onFileChange(event) {
  selectedFile.value = event.target.files[0] ?? null
}

function canAdd() {
  return form.type === 'photo' ? !!selectedFile.value : !!form.url
}

async function add() {
  uploading.value = true
  try {
    const payload = { ...form }

    if (form.type === 'photo') {
      const uploaded = await adminUploads.upload(selectedFile.value, 'events')
      payload.url = uploaded.path
    } else if (form.type === 'youtube_video' || form.type === 'youtube_live') {
      if (!payload.external_id) payload.external_id = extractYoutubeId(form.url)
    }

    await adminEventMedia.create(props.eventId, payload)
    Object.assign(form, { type: 'youtube_video', url: '', external_id: '', caption: '' })
    selectedFile.value = null
    emit('refresh')
  } finally {
    uploading.value = false
  }
}

async function remove(media) {
  await adminEventMedia.remove(media.id)
  emit('refresh')
}
</script>

<template>
  <div>
    <ul class="list-unstyled mb-3">
      <li v-for="m in media" :key="m.id" class="d-flex justify-content-between align-items-center small mb-2 abt-surface p-2">
        <span class="d-flex align-items-center gap-2">
          <img v-if="m.type === 'photo'" :src="m.url" class="rounded" style="width: 40px; height: 40px; object-fit: cover;" />
          <span>
            <span class="abt-mono abt-text-muted">{{ m.type }}</span> — {{ m.caption || m.url }}
          </span>
        </span>
        <button type="button" class="btn btn-sm btn-outline-danger" @click="remove(m)">Quitar</button>
      </li>
      <li v-if="media.length === 0" class="small abt-text-muted">Sin fotos/videos aún.</li>
    </ul>

    <div class="row g-2 align-items-end">
      <div class="col-md-3">
        <label class="form-label small">Tipo</label>
        <select v-model="form.type" class="form-select form-select-sm">
          <option value="youtube_video">YouTube (video)</option>
          <option value="youtube_live">YouTube (en vivo)</option>
          <option value="facebook_post">Facebook (post)</option>
          <option value="photo">Foto (subir archivo)</option>
        </select>
      </div>
      <div class="col-md-5">
        <label class="form-label small">{{ form.type === 'photo' ? 'Archivo' : 'URL' }}</label>
        <input
          v-if="form.type === 'photo'"
          type="file"
          accept="image/*"
          class="form-control form-control-sm"
          @change="onFileChange"
        />
        <input v-else v-model="form.url" type="url" class="form-control form-control-sm" placeholder="https://..." />
      </div>
      <div class="col-md-3">
        <label class="form-label small">Descripción</label>
        <input v-model="form.caption" type="text" class="form-control form-control-sm" />
      </div>
      <div class="col-md-1">
        <button type="button" class="btn btn-sm abt-btn-neon w-100" @click="add" :disabled="!canAdd() || uploading">
          +
        </button>
      </div>
    </div>
  </div>
</template>
