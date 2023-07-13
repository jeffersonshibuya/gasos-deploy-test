/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['gasos-ballot-gallery-resized.s3.us-east-1.amazonaws.com']
  }
  // output: 'export',
  // trailingSlash: true,
  // images: { unoptimized: true }
};

module.exports = nextConfig;
