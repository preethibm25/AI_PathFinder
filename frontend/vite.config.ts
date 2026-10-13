import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Enable SSL if --https flag is passed or USE_HTTPS=true
    process.env.USE_HTTPS === 'true' ? basicSsl() : null
  ].filter(Boolean),
  server: {
    port: 5173,
    host: true
  }
})
