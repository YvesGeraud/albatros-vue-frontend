<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { animate } from 'animejs'

const props = defineProps({
  animation: {
    type: String,
    default: 'fade-up',
    validator: (v) => ['fade-up', 'fade-left', 'fade-right', 'scale'].includes(v),
  },
  delay: { type: Number, default: 0 },
  duration: { type: Number, default: 800 },
  threshold: { type: Number, default: 0.15 },
})

const el = ref(null)
let observer = null

const animationMap = {
  'fade-up': { className: 'abt-reveal', from: { opacity: 0, translateY: 30 }, to: { opacity: 1, translateY: 0 } },
  'fade-left': { className: 'abt-reveal-left', from: { opacity: 0, translateX: -40 }, to: { opacity: 1, translateX: 0 } },
  'fade-right': { className: 'abt-reveal-right', from: { opacity: 0, translateX: 40 }, to: { opacity: 1, translateX: 0 } },
  'scale': { className: 'abt-reveal-scale', from: { opacity: 0, scale: 0.9 }, to: { opacity: 1, scale: 1 } },
}

onMounted(() => {
  if (!el.value) return

  const config = animationMap[props.animation]
  el.value.classList.add(config.className)

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target, {
            ...config.to,
            delay: props.delay,
            duration: props.duration,
            easing: 'easeOutCubic',
          })
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: props.threshold }
  )
  observer.observe(el.value)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div ref="el">
    <slot />
  </div>
</template>
