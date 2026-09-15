<script setup lang="ts">
import { ref } from 'vue'
import { useHead } from '@unhead/vue'
import type { Project } from '../content/types'
import { canonical, localUrl, site } from '../site'
import { featured } from '../content'
import ProjectVisual from '../components/ProjectVisual.vue'
import Arrow from '../components/Arrow.vue'
import { useMotion } from '../motion'
const props = defineProps<{ project: Project }>()
const root = ref<HTMLElement>()
useMotion(root)
const next = featured[(featured.findIndex(p => p.slug === props.project.slug) + 1) % featured.length]!
useHead({title: `${props.project.title} | ${site.name}`,meta:[{name:'description',content:props.project.summary},{property:'og:title',content:`${props.project.title} | Project notes`},{property:'og:description',content:props.project.summary},{property:'og:type',content:'article'},{property:'og:url',content:canonical(`projects/${props.project.slug}/`)}],link:[{rel:'canonical',href:canonical(`projects/${props.project.slug}/`)}]})
</script>
<template><main id="main" ref="root" class="case-study shell" tabindex="-1"><header id="top" class="case-header"><a class="text-link" :href="localUrl('#work')">Back to selected work</a><h1 class="hero-enter">{{ project.title }}<span class="accent">.</span></h1><p class="case-summary hero-enter">{{ project.summary }}</p><p class="status">{{ project.status }}</p><ul class="tech-list" aria-label="Technologies"><li v-for="tech in project.technologies" :key="tech">{{ tech }}</li></ul></header><ProjectVisual :project="project" eager /><div class="case-layout"><aside><span class="mono">{{ project.category }}</span><div class="source-links"><a v-for="link in project.links" :key="link.url" class="text-link" :href="link.url">{{ link.label }} <Arrow /></a></div></aside><div class="case-body"><section v-if="project.contribution" class="reveal"><h2>Contribution</h2><p>{{ project.contribution }}</p></section><section v-for="section in project.sections" :key="section.title" class="reveal"><h2>{{ section.title }}</h2><p>{{ section.body }}</p></section><section class="limitations reveal"><h2>Current limitations</h2><p>{{ project.limitations }}</p></section></div></div><a class="next-project" :href="localUrl(`projects/${next.slug}/`)"><span class="mono">Next case study</span><span>{{ next.title }} <Arrow /></span></a></main></template>