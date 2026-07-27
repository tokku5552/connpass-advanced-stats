/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  assetPrefix: "./",
  output: "export",
  distDir: "../extensions/popup",
};

module.exports = nextConfig;
