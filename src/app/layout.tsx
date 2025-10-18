import type { Metadata } from "next";
import "./fonts.css";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import SmoothScrolling from "@/components/common/SmoothScrolling";
import { SmoothScrollProvider } from "@/contexts/SmoothScrollContext";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Venoire",
  description:
    "Luxury Clothing | Designed to dress the world in quiet confidence and curated luxury",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <SmoothScrollProvider>
          <Navbar />
          <SmoothScrolling>{children}</SmoothScrolling>
          <Footer />
        </SmoothScrollProvider>
      </body>
      <Script src="https://www.instagram.com/embed.js" strategy="lazyOnload" />
    </html>
  );
}
