import client from './client'

export function fetchSiteSettings() {
  return client.get('/api/v1/settings').then((r) => r.data.data)
}

/** @deprecated Use fetchSiteSettings instead */
export function fetchHeroSettings() {
  return client.get('/api/v1/settings/hero').then((r) => r.data.data)
}

export const adminSettings = {
  get: () => client.get('/api/v1/admin/settings').then((r) => r.data.data),
  update: (payload) => client.put('/api/v1/admin/settings', payload).then((r) => r.data.data),
}
