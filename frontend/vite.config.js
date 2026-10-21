import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Development proxy: when VITE_API_URL is NOT set, the frontend calls "/api/..." on the Vite
// server (port 5173) and Vite forwards it to the backend. This avoids CORS during development.
// When VITE_API_URL IS set (for example in production), the browser calls that URL directly
// and the proxy below is not used.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
