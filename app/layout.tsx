import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Akbar Rayyan | Fullstack Developer",
  description:
    "Portfolio of Akbar Rayyan, a fullstack developer focused on building fast, reliable, and scalable digital products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
