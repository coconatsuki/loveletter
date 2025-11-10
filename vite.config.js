import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.js"],
  },
  build: {
    // Minify and optimize for production
    minify: "esbuild", // Using esbuild (faster and built-in)
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code for better caching
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "firebase-vendor": ["firebase/app", "firebase/database"],
        },
      },
    },
  },
  // Remove console.logs and debugger statements ONLY in production
  esbuild: {
    drop: mode === "production" ? ["console", "debugger"] : [],
  },
}));
