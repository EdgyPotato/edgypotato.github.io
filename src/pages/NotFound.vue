<script setup lang="ts">
import { useHead } from "@unhead/vue";
import { localUrl, site } from "../site";
useHead({
  title: `Page not found | ${site.name}`,
  meta: [
    {
      name: "description",
      content: "This page does not exist. Return to the selected projects.",
    },
    { name: "robots", content: "noindex,follow" },
  ],
});
</script>
<template>
  <main id="main" class="not-found shell" tabindex="-1">
    <span id="top" class="mono">Error 404</span>
    <h1>Page not found<span class="accent">.</span></h1>
    <p>
      The requested page does not exist or has been moved. <br>
      Explore the selected projects from the homepage.
    </p>
    <a class="button" :href="localUrl()">Return home</a>
  </main>
</template>
