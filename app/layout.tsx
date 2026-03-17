import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#eab308",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.vcanews.com.br"),
  title: "VCANews - Notícias de Vitória da Conquista",
  description: "As principais notícias de Vitória da Conquista e região em um só lugar.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "VCANews",
  },
  openGraph: {
    title: "VCANews - Notícias de Vitória da Conquista",
    description: "As principais notícias de Vitória da Conquista e região em um só lugar.",
    url: "https://www.vcanews.com.br",
    siteName: "VCANews",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VCANews - Notícias de Vitória da Conquista",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VCANews - Notícias de Vitória da Conquista",
    description: "As principais notícias de Vitória da Conquista e região em um só lugar.",
    images: ["/og-image.png"],
  },
};

import Navbar from "@/components/Navbar";
import MobileFooter from "@/components/MobileFooter";
import { Providers } from "@/components/Providers";
import { AgeGuard } from "@/components/AgeGuard";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-[family-name:var(--font-geist-sans)]`}
        suppressHydrationWarning
      >
        <Providers>
          <AgeGuard>
            <Navbar />
            <main className="pb-20 lg:pb-0">{children}</main>
            <MobileFooter />
            <Toaster position="top-center" />
          </AgeGuard>
        </Providers>
      </body>
    </html>
  );
}
