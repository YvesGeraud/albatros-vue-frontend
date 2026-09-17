<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  items: {
    type: Array,
    default: () => [
      { label: 'Inicio', to: { name: 'home' } },
      { label: 'Eventos', to: { name: 'events' } },
      { label: 'Catálogo', to: { name: 'catalog' } },
      { label: 'Nosotros', href: '#nosotros' },
      { label: 'Cotizar', to: { name: 'quote-builder' } },
    ],
  },
  animationTime: {
    type: Number,
    default: 600,
  },
  particleCount: {
    type: Number,
    default: 15,
  },
  particleDistances: {
    type: Array,
    default: () => [90, 10],
  },
  particleR: {
    type: Number,
    default: 100,
  },
  timeVariance: {
    type: Number,
    default: 300,
  },
  colors: {
    type: Array,
    default: () => [1, 2, 3, 1, 2, 3, 1, 4],
  },
  initialActiveIndex: {
    type: Number,
    default: 0,
  },
})

const route = useRoute()
const router = useRouter()

const containerRef = ref(null)
const navRef = ref(null)
const filterRef = ref(null)
const textRef = ref(null)
const activeIndex = ref(props.initialActiveIndex)

const noise = (n = 1) => n / 2 - Math.random() * n

const getXY = (distance, pointIndex, totalPoints) => {
  const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180)
  return [distance * Math.cos(angle), distance * Math.sin(angle)]
}

const createParticle = (i, t, d, r) => {
  const rotate = noise(r / 10)
  return {
    start: getXY(d[0], props.particleCount - i, props.particleCount),
    end: getXY(d[1] + noise(7), props.particleCount - i, props.particleCount),
    time: t,
    scale: 1 + noise(0.2),
    color: props.colors[Math.floor(Math.random() * props.colors.length)],
    rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10,
  }
}

const makeParticles = (element) => {
  if (!element) return
  const d = props.particleDistances
  const r = props.particleR
  const bubbleTime = props.animationTime * 2 + props.timeVariance
  element.style.setProperty('--time', `${bubbleTime}ms`)

  for (let i = 0; i < props.particleCount; i++) {
    const t = props.animationTime * 2 + noise(props.timeVariance * 2)
    const p = createParticle(i, t, d, r)
    element.classList.remove('active')

    setTimeout(() => {
      const particle = document.createElement('span')
      const point = document.createElement('span')
      particle.classList.add('particle')
      particle.style.setProperty('--start-x', `${p.start[0]}px`)
      particle.style.setProperty('--start-y', `${p.start[1]}px`)
      particle.style.setProperty('--end-x', `${p.end[0]}px`)
      particle.style.setProperty('--end-y', `${p.end[1]}px`)
      particle.style.setProperty('--time', `${p.time}ms`)
      particle.style.setProperty('--scale', `${p.scale}`)
      particle.style.setProperty('--color', `var(--gooey-color-${p.color}, white)`)
      particle.style.setProperty('--rotate', `${p.rotate}deg`)
      point.classList.add('point')
      particle.appendChild(point)
      element.appendChild(particle)

      requestAnimationFrame(() => {
        element.classList.add('active')
      })

      setTimeout(() => {
        try {
          if (element.contains(particle)) {
            element.removeChild(particle)
          }
        } catch {
          // cleanup safe
        }
      }, t)
    }, 30)
  }
}

const updateEffectPosition = (element) => {
  if (!containerRef.value || !filterRef.value || !textRef.value || !element) return
  const containerRect = containerRef.value.getBoundingClientRect()
  const pos = element.getBoundingClientRect()

  const styles = {
    left: `${pos.x - containerRect.x}px`,
    top: `${pos.y - containerRect.y}px`,
    width: `${pos.width}px`,
    height: `${pos.height}px`,
  }

  Object.assign(filterRef.value.style, styles)
  Object.assign(textRef.value.style, styles)
  textRef.value.innerText = element.innerText.trim()
}

