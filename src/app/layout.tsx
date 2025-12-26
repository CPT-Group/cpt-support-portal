import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";
import { Header, MainContent } from "@/components/layout";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Get the site URL from environment variable or use a default
// For Netlify, set NEXT_PUBLIC_SITE_URL in environment variables
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cpt-support-portal.netlify.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CPT Group Support Portal | Class Member Support Center",
    template: "%s | CPT Group Support Portal",
  },
  description: "CPT Group Support Portal - Get help with class action case information, password resets, address changes, document requests, and settlement administration support. Submit support requests and find answers to frequently asked questions.",
  keywords: [
    "CPT Group",
    "CPT Support",
    "class action support",
    "settlement administration",
    "class member support",
    "case management",
    "support request",
    "password reset",
    "address change",
    "document request",
    "settlement information",
  ],
  authors: [{ name: "CPT Group" }],
  creator: "CPT Group",
  publisher: "CPT Group",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "CPT Group Support Portal",
    title: "CPT Group Support Portal | Class Member Support Center",
    description: "Get help with class action case information, support requests, and settlement administration. Submit support requests and find answers to frequently asked questions.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "CPT Group Support Portal - Class Member Support Center",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CPT Group Support Portal | Class Member Support Center",
    description: "Get help with class action case information, support requests, and settlement administration.",
    images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-icon.png", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body>
        <Providers>
          <Header />
          <MainContent>
            {children}
          </MainContent>
        </Providers>
      </body>
    </html>
  );
}
