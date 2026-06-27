import { defineConfig } from "electron-vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

const alias = {
  "@": resolve(__dirname, "src"),
  "@playermaster/shared": resolve(__dirname, "../../packages/shared/src/index.ts")
};

export default defineConfig({
  main: {
    resolve: { alias },
    build: {
      rollupOptions: {
        input: "src/main/main.ts"
      }
    }
  },
  preload: {
    resolve: { alias },
    build: {
      rollupOptions: {
        input: "src/preload/preload.ts"
      }
    }
  },
  renderer: {
    resolve: { alias },
    plugins: [react()],
    build: {
      rollupOptions: {
        input: "src/renderer/index.html"
      }
    }
  }
});
