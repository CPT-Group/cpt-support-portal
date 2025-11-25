import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request Submitted Successfully',
  description: 'Your support request has been received. A CPT representative will get back to you as soon as possible.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Request Submitted | CPT Support Portal',
    description: 'Your support request has been received. A CPT representative will get back to you as soon as possible.',
    url: '/support-request/success',
  },
  twitter: {
    title: 'Request Submitted | CPT Support Portal',
    description: 'Your support request has been received. A CPT representative will get back to you as soon as possible.',
  },
};

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

