// Leaflet's default pin icon resolves its image URLs relative to its own
// script location, which breaks once Vite bundles/hashes everything — the
// images 404 silently, leaving a broken-image icon on any L.marker() that
// doesn't specify a custom icon. Importing the images directly gives Vite
// real, hashed URLs to point Leaflet at.
//
// Side-effect-only module, imported only by components that actually use
// L.marker() with the default icon (LocationPicker.vue) — not from main.js,
// so Leaflet stays out of the main bundle and loads lazily with those
// components' own chunk, same as before.
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})
