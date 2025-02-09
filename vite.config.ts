import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    minify: "terser", // ✅ Minifies JavaScript
  },
  server: {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  },
  base: "/be_write_back/", // 🔹 Change this to match your GitHub repo name
});
