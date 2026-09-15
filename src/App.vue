<script setup lang="ts">
import { site, localUrl } from './site'
</script>

<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header shell">
    <a class="wordmark" :href="localUrl()" :aria-label="`${site.name} home`">
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true"><path d="M11 4H4v26h7M23 4h7v26h-7" stroke="currentColor" stroke-width="2"/><text x="17" y="22" text-anchor="middle" fill="currentColor" font-size="16">{{ site.initial }}</text></svg>
      <span>{{ site.name }}<span class="brand-period">.</span></span>
    </a>
    <nav aria-label="Main navigation">
      <a :href="localUrl('#work')">Work <span class="nav-count">03</span></a>
      <a :href="localUrl('#experience')">Experience</a>
      <a :href="localUrl('#contact')" class="nav-contact">Contact <span aria-hidden="true">↗</span></a>
    </nav>
  </header>
  <RouterView v-slot="{ Component, route }"><component :is="Component" :key="route.path" /></RouterView>
  <footer class="site-footer shell">
    <span>{{ site.name }} / Personal portfolio</span>
    <div><a :href="site.github">GitHub</a><a :href="site.linkedin">LinkedIn</a><a href="#top">Back to top <span aria-hidden="true">↑</span></a></div>
  </footer>
</template>
