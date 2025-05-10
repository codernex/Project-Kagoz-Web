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

// Generate XML sitemap
function generateSitemap(categories: ICategory[], baseUrl: string): string {
  const urls = categories.map(
    (category) => `
    <url>
      <loc>${baseUrl}/categories/${category.slug}</loc>
      <lastmod>${category.updatedAt}</lastmod>
    </url>
  `
  );

  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
  <?xml-stylesheet type="text/xsl" href="${baseUrl}/categories.xsl"?>`;

  return (
    xmlHeader +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls.join("\n")}
    </urlset>`
  );
}

// Route handler
export async function GET() {
  const categories = await fetchCategories();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const sitemapXml = generateSitemap(categories, baseUrl);

  return new NextResponse(sitemapXml, {
    headers: {
      "Content-Type": "application/xml", // Ensure XML content type
    },
  });
}
