import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/providers";
import { ThemeToggle } from "@/components/common/ThemeToggle";

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL 
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  title: {
    default: "CPT Support Portal",
    template: "%s | CPT Support Portal",
  },
  description: "Submit support requests, manage cases, and find answers to frequently asked questions. Get help with password resets, address changes, case information, and more.",
  keywords: ["CPT", "support", "help desk", "case management", "support ticket", "customer service"],
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
    siteName: "CPT Support Portal",
    title: "CPT Support Portal",
    description: "Submit support requests, manage cases, and find answers to frequently asked questions.",
    // OG image is automatically detected from app/opengraph-image.png
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "CPT Support Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CPT Support Portal",
    description: "Submit support requests, manage cases, and find answers to frequently asked questions.",
    // Twitter image is automatically detected from app/twitter-image.png
    // Falls back to opengraph-image.png if not found
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
  // Icons are automatically detected from app/icon.png and app/apple-icon.png
  // favicon.ico is also automatically detected from app/favicon.ico
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
    <html lang="en">
      <body>
        <Providers>
          <ThemeToggle />
          {children}
        </Providers>
      </body>
    </html>
  );
}
