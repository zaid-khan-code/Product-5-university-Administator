import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

import { Navigation } from "@/components/Navigation";
import { ClientInitializer } from "@/components/ClientInitializer";

export const metadata: Metadata = {
  title: "National University Administration",
  description: "University administration system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-university-gray flex min-h-screen`}
      >
        <ClientInitializer>
          <Navigation />
          <main className="ml-64 flex-1 p-8">
            {children}
          </main>
        </ClientInitializer>
      </body>
    </html>
  );
}
