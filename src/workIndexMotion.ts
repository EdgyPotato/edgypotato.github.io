import type { gsap as GSAP } from 'gsap'
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger'

export function animateWorkIndex(scope: HTMLElement, gsap: typeof GSAP, ScrollTrigger: typeof ScrollTriggerType) {
  const heading = scope.querySelector<HTMLElement>('.work-heading h2')
  const description = scope.querySelector<HTMLElement>('.work-heading p')
  const index = scope.querySelector<HTMLElement>('.work-index')
  const marker = scope.querySelector<HTMLElement>('.work-index-marker')
  const title = index?.querySelector<HTMLElement>('.work-index-title')
  const nav = index?.querySelector<HTMLElement>('.project-nav')
  if (!heading || !index || !marker || !title || !nav) return

  let x = 0, y = 0, scale = 1, expandedMargin = 0, distance = 160
  const measure = () => {
    const source = heading.getBoundingClientRect()
    const bar = index.getBoundingClientRect()
    const origin = marker.getBoundingClientRect()
    const style = getComputedStyle(index)
    scale = parseFloat(getComputedStyle(heading).fontSize) / parseFloat(getComputedStyle(title).fontSize)
    x = source.left - bar.left - title.offsetLeft
    y = source.top - origin.top - title.offsetTop
    expandedMargin = style.flexDirection === 'row' ? -(title.offsetWidth + parseFloat(style.columnGap)) : 0
    distance = Math.max(160, -y + 48)
  }
  measure()
  gsap.set(heading, { opacity: 0 })
  gsap.set(title, { transformOrigin: 'left top' })
  const timeline = gsap.timeline({ defaults: { duration: 1, ease: 'none' } })
  timeline.fromTo(title, { x: () => x, y: () => y }, { x: 0, y: 0 }, 0)
    .fromTo(title, { scale: () => scale }, { scale: 1, ease: 'power2.out' }, 0)
    .fromTo(nav, { marginLeft: () => expandedMargin }, { marginLeft: 0, ease: 'power2.out' }, 0)
  if (description) timeline.fromTo(description, { opacity: 1 }, { opacity: 0, duration: .25 }, 0)
  ScrollTrigger.create({
    trigger: marker,
    start: () => `top ${(document.querySelector('.site-header')?.getBoundingClientRect().height || 108) + distance}px`,
    end: () => `top ${document.querySelector('.site-header')?.getBoundingClientRect().height || 108}px`,
    animation: timeline,
    scrub: true,
    invalidateOnRefresh: true,
    onRefreshInit: measure,
  })
}
