import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL
const TOKEN_KEY = 'albatros_admin_token'

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
