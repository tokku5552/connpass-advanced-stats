/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  assetPrefix: "./",
  output: "export",
  distDir: "../extensions/popup",
};

module.exports = nextConfig;
