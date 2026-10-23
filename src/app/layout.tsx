import type { Metadata } from "next";
import type React from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://velocicode.acmsa.org"),
  title: "VelociCode — ACM San Antonio",
  description: "A month-long game jam hosted by ACM San Antonio.",
  icons: {
    icon: "/velocicode-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
