import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { AppShell } from "@/components/layout/app-shell";
import { themeInitScript } from "@/lib/theme-script";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Clearbid — Commercial Contracts", template: "%s · Clearbid" },
  description: "Discover, qualify and track private-sector contract opportunities. Frontend prototype with sample data.",
};

export const viewport: Viewport = {
  themeColor: [{ color: "#f5f6f8" }],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the theme script may add `dark` to <html> before React hydrates.
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-dvh font-sans text-sm">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
