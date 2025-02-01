/// <reference types="vitest/config" />
import { dirname, resolve } from "path"
import { fileURLToPath } from 'node:url'
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vite.dev/guide/build.html#multi-page-app
const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  test: {
    include: ['src/**/*.test.*'],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  base: '/dist',
  build: {
    outDir: '../dist',
    assetsDir: '.',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        options: resolve(__dirname, 'options.html'),
        popup: resolve(__dirname, 'popup.html'),
      },
    },
  },
  plugins: [react({
    babel: {
      plugins: [
        "babel-plugin-react-compiler",
      ],
    },
  })],
})
