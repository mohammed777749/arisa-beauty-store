import { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://arisa-beauty-store.vercel.app";
  const now = new Date();

  // الصفحات الرئيسية
  const staticPages = [
    { url: "/", priority: 1.0, changeFreq: "daily" as const },
    { url: "/?view=shop", priority: 0.9, changeFreq: "daily" as const },
    { url: "/?view=services", priority: 0.9, changeFreq: "daily" as const },
    { url: "/?view=wishlist", priority: 0.5, changeFreq: "weekly" as const },
    { url: "/?view=orders", priority: 0.5, changeFreq: "weekly" as const },
    { url: "/?view=auth", priority: 0.4, changeFreq: "monthly" as const },
  ];

  return staticPages.map((page) => ({
    url: `${baseUrl}${page.url}`,
    lastModified: now,
    changeFrequency: page.changeFreq,
    priority: page.priority,
  }));
}
