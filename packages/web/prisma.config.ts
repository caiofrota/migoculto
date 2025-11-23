import { loadEnvConfig } from "@next/env";
import { defineConfig, env } from "prisma/config";

const projectDir = process.cwd();
loadEnvConfig(projectDir, process.env.NODE_ENV !== "production");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
