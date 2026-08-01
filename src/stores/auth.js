import { defineStore } from 'pinia'
import * as authApi from '../api/auth'
import { getToken } from '../api/client'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    initialized: false,
  }),
  getters: {
    isAuthenticated: (state) => state.user !== null,
  },
  actions: {
    async fetchCurrentUser() {
      if (!getToken()) {
        this.user = null
        this.initialized = true
        return
      }
      try {
        this.user = await authApi.fetchUser()
      } catch {
        this.user = null
      } finally {
        this.initialized = true
      }
    },
    async login(credentials) {
      this.user = await authApi.login(credentials)
    },
    async logout() {
      await authApi.logout()
      this.user = null
    },
  },
})
