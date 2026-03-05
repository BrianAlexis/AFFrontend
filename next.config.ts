import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1338",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "1338",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "[::1]",
        port: "1338",
        pathname: "/**",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Deshabilitar optimización en desarrollo para permitir IPs privadas
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
