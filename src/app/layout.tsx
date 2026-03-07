import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "react-hot-toast";
import { QueryProvider } from "@/components/providers/QueryProvider";

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
        <QueryProvider>
          {children}
        </QueryProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
