export const base = import.meta.env.BASE_URL
export const localUrl = (path = '') => `${base}${path.replace(/^\//, '')}`
export const site = { ...{"name": "TAN KAI YUAN", "givenName": "TAN", "remainingName": "KAI YUAN", "initial": "T", "email": "tanyuanWA@proton.me", "github": "https://github.com/EdgyPotato", "linkedin": "https://linkedin.com/in/tan-kai-yuan-14b8a4302"}, nationality: "Malaysian" }
export const canonical = (path = '') => `${(import.meta.env.VITE_SITE_URL || 'https://EdgyPotato.github.io').replace(/\/$/, '')}${localUrl(path)}`

// The header is fixed, so an anchor target has to clear it. Programmatic scrolls ignore scroll-padding-top,
// so router navigation and the post-refresh restore below both take their offset from here.
export const anchorClearance = (target?: HTMLElement | null) => {
  const header = document.querySelector('.site-header')
  const index = target?.closest('.project-row') ? document.querySelector('.work-index') : null
  return (header ? header.getBoundingClientRect().height : 108) + 24 + (index?.getBoundingClientRect().height || 0)
}
// ScrollTrigger sends the page to the top while it measures a pinned section, which discards the anchor scroll
// a deep link had already performed. Re-apply it once, and only while the page is still sitting at the top.
export const anchorTarget = (hash: string) => {
  try { return document.getElementById(decodeURIComponent(hash.slice(1))) }
  catch { return null }
}
export const scrollToHash = (hash = location.hash) => {
  if (hash.length < 2 || window.scrollY > 4) return
  const target = anchorTarget(hash)
  if (!target) return
  const top = target.getBoundingClientRect().top + window.scrollY - anchorClearance(target)
  if (top > 4) window.scrollTo({ top, behavior: 'instant' })
}
