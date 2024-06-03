import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Metadata } from "next";
import React, { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Temp Secrets",
  description: "Share your secrets",
  icons: {
    icon: "/icons/logo.svg",
  },
};

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="relative flex flex-col min-h-screen max-w-screen">
      <Navbar />
      <section className="flex flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14 flex-1">
        <div className="max-w-full">{children}</div>
      </section>
      <Footer />
    </main>
  );
};

export default HomeLayout;
