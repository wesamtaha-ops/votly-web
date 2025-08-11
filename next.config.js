/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['votly.app', 'votly.io'],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This disables TypeScript type checking during the build process.
    ignoreBuildErrors: true,
  },
};

const withNextIntl = require('next-intl/plugin')(
  // This is the default (also the `src` folder is supported out of the box)
  './i18n.js',
);

module.exports = withNextIntl(nextConfig);
