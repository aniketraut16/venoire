import type { Metadata } from "next";
import "./fonts.css";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import SmoothScrolling from "@/components/common/SmoothScrolling";

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
        <SmoothScrolling>
          <Navbar />
          {children}
          <Footer />
        </SmoothScrolling>
      </body>
    </html>
  );
}
