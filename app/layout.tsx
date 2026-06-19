import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Koreksi Ejaan & Tata Bahasa Indonesia",
  description:
    "Demo Grammar Error Correction Bahasa Indonesia berbasis model mT5.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={GeistSans.variable}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}