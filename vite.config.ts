import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    proxy: {
      '/cdnapi': {
          target: 'https://api.brawlify.com/v1', 
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/cdnapi/, ''),
          
          configure: (proxy, options) => {
             proxy.on('error', (err, _req, _res) => {
              console.log('error', err);
             });
             proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Request sent to target:', req.method, req.url);
             });
             proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Response received from target:', proxyRes.statusCode, req.url);
             });
        },
      },
      // Target is your backend API
        '/api': {
            target: 'https://api.brawlstars.com/v1', 
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            
            configure: (proxy, options) => {
               proxy.on('error', (err, _req, _res) => {
                console.log('error', err);
               });
               proxy.on('proxyReq', (proxyReq, req, _res) => {
                console.log('Request sent to target:', req.method, req.url);
               });
               proxy.on('proxyRes', (proxyRes, req, _res) => {
                console.log('Response received from target:', proxyRes.statusCode, req.url);
               });
         },
      },
    },
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
