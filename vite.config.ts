import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = env.VITE_BASE_PATH || '/'
  if (!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(base)) throw new Error('VITE_BASE_PATH must start and end with /')
  return { base, plugins: [vue(), tailwindcss()], ssgOptions: { formatting: 'minify', dirStyle: 'nested' } }
})
