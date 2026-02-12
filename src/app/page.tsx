import type { Metadata } from 'next';
import { HomeHero } from '@/components';

export const metadata: Metadata = {
  title: 'CPT Group Support Portal | Class Member Support Center',
  description: 'Welcome to CPT Group Support Portal. Get help with class action case information, submit support requests, and find answers to frequently asked questions. Access settlement administration support, password resets, address changes, and document requests.',
  openGraph: {
    title: 'CPT Group Support Portal | Class Member Support Center',
    description: 'Get help with class action case information, submit support requests, and access settlement administration support.',
    url: '/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CPT Group Support Portal | Class Member Support Center',
    description: 'Get help with class action case information, submit support requests, and access settlement administration support.',
  },
};

export default function Home() {
  return <HomeHero />;
}
