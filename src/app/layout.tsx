import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Temp Secrets",
  description: "A simple app to store your secrets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.className} bg-background overflow-x-hidden`}
      >
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
