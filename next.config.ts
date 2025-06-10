import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(md|txt|LICENSE)$/,
      type: 'asset/source',
    })

    // Ignore these problematic files entirely
    config.resolve.alias = {
      ...config.resolve.alias,
      '@libsql/isomorphic-ws/README.md': false,
      '@libsql/client/README.md': false,
    }

    return config
  },

};

export default nextConfig;
