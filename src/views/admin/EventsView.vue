<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { adminEvents } from '../../api/admin'

const events = ref([])

async function load() {
  events.value = await adminEvents.list()
}

async function remove(event) {
  if (!confirm(`¿Eliminar el evento "${event.title}"?`)) return
  await adminEvents.remove(event.id)
  await load()
}

onMounted(load)
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="abt-display h3 mb-0" style="color: var(--abt-text);">Eventos</h1>
      <RouterLink :to="{ name: 'admin-event-new' }" class="btn abt-btn-neon btn-sm">
        Nuevo evento
      </RouterLink>
    </div>

    <table class="table table-dark table-borderless align-middle">
      <thead>
        <tr class="abt-mono small abt-text-muted">
          <th>Título</th>
          <th>Fecha</th>
          <th>Estado</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="event in events" :key="event.id">
          <td>{{ event.title }}</td>
          <td class="abt-text-muted">{{ new Date(event.event_date).toLocaleDateString('es-MX') }}</td>
          <td>
            <span v-if="event.is_live" class="abt-badge-live">EN VIVO</span>
            <span v-else class="abt-mono small abt-text-muted">{{ event.status }}</span>
          </td>
          <td class="text-end">
            <RouterLink
              :to="{ name: 'admin-event-edit', params: { id: event.id } }"
              class="btn btn-sm btn-outline-light me-2"
            >
              Editar
            </RouterLink>
            <button class="btn btn-sm btn-outline-danger" @click="remove(event)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
