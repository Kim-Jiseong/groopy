import "@/styles/globals.css";
import "@/styles/markdown.css";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { Providers } from "../providers";
import { siteConfig } from "@/config/site";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Multi-Agent AI",
    "AI platform",
    "No-code AI",
    "AI team creation",
    "LLM AI",
    "AI automation",
    "AI marketplace",
    "AI for non-developers",
    "Content automation",
    "Creative AI",
    "Monetize AI",
    "Collaborative AI",
    "Accessible AI",
    "AI for startups",
    "AI innovation",
    "AI MVP",
    "Entrepreneur AI",
    "AI tools",
    "AI idea validation",
    "AI-driven solutions",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Groopy",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    // images: ['https://example.com/image.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`bg-background text-foreground ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          // disableTransitionOnChange
        >
          <main className="w-full min-h-screen ">
            {children}
            <Toaster />
          </main>
        </Providers>
      </body>
    </html>
  );
}
