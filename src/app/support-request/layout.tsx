import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submit Support Request',
  description: 'Submit a support request for password resets, address changes, case information, document requests, and more. Our team will respond as soon as possible.',
  openGraph: {
    title: 'Submit Support Request | CPT Support Portal',
    description: 'Submit a support request for password resets, address changes, case information, and more.',
    url: '/support-request',
  },
  twitter: {
    title: 'Submit Support Request | CPT Support Portal',
    description: 'Submit a support request for password resets, address changes, case information, and more.',
  },
};

export default function SupportRequestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

