import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submit Support Request',
  description: 'Submit a support request to CPT Group for class action case assistance. Get help with password resets, address changes, case information, document requests, name changes, dispute responses, and settlement administration support. Our team will respond as soon as possible.',
  keywords: [
    'CPT Group support request',
    'class action support',
    'submit support ticket',
    'case information request',
    'password reset request',
    'address change request',
    'document request',
    'settlement support',
  ],
  openGraph: {
    title: 'Submit Support Request | CPT Group Support Portal',
    description: 'Submit a support request for class action case assistance, password resets, address changes, case information, and settlement administration support.',
    url: '/support-request',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Submit Support Request | CPT Group Support Portal',
    description: 'Submit a support request for class action case assistance, password resets, address changes, and more.',
  },
};

export default function SupportRequestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

