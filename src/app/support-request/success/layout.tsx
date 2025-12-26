import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request Submitted Successfully',
  description: 'Your support request has been received by CPT Group. A representative will get back to you as soon as possible regarding your class action case support request.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Request Submitted | CPT Group Support Portal',
    description: 'Your support request has been received. A CPT Group representative will get back to you as soon as possible.',
    url: '/support-request/success',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Request Submitted | CPT Group Support Portal',
    description: 'Your support request has been received. A CPT Group representative will get back to you as soon as possible.',
  },
};

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

