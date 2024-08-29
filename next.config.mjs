import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['votly.app'], // Allow images from votly.app
  },
};

export default nextConfig;
