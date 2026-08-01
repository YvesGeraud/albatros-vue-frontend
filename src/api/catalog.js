import client from './client'

export function fetchCatalog() {
  return client.get('/api/v1/catalog').then((res) => res.data)
}
