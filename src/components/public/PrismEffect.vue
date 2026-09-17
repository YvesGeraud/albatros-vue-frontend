<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { Renderer, Triangle, Program, Mesh } from 'ogl'

const props = defineProps({
  height: { type: Number, default: 3.5 },
  baseWidth: { type: Number, default: 5.5 },
  glow: { type: Number, default: 1 },
  noise: { type: Number, default: 0.5 },
  scale: { type: Number, default: 3.6 },
  timeScale: { type: Number, default: 0.5 },
})

const containerRef = ref(null)
let renderer = null
let animationId = null

const initPrism = () => {
  if (!containerRef.value) return

  const dpr = Math.min(2, window.devicePixelRatio || 1)
  renderer = new Renderer({
    dpr,
    alpha: true,
    antialias: false,
  })

  const gl = renderer.gl
  gl.disable(gl.DEPTH_TEST)
  gl.disable(gl.CULL_FACE)
  gl.disable(gl.BLEND)

  gl.canvas.style.position = 'absolute'
  gl.canvas.style.inset = '0'
  gl.canvas.style.width = '100%'
  gl.canvas.style.height = '100%'
  gl.canvas.style.pointerEvents = 'none'

  containerRef.value.appendChild(gl.canvas)

  const vertex = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `

  const fragment = `
    precision highp float;
    uniform vec2 iResolution;
    uniform float iTime;
    uniform float uHeight;
    uniform float uBaseHalf;
    uniform float uGlow;
    uniform float uNoise;
    uniform float uScale;
    uniform float uTimeScale;

    vec4 tanh4(vec4 x){
      vec4 e2x = exp(2.0*x);
      return (e2x - 1.0) / (e2x + 1.0);
    }

    float rand(vec2 co){
      return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    float sdOctaAnisoInv(vec3 p){
      vec3 q = vec3(abs(p.x) / uBaseHalf, abs(p.y) / uHeight, abs(p.z) / uBaseHalf);
      float m = q.x + q.y + q.z - 1.0;
      return m * 0.5773502691896258;
    }

    float sdPyramidUpInv(vec3 p){
      float oct = sdOctaAnisoInv(p);
      return max(oct, -p.y);
    }

    void main(){
      vec2 f = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y) * uScale;
      float z = 5.0;
      float d = 0.0;
      vec3 p;
      vec4 o = vec4(0.0);

      float t = iTime * uTimeScale;
      float c0 = cos(t);
      float s0 = sin(t);
      mat2 wob = mat2(c0, -s0, s0, c0);

      for (int i = 0; i < 60; i++) {
        p = vec3(f, z);
        p.xz = p.xz * wob;
        d = 0.1 + 0.2 * abs(sdPyramidUpInv(p));
        z -= d;
        o += (sin((p.y + z) * 1.5 + vec4(0.0, 1.0, 2.0, 3.0)) + 1.0) / d;
      }

      o = tanh4(o * o * (uGlow * 1.0) / 1e5);
      vec3 col = o.rgb;
      float n = rand(gl_FragCoord.xy + vec2(iTime));
      col += (n - 0.5) * uNoise * 0.2;
      col = clamp(col, 0.0, 1.0);

      gl_FragColor = vec4(col, max(col.r, max(col.g, col.b)) * 0.85);
    }
  `

  const uniforms = {
    iTime: { value: 0 },
    iResolution: { value: [1, 1] },
    uHeight: { value: props.height },
    uBaseHalf: { value: props.baseWidth * 0.5 },
    uGlow: { value: props.glow },
    uNoise: { value: props.noise },
    uScale: { value: props.scale },
    uTimeScale: { value: props.timeScale },
  }

  const geometry = new Triangle(gl)
  const program = new Program(gl, { vertex, fragment, uniforms })
  const mesh = new Mesh(gl, { geometry, program })

  const resize = () => {
    if (!containerRef.value || !renderer) return
    const w = containerRef.value.clientWidth
    const h = containerRef.value.clientHeight
    renderer.setSize(w, h)
    uniforms.iResolution.value = [w * renderer.dpr, h * renderer.dpr]
  }

  const loop = (t) => {
    uniforms.iTime.value = t * 0.001
    try {
      renderer.render({ scene: mesh })
      animationId = requestAnimationFrame(loop)
    } catch {
      // stop render loop on context error
    }
  }

  window.addEventListener('resize', resize)
  resize()
  animationId = requestAnimationFrame(loop)
}

onMounted(() => {
  initPrism()
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (renderer?.gl?.canvas?.parentNode) {
    renderer.gl.canvas.parentNode.removeChild(renderer.gl.canvas)
  }
})
</script>

<template>
  <div ref="containerRef" class="abt-prism-effect" aria-hidden="true" />
</template>

<style scoped>
.abt-prism-effect {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}
</style>
