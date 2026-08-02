import client from './client'

const base = '/api/v1/admin'

export const adminCategories = {
  list: () => client.get(`${base}/categories`).then((r) => r.data.data),
  create: (payload) => client.post(`${base}/categories`, payload).then((r) => r.data.data),
  update: (id, payload) => client.put(`${base}/categories/${id}`, payload).then((r) => r.data.data),
  remove: (id) => client.delete(`${base}/categories/${id}`),
}

export const adminProducts = {
  list: () => client.get(`${base}/products`).then((r) => r.data.data),
  create: (payload) => client.post(`${base}/products`, payload).then((r) => r.data.data),
  update: (id, payload) => client.put(`${base}/products/${id}`, payload).then((r) => r.data.data),
  remove: (id) => client.delete(`${base}/products/${id}`),
}

export const adminCombos = {
  list: () => client.get(`${base}/combos`).then((r) => r.data.data),
  create: (payload) => client.post(`${base}/combos`, payload).then((r) => r.data.data),
  update: (id, payload) => client.put(`${base}/combos/${id}`, payload).then((r) => r.data.data),
  remove: (id) => client.delete(`${base}/combos/${id}`),
}

export const adminEvents = {
  list: () => client.get(`${base}/events`).then((r) => r.data.data),
  get: (id) => client.get(`${base}/events/${id}`).then((r) => r.data.data),
  create: (payload) => client.post(`${base}/events`, payload).then((r) => r.data.data),
  update: (id, payload) => client.put(`${base}/events/${id}`, payload).then((r) => r.data.data),
  remove: (id) => client.delete(`${base}/events/${id}`),
}

export const adminEventMedia = {
  create: (eventId, payload) =>
    client.post(`${base}/events/${eventId}/media`, payload).then((r) => r.data.data),
  update: (mediaId, payload) =>
    client.put(`${base}/media/${mediaId}`, payload).then((r) => r.data.data),
  remove: (mediaId) => client.delete(`${base}/media/${mediaId}`),
}

export const adminTestimonials = {
  list: () => client.get(`${base}/testimonials`).then((r) => r.data.data),
  create: (payload) => client.post(`${base}/testimonials`, payload).then((r) => r.data.data),
  update: (id, payload) => client.put(`${base}/testimonials/${id}`, payload).then((r) => r.data.data),
  remove: (id) => client.delete(`${base}/testimonials/${id}`),
}

export const adminQuotes = {
  list: () => client.get(`${base}/quotes`).then((r) => r.data.data),
  get: (id) => client.get(`${base}/quotes/${id}`).then((r) => r.data.data),
  updateStatus: (id, status) =>
    client.patch(`${base}/quotes/${id}`, { status }).then((r) => r.data.data),
}

export const adminSettings = {
  get: () => client.get(`${base}/settings`).then((r) => r.data.data),
  update: (payload) => client.put(`${base}/settings`, payload).then((r) => r.data.data),
}

