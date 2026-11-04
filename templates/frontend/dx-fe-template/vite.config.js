import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/task-endpoint/",
  server: {
    port: 5173,
    // Proxy: request ke /api/* diteruskan ke backend
    // sehingga tidak perlu nulis full URL di FE dan menghindari CORS issue
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
