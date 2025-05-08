/// <reference types="vitest/config" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
  },
  server: {
    host: "0.0.0.0", // Permite conexiones desde cualquier IP en la red
    port: 5173, // Puerto predeterminado
  },
});
