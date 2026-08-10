import type { Metadata } from "next";
import { Unbounded, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Amer Usman — Senior AI Full-Stack Engineer",
  description:
    "Senior AI Full-Stack Engineer with 8+ years of experience. Top Rated Plus on Upwork with 100% Job Success, $300K+ earned and 17,000+ hours across AI SaaS, enterprise platforms, and automation systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${unbounded.variable} ${spaceGrotesk.variable} ${jetbrains.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
