import { defineConfig } from "vite"
import { resolve } from "node:path"

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        editor: resolve(__dirname, "editor.html"),
        simulator: resolve(__dirname, "simulator.html")
      }
    }
  }
})
