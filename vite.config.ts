import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // path из Node.js

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
