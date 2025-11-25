import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Find answers to commonly asked questions about support requests, case information, password resets, address changes, and settlement processes.',
  openGraph: {
    title: 'FAQ | CPT Support Portal',
    description: 'Find answers to commonly asked questions about support requests and case information.',
    url: '/faq',
  },
  twitter: {
    title: 'FAQ | CPT Support Portal',
    description: 'Find answers to commonly asked questions about support requests and case information.',
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

