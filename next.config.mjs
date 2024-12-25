/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/api/v1/uploads/**", // Add /** to allow dynamic paths
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/categories/sitemap.xml", // The URL you want
        destination: "/api/categories/sitemap", // The actual route (mapped to your `route.ts`)
      },
      {
        source: "/sitemap.xml", // The URL you want
        destination: "/api/sitemap", // The actual route (mapped to your `route.ts`)
      },
      {
        source: "/business/sitemap.xml", // The URL you want
        destination: "/api/business/sitemap", // The actual route (mapped to your `route.ts`)
      },
    ];
  },
};

export default nextConfig;
