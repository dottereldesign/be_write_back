import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  base: "/be_write_back/", // ✅ Ensure correct GitHub Pages deployment path

  build: {
    target: "esnext", // ✅ Use latest JavaScript for smaller bundle
    sourcemap: false, // ✅ Disable source maps for production
    cssCodeSplit: true, // ✅ Split CSS for better caching
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor"; // ✅ Creates a separate chunk for vendor libraries
          }
        },
      },
    },
  },

  server: {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable", // ✅ Enable long-term caching
    },
  },

  define: {
    "import.meta.env.PROD": JSON.stringify(true), // ✅ Ensure production optimizations
  },
});
