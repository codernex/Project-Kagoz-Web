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
      {
        protocol: "http",
        hostname: "88.222.241.93",
        port: "9000",
        pathname: "/api/v1/uploads/**",
      },
      {
        protocol: "http",
        hostname: "88.222.241.93",
        pathname: "/api/v1/uploads/**",
      },
      {
        protocol: "https",
        hostname: "api.kagoz.com",
        pathname: "/api/v1/uploads/**", // Add /** to allow dynamic paths
      },
      {
        protocol: "http",
        hostname: "api.kagoz.com",
        pathname: "/api/v1/uploads/**", // Add /** to allow dynamic paths
      },
    ],
  },
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/categories.xml", // The URL you want
        destination: "/api/categories", // The actual route (mapped to your `route.ts`)
      },
      {
        source: "/sitemap.xml", // The URL you want
        destination: "/api/sitemap", // The actual route (mapped to your `route.ts`)
      },
      {
        source: "/businesscategories.xml", // The URL you want
        destination: "/api/business", // The actual route (mapped to your `route.ts`)
      },
      {
        source: "/pages.xml",
        destination: "/api/pages",
      },
      {
        source: "/:category.xml", // e.g. /tires.xml
        destination: "/api/:category",
      },
    ];
  },
};

export default nextConfig;
