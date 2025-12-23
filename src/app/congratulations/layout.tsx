import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thank You for Your Feedback | CPT Support Portal',
  description: 'Thank you for providing feedback on our FAQ. Your input helps us improve our support resources.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CongratulationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

