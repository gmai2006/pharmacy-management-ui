import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
        proxy: {
          // Proxy requests starting with '/api'
          '/pharmacy/api/': {
            target: 'http://localhost:8080', // The target backend server
            changeOrigin: true, // Needed for virtual hosted sites
            secure: false, // Set to true if your target uses HTTPS and you want to enforce certificate validation
            // rewrite: (path) => path.replace(/^\/api/, ''), // Optional: remove the '/api' prefix before sending to target
          },
          '/ws/messages': {
            target: 'ws://localhost:8080/', // The target backend server
            changeOrigin: true, // Needed for virtual hosted sites
            secure: false, // Set to true if your target uses HTTPS and you want to enforce certificate validation
            // rewrite: (path) => path.replace(/^\/api/, ''), // Optional: remove the '/api' prefix before sending to target
          },
          '/ws/echo': {
            target: 'ws://localhost:8080/', // The target backend server
            changeOrigin: true, // Needed for virtual hosted sites
            secure: false, // Set to true if your target uses HTTPS and you want to enforce certificate validation
            // rewrite: (path) => path.replace(/^\/api/, ''), // Optional: remove the '/api' prefix before sending to target
          },
        },
      },
})