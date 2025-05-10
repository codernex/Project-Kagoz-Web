import { NextResponse } from "next/server";
import { axiosInstance } from "@/redux/api";

type PaginatedBusinessResponse = {
  business: IBusiness[];
  currentPage: number;
  totalPages: number;
  count: number;
};

const LIMIT = 100;

async function fetchBusinessesByPage(
  page: number
): Promise<PaginatedBusinessResponse | null> {
  try {
    const response = await axiosInstance.get("/business", {
      params: {
        page,
        limit: LIMIT,
        all: false,
      },
    });

    return response.data.data as PaginatedBusinessResponse;
  } catch (error) {
    console.error(`Error fetching businesses on page ${page}:`, error);
    return null;
  }
}

// Generate XML with sitemap URLs and navigation links
function generateSitemapXml(
  businesses: IBusiness[],
  baseUrl: string,
  currentPage: number,
  totalPages: number
): string {
  const urls = businesses.map(
    (b) => `
    <url>
      <loc>${baseUrl}/business/${b.slug}</loc>
      <lastmod>${b.updatedAt}</lastmod>
    </url>
  `
  );

  // Optional <xhtml:link rel="prev/next" /> (SEO-friendly, optional)
  const paginationLinks: string[] = [];

  if (currentPage > 1) {
    paginationLinks.push(
      `<xhtml:link rel="prev" href="${baseUrl}/sitemap/business?page=${
        currentPage - 1
      }" />`
    );
  }

  if (currentPage < totalPages) {
    paginationLinks.push(
      `<xhtml:link rel="next" href="${baseUrl}/sitemap/business?page=${
        currentPage + 1
      }" />`
    );
  }

  // Custom <pageLinks> block (not for SEO — your custom usage)
  const numberedPageLinks = Array.from({ length: totalPages }, (_, i) => i + 1)
    .map(
      (page) =>
        `<link page="${page}" url="${baseUrl}/sitemap/business?page=${page}" />`
    )
    .join("\n");

  const pageLinksBlock = `
    <pageLinks>
      ${numberedPageLinks}
    </pageLinks>
  `;
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${baseUrl}/sitemap.xsl"?>`;

  return (
    xmlHeader +
    `<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    >
      ${urls.join("\n")}
      ${pageLinksBlock}
    </urlset>`
  );
}

// Route handler
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pageParam = searchParams.get("page");
  const page = Number(pageParam) || 1;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const data = await fetchBusinessesByPage(page);

  if (!data || data.business.length === 0) {
    return new NextResponse("No businesses found", { status: 404 });
  }

  const xml = generateSitemapXml(
    data.business,
    baseUrl,
    data.currentPage,
    data.totalPages
  );

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
