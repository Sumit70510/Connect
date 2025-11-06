import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite";
import dotenv from "dotenv";

// https://vite.dev/config/
dotenv.config();
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // port: 3000,
    proxy: {
      "/api": {
        target: "https://localhost:3000/api", 
        changeOrigin: true,
      },
    },
   },
})