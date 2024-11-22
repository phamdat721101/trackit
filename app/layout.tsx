import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { GlobalContextProvider } from "@/context/store";
import WalletProvider from "@/provider/WalletProvider";
import Layout from "@/components/layout/Layout";

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

export const metadata: Metadata = {
  title: "TrackIt",
  description: "TrackIt app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletProvider>
          <GlobalContextProvider>
            <Layout>{children}</Layout>
          </GlobalContextProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
