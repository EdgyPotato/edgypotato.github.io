<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref } from 'vue'
import type { Project } from '../content/types'
import { localUrl } from '../site'
import Arrow from './Arrow.vue'

const props = defineProps<{ project: Project; eager?: boolean }>()
const selected = ref(0)
const failed = ref<Record<number, boolean>>({})
const viewer = ref<HTMLDialogElement>()
const viewerOpen = ref(false)
const images = computed(() => [
  { src: props.project.visual.image, card: props.project.visual.card, alt: props.project.visual.alt, width: props.project.visual.width, height: props.project.visual.height, label: props.project.slug === 'bim-translator' ? 'Gesture detection' : props.project.slug === 'food-ordering' ? 'Restaurant dashboard' : 'Quest board' },
  ...(props.project.visual.secondaryImage ? [{ src: props.project.visual.secondaryImage, card: props.project.visual.secondaryCard, alt: props.project.visual.secondaryAlt, width: props.project.visual.secondaryWidth, height: props.project.visual.secondaryHeight, label: props.project.slug === 'bim-translator' ? 'Welcome screen' : 'Customer menu' }] : []),
].map(image => ({ ...image, device: (image.height || 0) > (image.width || 0) ? 'phone' : 'browser' })))
const current = computed(() => images.value[selected.value]!)

function choose(index: number) {
  selected.value = index
}
async function openViewer(event: MouseEvent, index = selected.value) {
  selected.value = index
  if (!viewer.value || typeof viewer.value.showModal !== 'function') return
  event.preventDefault()
  viewerOpen.value = true
  await nextTick()
  viewer.value.showModal()
}
onUnmounted(() => viewer.value?.close())
</script>

<template>
  <figure class="project-visual" :class="project.slug">
    <div class="visual-header">
      <span class="visual-title">{{ project.title }} / Interface</span>
      <span class="visual-format">{{ project.slug === 'bim-translator' ? 'Android' : 'Web' }}</span>
    </div>
    <div class="project-stage" :class="{ 'multiple-screens': images.length > 1 }">
      <div class="image-reveal" aria-hidden="true"></div>
      <div v-for="(image, index) in images" :key="image.src" class="screenshot-panel">
        <a v-if="image.src && !failed[index]" class="screen-frame" :href="localUrl(image.src)" :aria-label="image.label" @click="openViewer($event, index)">
          <span class="device-shell" :class="`device-${image.device}`" :style="{ '--screen-ratio': `${image.width || 1} / ${image.height || 1}` }">
            <span v-if="image.device === 'browser'" class="browser-chrome" aria-hidden="true"><span class="browser-dots"><i></i><i></i><i></i></span><span class="browser-address">{{ project.title }}</span></span>
          <img class="project-screenshot" :src="localUrl(image.card || image.src)" :alt="image.alt || `${project.title} interface`" :width="image.width" :height="image.height" :loading="eager ? 'eager' : 'lazy'" decoding="async" fetchpriority="low" @error="failed[index] = true">
          </span>
          <span class="screen-inspect">Inspect screenshot <Arrow /></span>
        </a>
        <div v-else class="screenshot-pending"><p>{{ failed[index] ? 'The screenshot could not load.' : 'Screenshot unavailable.' }}</p><a v-if="project.links?.length" :href="project.links[0]!.url" class="text-link">Inspect the source</a></div>
        <span v-if="images.length > 1" class="screenshot-label">{{ image.label }}</span>
      </div>
    </div>
    <figcaption><span>{{ project.visual.caption }}</span><a v-if="current.src" :href="localUrl(current.src)" class="caption-detail" @click="openViewer">View full size screenshot <Arrow /></a></figcaption>
    <dialog ref="viewer" class="image-viewer" @close="viewerOpen = false" :aria-label="`${project.title} screenshots`" @click="event => { if (event.target === viewer) viewer?.close() }">
      <div class="viewer-header"><h2>{{ project.title }}</h2><button type="button" aria-label="Close screenshot viewer" @click="viewer?.close()"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19" stroke="currentColor" stroke-width="1.5"/></svg></button></div>
      <img v-if="current.src && viewerOpen" :src="localUrl(current.src)" :alt="current.alt" :width="current.width" :height="current.height">
      <div class="viewer-footer"><span>{{ current.label }}</span><a v-if="current.src" class="text-link" :href="localUrl(current.src)" target="_blank" rel="noopener">Open original image <Arrow /></a><div v-if="images.length > 1" class="viewer-controls"><button type="button" @click="choose((selected + images.length - 1) % images.length)">Previous</button><button type="button" @click="choose((selected + 1) % images.length)">Next <Arrow /></button></div></div>
    </dialog>
  </figure>
</template>
