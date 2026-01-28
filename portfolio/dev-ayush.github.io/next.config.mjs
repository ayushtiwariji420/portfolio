/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Enable static export only when explicitly requested
  ...(process.env.NEXT_OUTPUT_EXPORT === 'true' ? { output: 'export' } : {}),
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // For GitHub Pages deployment (adjust if you use a subpath)
  basePath: '',
  assetPrefix: '',
};

export default nextConfig;
