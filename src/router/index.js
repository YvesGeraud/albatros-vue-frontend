import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/PublicLayout.vue'),
      children: [
        { path: '', name: 'home', component: () => import('../views/public/HomeView.vue') },
        { path: 'eventos', name: 'events', component: () => import('../views/public/EventsView.vue') },
        { path: 'eventos/:slug', name: 'event-detail', component: () => import('../views/public/EventDetailView.vue') },
        { path: 'catalogo', name: 'catalog', component: () => import('../views/public/CatalogView.vue') },
        { path: 'cotizador', name: 'quote-builder', component: () => import('../views/public/QuoteBuilderView.vue') },
        { path: 'promocion', name: 'flyer', alias: ['flyer', 'redes'], component: () => import('../views/public/FlyerView.vue') },
      ],
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('../views/admin/LoginView.vue'),
    },
    {
      path: '/admin',
      component: () => import('../layouts/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: { name: 'admin-settings' } },
        { path: 'configuracion', name: 'admin-settings', component: () => import('../views/admin/SiteSettingsView.vue') },
      ],
    },
  ],
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true

  const auth = useAuthStore()
  if (!auth.initialized) {
    await auth.fetchCurrentUser()
  }

  if (!auth.isAuthenticated) {
    return { name: 'admin-login', query: { redirect: to.fullPath } }
  }

  return true
})

export default router
