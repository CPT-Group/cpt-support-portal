import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify deployment configuration
  // The @netlify/plugin-nextjs handles most deployment settings automatically
  // No static export needed - Netlify supports Next.js server-side features
  // Terms and Privacy pages use iframes from cptgroupcaseinfo.com (configured to allow embedding)
};

export default nextConfig;
