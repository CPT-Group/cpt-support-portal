import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify deployment configuration
  // The @netlify/plugin-nextjs handles most deployment settings automatically
  // No static export needed - Netlify supports Next.js server-side features
  
  // Headers for iframe embedding (Note: External site must also allow iframe embedding)
  async headers() {
    return [
      {
        source: '/terms',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
      {
        source: '/privacy',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
