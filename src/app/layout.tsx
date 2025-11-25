import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/providers";
import { ThemeToggle } from "@/components/common/ThemeToggle";

export const metadata: Metadata = {
  title: "CPT Support Portal",
  description: "Support ticket submission portal",
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
