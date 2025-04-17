/// <reference types="vitest/config" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: ["./src/tests/setup.ts"],
    environment: "jsdom",
  },
  build: {
    rollupOptions: {
      external: [/^\/playground\//],
    },
  },
});
