import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "New Kitisuru Estate | Elegant 4-Bedroom Residence",
  description:
    "Experience the epitome of luxury living in the heart of New Kitisuru Estate. A meticulously designed 4-bedroom sanctuary — 4 bedrooms, 4 ensuite.",
  keywords: ["Kitisuru", "luxury rental", "Nairobi", "4 bedroom", "estate", "Kenya real estate"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${outfit.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
