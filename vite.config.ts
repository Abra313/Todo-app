/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { qrcode } from "vite-plugin-qrcode";
import manifest from "./manifest";

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
  },
  plugins: [
    react(),
    // Generate QR code for npm run dev:host
    qrcode({ filter: (url) => url.startsWith("http://192.168.0.") }),
    VitePWA({
      manifest,
      devOptions: {
        enabled: true,
        type: "module",
      },
      registerType: "prompt",
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.destination === "script" ||
              request.destination === "style" ||
              request.destination === "font" ||
              request.destination === "worker",
            handler: "CacheFirst",
            options: {
              cacheName: "dynamic-resources",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
              cacheName: "documents",
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
        ],
      },
      includeAssets: ["**/*", "sw.js"],
    }),
  ],
  // build: {
  //   rollupOptions: {
  //     output: {
  //       // Manually split vendor dependencies and large chunks
  //       manualChunks(id) {
  //         if (id.includes("node_modules")) {
  //           // Put all node_modules into one 'vendor' chunk
  //           return "vendor";
  //         }
  //         // Specific large dependencies can be split into their own chunks
  //         if (id.includes("emoji-picker-react")) {
  //           return "emoji-picker-react";
  //         }
  //         if (id.includes("react-spring-bottom-sheet")) {
  //           return "react-spring-bottom-sheet";
  //         }
  //       },
  //     },
  //   },
  //   chunkSizeWarningLimit: 1000, // Increase chunk size limit to suppress warning for larger chunks
  // },
});
