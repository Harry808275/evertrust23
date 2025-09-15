import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { SessionProvider } from "@/components/SessionProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { AnalyticsProvider } from "@/components/ui/Analytics";
import StructuredData from "@/components/ui/StructuredData";
import { defaultMetadata } from "@/lib/metadata";


const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${inter.variable} antialiased`}
      >
        <SessionProvider>
          <ToastProvider>
            <AnalyticsProvider>
              <StructuredData />
              <Navigation />
              {children}
            </AnalyticsProvider>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
