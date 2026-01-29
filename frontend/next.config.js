/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.watchOptions = {
      ignored: ['**/node_modules/**', '**/.next/**', 'F:/pagefile.sys'],
    };
    return config;
  },
};

module.exports = nextConfig;
