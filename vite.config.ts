// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import removeConsole from "vite-plugin-remove-console";

// ✅ No VitePWA import!

export default defineConfig({
  base: "/be_write_back/",

  plugins: [
    react(),
    removeConsole({ external: [] }),
    // ✅ No VitePWA here
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
});
