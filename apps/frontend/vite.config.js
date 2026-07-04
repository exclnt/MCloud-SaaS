import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '../../'), '');
  const gatewayUrl = env.GATEWAY_URL || `http://${env.GATEWAY_HOST || 'localhost'}:${env.GATEWAY_PORT || 3000}`;
  const frontendPort = parseInt(env.FRONTEND_PORT || 5173);

  return {
    plugins: [react()],
    envDir: path.resolve(__dirname, '../../'),
    server: {
      allowedHosts: true,
      port: frontendPort,
      proxy: {
        '/api': gatewayUrl
      }
    },
    preview: {
      allowedHosts: true,
      port: 4173,
      proxy: {
        '/api': gatewayUrl
      }
    }
  };
});
