// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import removeConsole from "vite-plugin-remove-console";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ command }) => ({
  base: command === "serve" ? "/" : "/be_write_back/",

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
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,webp,png,svg,ico,json}"],
      },
    }),
  ],

  build: {
    target: "esnext",
    sourcemap: false,
  },

  server: {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  },
}));
