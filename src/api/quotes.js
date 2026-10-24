import client from './client'

export function submitQuote(payload) {
  return client.post('/api/v1/quotes', payload).then((res) => res.data.data)
}

export function submitPackageQuote(payload) {
  return client.post('/api/v1/quotes/package', payload).then((res) => res.data.data)
}
