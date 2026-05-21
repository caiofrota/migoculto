import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname, "../.."),
  },
  transpilePackages: ["@migoculto/db", "@migoculto/i18n", "@migoculto/types", "@migoculto/ui"],
};

export default nextConfig;
