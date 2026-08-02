import client from './client'

export function fetchTestimonials() {
  return client.get('/api/v1/testimonials').then((res) => res.data.data)
}
