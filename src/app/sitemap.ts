import type { MetadataRoute } from 'next';

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://cpt-support-portal.netlify.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE}/support-request`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/faq`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];
}
