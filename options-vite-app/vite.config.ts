import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: '/options-app',
  build: {
    outDir: '../extension/options-app',
    assetsDir: '.',
    emptyOutDir: true
  }
})
