/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Remove experimental appDir to avoid issues
  // experimental: {
  //   appDir: true
  // }
}

module.exports = nextConfig 