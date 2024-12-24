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
};

export default nextConfig;
