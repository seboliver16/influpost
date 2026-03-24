import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "influpost - Schedule & Publish to YouTube, Instagram & TikTok",
  description:
    "Upload once, publish everywhere. Preview and schedule your video content across YouTube, Instagram, and TikTok with perfect quality preservation.",
  keywords: [
    "social media scheduler",
    "video scheduling",
    "YouTube scheduler",
    "Instagram scheduler",
    "TikTok scheduler",
    "cross-platform posting",
    "content creator tools",
    "influpost",
  ],
  authors: [{ name: "influpost" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "influpost - Upload once, publish everywhere",
    description:
      "Preview and schedule your video content across YouTube, Instagram, and TikTok with perfect quality preservation.",
    siteName: "influpost",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "influpost - Upload once, publish everywhere",
    description:
      "Preview and schedule your video content across YouTube, Instagram, and TikTok.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
