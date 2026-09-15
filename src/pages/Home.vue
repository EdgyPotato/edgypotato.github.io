<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useHead } from '@unhead/vue'
import { featured, supporting } from '../content'
import { site, localUrl, canonical } from '../site'
import ProjectVisual from '../components/ProjectVisual.vue'
import GeometricBackground from '../components/GeometricBackground.vue'
import Arrow from '../components/Arrow.vue'
import { useMotion } from '../motion'

const root = ref<HTMLElement>()
const workIndex = ref<HTMLElement>()
let indexObserver: ResizeObserver | undefined
onMounted(() => {
  const index = workIndex.value
  if (!index) return
  indexObserver = new ResizeObserver(() => {
    root.value?.style.setProperty('--work-sticky-height', `${index.getBoundingClientRect().height}px`)
  })
  indexObserver.observe(index)
})
onUnmounted(() => indexObserver?.disconnect())
useMotion(root)
useHead({
  title: `${site.name} | Personal Portfolio`,
  meta: [
    { name: 'description', content: `A personal collection of web, mobile, and applied AI projects by ${site.name}.` },
    { property: 'og:title', content: `${site.name} | Personal Portfolio` },
    { property: 'og:description', content: `Selected web, mobile, and applied AI projects by ${site.name}.` },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: canonical() },
  ],
  link: [{ rel: 'canonical', href: canonical() }],
})
</script>

