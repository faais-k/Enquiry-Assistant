import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const n8nBaseUrl = env.VITE_N8N_BASE_URL
  if (!n8nBaseUrl) {
    throw new Error(
      'Missing VITE_N8N_BASE_URL in .env — copy .env.example to .env and set your n8n instance URL.'
    )
  }

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: n8nBaseUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
