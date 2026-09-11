import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { fileURLToPath } from "node:url"

const src = fileURLToPath(new URL("./src", import.meta.url))

// The Lifeline components are used verbatim. They import two Next.js modules;
// `next/image` is aliased to a plain <img> shim and `next-themes` is the real
// package (it is framework-agnostic React).
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": src,
      "next/image": `${src}/shims/next-image.tsx`,
    },
  },
  build: { outDir: "dist", assetsInlineLimit: 0 },
})
