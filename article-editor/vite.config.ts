import { defineConfig } from "vite"
import solid from "vite-plugin-solid"
import tsconfigPaths from "vite-tsconfig-paths"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [solid(), tsconfigPaths(), tailwindcss()],
  build: {
    lib: {
      name: "articles",
      entry: "src/index",
      formats: ["es"],
    },
    outDir: "../articles/static/articles",
    emptyOutDir: true,
  },
})
