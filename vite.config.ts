// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import removeConsole from "vite-plugin-remove-console";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/be_write_back/", // ✅ Base URL for GitHub Pages

  plugins: [
    react(),
    removeConsole({ external: [] }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "logo.webp", "vite.svg"],

      manifest: {
        name: "Be Write Back",
        short_name: "BRB",
        description: "Clipboard Save and Paste Manager",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/be_write_back/",
        start_url: "/be_write_back/",
        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        screenshots: [
          {
            src: "screenshot.png",
            sizes: "1280x720",
            type: "image/png",
          },
        ],
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,webp,png,svg,ico,json}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-stylesheets",
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
            },
          },
        ],
      },
    }),
  ],

  build: {
    target: "esnext",
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) return "vendor";
        },
      },
    },
  },

  server: {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  },

  define: {
    "import.meta.env.PROD": JSON.stringify(true),
  },
});
