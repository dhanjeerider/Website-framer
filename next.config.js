/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  // Remove any server-side features
  images: {
    unoptimized: true, // Required for static export
  },
};

module.exports = nextConfig;
