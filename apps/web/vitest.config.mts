import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceDir = path.resolve(rootDir, "../..");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": rootDir,
      "@migoculto/api-client": path.resolve(workspaceDir, "packages/api-client/src/index.ts"),
      "@migoculto/db": path.resolve(workspaceDir, "packages/db/src/index.ts"),
      "@migoculto/i18n": path.resolve(workspaceDir, "packages/i18n/src/index.ts"),
      "@migoculto/types": path.resolve(workspaceDir, "packages/types/src/index.ts"),
      "@migoculto/ui": path.resolve(workspaceDir, "packages/ui/src/index.ts"),
      "__tests__": path.resolve(rootDir, "__tests__"),
      app: path.resolve(rootDir, "app"),
      errors: path.resolve(rootDir, "errors"),
      lib: path.resolve(rootDir, "lib"),
      model: path.resolve(rootDir, "model"),
      proxy: path.resolve(rootDir, "proxy.ts"),
    },
  },
  test: {
    environment: "jsdom",
  },
});