<template>
  <main id="main" ref="root" class="home-page" tabindex="-1">
    <div class="hero-sequence">
    <div class="hero-scene">
    <section id="top" class="hero shell">
      <div class="hero-copy">
        <h1 :aria-label="site.name"><span class="hero-line"><span>{{ site.givenName }}</span></span><span class="hero-line accent"><span>{{ site.remainingName }}.</span></span></h1>
        <p class="hero-statement">Welcome! 欢迎!<br>Salam Sejahtera!</p>
        <p class="hero-description">I am computer science graduate from Universiti Teknologi Malaysia. I have done a couple projects in web and mobile development, applied AI, and interactive games. Feel free<br>
                                    to take a look!</p>
        <div class="hero-actions hero-enter">
          <a class="button" href="#work">Explore projects <Arrow /></a>
          <a class="text-link" :href="site.resumeUrl" target="_blank" rel="noopener noreferrer" aria-label="Résumé PDF (opens in a new tab)">Résumé <Arrow /></a>
        </div>
      </div>
      <div class="hero-model-space"><GeometricBackground /><div class="model-caption"><span>Hardware assembly</span><span class="model-scroll-cue">Scroll to build</span></div></div>
      <div class="hero-footer hero-enter"><span>Web / Mobile / AI</span><a href="#work">View projects <svg width="18" height="22" viewBox="0 0 18 22" fill="none" aria-hidden="true"><path d="M9 1v18m-6-6 6 6 6-6" stroke="currentColor" stroke-width="1.5"/></svg></a></div>
    </section>

    </div>
    </div>

    <section id="work" class="work shell section-space">
      <div class="work-heading reveal"><h2>Selected work<span class="accent">.</span></h2><p>Project overviews, implementation details, and results.</p></div>
      <div class="work-index-marker" aria-hidden="true"></div>
      <div ref="workIndex" class="work-index">
      <span class="work-index-title" aria-hidden="true">Selected work<span class="accent">.</span></span>
      <nav class="project-nav" aria-label="Selected projects">
        <a v-for="(project, i) in featured" :key="project.slug" :href="`#${project.slug}`"><span>{{ String(i + 1).padStart(2, '0') }}</span>{{ project.title }}<Arrow /></a>
      </nav>
      </div>
      <article v-for="(project, i) in featured" :id="project.slug" :key="project.slug" class="project-row">
        <div class="project-dossier">
          <div class="project-top"><span class="project-index">{{ String(i + 1).padStart(2, '0') }}</span><span class="project-category">{{ project.category }}</span></div>
          <div class="project-copy"><h3><a :href="localUrl(`projects/${project.slug}/`)">{{ project.title }}</a></h3><p>{{ project.summary }}</p></div>
          <p class="status">{{ project.status }}</p>
          <ul class="tech-list" aria-label="Technologies"><li v-for="tech in project.technologies" :key="tech">{{ tech }}</li></ul>
          <a class="project-link button button-outline" :href="localUrl(`projects/${project.slug}/`)">Read case study <Arrow /></a>
        </div>
        <ProjectVisual :project="project" />
      </article>
    </section>

    <section id="experience" class="experience shell section-space">
      <div class="experience-heading"><h2>Experience<span class="accent">.</span></h2><p>Internship work covering automated tests, data syncing, and technical guides.</p></div>
      <div class="experience-body"><span class="experience-progress" aria-hidden="true"></span><div class="experience-position reveal"><p class="mono">September 2024 to February 2025</p><h3>Software Engineer Intern</h3><p class="company">GNey Software · Malaysia</p></div><div class="experience-entry reveal"><h3>Automated testing</h3><p>Converted manual test cases into Selenium tests for Windows and macOS. Monitored Jenkins runs and investigated failures, including a bug affecting production.</p></div><div class="experience-entry reveal"><h3>Data syncing</h3><p>Helped sync data between Inistate and external accounting software according to customer requirements.</p></div><div class="experience-entry reveal"><h3>Technical guides</h3><p>Wrote Inistate guides for clients, staff, and developers, including accounting integration guides. Assigned documentation tasks to fellow interns and reviewed the contributions.</p></div></div>
    </section>

    <section class="capabilities-section shell section-space">
      <div class="section-heading reveal"><h2>Tools and technologies<span class="accent">.</span></h2><p>Tools used across the projects and internship.</p></div>
      <div class="capabilities"><a :href="localUrl('projects/upraxis/')" class="capability reveal"><span class="mono">Systems & data</span><h3>.NET / PostgreSQL<br>React / TypeScript</h3><span class="capability-foot">Explore Upraxis <Arrow /></span></a><a :href="localUrl('projects/bim-translator/')" class="capability reveal"><span class="mono">Mobile & applied AI</span><h3>Flutter / FastAPI<br>YOLO / PyTorch</h3><span class="capability-foot">Explore BIM Translator <Arrow /></span></a><div class="capability reveal"><span class="mono">Testing & delivery</span><h3>Selenium / Jenkins<br>Vitest / Git</h3><span class="capability-foot">Used during the internship and in projects</span></div></div>
    </section>

    <section class="additional shell section-space">
      <div class="section-heading reveal"><h2>Other projects<span class="accent">.</span></h2><p>Experiments in speech recognition, graphics, and games.</p></div>
      <div class="supporting-grid"><article v-for="project in supporting" :key="project.slug" class="supporting-project reveal"><div class="supporting-symbol" aria-hidden="true"><svg v-if="project.slug === 'asr'" width="100%" height="110" viewBox="0 0 440 110" fill="none"><path d="M0 55h40l6-10 7 25 8-43 8 58 8-76 8 92 8-72 8 45 8-29 8 10h35l7-12 7 25 7-37 7 47 7-58 7 68 7-88 7 90 7-58 7 30 7-17 7 13h28l8-17 8 35 8-51 8 63 8-47 8 28 8-11h75" stroke="currentColor" stroke-width="1.5"/></svg><svg v-else-if="project.slug === 'opengl'" width="100%" height="110" viewBox="0 0 440 110" fill="none"><g stroke="currentColor" stroke-width="1.5"><path d="m145 15 120 10 35 70-150-10-5-70 70 40 50-30M150 85l65-30 85 40"/><circle cx="215" cy="55" r="4" fill="currentColor"/></g></svg><svg v-else width="100%" height="110" viewBox="0 0 440 110" fill="none"><g stroke="currentColor" stroke-width="1.5"><rect x="174" y="14" width="32" height="50" rx="16"/><path d="M164 45v6a26 26 0 0 0 52 0v-6M190 77v20m-16 0h32"/><circle cx="253" cy="47" r="23"/><path d="m270 64 27 27"/></g></svg></div><div class="supporting-content"><span class="mono">{{ project.category }} / {{ project.status }}</span><h3>{{ project.title }}</h3><p>{{ project.summary }}</p><p v-if="project.contribution" class="supporting-contribution">{{ project.contribution }}</p><div v-if="project.links?.length" class="supporting-links"><a v-for="link in project.links" :key="link.url" class="text-link" :href="link.url">{{ link.label }} <Arrow /></a></div></div></article></div>
      <div class="credentials"><div class="reveal"><h3>Education</h3><p>Bachelor of Computer Science<br><span class="secondary">Graphics and Multimedia Software · Honours</span></p><p>Universiti Teknologi Malaysia</p><span class="mono">September 2021 to November 2025</span></div><div class="reveal"><h3>Courses and certificates</h3><ul class="credential-list"><li>AWS Academy Cloud Foundations <span>2021</span></li><li>Kaggle Data Visualization <span>2024</span></li><li>Inistate Digital Transformation Champion <span>2025</span></li></ul></div></div>
    </section>

    <section id="contact" class="contact shell section-space"><div class="contact-heading reveal"><h2>Get in touch<span class="accent">.</span></h2><a class="contact-email" :href="`mailto:${site.email}`">{{ site.email }} <Arrow /></a></div><div id="resume" class="resume-note reveal"><h3>Résumé and links</h3><p>Nationality: {{ site.nationality }}</p><p>Languages: English, Mandarin, and Malay.</p><p><a class="text-link" :href="site.resumeUrl" target="_blank" rel="noopener noreferrer" aria-label="View résumé PDF (opens in a new tab)">View résumé PDF <Arrow /></a></p><div class="contact-links"><a :href="site.github">GitHub <Arrow /></a><a :href="site.linkedin">LinkedIn <Arrow /></a></div></div></section>
  </main>
</template>
