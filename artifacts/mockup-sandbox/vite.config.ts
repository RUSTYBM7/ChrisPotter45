import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { mockupPreviewPlugin } from "./mockupPreviewPlugin";

/**
 * PORT
 * - Optional
 * - Used only for dev / preview
 * - Vercel does NOT provide PORT at build time
 */
const rawPort = process.env.PORT;
const port =
  rawPort && !Number.isNaN(Number(rawPort)) && Number(rawPort) > 0
    ? Number(rawPort)
    : 5173;

/**
 * BASE_PATH
 * - Required for correct asset resolution
 * - Default to "/" for Vercel and local builds
 */
const basePath = process.env.BASE_PATH ?? "/";

export default defineConfig(async () => ({
  base: basePath,

  plugins: [
    mockupPreviewPlugin(),
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),

    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          (
            await import("@replit/vite-plugin-cartographer")
          ).cartographer({
            root: path.resolve(import.meta.dirname, ".."),
          }),
        ]
      : []),
  ],

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },

  root: path.resolve(import.meta.dirname),

  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },

  /**
   * Dev server only (ignored by Vercel)
   */
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },

  /**
   * vite preview (local only)
   */
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
}));