<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import L from 'leaflet'
import '../../leaflet-default-icon'

const props = defineProps({
  latitude: { type: [Number, String, null], default: null },
  longitude: { type: [Number, String, null], default: null },
})

const emit = defineEmits(['update:latitude', 'update:longitude'])

const mapEl = ref(null)
let map
let marker

function placeMarker(lat, lng) {
  if (marker) {
    marker.setLatLng([lat, lng])
  } else {
    marker = L.marker([lat, lng], { draggable: true }).addTo(map)
    marker.on('dragend', () => {
      const pos = marker.getLatLng()
      emit('update:latitude', pos.lat)
      emit('update:longitude', pos.lng)
    })
  }
}

onMounted(() => {
  const initialLat = Number(props.latitude) || 19.3182
  const initialLng = Number(props.longitude) || -98.2375

  map = L.map(mapEl.value).setView([initialLat, initialLng], 11)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)

  if (props.latitude && props.longitude) {
    placeMarker(initialLat, initialLng)
  }

  map.on('click', (e) => {
    placeMarker(e.latlng.lat, e.latlng.lng)
    emit('update:latitude', e.latlng.lat)
    emit('update:longitude', e.latlng.lng)
  })
})

onUnmounted(() => {
  map?.remove()
})

watch([() => props.latitude, () => props.longitude], ([lat, lng]) => {
  if (lat && lng && map) {
    placeMarker(Number(lat), Number(lng))
  }
})
</script>

<template>
  <div>
    <div ref="mapEl" class="abt-location-picker abt-surface mb-2"></div>
    <p class="small abt-text-muted mb-0">Haz clic en el mapa para colocar la ubicación del evento.</p>
  </div>
</template>

<style scoped>
.abt-location-picker {
  height: 280px;
  width: 100%;
}
</style>
