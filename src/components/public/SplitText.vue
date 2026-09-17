<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { animate, stagger } from 'animejs'

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    default: 'p',
  },
  splitBy: {
    type: String,
    default: 'chars', // 'chars' | 'words'
    validator: (v) => ['chars', 'words'].includes(v),
  },
  animation: {
    type: String,
    default: 'fade-up', // 'fade-up' | 'fade-down' | 'blur-in' | 'zoom-in' | 'rotate-up'
    validator: (v) => ['fade-up', 'fade-down', 'blur-in', 'zoom-in', 'rotate-up'].includes(v),
  },
  delay: {
    type: Number,
    default: 100,
  },
  staggerDelay: {
    type: Number,
    default: 35,
  },
  duration: {
    type: Number,
    default: 600,
  },
  easing: {
    type: String,
    default: 'easeOutCubic',
  },
  threshold: {
    type: Number,
    default: 0.2,
  },
  triggerOnScroll: {
    type: Boolean,
    default: true,
  },
  once: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['animationComplete'])

const containerRef = ref(null)
let observer = null

const words = computed(() => {
  if (!props.text) return []
  return props.text.split(' ').map((word, wordIndex) => ({
    id: `w-${wordIndex}`,
    word,
    chars: word.split('').map((char, charIndex) => ({
      id: `c-${wordIndex}-${charIndex}`,
      char,
    })),
  }))
})

const animationConfigs = {
  'fade-up': {
    to: { opacity: [0, 1], translateY: [35, 0] },
  },
  'fade-down': {
    to: { opacity: [0, 1], translateY: [-35, 0] },
  },
  'blur-in': {
    to: { opacity: [0, 1], filter: ['blur(10px)', 'blur(0px)'], translateY: [20, 0] },
  },
  'zoom-in': {
    to: { opacity: [0, 1], scale: [0.3, 1], translateY: [20, 0] },
  },
  'rotate-up': {
    to: { opacity: [0, 1], translateY: [40, 0], rotateX: [90, 0] },
  },
}

const runAnimation = () => {
  if (!containerRef.value) return
  const targets = containerRef.value.querySelectorAll('.split-item')
  if (!targets.length) return

  const config = animationConfigs[props.animation] || animationConfigs['fade-up']

  animate(targets, {
    ...config.to,
    delay: stagger(props.staggerDelay, { start: props.delay }),
    duration: props.duration,
    easing: props.easing,
    onComplete: () => {
      emit('animationComplete')
    },
  })
}

onMounted(() => {
  if (!containerRef.value) return

  if (!props.triggerOnScroll) {
    runAnimation()
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runAnimation()
          if (props.once) {
            observer.unobserve(entry.target)
          }
        }
      })
    },
    { threshold: props.threshold }
  )

  observer.observe(containerRef.value)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <component :is="tag" ref="containerRef" class="abt-split-text" :class="`anim-${animation}`">
    <template v-if="splitBy === 'chars'">
      <span
        v-for="(wordObj, wIdx) in words"
        :key="wordObj.id"
        class="split-word"
      >
        <span
          v-for="charObj in wordObj.chars"
          :key="charObj.id"
          class="split-item split-char"
        >
          {{ charObj.char }}
        </span>
        <span v-if="wIdx < words.length - 1" class="split-space">&nbsp;</span>
      </span>
    </template>
    <template v-else>
      <span
        v-for="(wordObj, wIdx) in words"
        :key="wordObj.id"
        class="split-item split-word-item"
      >
        {{ wordObj.word }}
        <span v-if="wIdx < words.length - 1" class="split-space">&nbsp;</span>
      </span>
    </template>
  </component>
</template>

<style scoped>
.abt-split-text {
  display: inline-block;
  perspective: 1000px;
}

.split-word {
  display: inline-block;
  white-space: nowrap;
}

.split-item {
  display: inline-block;
  will-change: transform, opacity, filter;
  opacity: 0;
}

.anim-fade-up .split-item {
  transform: translateY(35px);
}

.anim-fade-down .split-item {
  transform: translateY(-35px);
}

.anim-blur-in .split-item {
  filter: blur(10px);
  transform: translateY(20px);
}

.anim-zoom-in .split-item {
  transform: scale(0.3) translateY(20px);
}

.anim-rotate-up .split-item {
  transform: translateY(40px) rotateX(90deg);
  transform-origin: bottom center;
}

.split-space {
  display: inline-block;
}
</style>
