import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // ...остальные ваши алиасы
    },
  },
  // NEW — важно для GitHub Pages
  base: "/Endo-anamnesis/",
});
