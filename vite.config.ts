import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: {
    watch: {
      usePolling: true,
      ignored: ["**/.gitignore", "**/node_modules/**"],
    },
  },
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "CodeDoctor",
        short_name: "CodeDoctor",
        description:
          "Plateforme technique pour comprendre, diagnostiquer et résoudre les problèmes de code.",
        lang: "fr",
        theme_color: "#18181b",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});