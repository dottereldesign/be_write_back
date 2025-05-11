// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import removeConsole from "vite-plugin-remove-console";
import { VitePWA } from "vite-plugin-pwa"; // 🆕 Import PWA plugin

export default defineConfig({
  plugins: [
    react(),
    removeConsole({
      external: [],
    }),
    VitePWA({
      // 🆕 PWA settings
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "logo.webp", "vite.svg"],
      manifest: {
        name: "Be Write Back",
        short_name: "BRB",
        description: "Clipboard Save and Paste Manager",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/be_write_back/", // ⚡ MATCH your base! Important
        start_url: "/be_write_back/", // ⚡ MATCH your base!
        icons: [
          {
            src: "vite.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "vite.svg",
            sizes: "512x512",
            type: "image/svg+xml",
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

  base: "/be_write_back/",

  build: {
    target: "esnext",
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
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
