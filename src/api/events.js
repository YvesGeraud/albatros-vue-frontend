import client from './client'

export function fetchEvents(params = {}) {
  return client.get('/api/v1/events', { params }).then((res) => res.data.data)
}

export function fetchEvent(idOrSlug) {
  return client.get(`/api/v1/events/${idOrSlug}`).then((res) => res.data.data)
}

export function fetchLiveNow() {
  return client.get('/api/v1/events/live-now').then((res) => res.data?.data ?? null)
}

export function fetchFeaturedVideo() {
  return client.get('/api/v1/events/featured-video').then((res) => res.data?.data ?? null)
}
