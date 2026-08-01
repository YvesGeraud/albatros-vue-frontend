<script setup>
import { onMounted, reactive, ref } from 'vue'
import { adminProducts, adminCategories } from '../../api/admin'
import { adminUploads } from '../../api/uploads'

const products = ref([])
const categories = ref([])
const editingId = ref(null)
const uploading = ref(false)
const form = reactive({
  category_id: '',
  name: '',
  slug: '',
  description: '',
  price: 0,
  image_path: null,
  image_url: null,
  is_active: true,
  sort_order: 0,
})

async function load() {
  ;[products.value, categories.value] = await Promise.all([
    adminProducts.list(),
    adminCategories.list(),
  ])
}

function resetForm() {
  editingId.value = null
  Object.assign(form, {
    category_id: categories.value[0]?.id ?? '',
    name: '',
    slug: '',
    description: '',
    price: 0,
    image_path: null,
    image_url: null,
    is_active: true,
    sort_order: 0,
  })
}

function edit(product) {
  editingId.value = product.id
  Object.assign(form, {
    category_id: product.category_id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    image_path: product.image_path,
    image_url: product.image_url,
    is_active: product.is_active,
    sort_order: product.sort_order,
  })
}

async function onImageChange(event) {
  const file = event.target.files[0]
  if (!file) return
  uploading.value = true
  try {
    const uploaded = await adminUploads.upload(file, 'products')
    form.image_path = uploaded.path
    form.image_url = uploaded.url
  } finally {
    uploading.value = false
  }
}

async function handleSubmit() {
  if (editingId.value) {
    await adminProducts.update(editingId.value, form)
  } else {
    await adminProducts.create(form)
  }
  resetForm()
  await load()
}

async function remove(product) {
  if (!confirm(`¿Eliminar el producto "${product.name}"?`)) return
  await adminProducts.remove(product.id)
  await load()
}

function categoryName(id) {
  return categories.value.find((c) => c.id === id)?.name ?? '—'
}

onMounted(async () => {
  await load()
  resetForm()
})
</script>

<template>
  <div>
    <h1 class="abt-display h3 mb-4" style="color: var(--abt-text);">Productos</h1>

    <div class="row g-4">
      <div class="col-lg-7">
        <table class="table table-dark table-borderless align-middle">
          <thead>
            <tr class="abt-mono small abt-text-muted">
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td>
                <img v-if="product.image_url" :src="product.image_url" class="rounded me-2" style="width: 32px; height: 32px; object-fit: cover;" />
                {{ product.name }}
                <span v-if="!product.is_active" class="badge bg-secondary ms-1">inactivo</span>
              </td>
              <td class="abt-text-muted">{{ categoryName(product.category_id) }}</td>
              <td class="abt-mono">${{ Number(product.price).toLocaleString('es-MX') }}</td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-light me-2" @click="edit(product)">Editar</button>
                <button class="btn btn-sm btn-outline-danger" @click="remove(product)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="col-lg-5">
        <form class="abt-surface p-4" @submit.prevent="handleSubmit">
          <h2 class="h6 abt-mono abt-text-muted mb-3">
            {{ editingId ? 'EDITAR PRODUCTO' : 'NUEVO PRODUCTO' }}
          </h2>
          <div class="mb-3">
            <label class="form-label small">Categoría</label>
            <select v-model.number="form.category_id" class="form-select" required>
              <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
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
            <label class="form-label small">Precio (MXN)</label>
            <input v-model.number="form.price" type="number" step="0.01" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label small">Imagen</label>
            <input type="file" accept="image/*" class="form-control" @change="onImageChange" :disabled="uploading" />
            <img v-if="form.image_url" :src="form.image_url" class="mt-2 rounded" style="max-height: 100px;" />
          </div>
          <div class="form-check mb-3">
            <input v-model="form.is_active" type="checkbox" class="form-check-input" id="productActive" />
            <label class="form-check-label small" for="productActive">Activo (visible al público)</label>
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
