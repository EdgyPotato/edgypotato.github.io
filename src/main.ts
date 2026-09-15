import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import Home from './pages/Home.vue'
import ProjectPage from './pages/ProjectPage.vue'
import NotFound from './pages/NotFound.vue'
import { featured } from './content'
import { anchorClearance, anchorTarget } from './site'
import './style.css'
export const createApp = ViteSSG(App, {
 base: import.meta.env.BASE_URL,
 routes: [ { path: '/', component: Home }, ...featured.map(project => ({ path: `/projects/${project.slug}/`, component: ProjectPage, props: { project } })), { path: '/404', component: NotFound }, { path: '/:pathMatch(.*)*', component: NotFound } ],
 scrollBehavior(to, _from, saved) {
  if (saved) return saved
  if (!to.hash) return { top: 0 }
  return anchorPosition(to.hash)
 }
})

// The header is fixed and a programmatic scroll does not honour scroll-padding-top, so the clearance is applied
// here instead. On a fresh navigation the target is not in the document yet, so wait for it rather than silently
// staying at the top of the page.
function anchorPosition(hash: string, frames = 30): Promise<{ el: HTMLElement; top: number } | { top: number }> {
 return new Promise(resolve => {
  const look = (left: number) => {
   if (typeof document === 'undefined') return resolve({ top: 0 })
   const target = anchorTarget(hash)
   if (target) return resolve({ el: target, top: anchorClearance(target) })
   if (left <= 0) return resolve({ top: 0 })
   requestAnimationFrame(() => look(left - 1))
  }
  look(frames)
 })
}
