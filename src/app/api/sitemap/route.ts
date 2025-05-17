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
  { url: "/", lastModified: new Date().toISOString(), title: "Home" },
  { url: "/about", lastModified: new Date().toISOString(), title: "About" },
  { url: "/contact", lastModified: new Date().toISOString(), title: "Contact" },
  { url: "/blogs", lastModified: new Date().toISOString(), title: "Blogs" },
  {
    url: "/privacy-policy",
    lastModified: new Date().toISOString(),
    title: "Privacy Policy",
  },
  {
    url: "/tos",
    lastModified: new Date().toISOString(),
    title: "Terms of service",
  },
  {
    url: "/ads-policy",
    lastModified: new Date().toISOString(),
    title: "Ads Policy",
  },
  {
    url: "/categories/sitemap.xml",
    lastModified: new Date().toISOString(),
    title: "Categories Sitemap",
  },
  {
    url: "/business/sitemap.xml",
    lastModified: new Date().toISOString(),
    title: "Business Sitemap",
  },
  // Add any other static pages here
];

// Generate XML sitemap with XSL reference
function generateSitemap(
  pages: { url: string; lastModified: string; title: string }[],
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
  const extraPages = `
  
  `;

  const styleHeader = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${baseUrl}/index.xsl"?>
  `;

  return (
    styleHeader +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls.join("\n")}
    </urlset>
    `
  );
}

// Route handler
export async function GET() {
  // Combine static and dynamic pages

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const sitemapXml = generateSitemap(staticPages, baseUrl);

  return new NextResponse(sitemapXml, {
    headers: {
      "Content-Type": "application/xml", // Ensure XML content type
    },
  });
}
