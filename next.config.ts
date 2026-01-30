import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization (disabled for static export)
  images: {
    unoptimized: true,
  },
  
  // Trailing slashes for SEO-friendly URLs
  trailingSlash: true,
  
  // Disable x-powered-by header
  poweredByHeader: false,
  
  // Compress output
  compress: true,
  
  // Experimental features
  experimental: {
    // Enable typed routes
    typedRoutes: true,
  },
};

export default nextConfig;
