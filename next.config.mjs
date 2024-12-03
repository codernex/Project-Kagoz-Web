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
    ],
  },
};

export default nextConfig;
