<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import L from 'leaflet'
import { useRouter } from 'vue-router'

const props = defineProps({
  events: { type: Array, default: () => [] },
})

const router = useRouter()
const mapEl = ref(null)
let map
let markersLayer

function iconFor(event) {
  const color = event.is_live ? 'var(--abt-orange)' : 'var(--abt-purple)'
  const pulse = event.is_live ? 'abt-marker-live' : ''
  return L.divIcon({
    className: '',
    html: `<span class="abt-map-marker ${pulse}" style="background:${color}"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  })
}

function renderMarkers() {
  if (!map) return
  markersLayer.clearLayers()

  const withCoords = props.events.filter((e) => e.latitude && e.longitude)
  withCoords.forEach((event) => {
    const marker = L.marker([event.latitude, event.longitude], { icon: iconFor(event) })
    marker.bindPopup(
      `<strong>${event.title}</strong><br/>${event.venue_name ?? ''}<br/>` +
        `<a href="#" data-slug="${event.slug}">Ver detalle</a>`
    )
    marker.on('popupopen', () => {
      const link = document.querySelector(`a[data-slug="${event.slug}"]`)
      link?.addEventListener('click', (e) => {
        e.preventDefault()
        router.push({ name: 'event-detail', params: { slug: event.slug } })
      })
    })
    markersLayer.addLayer(marker)
  })

  if (withCoords.length > 0) {
    map.fitBounds(markersLayer.getBounds().pad(0.2))
  }
}

onMounted(() => {
  map = L.map(mapEl.value, { scrollWheelZoom: false }).setView([19.3182, -98.2375], 10)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)
  markersLayer = L.featureGroup().addTo(map)
  renderMarkers()
})

onUnmounted(() => {
  map?.remove()
})

watch(() => props.events, renderMarkers, { deep: true })
</script>

<template>
  <div ref="mapEl" class="abt-events-map abt-surface"></div>
</template>

<style scoped>
.abt-events-map {
  height: 360px;
  width: 100%;
  z-index: 0;
}
</style>

<style>
.abt-map-marker {
  display: block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #0a0912;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
}
.abt-marker-live {
  animation: abt-marker-pulse 1.2s infinite;
}
@keyframes abt-marker-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 107, 53, 0.6); }
  50% { box-shadow: 0 0 0 8px rgba(255, 107, 53, 0); }
}
</style>
