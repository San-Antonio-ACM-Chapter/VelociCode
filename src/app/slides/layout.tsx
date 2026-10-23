import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "Slides",
  robots: { index: false, follow: false },
};

export default function SlidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
