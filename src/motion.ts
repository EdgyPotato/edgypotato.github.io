import { onMounted, onUnmounted, type Ref } from 'vue'
import { scrollToHash } from './site'
import { animateWorkIndex } from './workIndexMotion'

export const SCROLL_SMOOTHING = .45
const PAGE_SCROLL_SMOOTHING = .6

// GSAP and ScrollTrigger are 118 kB of the bundle and nothing on screen needs them to paint, so they load in
// their own chunk after hydration. Both consumers share this promise, so the plugin registers exactly once.
let loader: Promise<{ gsap: typeof import('gsap')['gsap']; ScrollTrigger: typeof import('gsap/ScrollTrigger')['ScrollTrigger'] } | undefined> | undefined
export function loadMotion() {
  loader ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([core, plugin]) => {
    core.gsap.registerPlugin(plugin.ScrollTrigger)
    return { gsap: core.gsap, ScrollTrigger: plugin.ScrollTrigger }
  }).catch(() => {
    document.documentElement.classList.add('motion-unavailable')
    scrollToHash()
    return undefined
  })
  return loader
}

export function useMotion(root: Ref<HTMLElement | undefined>) {
  let media: gsap.MatchMedia | undefined
  let alive = true

  onMounted(() => loadMotion().then(motion => {
    if (!alive || !motion) return
    const { gsap, ScrollTrigger } = motion
    media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const scope = root.value
      if (!scope) return
      const intro = gsap.timeline({ defaults: { ease: 'power2.out' } })
      const heroLines = scope.querySelectorAll('.hero-line > span')
      const introElements = scope.querySelectorAll('.hero-enter')
      if (heroLines.length) intro.from(heroLines, {
        yPercent: 100, duration: .9, stagger: .1,
      })
      if (introElements.length) intro.from(introElements, {
        opacity: .15, y: 18, duration: .65, stagger: .05,
      }, .15)

      scope.querySelectorAll<HTMLElement>('.project-visual').forEach(visual => {
        const curtain = visual.querySelector('.image-reveal')
        if (!curtain) return
        gsap.fromTo(curtain, { scaleX: 1 }, {
          scaleX: 0, transformOrigin: 'right', ease: 'none',
          scrollTrigger: { trigger: visual, start: 'top 95%', end: 'top 45%', scrub: PAGE_SCROLL_SMOOTHING },
        })
      })

      animateWorkIndex(scope, gsap, ScrollTrigger)

      scope.querySelectorAll<HTMLElement>('.section-heading, .project-dossier, .experience-position, .experience-entry, .capability, .supporting-project, .credentials > div, .contact-heading, .resume-note, .case-body section').forEach(element => {
        gsap.from(element, {
          y: 22, ease: 'none',
          scrollTrigger: { trigger: element, start: 'top 95%', end: 'top 45%', scrub: PAGE_SCROLL_SMOOTHING },
        })
      })

      const line = scope.querySelector('.experience-progress')
      if (line) gsap.fromTo(line, { scaleY: 0 }, {
        scaleY: 1, transformOrigin: 'top', ease: 'none',
        scrollTrigger: { trigger: '.experience-body', start: 'top 75%', end: 'bottom 60%', scrub: PAGE_SCROLL_SMOOTHING },
      })

      const nav = scope.querySelector('.project-nav')
      scope.querySelectorAll<HTMLElement>('.project-row').forEach(row => {
        const link = nav?.querySelector(`a[href="#${row.id}"]`)
        if (link) ScrollTrigger.create({
          trigger: row, start: 'top 55%', end: 'bottom 55%',
          toggleClass: { targets: link, className: 'is-current' },
        })
      })
    }, root.value)
    scrollToHash()
    document.fonts.ready.then(() => {
      if (!alive) return
      ScrollTrigger.refresh()
      scrollToHash()
    })
  }))

  onUnmounted(() => {
    alive = false
    media?.revert()
  })
}
