<script setup>
import { onMounted, reactive, ref } from 'vue'
import { adminCombos, adminProducts } from '../../api/admin'
import { adminUploads } from '../../api/uploads'

const combos = ref([])
const products = ref([])
const editingId = ref(null)
const uploading = ref(false)
const form = reactive({
  name: '',
  slug: '',
  description: '',
  price: 0,
  image_path: null,
  image_url: null,
  is_active: true,
  sort_order: 0,
  products: {}, // productId -> quantity (0 = not included)
})

async function load() {
  ;[combos.value, products.value] = await Promise.all([adminCombos.list(), adminProducts.list()])
}

function resetForm() {
  editingId.value = null
  Object.assign(form, {
    name: '',
    slug: '',
    description: '',
    price: 0,
    image_path: null,
    image_url: null,
    is_active: true,
    sort_order: 0,
    products: {},
  })
}

function edit(combo) {
  editingId.value = combo.id
  const selected = {}
  for (const p of combo.products ?? []) {
    selected[p.id] = p.quantity
  }
  Object.assign(form, {
    name: combo.name,
    slug: combo.slug,
    description: combo.description,
    price: combo.price,
    image_path: combo.image_path,
    image_url: combo.image_url,
    is_active: combo.is_active,
    sort_order: combo.sort_order,
    products: selected,
  })
}

async function onImageChange(event) {
  const file = event.target.files[0]
  if (!file) return
  uploading.value = true
  try {
    const uploaded = await adminUploads.upload(file, 'combos')
    form.image_path = uploaded.path
    form.image_url = uploaded.url
  } finally {
    uploading.value = false
  }
}

function toggleProduct(productId, checked) {
  form.products = { ...form.products }
  if (checked) {
    form.products[productId] = form.products[productId] || 1
  } else {
    delete form.products[productId]
  }
}

async function handleSubmit() {
  const payload = {
    ...form,
    products: Object.entries(form.products).map(([id, quantity]) => ({
      id: Number(id),
      quantity: Number(quantity),
    })),
  }
  if (editingId.value) {
    await adminCombos.update(editingId.value, payload)
  } else {
    await adminCombos.create(payload)
  }
  resetForm()
  await load()
}

async function remove(combo) {
  if (!confirm(`¿Eliminar el combo "${combo.name}"?`)) return
  await adminCombos.remove(combo.id)
  await load()
}

onMounted(load)
</script>

<template>
  <div>
    <h1 class="abt-display h3 mb-4" style="color: var(--abt-text);">Combos</h1>

    <div class="row g-4">
      <div class="col-lg-7">
        <table class="table table-dark table-borderless align-middle">
          <thead>
            <tr class="abt-mono small abt-text-muted">
              <th>Nombre</th>
              <th>Precio</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="combo in combos" :key="combo.id">
              <td>
                <img v-if="combo.image_url" :src="combo.image_url" class="rounded me-2" style="width: 32px; height: 32px; object-fit: cover;" />
                {{ combo.name }}
              </td>
              <td class="abt-mono">${{ Number(combo.price).toLocaleString('es-MX') }}</td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-light me-2" @click="edit(combo)">Editar</button>
                <button class="btn btn-sm btn-outline-danger" @click="remove(combo)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="col-lg-5">
        <form class="abt-surface p-4" @submit.prevent="handleSubmit">
          <h2 class="h6 abt-mono abt-text-muted mb-3">
            {{ editingId ? 'EDITAR COMBO' : 'NUEVO COMBO' }}
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
            <label class="form-label small">Precio del paquete (MXN)</label>
            <input v-model.number="form.price" type="number" step="0.01" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label small">Imagen</label>
            <input type="file" accept="image/*" class="form-control" @change="onImageChange" :disabled="uploading" />
            <img v-if="form.image_url" :src="form.image_url" class="mt-2 rounded" style="max-height: 100px;" />
          </div>

          <div class="mb-3">
            <label class="form-label small d-block mb-2">Productos incluidos</label>
            <div v-for="p in products" :key="p.id" class="d-flex align-items-center gap-2 mb-1">
              <input
                type="checkbox"
                class="form-check-input"
                :checked="form.products[p.id] !== undefined"
                @change="toggleProduct(p.id, $event.target.checked)"
              />
              <span class="small flex-grow-1">{{ p.name }}</span>
              <input
                v-if="form.products[p.id] !== undefined"
                v-model.number="form.products[p.id]"
                type="number"
                min="1"
                class="form-control form-control-sm"
                style="width: 4.5rem;"
              />
            </div>
          </div>

          <div class="form-check mb-3">
            <input v-model="form.is_active" type="checkbox" class="form-check-input" id="comboActive" />
            <label class="form-check-label small" for="comboActive">Activo (visible al público)</label>
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
