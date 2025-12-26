import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Find answers to commonly asked questions about CPT Group class action support requests, case information, password resets, address changes, document requests, and settlement administration processes. Get help with your class member account and support needs.',
  keywords: [
    'CPT Group FAQ',
    'class action FAQ',
    'settlement FAQ',
    'support questions',
    'case information FAQ',
    'password reset help',
    'address change help',
  ],
  openGraph: {
    title: 'FAQ | CPT Group Support Portal',
    description: 'Find answers to commonly asked questions about class action support requests, case information, and settlement administration.',
    url: '/faq',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ | CPT Group Support Portal',
    description: 'Find answers to commonly asked questions about class action support requests and case information.',
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

