import type { NextConfig } from "next";
const withMDX = require('@next/mdx')()

const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // Configure for Replit environment
  ...(process.env.NODE_ENV === 'development' && {
    // Allow connections from Replit proxy
    experimental: {
      allowedRevalidateHeaderKeys: ['*'],
    },
    // Trust proxy headers for Replit iframe
    headers: async () => [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
        ],
      },
    ],
  }),
};

export default withMDX(nextConfig); 