const handleItemClick = (e, index, item) => {
  if (item.href?.startsWith('#')) {
    e.preventDefault()
    if (route.name !== 'home') {
      router.push({ name: 'home', hash: item.href })
    } else {
      const target = document.querySelector(item.href)
      if (target) {
        const navbarHeight = 80
        const elementPosition = target.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth',
        })
      }
    }
  } else if (item.to) {
    e.preventDefault()
    router.push(item.to)
  }

  if (activeIndex.value === index) return

  activeIndex.value = index
  const liEl = navRef.value?.querySelectorAll('li')[index]
  if (liEl) {
    updateEffectPosition(liEl)
  }

  if (filterRef.value) {
    const particles = filterRef.value.querySelectorAll('.particle')
    particles.forEach((p) => {
      if (filterRef.value.contains(p)) {
        filterRef.value.removeChild(p)
      }
    })
  }

  if (textRef.value) {
    textRef.value.classList.remove('active')
    void textRef.value.offsetWidth
    textRef.value.classList.add('active')
  }

  if (filterRef.value) {
    makeParticles(filterRef.value)
  }
}

const syncActiveWithRoute = () => {
  const currentPath = route.path
  const currentName = route.name

  const foundIndex = props.items.findIndex((item) => {
    if (item.to && typeof item.to === 'object') {
      return item.to.name === currentName
    }
    if (item.href && !item.href.startsWith('#')) {
      return currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href))
    }
    return false
  })

  if (foundIndex !== -1 && foundIndex !== activeIndex.value) {
    activeIndex.value = foundIndex
    nextTick(() => {
      const liEl = navRef.value?.querySelectorAll('li')[foundIndex]
      if (liEl) {
        updateEffectPosition(liEl)
        if (filterRef.value) {
          makeParticles(filterRef.value)
        }
      }
    })
  }
}

let resizeObserver = null
let scrollSpyObserver = null

const setupScrollSpy = () => {
  if (typeof window === 'undefined') return

  const sectionIds = props.items
    .map((item) => item.href)
    .filter((h) => h && h.startsWith('#'))
    .map((h) => h.substring(1))

  const sectionElements = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean)

  if (!sectionElements.length) return

  scrollSpyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id
          const idx = props.items.findIndex((item) => item.href === `#${id}`)
          if (idx !== -1 && idx !== activeIndex.value) {
            activeIndex.value = idx
            const liEl = navRef.value?.querySelectorAll('li')[idx]
            if (liEl) {
              updateEffectPosition(liEl)
            }
          }
        }
      })
    },
    { threshold: 0.2, rootMargin: '-70px 0px -40% 0px' }
  )

  sectionElements.forEach((el) => scrollSpyObserver.observe(el))
}

onMounted(() => {
  nextTick(() => {
    syncActiveWithRoute()
    const activeLi = navRef.value?.querySelectorAll('li')[activeIndex.value]
    if (activeLi) {
      updateEffectPosition(activeLi)
      textRef.value?.classList.add('active')
    }

    if (containerRef.value) {
      resizeObserver = new ResizeObserver(() => {
        const currentActiveLi = navRef.value?.querySelectorAll('li')[activeIndex.value]
        if (currentActiveLi) {
          updateEffectPosition(currentActiveLi)
        }
      })
      resizeObserver.observe(containerRef.value)
    }

    setupScrollSpy()
  })
})

watch(
  () => route.path,
  () => {
    syncActiveWithRoute()
    nextTick(() => {
      setupScrollSpy()
    })
  }
)

onUnmounted(() => {
  resizeObserver?.disconnect()
  scrollSpyObserver?.disconnect()
})
</script>

<template>
  <div ref="containerRef" class="gooey-nav-wrapper">
    <!-- SVG Gooey Filter (Transparent, without black background or blend-mode bugs) -->
    <svg class="gooey-svg-filter" aria-hidden="true">
      <defs>
        <filter id="gooey-nav-filter" x="-100%" y="-100%" width="300%" height="300%" color-interpolation-filters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>

    <nav class="gooey-nav" style="transform: translate3d(0, 0, 0.01px);">
      <ul ref="navRef" class="gooey-nav-list">
        <li
          v-for="(item, index) in items"
          :key="item.label"
          class="gooey-nav-item"
          :class="{ active: activeIndex === index }"
        >
          <a
            :href="item.href || '#'"
            class="gooey-nav-link"
            @click="handleItemClick($event, index, item)"
          >
            {{ item.label }}
          </a>
        </li>
      </ul>
    </nav>
    <span ref="filterRef" class="gooey-effect gooey-filter" />
    <span ref="textRef" class="gooey-effect gooey-text" />
  </div>
