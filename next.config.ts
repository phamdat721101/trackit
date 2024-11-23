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
  }
};

export default nextConfig;
