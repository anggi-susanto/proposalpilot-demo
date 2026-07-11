import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "10.0.0.35",
    "proposal.jordi.web.id",
    "https://proposal.jordi.web.id",
  ],
};

export default nextConfig;
