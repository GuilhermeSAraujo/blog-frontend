import type { NextConfig } from "next";

function apiOrigin(): string | undefined {
  const raw = process.env.API_BASE_URL?.trim();
  if (!raw) return undefined;
  return raw.replace(/\/$/, "");
}

const nextConfig: NextConfig = {
  async rewrites() {
    const origin = apiOrigin();
    if (!origin) return [];
    return [
      { source: "/api/:path*", destination: `${origin}/api/:path*` },
      { source: "/feed.xml", destination: `${origin}/feed.xml` },
    ];
  },
};

export default nextConfig;
