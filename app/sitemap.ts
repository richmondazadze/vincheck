import type { MetadataRoute } from "next";
import { config } from "@/lib/config";
import { getYears, searchVehicles } from "@/lib/api/carapi";

export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = config.site.url;
  const sitemap: MetadataRoute.Sitemap = [];

  // Static pages
  sitemap.push(
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/cars`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/vin`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/vin/guide`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/vin/batch`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }
  );

  try {
    // Add year pages
    const years = await getYears();
    const recentYears = years.slice(-5); // Last 5 years

    for (const year of recentYears) {
      sitemap.push({
        url: `${baseUrl}/cars/${year}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    // Add popular vehicle detail pages
    const { vehicles } = await searchVehicles({
      year: recentYears[recentYears.length - 1],
      perPage: 50,
    });

    for (const vehicle of vehicles) {
      sitemap.push({
        url: `${baseUrl}/vehicle/${vehicle.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }

  return sitemap;
}
