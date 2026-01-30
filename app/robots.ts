import type { MetadataRoute } from "next";
import { config } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/compare?*", // Don't crawl comparison pages with query params
          "/vin?*", // Don't crawl VIN results
          "/api/*", // Don't crawl API routes
        ],
      },
    ],
    sitemap: `${config.site.url}/sitemap.xml`,
  };
}
