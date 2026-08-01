<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminEvents } from '../../api/admin'
import LocationPicker from '../../components/admin/LocationPicker.vue'
import MediaLinksEditor from '../../components/admin/MediaLinksEditor.vue'

const route = useRoute()
const router = useRouter()
const eventId = computed(() => (route.params.id ? Number(route.params.id) : null))

const form = reactive({
  title: '',
  slug: '',
  description: '',
  venue_name: '',
  address: '',
  latitude: null,
  longitude: null,
  event_date: '',
  is_live: false,
})
const media = ref([])
const loading = ref(false)

async function loadEvent() {
  if (!eventId.value) return
  const event = await adminEvents.get(eventId.value)
  Object.assign(form, {
    title: event.title,
    slug: event.slug,
    description: event.description,
    venue_name: event.venue_name,
    address: event.address,
    latitude: event.latitude,
    longitude: event.longitude,
    event_date: event.event_date?.slice(0, 16),
    is_live: event.is_live,
  })
  media.value = event.media ?? []
}

async function refreshMedia() {
  const event = await adminEvents.get(eventId.value)
  media.value = event.media ?? []
}

async function handleSubmit() {
  loading.value = true
  try {
    if (eventId.value) {
      await adminEvents.update(eventId.value, form)
    } else {
      const created = await adminEvents.create(form)
      router.replace({ name: 'admin-event-edit', params: { id: created.id } })
      return
    }
    router.push({ name: 'admin-events' })
  } finally {
    loading.value = false
  }
}

onMounted(loadEvent)
</script>

<template>
  <div>
    <h1 class="abt-display h3 mb-4" style="color: var(--abt-text);">
      {{ eventId ? 'Editar evento' : 'Nuevo evento' }}
    </h1>

    <form class="abt-surface p-4 mb-4" @submit.prevent="handleSubmit">
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label small">Título</label>
          <input v-model="form.title" type="text" class="form-control" required />
        </div>
        <div class="col-md-6">
          <label class="form-label small">Slug</label>
          <input v-model="form.slug" type="text" class="form-control" required />
        </div>
        <div class="col-12">
          <label class="form-label small">Descripción</label>
          <textarea v-model="form.description" class="form-control" rows="2"></textarea>
        </div>
        <div class="col-md-6">
          <label class="form-label small">Recinto</label>
          <input v-model="form.venue_name" type="text" class="form-control" />
        </div>
        <div class="col-md-6">
          <label class="form-label small">Dirección</label>
          <input v-model="form.address" type="text" class="form-control" />
        </div>
        <div class="col-md-6">
          <label class="form-label small">Fecha y hora</label>
          <input v-model="form.event_date" type="datetime-local" class="form-control" required />
        </div>
        <div class="col-md-6 d-flex align-items-end">
          <div class="form-check">
            <input v-model="form.is_live" type="checkbox" class="form-check-input" id="isLive" />
            <label class="form-check-label small" for="isLive">Transmitiendo en vivo ahora</label>
          </div>
        </div>
        <div class="col-12">
          <label class="form-label small">Ubicación</label>
          <LocationPicker
            v-model:latitude="form.latitude"
            v-model:longitude="form.longitude"
          />
        </div>
      </div>

      <button type="submit" class="btn abt-btn-neon mt-4" :disabled="loading">
        {{ eventId ? 'Guardar cambios' : 'Crear evento' }}
      </button>
    </form>

    <div v-if="eventId" class="abt-surface p-4">
      <h2 class="h6 abt-mono abt-text-muted mb-3">FOTOS Y VIDEOS</h2>
      <MediaLinksEditor :event-id="eventId" :media="media" @refresh="refreshMedia" />
    </div>
    <p v-else class="small abt-text-muted">
      Guarda el evento primero para poder agregar fotos y videos.
    </p>
  </div>
</template>
