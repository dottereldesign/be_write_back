import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import removeConsole from "vite-plugin-remove-console"; // 🔥 Import plugin

export default defineConfig({
  plugins: [
    react(),
    removeConsole({
      external: [], // ✅ Optional: If you want to exclude certain files from stripping
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
