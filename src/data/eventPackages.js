// Contenido por defecto de los paquetes de la landing. El admin puede
// sobrescribir todo excepto el `id`, que el backend valida en las
// cotizaciones (basico, estandar, golden).
export const defaultEventPackages = [
  {
    id: 'basico',
    name: 'Básico',
    badge: 'Íntimo & Versátil',
    tagline: 'Fiestas privadas y reuniones',
    title: 'Paquete Básico',
    description: 'Sonido balanceado e iluminación esencial para fiestas privadas, cumpleaños y eventos pequeños. Todo lo necesario para que tu pista nunca se quede vacía.',
    highlights: ['Audio Hi-Fi', 'DJ Profesional', 'Iluminación LED'],
    image: '/images/packages/paquete-basico.jpg',
    color: '#22d3ee',
  },
  {
    id: 'estandar',
    name: 'Estándar',
    badge: 'Más Solicitado',
    tagline: 'XV años, bodas y graduaciones',
    title: 'Paquete Estándar',
    description: 'La combinación perfecta de pista LED, animación en vivo y mayor pegada sonora. Ideal para XV años, bodas y graduaciones que buscan una fiesta inolvidable.',
    highlights: ['Pista LED', 'Animación en Vivo', 'Cabezas Móviles'],
    image: '/images/packages/paquete-estandar.jpg',
    color: '#b06bff',
  },
  {
    id: 'golden',
    name: 'Golden',
    badge: 'Producción de Gala',
    tagline: 'Experiencia premium',
    title: 'Paquete Golden',
    description: 'Nuestra producción más completa: audio Line Array, pista LED expandida, pirotecnia fría y efectos especiales para que tu evento sea un verdadero espectáculo.',
    highlights: ['Line Array', 'Pirotecnia Fría', 'Efectos Especiales'],
    image: '/images/packages/paquete-golden.jpg',
    color: '#f0a838',
  },
]

// Combina lo guardado en el CMS con los defaults por id, para que siempre
// existan los 3 paquetes aunque falten campos o paquetes en lo guardado.
export function mergeEventPackages(saved) {
  const list = Array.isArray(saved) ? saved : []
  return defaultEventPackages.map((def) => {
    const override = list.find((p) => p && p.id === def.id) || {}
    const merged = { ...def, ...override, id: def.id }
    merged.highlights = Array.isArray(merged.highlights)
      ? merged.highlights.filter(Boolean)
      : String(merged.highlights || '').split(',').map((s) => s.trim()).filter(Boolean)
    return merged
  })
}
