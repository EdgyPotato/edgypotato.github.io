import { writeFile, copyFile } from 'node:fs/promises'
import { loadEnv } from 'vite'
const env = { ...loadEnv('production', process.cwd(), ''), ...process.env }
const base = env.VITE_BASE_PATH || '/'
const origin = (env.VITE_SITE_URL || 'https://EdgyPotato.github.io').replace(/\/$/, '')
const routes = ['', 'projects/upraxis/', 'projects/bim-translator/', 'projects/food-ordering/']
await copyFile('dist/404/index.html', 'dist/404.html')
await writeFile('dist/.nojekyll', '')
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(route => `<url><loc>${new URL(base + route, origin).href}</loc></url>`).join('')}</urlset>`)
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${origin}${base}sitemap.xml\n`)
console.log('Generated Pages 404, sitemap, robots.txt, and .nojekyll')
