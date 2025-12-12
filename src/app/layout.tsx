import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 🔥 Import AvatarProvider
import { AvatarProvider } from "./context/AvatarContext";
import Navbar from "@/components/Navbar";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vogue",
  description: "Next-gen AR fashion and avatar app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 🔥 Wrap the whole app so avatar state is global */}
        <AvatarProvider>
          {children}
        </AvatarProvider>
        {/* <Navbar />
        {children} */}
      </body>
    </html>
  );
}
