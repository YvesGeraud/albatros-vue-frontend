import client, { setToken } from './client'

export async function login(credentials) {
  const { data } = await client.post('/api/v1/login', credentials)
  setToken(data.token)
  return data.user
}

export async function logout() {
  try {
    await client.post('/api/v1/logout')
  } finally {
    setToken(null)
  }
}

export function fetchUser() {
  return client.get('/api/v1/user').then((res) => res.data)
}
