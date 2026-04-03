import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sip Core",
  description: "Core MVP for Sip Party Game"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
