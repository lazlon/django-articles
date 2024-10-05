import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
    plugins: [tsconfigPaths()],
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
