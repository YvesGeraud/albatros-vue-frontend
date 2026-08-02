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
        { path: '', name: 'admin-dashboard', component: () => import('../views/admin/DashboardView.vue') },
        { path: 'categorias', name: 'admin-categories', component: () => import('../views/admin/CategoriesView.vue') },
        { path: 'productos', name: 'admin-products', component: () => import('../views/admin/ProductsView.vue') },
        { path: 'combos', name: 'admin-combos', component: () => import('../views/admin/CombosView.vue') },
        { path: 'eventos', name: 'admin-events', component: () => import('../views/admin/EventsView.vue') },
        { path: 'eventos/nuevo', name: 'admin-event-new', component: () => import('../views/admin/EventFormView.vue') },
        { path: 'eventos/:id/editar', name: 'admin-event-edit', component: () => import('../views/admin/EventFormView.vue') },
        { path: 'cotizaciones', name: 'admin-quotes', component: () => import('../views/admin/QuotesView.vue') },
        { path: 'testimonios', name: 'admin-testimonials', component: () => import('../views/admin/TestimonialsView.vue') },
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
