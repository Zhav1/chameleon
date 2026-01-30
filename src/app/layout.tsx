import type { Metadata } from "next";
import { getAllFontVariables } from "@/lib/chameleon/fonts";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chameleon - Polymorphic Interface Engine",
  description: "One URL, Infinite Experiences. AI-powered adaptive UI that morphs to your vibe.",
  keywords: ["AI", "adaptive UI", "polymorphic interface", "Gemini", "dynamic theming"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${getAllFontVariables()} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
