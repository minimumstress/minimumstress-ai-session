import type { Metadata } from "next";
// Premium Tipografi için Inter (Modern) ve Playfair Display (Lüks) fontları
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Minimum Stress AI • Your Immersive Wellness Space",
  description: "A premium AI session experience designed for immediate stress relief and mental grounding.",
};

export default function RootLayout({
  children,
  }: {
  children: React.ReactNode;
  }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}