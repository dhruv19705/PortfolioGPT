/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Common image hosting services
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'assets.aceternity.com' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'github.com' },
      { protocol: 'https', hostname: 'imgur.com' },
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'https', hostname: 'cdn.jsdelivr.net' },
      { protocol: 'https', hostname: 'opengraph.githubassets.com' },
    ],
  },
  eslint: {
    // Ne bloque PAS le build en cas d'erreurs eslint
    ignoreDuringBuilds: true,
  },
  webpack: (config: { cache?: false | Record<string, unknown> }, { dev }: { dev: boolean }) => {
    // OneDrive file sync can break webpack pack cache renames in dev.
    // Disable persistent cache only in development to avoid ENOENT spam.
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;
