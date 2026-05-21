import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@migoculto/db", "@migoculto/i18n", "@migoculto/types", "@migoculto/ui"],
};

export default nextConfig;
