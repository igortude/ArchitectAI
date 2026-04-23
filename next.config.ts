import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  
  // Solução para o bug do Turbopack no Next 16
  turbopack: {
    root: process.cwd(), // Isso vai gerar algo como: /home/igor/Documentos/GIT/ArchitectAI_v1.0.0
  },
};

export default nextConfig;
