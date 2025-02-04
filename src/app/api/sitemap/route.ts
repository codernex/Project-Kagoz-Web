import { NextResponse } from "next/server";
import { axiosInstance } from "@/redux/api";

// Helper function to fetch categories
async function fetchCategories() {
  try {
    const response = await axiosInstance.get("/categories");
    return response.data.data as ICategory[];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

async function fetchBusiness() {
  try {
    const response = await axiosInstance.get("/business");
    return response.data.data.business as IBusiness[];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// List of static pages
const staticPages = [
  { url: "/", lastModified: new Date().toISOString() },
  { url: "/about", lastModified: new Date().toISOString() },
  { url: "/contact", lastModified: new Date().toISOString() },
  { url: "/blogs", lastModified: new Date().toISOString() },
  { url: "/privacy-policy", lastModified: new Date().toISOString() },
  { url: "/tos", lastModified: new Date().toISOString() },
  { url: "/ads-policy", lastModified: new Date().toISOString() },
  // Add any other static pages here
];

// Generate XML sitemap with XSL reference
function generateSitemap(
  pages: { url: string; lastModified: string }[],
  baseUrl: string
): string {
  const urls = pages.map(
    (page) => `
    <url>
      <loc>${baseUrl}${page.url}</loc>
      <lastmod>${page.lastModified}</lastmod>
    </url>
  `
  );

  return `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls.join("\n")}
    </urlset>
    `;
}

// Route handler
export async function GET() {
  const categories = await fetchCategories();
  const business = await fetchBusiness();

  // Add dynamic category pages
  const categoryPages = categories.map((category) => ({
    url: `/categories/${category.slug}`,
    lastModified: category.updatedAt, // Replace with actual modification time if available
  }));

  const businessPage = business.map((category) => ({
    url: `/business/${category.slug}`,
    lastModified: category.updatedAt,
    images: [category.logoUrl],
  }));

  // Combine static and dynamic pages
  const allPages = [...staticPages, ...categoryPages, ...businessPage];

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const sitemapXml = generateSitemap(allPages, baseUrl);

  return new NextResponse(sitemapXml, {
    headers: {
      "Content-Type": "application/xml", // Ensure XML content type
    },
  });
}
