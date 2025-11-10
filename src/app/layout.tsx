import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "OwnMali - Cryptocurrency Exchange",
  description: "Trade cryptocurrencies with confidence on OwnMali - A secure and user-friendly cryptocurrency exchange platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-white`}>
        <div className="flex min-h-screen flex-col">
          <Navigation />
          <main className="flex-1">
            <div className="container mx-auto py-6 px-4">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
