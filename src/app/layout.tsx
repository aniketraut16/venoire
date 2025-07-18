import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
