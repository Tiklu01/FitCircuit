import type { Metadata } from "next";
import LoadingAnimation from "@/components/loadinganimation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider
} from '@clerk/nextjs'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FitCircuit",
  description: "Your personal fitness journey starts here",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <script src="https://cdn.botpress.cloud/webchat/v2.2/inject.js"></script>
          <script src="https://files.bpcontent.cloud/2025/02/22/14/20250222145729-YKXE6DN6.js"></script>

          <LoadingAnimation />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
