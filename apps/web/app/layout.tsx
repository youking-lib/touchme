import "@repo/ui/styles.css";
import "@repo/player/styles.css";

import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@repo/ui";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TouchMe Music",
  description: "TouchMe Music Player",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}

        <Toaster />
      </body>
    </html>
  );
}
