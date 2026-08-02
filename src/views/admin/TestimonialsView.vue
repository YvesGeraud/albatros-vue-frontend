<script setup>
import { onMounted, reactive, ref } from 'vue'
import { adminTestimonials } from '../../api/admin'
import { adminUploads } from '../../api/uploads'

const testimonials = ref([])
const editingId = ref(null)
const uploading = ref(false)
const form = reactive({
  customer_name: '',
  event_type: '',
  content: '',
  rating: 5,
  avatar_path: null,
  avatar_url: null,
  is_active: true,
  sort_order: 0,
})

async function load() {
  testimonials.value = await adminTestimonials.list()
}

function resetForm() {
  editingId.value = null
  Object.assign(form, {
    customer_name: '',
    event_type: '',
    content: '',
    rating: 5,
    avatar_path: null,
    avatar_url: null,
    is_active: true,
    sort_order: 0,
  })
}

function edit(testimonial) {
  editingId.value = testimonial.id
  Object.assign(form, {
    customer_name: testimonial.customer_name,
    event_type: testimonial.event_type,
    content: testimonial.content,
    rating: testimonial.rating,
    avatar_path: testimonial.avatar_path,
    avatar_url: testimonial.avatar_url,
    is_active: testimonial.is_active,
    sort_order: testimonial.sort_order,
  })
}

async function onAvatarChange(event) {
  const file = event.target.files[0]
  if (!file) return
  uploading.value = true
  try {
    const uploaded = await adminUploads.upload(file, 'testimonials')
    form.avatar_path = uploaded.path
    form.avatar_url = uploaded.url
  } finally {
    uploading.value = false
  }
}

async function handleSubmit() {
  if (editingId.value) {
    await adminTestimonials.update(editingId.value, form)
  } else {
    await adminTestimonials.create(form)
  }
  resetForm()
  await load()
}

async function remove(testimonial) {
  if (!confirm(`¿Eliminar el testimonio de "${testimonial.customer_name}"?`)) return
  await adminTestimonials.remove(testimonial.id)
  await load()
}

onMounted(async () => {
  await load()
  resetForm()
})
</script>

<template>
  <div>
    <h1 class="abt-display h3 mb-4" style="color: var(--abt-text);">Testimonios</h1>

    <div class="row g-4">
      <div class="col-lg-7">
        <table class="table table-dark table-borderless align-middle">
          <thead>
            <tr class="abt-mono small abt-text-muted">
              <th>Cliente</th>
              <th>Evento</th>
              <th>Calificación</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="testimonial in testimonials" :key="testimonial.id">
              <td>
                <img v-if="testimonial.avatar_url" :src="testimonial.avatar_url" class="rounded-circle me-2" style="width: 32px; height: 32px; object-fit: cover;" />
                {{ testimonial.customer_name }}
                <span v-if="!testimonial.is_active" class="badge bg-secondary ms-1">inactivo</span>
              </td>
              <td class="abt-text-muted">{{ testimonial.event_type ?? '—' }}</td>
              <td class="abt-mono">{{ testimonial.rating ? `${testimonial.rating}★` : '—' }}</td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-light me-2" @click="edit(testimonial)">Editar</button>
                <button class="btn btn-sm btn-outline-danger" @click="remove(testimonial)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="col-lg-5">
        <form class="abt-surface p-4" @submit.prevent="handleSubmit">
          <h2 class="h6 abt-mono abt-text-muted mb-3">
            {{ editingId ? 'EDITAR TESTIMONIO' : 'NUEVO TESTIMONIO' }}
          </h2>
          <div class="mb-3">
            <label class="form-label small">Nombre del cliente</label>
            <input v-model="form.customer_name" type="text" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label small">Tipo de evento</label>
            <input v-model="form.event_type" type="text" class="form-control" placeholder="Boda, XV años, etc." />
          </div>
          <div class="mb-3">
            <label class="form-label small">Testimonio</label>
            <textarea v-model="form.content" class="form-control" rows="3" required></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label small">Calificación (1-5)</label>
            <input v-model.number="form.rating" type="number" min="1" max="5" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label small">Foto (opcional)</label>
            <input type="file" accept="image/*" class="form-control" @change="onAvatarChange" :disabled="uploading" />
            <img v-if="form.avatar_url" :src="form.avatar_url" class="mt-2 rounded-circle" style="width: 64px; height: 64px; object-fit: cover;" />
          </div>
          <div class="mb-3">
            <label class="form-label small">Orden</label>
            <input v-model.number="form.sort_order" type="number" class="form-control" />
          </div>
          <div class="form-check mb-3">
            <input v-model="form.is_active" type="checkbox" class="form-check-input" id="testimonialActive" />
            <label class="form-check-label small" for="testimonialActive">Activo (visible al público)</label>
          </div>
          <div class="d-flex gap-2">
            <button type="submit" class="btn abt-btn-neon">
              {{ editingId ? 'Guardar' : 'Crear' }}
            </button>
            <button v-if="editingId" type="button" class="btn btn-outline-light" @click="resetForm">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
