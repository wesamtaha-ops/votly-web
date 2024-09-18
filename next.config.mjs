import { createRequire } from "module";
const require = createRequire(import.meta.url);

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["votly.app"], // Allow images from votly.app
  },
  i18n: {
    locales: ["en", "ar"],
    defaultLocale: "en",
    localeDetection: true, // Detects locale from browser settings
  },
  webpack: (config, { isServer }) => {
    // Add a loader to process undici
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/undici/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
        },
      },
    });

    return config;
  },
};

export default nextConfig;