</template>

<style scoped>
.gooey-nav-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  isolation: isolate;
  --gooey-color-1: #ffffff;
  --gooey-color-2: #b06bff;
  --gooey-color-3: #22d3ee;
  --gooey-color-4: #f0a838;
}

.gooey-nav {
  display: flex;
  position: relative;
}

.gooey-nav-list {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;
  z-index: 3;
}

.gooey-nav-item {
  position: relative;
  border-radius: 9999px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
  user-select: none;
}

.gooey-nav-link {
  outline: none;
  padding: 0.4rem 0.85rem;
  display: inline-block;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
  font-size: 0.88rem;
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.25s ease;
}

.gooey-nav-item:hover .gooey-nav-link {
  color: #ffffff;
}

.gooey-nav-item.active .gooey-nav-link {
  color: #0a0912;
  font-weight: 600;
}

.gooey-nav-item::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: white;
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s ease;
  z-index: -1;
}

.gooey-nav-item.active::after {
  opacity: 1;
  transform: scale(1);
}

/* Gooey Effects */
.gooey-effect {
  position: absolute;
  opacity: 1;
  pointer-events: none;
  display: grid;
  place-items: center;
  z-index: 1;
  transition: left 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
              top 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
              width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
              height 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.gooey-effect.gooey-text {
  color: #ffffff;
  transition: color 0.3s ease;
  font-weight: 600;
  font-size: 0.95rem;
  z-index: 4;
}

.gooey-effect.gooey-text.active {
  color: #0a0912;
}

.gooey-svg-filter {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
  overflow: hidden;
}

.gooey-effect.gooey-filter {
  filter: url(#gooey-nav-filter);
  background: transparent;
}

.gooey-effect.gooey-filter::after {
  content: "";
  position: absolute;
  inset: 0;
  background: #ffffff;
  transform: scale(0);
  opacity: 0;
  z-index: -1;
  border-radius: 9999px;
  box-shadow: 0 0 16px rgba(255, 255, 255, 0.45);
}

.gooey-effect.active::after {
  animation: gooey-pill 0.3s ease both;
}

@keyframes gooey-pill {
  to {
    transform: scale(1);
    opacity: 1;
  }
}

:deep(.particle),
:deep(.point) {
  display: block;
  opacity: 0;
  width: 20px;
  height: 20px;
  border-radius: 9999px;
  transform-origin: center;
}

:deep(.particle) {
  --time: 5s;
  position: absolute;
  top: calc(50% - 8px);
  left: calc(50% - 8px);
  animation: gooey-particle calc(var(--time)) ease 1 -350ms;
}

:deep(.point) {
  background: var(--color);
  opacity: 1;
  animation: gooey-point calc(var(--time)) ease 1 -350ms;
}

@keyframes gooey-particle {
  0% {
    transform: rotate(0deg) translate(calc(var(--start-x)), calc(var(--start-y)));
    opacity: 1;
    animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
  }
  70% {
    transform: rotate(calc(var(--rotate) * 0.5)) translate(calc(var(--end-x) * 1.2), calc(var(--end-y) * 1.2));
    opacity: 1;
    animation-timing-function: ease;
  }
  85% {
    transform: rotate(calc(var(--rotate) * 0.66)) translate(calc(var(--end-x)), calc(var(--end-y)));
    opacity: 1;
  }
  100% {
    transform: rotate(calc(var(--rotate) * 1.2)) translate(calc(var(--end-x) * 0.5), calc(var(--end-y) * 0.5));
    opacity: 1;
  }
}

@keyframes gooey-point {
  0% {
    transform: scale(0);
    opacity: 0;
    animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
  }
  25% {
    transform: scale(calc(var(--scale) * 0.25));
  }
  38% {
    opacity: 1;
  }
  65% {
    transform: scale(var(--scale));
    opacity: 1;
    animation-timing-function: ease;
  }
  85% {
    transform: scale(var(--scale));
    opacity: 1;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
}

/* Responsive */
@media (max-width: 991px) {
  .gooey-nav-list {
    gap: 0.15rem;
  }
  .gooey-nav-link {
    font-size: 0.85rem;
    padding: 0.35rem 0.65rem;
  }
}
</style>
