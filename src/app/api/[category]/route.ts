import { axiosInstance } from "@/redux/api";
import { NextResponse } from "next/server";

type PaginatedBusinessResponse = {
  items: IBusiness[];
  currentPage: number;
  totalPages: number;
  count: number;
};

async function fetchBusinessesByPage(
  category: string
): Promise<PaginatedBusinessResponse | null> {
  try {
    const response = await axiosInstance.get("/business/search", {
      params: {
        category,
        isOpen: false,
        isClosed: false,
      },
    });

    return response.data.data as PaginatedBusinessResponse;
  } catch (error) {
    return null;
  }
}

// Generate XML with sitemap URLs and navigation links
function generateSitemapXml(businesses: IBusiness[], baseUrl: string): string {
  const urls = businesses.map(
    (b) => `
    <url>
      <loc>${baseUrl}/business/${b.slug}</loc>
      <lastmod>${b.updatedAt}</lastmod>
    </url>
  `
  );

  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>`;

  return (
    xmlHeader +
    `<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    >
      ${urls.join("\n")}
    </urlset>`
  );
}

// Route handler
export async function GET(
  req: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const data = await fetchBusinessesByPage(category.replace("-business", ""));

  if (!data || data.items.length === 0) {
    return new NextResponse("No businesses found", { status: 404 });
  }

  const xml = generateSitemapXml(data.items, baseUrl);

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
