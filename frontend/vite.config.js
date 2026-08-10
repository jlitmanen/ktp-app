import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy API requests to the Express backend
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        // Required for cookies to work with credentials
        withCredentials: true,
      },
    },
  },
});
