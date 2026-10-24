import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { fetchUser } from '../api/auth'

// Must not exceed SANCTUM_IDLE_TIMEOUT on the backend (30 min by default).
const IDLE_MS = 30 * 60 * 1000
// While the admin is active, ping the API this often so the backend's own
// idle check sees the activity (e.g. a long edit with no saves yet).
const KEEPALIVE_MS = 5 * 60 * 1000
const CHECK_MS = 15 * 1000
const WRITE_THROTTLE_MS = 5 * 1000
// Shared through localStorage so activity in any admin tab counts for all.
const STORAGE_KEY = 'albatros_admin_last_activity'
const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'wheel']

function readLastActivity() {
  try {
    return Number(localStorage.getItem(STORAGE_KEY)) || 0
  } catch {
    return 0
  }
}

function writeLastActivity(ts) {
  try {
    localStorage.setItem(STORAGE_KEY, String(ts))
  } catch {
    // Storage unavailable: the in-memory value still covers this tab.
  }
}

export function useIdleLogout() {
  const auth = useAuthStore()
  const router = useRouter()

  let lastActivity = Date.now()
  let lastPing = Date.now()
  let timer = null
  let loggingOut = false

  function onActivity() {
    const now = Date.now()
    if (now - lastActivity < WRITE_THROTTLE_MS) return
    lastActivity = now
    writeLastActivity(now)

    if (now - lastPing >= KEEPALIVE_MS) {
      lastPing = now
      fetchUser().catch(() => {
        // A 401 here is handled by the global interceptor in main.js.
      })
    }
  }

  async function check() {
    if (loggingOut) return
    lastActivity = Math.max(lastActivity, readLastActivity())
    if (Date.now() - lastActivity < IDLE_MS) return

    loggingOut = true
    const redirect = router.currentRoute.value.fullPath
    try {
      await auth.logout()
    } catch {
      // Token may already be rejected server-side; it's cleared either way.
    }
    router.push({ name: 'admin-login', query: { redirect, expired: 'idle' } })
  }

  function onVisibilityChange() {
    // Timers are throttled in background tabs and paused while the laptop
    // sleeps, so re-check as soon as the tab is visible again.
    if (document.visibilityState === 'visible') check()
  }

  onMounted(() => {
    writeLastActivity(lastActivity)
    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, onActivity, { passive: true }))
    document.addEventListener('visibilitychange', onVisibilityChange)
    timer = setInterval(check, CHECK_MS)
  })

  onUnmounted(() => {
    ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, onActivity))
    document.removeEventListener('visibilitychange', onVisibilityChange)
    clearInterval(timer)
  })
}
