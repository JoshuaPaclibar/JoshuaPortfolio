import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

// Development proxy: in `npm run dev` the browser calls "/api/..." on the Vite server (port 5173)
// and Vite forwards it to the backend. The backend port is read from backend/.env (PORT), so
// you only ever change the port in ONE place. In a production build, VITE_API_URL is used instead.
export default defineConfig(({ mode }) => {
  const backendEnv = loadEnv(mode, fileURLToPath(new URL('../backend', import.meta.url)), '');
  const backendPort = backendEnv.PORT || 5050;

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: `http://127.0.0.1:${backendPort}`,
          changeOrigin: true,
        },
      },
    },
  };
});
