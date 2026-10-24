<script setup>
import { computed, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { useEventsStore } from '../../stores/events'
import { useSiteStore } from '../../stores/site'

// Nothing to render here: SweetAlert2 mounts the toast directly in <body>.
defineOptions({ render: () => null })

const eventsStore = useEventsStore()
const siteStore = useSiteStore()
const router = useRouter()

const TOAST_MS = 7000

const liveEvent = computed(() => {
  if (eventsStore.liveEvent) return eventsStore.liveEvent
  if (siteStore.liveStreamActive) {
    return {
      id: 'cms-live',
      title: siteStore.liveStreamTitle || 'Evento En Vivo',
      venue_name: siteStore.liveStreamVenue || 'Tlaxcala',
    }
  }
  return null
})

// Once per browser session per event, so it doesn't reappear on every page.
function alreadyShown(id) {
  try {
    return Boolean(sessionStorage.getItem(`abt_live_dismissed_${id}`))
  } catch {
    return false
  }
}

function markShown(id) {
  try {
    sessionStorage.setItem(`abt_live_dismissed_${id}`, '1')
  } catch {
    // Storage unavailable: it may show again on the next page load.
  }
}

function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text ?? ''
  return div.innerHTML
}

function scrollToLiveSection() {
  const el = document.getElementById('en-vivo')
  if (!el) {
    router.push({ name: 'home', hash: '#en-vivo' })
    return
  }
  const navbarHeight = 80
  const pos = el.getBoundingClientRect().top + window.pageYOffset - navbarHeight
  window.scrollTo({ top: pos, behavior: 'smooth' })
}

function showToast(event) {
  markShown(event.id)
  const isMobile = window.matchMedia('(max-width: 576px)').matches

  Swal.fire({
    toast: true,
    // Left on desktop so it doesn't collide with the WhatsApp button.
    position: isMobile ? 'top' : 'bottom-start',
    timer: TOAST_MS,
    timerProgressBar: true,
    showCloseButton: true,
    showConfirmButton: true,
    confirmButtonText: '<i class="bi bi-play-circle-fill me-1"></i> Ver transmisión',
    buttonsStyling: false,
    html: `
      <div class="abt-swal-live-kicker"><span class="abt-swal-live-dot"></span> EN VIVO AHORA</div>
      <div class="abt-swal-live-title">${escapeHtml(event.title)}</div>
      ${event.venue_name ? `<div class="abt-swal-live-venue"><i class="bi bi-geo-alt-fill"></i> ${escapeHtml(event.venue_name)}</div>` : ''}
    `,
    customClass: {
      popup: 'abt-swal-live',
      confirmButton: 'abt-swal-live-btn',
      closeButton: 'abt-swal-live-close',
      timerProgressBar: 'abt-swal-live-progress',
    },
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    },
  }).then((result) => {
    if (result.isConfirmed) scrollToLiveSection()
  })
}

// The live event loads asynchronously, so wait for it instead of checking once.
watch(
  liveEvent,
  (event) => {
    if (event && !alreadyShown(event.id)) showToast(event)
  },
  { immediate: true },
)

onUnmounted(() => {
  if (Swal.isVisible() && document.querySelector('.abt-swal-live')) Swal.close()
})
</script>

<style>
/* Global (not scoped): SweetAlert2 renders the toast directly in <body>. */
.swal2-popup.abt-swal-live {
  width: 320px;
  padding: 0.9rem 1rem;
  background: rgba(18, 14, 27, 0.96);
  border: 1px solid rgba(255, 45, 85, 0.5);
  border-radius: 1rem;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 45, 85, 0.25);
  color: #f2effa;
}

.abt-swal-live .swal2-html-container {
  margin: 0;
  padding: 0;
  text-align: left;
}

.abt-swal-live-kicker {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.25rem;
  font-family: var(--abt-font-mono, monospace);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 1px;
  color: #ff3b60;
}

.abt-swal-live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff2d55;
  box-shadow: 0 0 8px #ff2d55;
  animation: abt-swal-live-pulse 1.2s infinite;
}

@keyframes abt-swal-live-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.5; }
}

.abt-swal-live-title {
  font-size: 0.92rem;
  font-weight: 700;
  color: #ffffff;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.abt-swal-live-venue {
  margin-top: 0.15rem;
  font-size: 0.76rem;
  color: rgba(242, 239, 250, 0.75);
}

.abt-swal-live-venue .bi {
  color: #f0a838;
}

.abt-swal-live .swal2-actions {
  justify-content: flex-start;
  margin: 0.6rem 0 0;
  padding: 0;
}

.abt-swal-live-btn {
  background: linear-gradient(135deg, #ff2d55, #b06bff);
  color: #ffffff;
  font-size: 0.78rem;
  font-weight: 700;
  border: none;
  border-radius: 9999px;
  padding: 0.35rem 0.85rem;
  cursor: pointer;
}

.abt-swal-live-btn:hover {
  box-shadow: 0 0 15px rgba(255, 45, 85, 0.5);
}

.abt-swal-live-close {
  color: rgba(255, 255, 255, 0.5);
}

.abt-swal-live-close:hover {
  color: #ffffff;
}

.abt-swal-live-progress {
  background: linear-gradient(90deg, #ff2d55, #b06bff);
}

/* Mobile: compact, under the navbar, without covering the screen. */
@media (max-width: 576px) {
  .swal2-container.swal2-top:has(.abt-swal-live) {
    top: 70px;
  }

  .swal2-popup.abt-swal-live {
    width: calc(100vw - 2rem);
    padding: 0.7rem 0.85rem;
  }

  .abt-swal-live-venue {
    display: none;
  }
}
</style>
