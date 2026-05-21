import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "apps/web"),
      "@migoculto/api-client": path.resolve(rootDir, "packages/api-client/src/index.ts"),
      "@migoculto/db": path.resolve(rootDir, "packages/db/src/index.ts"),
      "@migoculto/i18n": path.resolve(rootDir, "packages/i18n/src/index.ts"),
      "@migoculto/types": path.resolve(rootDir, "packages/types/src/index.ts"),
      "@migoculto/ui": path.resolve(rootDir, "packages/ui/src/index.ts"),
      "@tests": path.resolve(rootDir, "tests"),
      "__tests__": path.resolve(rootDir, "apps/web/__tests__"),
      "app": path.resolve(rootDir, "apps/web/app"),
      "errors": path.resolve(rootDir, "apps/web/errors"),
      "lib": path.resolve(rootDir, "apps/web/lib"),
      "model": path.resolve(rootDir, "apps/web/model"),
      "proxy": path.resolve(rootDir, "apps/web/proxy.ts")
    }
  },
  test: {
    coverage: {
      all: true,
      exclude: [
        "**/*.config.*",
        "**/*.d.ts",
        "**/.next/**",
        "**/.expo/**",
        "**/node_modules/**",
        "**/prisma/migrations/**",
        "**/tests/**",
        "e2e/**"
      ],
      include: ["apps/**/*.{ts,tsx}", "packages/**/*.{ts,tsx}"],
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      thresholds: {
        branches: 50,
        functions: 60,
        lines: 60,
        statements: 60
      }
    },
    environment: "jsdom",
    exclude: ["**/node_modules/**", "**/e2e/**"],
    include: ["**/*.spec.ts", "**/*.spec.tsx"],
    restoreMocks: true
  }
});
