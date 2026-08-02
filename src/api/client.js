import axios from 'axios'

const TOKEN_KEY = 'albatros_admin_token'

// Without a scheme (e.g. "albatros.up.railway.app" instead of
// "https://albatros.up.railway.app"), axios/the browser treat this as a
// path relative to the frontend's own origin instead of an absolute URL,
// silently producing requests like
// "https://<frontend-domain>/albatros.up.railway.app/api/...". Normalize it
// so a misconfigured env var fails loudly instead of that.
const rawBaseURL = import.meta.env.VITE_API_BASE_URL
if (!rawBaseURL) {
  throw new Error('VITE_API_BASE_URL no está configurada.')
}
const baseURL = /^https?:\/\//.test(rawBaseURL) ? rawBaseURL : `https://${rawBaseURL}`

const client = axios.create({
  baseURL,
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export default client
