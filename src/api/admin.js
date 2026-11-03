import client from './client'

const base = '/api/v1/admin'

export const adminSettings = {
  get: () => client.get(`${base}/settings`).then((r) => r.data.data),
  update: (payload) => client.put(`${base}/settings`, payload).then((r) => r.data.data),
}

