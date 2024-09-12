import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['votly.app'], // Allow images from votly.app
  },
  i18n: {
    locales: ['en', 'ar'],
    defaultLocale: 'en',
    localeDetection: true, // Detects locale from browser settings
  },
};

export default nextConfig;
