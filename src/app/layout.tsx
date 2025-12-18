import type { Metadata } from "next";
import "./fonts.css";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import SmoothScrolling from "@/components/common/SmoothScrolling";
import { LoadingWrapper } from "@/components/common/LoadingWrapper";
import LoginPopupWrapper from "@/components/common/LoginPopupWrapper";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/cartContext";
import { HomepageProvider } from "@/contexts/HomepageContext";
import Script from "next/script";
import { Toaster } from "react-hot-toast";

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
      <Toaster
       position="top-center"
       reverseOrder={true}
      />
        <AuthProvider>
          <LoadingWrapper>
            <HomepageProvider>
              <CartProvider>
                <Navbar />
                <SmoothScrolling>{children}</SmoothScrolling>
                <Footer />
                <LoginPopupWrapper />
              </CartProvider>
            </HomepageProvider>
          </LoadingWrapper>
        </AuthProvider>
      </body>
      <Script src="https://www.instagram.com/embed.js" strategy="lazyOnload" />
    </html>
  );
}
