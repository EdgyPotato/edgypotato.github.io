<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { SCROLL_SMOOTHING, loadMotion } from '../motion'
import { createHardware, projectPoint } from '../graphics/hardware'
import { createHardwareRenderer } from '../graphics/hardwareRenderer'
import { createSoftwareHardwareRenderer } from '../graphics/softwareHardwareRenderer'

const canvas = ref<HTMLCanvasElement>()
const ready = ref(false)
const software = ref(false)
const softwareCanvas = ref<HTMLCanvasElement>()
const faces = createHardware()
const state = { progress: 0 }
let media: gsap.MatchMedia | undefined
let alive = true
let observer: ResizeObserver | undefined
let draw = () => {}
let disposeRenderer = () => {}
let removeContextListener = () => {}
// The hero reserves its own scroll distance in CSS so the space exists before hydration. Read it back rather
// than recomputing it, so the pinned range and the reserved space can never disagree.
function heroScrollDistance() {
  const reserved = document.querySelector('.hero-sequence')
  const padding = reserved ? parseFloat(getComputedStyle(reserved).paddingBottom) : 0
  return padding || Math.max(1600, window.innerHeight * 2.0)
}
const staticPath = faces.map(face => face.points.map((p, i) => {
  const [x, y] = projectPoint(p)
  return `${i ? 'L' : 'M'}${(320 + x * 80).toFixed(1)},${(320 - y * 80).toFixed(1)}`
}).join('') + 'Z').join('')

onMounted(() => loadMotion().then(motion => {
  if (!motion) return
  const { gsap, ScrollTrigger } = motion
  const element = canvas.value
  if (!element || !alive) return
  let renderer = createHardwareRenderer(element, faces)
  const useSoftware = () => {
    if (!softwareCanvas.value || software.value) return
    renderer?.dispose()
    renderer = createSoftwareHardwareRenderer(softwareCanvas.value, faces)
    software.value = true
  }
  if (!renderer) useSoftware()
  if (!renderer) return
  disposeRenderer = () => renderer?.dispose()
  let width = 0
  let height = 0
  let ratio = 1
  draw = () => {
    if (!width || !height) return
    const progress = state.progress < .0001 ? 0 : state.progress > .9999 ? 1 : state.progress
    renderer?.draw(progress, width, height)
    const active = software.value ? softwareCanvas.value : element
    if (active) active.dataset.progress = progress.toFixed(3)
  }
  const resize = () => {
    const bounds = element.parentElement!.getBoundingClientRect()
    width = bounds.width
    height = bounds.height
    // Never render below the display grid, and supersample twice over on standard density screens.
    const density = Math.min(Math.max(2, (window.devicePixelRatio || 1)), 3)
    ratio = software.value ? Math.min(1, 560 / width) : Math.max(1, Math.min(density, Math.sqrt(6_000_000 / Math.max(1, width * height))))
    const active = software.value ? softwareCanvas.value : element
    if (!active) return
    active.width = Math.round(width * ratio)
    active.height = Math.round(height * ratio)
    draw()
  }
  const contextLost = (event: Event) => {
    event.preventDefault()
    useSoftware()
    resize()
  }
  element.addEventListener('webglcontextlost', contextLost)
  // Zoom and monitor changes alter device pixels without altering the CSS box, so ResizeObserver never fires.
  let densityQuery: MediaQueryList | undefined
  const densityChanged = () => { resize(); watchDensity() }
  const watchDensity = () => {
    densityQuery?.removeEventListener('change', densityChanged)
    densityQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`)
    densityQuery.addEventListener('change', densityChanged)
  }
  watchDensity()
  removeContextListener = () => {
    element.removeEventListener('webglcontextlost', contextLost)
    densityQuery?.removeEventListener('change', densityChanged)
  }
  observer = new ResizeObserver(resize)
  observer.observe(element.parentElement!)
  resize()
  ready.value = true
  media = gsap.matchMedia()
  media.add('(prefers-reduced-motion: no-preference)', () => {
    const sequence = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero-scene',
        start: () => `top ${document.querySelector('.site-header')?.getBoundingClientRect().height || 0}px`,
        end: () => `+=${heroScrollDistance()}`,
        pin: true, pinSpacing: false, scrub: SCROLL_SMOOTHING, invalidateOnRefresh: true,
      },
    })
    sequence.fromTo(state, { progress: 0 }, { progress: 1, duration: .82, ease: 'none', onUpdate: draw })
      .to(state, { progress: 1, duration: .18, ease: 'none' })
  })
  media.add('(prefers-reduced-motion: reduce)', () => {
    state.progress = 1
    draw()
  })
}))

onUnmounted(() => {
  alive = false
  media?.revert()
  observer?.disconnect()
  removeContextListener()
  disposeRenderer()
  draw = () => {}
})
</script>

<template>
  <div class="model-background" aria-hidden="true">
    <svg v-if="!ready" class="model-fallback" viewBox="0 0 640 640" fill="none"><path :d="staticPath" stroke="#7AA2FF" stroke-width=".65" opacity=".35" /></svg>
    <canvas v-show="!software" ref="canvas" :class="{ 'model-canvas': !software }"></canvas>
    <canvas v-show="software" ref="softwareCanvas" :class="{ 'model-canvas': software }"></canvas>
  </div>
</template>
