import type { MetadataRoute } from "next";
import { projects } from "@/app/lib/data";
export default function sitemap(): MetadataRoute.Sitemap { const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ezzali.com"; const routes = ["", "/about", "/work", "/contact"].map((path) => ({ url: `${origin}${path}`, changeFrequency: "monthly" as const, priority: path === "" ? 1 : 0.8 })); return [...routes, ...projects.map((project) => ({ url: `${origin}/work/${project.slug}`, changeFrequency: "yearly" as const, priority: 0.7 }))]; }
