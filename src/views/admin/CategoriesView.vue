<script setup>
import { onMounted, reactive, ref } from 'vue'
import { adminCategories } from '../../api/admin'

const categories = ref([])
const editingId = ref(null)
const form = reactive({ name: '', slug: '', description: '', icon: '', sort_order: 0 })

async function load() {
  categories.value = await adminCategories.list()
}

function resetForm() {
  editingId.value = null
  Object.assign(form, { name: '', slug: '', description: '', icon: '', sort_order: 0 })
}

function edit(category) {
  editingId.value = category.id
  Object.assign(form, {
    name: category.name,
    slug: category.slug,
    description: category.description,
    icon: category.icon,
    sort_order: category.sort_order,
  })
}

async function handleSubmit() {
  if (editingId.value) {
    await adminCategories.update(editingId.value, form)
  } else {
    await adminCategories.create(form)
  }
  resetForm()
  await load()
}

async function remove(category) {
  if (!confirm(`¿Eliminar la categoría "${category.name}"?`)) return
  await adminCategories.remove(category.id)
  await load()
}

onMounted(load)
</script>

<template>
  <div>
    <h1 class="abt-display h3 mb-4" style="color: var(--abt-text);">Categorías</h1>

    <div class="row g-4">
      <div class="col-lg-7">
        <table class="table table-dark table-borderless align-middle">
          <thead>
            <tr class="abt-mono small abt-text-muted">
              <th>Nombre</th>
              <th>Slug</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categories" :key="category.id">
              <td>{{ category.name }}</td>
              <td class="abt-text-muted">{{ category.slug }}</td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-light me-2" @click="edit(category)">Editar</button>
                <button class="btn btn-sm btn-outline-danger" @click="remove(category)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="col-lg-5">
        <form class="abt-surface p-4" @submit.prevent="handleSubmit">
          <h2 class="h6 abt-mono abt-text-muted mb-3">
            {{ editingId ? 'EDITAR CATEGORÍA' : 'NUEVA CATEGORÍA' }}
          </h2>
          <div class="mb-3">
            <label class="form-label small">Nombre</label>
            <input v-model="form.name" type="text" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label small">Slug</label>
            <input v-model="form.slug" type="text" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label small">Descripción</label>
            <textarea v-model="form.description" class="form-control" rows="2"></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label small">Ícono (bootstrap-icons, ej. bi-soundwave)</label>
            <input v-model="form.icon" type="text" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label small">Orden</label>
            <input v-model.number="form.sort_order" type="number" class="form-control" />
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
