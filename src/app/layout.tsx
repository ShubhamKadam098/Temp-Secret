import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "react-hot-toast";
import { QueryProvider } from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  title: "Temp Secrets",
  description: "Share text, files, and redirects with one-time secret links.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${GeistSans.className} bg-background overflow-x-hidden`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-slate-950"
        >
          Skip to content
        </a>
        <NuqsAdapter>
          <QueryProvider>{children}</QueryProvider>
        </NuqsAdapter>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "rgba(15, 23, 42, 0.95)",
              color: "#f8fafc",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "18px",
              boxShadow: "0 20px 50px -30px rgba(15, 23, 42, 0.9)",
            },
          }}
        />
      </body>
    </html>
  );
}
