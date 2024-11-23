import type { NextConfig } from "next";
import  path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hatchy.s3.us-east-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@component': path.resolve(__dirname, 'components'),
      '@lib': path.resolve(__dirname, 'lib'),
    };
    return config;
  },
};

export default nextConfig;
